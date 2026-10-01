/**
 * Karol Grove — Premium Price List & Catalogue Handler
 * Renders the clean product catalogue layout:
 * - Product image, name, category, description, pack sizes (250g, 500g, 1kg), price, MRP, discount, availability, Add to Cart
 * - Categories: All, Cashews, Almonds, Pistachios, Raisins, Dates, Seeds, Other
 * - Real-time synchronization via BroadcastChannel & Local/Cloud Storage
 */

(function() {
  'use strict';

  const ORDERED_CATEGORIES = ['All', 'Cashews', 'Almonds', 'Pistachios', 'Raisins', 'Dates', 'Seeds', 'Other'];
  let currentCategory = 'All';
  let searchQuery = '';
  let currentView = 'cards'; // 'cards' or 'table'

  // Helper: Escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Get active catalog from engine or storage
  function getCatalog() {
    if (typeof window.getLiveCatalog === 'function') {
      const live = window.getLiveCatalog();
      if (Array.isArray(live) && live.length > 0) return live;
    }
    const cached = localStorage.getItem('kg_live_catalog') || localStorage.getItem('kg_prices_local');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch(e) {}
    }
    if (Array.isArray(window.priceListData) && window.priceListData.length > 0) {
      return window.priceListData;
    }
    return window.defaultPriceCatalog || [];
  }

  // Robust Category Identifier (Checks both item.category and item.name)
  function getItemCategory(item) {
    if (!item) return 'Other';
    const name = String(item.name || '').toLowerCase();
    const cat = String(item.category || '').toLowerCase();
    const combined = `${cat} ${name}`;

    if (/cashew|kaju/i.test(combined)) return 'Cashews';
    if (/almond|badam/i.test(combined)) return 'Almonds';
    if (/pista|pistachio/i.test(combined)) return 'Pistachios';
    if (/raisin|kishmish/i.test(combined)) return 'Raisins';
    if (/date|khajoor|kharik|medjool|ajwa/i.test(combined)) return 'Dates';
    if (/seed|chia|pumpkin|flax|sunflower|watermelon|cucumber|sabja/i.test(combined)) return 'Seeds';
    return 'Other';
  }

  // Smart Product Image Resolver (Matches images even for older cache entries)
  function getProductImage(item) {
    if (item.image && typeof item.image === 'string' && item.image.trim() !== '') {
      return item.image;
    }
    const name = String(item.name || '').toLowerCase();
    if (/pepper.*cashew/i.test(name)) return 'assets/product-pepper-cashews.png';
    if (/chilli.*cashew/i.test(name)) return 'assets/product-chilli-cashews.png';
    if (/cashew|kaju/i.test(name)) return 'assets/product-cashews.png';
    if (/almond|badam/i.test(name)) return 'assets/product-almonds.png';
    if (/pista|pistachio/i.test(name)) return 'assets/product-pistachios.png';
    if (/black.*raisin/i.test(name)) return 'assets/product-black-raisins.png';
    if (/raisin|kishmish/i.test(name)) return 'assets/product-raisins.png';
    if (/black.*date/i.test(name)) return 'assets/product-black-dates.png';
    if (/dry.*date/i.test(name)) return 'assets/product-dry-dates.png';
    if (/date|medjool|ajwa/i.test(name)) return 'assets/product-dates.png';
    if (/chia/i.test(name)) return 'assets/product-chia-seeds.png';
    if (/pumpkin/i.test(name)) return 'assets/product-pumpkin-seeds.png';
    if (/sunflower/i.test(name)) return 'assets/product-sunflower-seeds.png';
    if (/flax/i.test(name)) return 'assets/product-flax-seeds.png';
    if (/cucumber/i.test(name)) return 'assets/product-cucumber-seeds.png';
    if (/watermelon/i.test(name)) return 'assets/product-watermelon-seeds.png';
    if (/sabja/i.test(name)) return 'assets/product-sabja-seeds.png';
    if (/seed/i.test(name)) return 'assets/product-seeds.png';
    if (/fig|anjeer/i.test(name)) return 'assets/product-figs.png';
    if (/walnut|akhrot/i.test(name)) return 'assets/product-walnuts.png';
    if (/apricot|jardalu/i.test(name)) return 'assets/product-apricots.png';
    if (/blueberry/i.test(name)) return 'assets/product-dry-blueberry.png';
    if (/cranberry/i.test(name)) return 'assets/product-dry-cranberry.png';
    if (/honey/i.test(name)) return 'assets/product-honey.png';
    if (/gift|hamper|box/i.test(name)) return 'assets/product-gift-box.png';
    return 'assets/karol-grove-pouch.png';
  }

  // Compute discount percentage
  function computeDiscount(price, mrp) {
    if (!price || !mrp || mrp <= price) return null;
    const pct = Math.round(((mrp - price) / mrp) * 100);
    return pct > 0 ? `${pct}% OFF` : null;
  }

  // Render Filter Tabs
  function renderFilterTabs() {
    const container = document.getElementById('pricelist-filter-tabs');
    if (!container) return;

    const catalog = getCatalog();
    
    // Group counts
    const counts = { All: catalog.length };
    ORDERED_CATEGORIES.forEach(c => { if (c !== 'All') counts[c] = 0; });

    catalog.forEach(item => {
      const cat = getItemCategory(item);
      if (counts[cat] !== undefined) {
        counts[cat]++;
      } else {
        counts['Other'] = (counts['Other'] || 0) + 1;
      }
    });

    let html = '';
    ORDERED_CATEGORIES.forEach(cat => {
      const count = counts[cat] || 0;
      // Only display categories that actually contain products
      if (count > 0 || cat === 'All') {
        const isActive = (currentCategory === cat);
        html += `
          <button type="button" 
                  class="cat-pill ${isActive ? 'active' : ''}" 
                  data-category="${escapeHtml(cat)}"
                  onclick="window.selectPricelistCategory('${escapeHtml(cat)}')"
                  style="padding: 9px 18px; border-radius: 30px; font-weight: 700; font-size: 13.5px; cursor: pointer; transition: all 0.2s ease;">
            ${escapeHtml(cat)} <span style="opacity: 0.8; font-size: 11.5px; margin-left: 4px;">(${count})</span>
          </button>
        `;
      }
    });

    container.innerHTML = html;
  }

  // Category selection handler
  window.selectPricelistCategory = function(cat) {
    currentCategory = cat;
    renderFilterTabs();
    renderPublicCatalogue();
  };

  // Add to cart with visual feedback
  function handleAddToCart(name, variant, btnElement) {
    if (typeof window.addToCart === 'function') {
      window.addToCart(name, variant, 1);
    }

    if (btnElement) {
      const origText = btnElement.innerHTML;
      btnElement.innerHTML = '✓ Added!';
      btnElement.style.background = '#2E7D32';
      btnElement.style.color = '#FFFFFF';
      setTimeout(() => {
        btnElement.innerHTML = origText;
        btnElement.style.background = '';
        btnElement.style.color = '';
      }, 1200);
    }
  }
  window.handleAddToCart = handleAddToCart;

  // Render Product Catalogue Cards (Premium Layout)
  function renderCatalogueCards(items) {
    const container = document.getElementById('pricelist-catalogue-container');
    if (!container) return;

    // Force visibility (never allow opacity: 0 to hide items)
    container.classList.remove('reveal');
    container.classList.add('revealed');
    container.style.opacity = '1';
    container.style.visibility = 'visible';
    container.style.display = 'grid';

    if (items.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: #FFFFFF; border-radius: 16px; border: 1.5px dashed #CCD7D0;">
          <div style="font-size: 38px; margin-bottom: 10px;">🔍</div>
          <h3 style="color: #0E3B2E; font-family: var(--font-display); font-size: 22px; margin-bottom: 8px;">No products found in this category</h3>
          <p style="color: #64746B; font-size: 14px; margin-bottom: 16px;">Try switching to "All" or clear your search query.</p>
          <button onclick="window.clearPricelistFilters()" class="btn-action btn-action-edit" style="padding: 10px 20px; font-size: 13.5px; border-radius: 8px; cursor: pointer;">Show All Products</button>
        </div>
      `;
      return;
    }

    let html = '';
    items.forEach(item => {
      const isAvailable = (item.availability !== 'disabled' && item.availability !== 'out_of_stock');
      const catName = getItemCategory(item);
      const imgSrc = getProductImage(item);
      const desc = item.description || 'Premium quality selected dry fruits & nuts, packaged for guaranteed crisp freshness.';

      // Compile variants: support item.variants or fallback to price250g / price500g / price1kg
      let variants = [];
      if (Array.isArray(item.variants) && item.variants.length > 0) {
        variants = item.variants;
      } else {
        if (item.price250g !== undefined && item.price250g !== '') {
          variants.push({ packSize: '250 g', price: item.price250g, mrp: item.mrp250g || item.mrp || Math.round(item.price250g * 1.18) });
        }
        if (item.price500g !== undefined && item.price500g !== '') {
          variants.push({ packSize: '500 g', price: item.price500g, mrp: item.mrp500g || (item.mrp ? Math.round(item.mrp * 1.9) : Math.round(item.price500g * 1.18)) });
        }
        if (item.price1kg !== undefined && item.price1kg !== '') {
          variants.push({ packSize: '1 kg', price: item.price1kg, mrp: item.mrp1kg || (item.mrp ? Math.round(item.mrp * 3.7) : Math.round(item.price1kg * 1.18)) });
        }
        if (variants.length === 0 && item.price) {
          variants.push({ packSize: `${item.packSize || 1} ${item.unit || 'pack'}`, price: item.price, mrp: item.mrp || null });
        }
      }

      // Generate variant rows
      let variantsHtml = '';
      if (variants.length > 0) {
        variants.forEach(v => {
          const priceNum = parseFloat(v.price) || 0;
          const mrpNum = v.mrp ? parseFloat(v.mrp) : null;
          const discount = computeDiscount(priceNum, mrpNum);

          const mrpHtml = mrpNum && mrpNum > priceNum 
            ? `<span class="variant-mrp">₹${mrpNum.toLocaleString('en-IN')}</span>` 
            : '';
          
          const discountHtml = discount 
            ? `<span class="variant-discount-tag">${discount}</span>` 
            : '';

          variantsHtml += `
            <div class="catalogue-variant-row">
              <span class="variant-size-label">${escapeHtml(v.packSize)}</span>
              <div class="variant-pricing">
                <span class="variant-price-live">₹${priceNum.toLocaleString('en-IN')}</span>
                ${mrpHtml}
                ${discountHtml}
              </div>
              <button type="button" 
                      class="variant-add-btn" 
                      onclick="window.handleAddToCart('${escapeHtml(item.name)}', '${escapeHtml(v.packSize)}', this)"
                      ${!isAvailable ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}
                      title="Add ${escapeHtml(item.name)} (${escapeHtml(v.packSize)}) to Cart">
                <span>🛒</span> Add
              </button>
            </div>
          `;
        });
      } else {
        variantsHtml = `<div style="padding: 10px; text-align: center; color: #888; font-size: 13px;">Price on request</div>`;
      }

      html += `
        <article class="catalogue-card" data-product-id="${escapeHtml(item.id || '')}">
          <div class="catalogue-card-header">
            <span class="catalogue-badge-cat">${escapeHtml(catName)}</span>
            <span class="catalogue-badge-stock ${isAvailable ? 'stock-available' : 'stock-out'}">
              ${isAvailable ? 'In Stock' : 'Out of Stock'}
            </span>
            <img src="${escapeHtml(imgSrc)}" 
                 alt="${escapeHtml(item.name)}" 
                 class="catalogue-card-img"
                 loading="lazy"
                 onerror="this.src='assets/karol-grove-pouch.png'">
          </div>
          <div class="catalogue-card-body">
            <h3 class="catalogue-card-title">${escapeHtml(item.name)}</h3>
            <p class="catalogue-card-desc">${escapeHtml(desc)}</p>
            
            <div class="catalogue-variants-list">
              <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64746B; letter-spacing: 0.5px; margin-bottom: 2px;">
                Available Pack Sizes &amp; Prices
              </div>
              ${variantsHtml}
            </div>

            <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #EEF2F0; display: flex; justify-content: space-between; align-items: center;">
              <a href="https://wa.me/+918494832492?text=Hi%20Karol%20Grove%2C%20I%20want%20to%20order%20${encodeURIComponent(item.name)}" 
                 target="_blank" 
                 rel="noopener" 
                 style="font-size: 12.5px; color: #0E3B2E; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
                <span>💬</span> WhatsApp Order &rarr;
              </a>
              <span style="font-size: 11px; color: #8A9B92;">100% Quality Inspected</span>
            </div>
          </div>
        </article>
      `;
    });

    container.innerHTML = html;
  }

  // Render Table View (Alternative)
  function renderTable(items) {
    const tableBody = document.getElementById('pricelist-table-body');
    const tableContainer = document.getElementById('pricelist-table-container');
    if (!tableBody) return;

    if (tableContainer) {
      tableContainer.classList.remove('reveal');
      tableContainer.classList.add('revealed');
    }

    if (items.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 40px; color: #64746B;">
            No items match your filter criteria.
          </td>
        </tr>
      `;
      return;
    }

    let html = '';
    items.forEach(item => {
      const p250 = (item.price250g !== undefined && item.price250g !== '')
        ? `<span class="price-val" onclick="window.handleAddToCart('${escapeHtml(item.name)}', '250g', this)"><span class="price-cart-icon">🛒</span> ₹${item.price250g}</span>`
        : '-';

      const p500 = (item.price500g !== undefined && item.price500g !== '')
        ? `<span class="price-val" onclick="window.handleAddToCart('${escapeHtml(item.name)}', '500g', this)"><span class="price-cart-icon">🛒</span> ₹${item.price500g}</span>`
        : '-';

      const p1kg = (item.price1kg !== undefined && item.price1kg !== '')
        ? `<span class="price-val" onclick="window.handleAddToCart('${escapeHtml(item.name)}', '1kg', this)"><span class="price-cart-icon">🛒</span> ₹${item.price1kg}</span>`
        : '-';

      html += `
        <tr>
          <td style="width: 20%;">
            <span class="item-category-tag" style="background: rgba(14, 59, 46, 0.08); color: #0E3B2E; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 11.5px; text-transform: uppercase;">
              ${escapeHtml(getItemCategory(item))}
            </span>
          </td>
          <td style="width: 44%;">
            <strong style="color: #0E3B2E; font-size: 15px;">${escapeHtml(item.name)}</strong>
          </td>
          <td class="price-col" style="width: 12%; text-align: center;">${p250}</td>
          <td class="price-col" style="width: 12%; text-align: center;">${p500}</td>
          <td class="price-col" style="width: 12%; text-align: center;">${p1kg}</td>
        </tr>
      `;
    });

    tableBody.innerHTML = html;
  }

  // Master Render Function
  function renderPublicCatalogue() {
    const catalog = getCatalog();

    // Filter items
    const filtered = catalog.filter(item => {
      // Category match
      const itemCat = getItemCategory(item);
      const catMatch = (currentCategory === 'All') || (itemCat === currentCategory);

      // Search match
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = !q ||
        (item.name && String(item.name).toLowerCase().includes(q)) ||
        (itemCat && itemCat.toLowerCase().includes(q)) ||
        (item.description && String(item.description).toLowerCase().includes(q));

      return catMatch && nameMatch;
    });

    // Update count indicator
    const countIndicator = document.getElementById('pricelist-count-badge');
    if (countIndicator) {
      countIndicator.textContent = `Showing ${filtered.length} of ${catalog.length} products`;
    }

    // Render cards and table
    renderCatalogueCards(filtered);
    renderTable(filtered);
  }
  window.renderPublicCatalogue = renderPublicCatalogue;

  // View Switcher: Cards vs Table
  window.switchPricelistView = function(view) {
    currentView = view;
    const cardsContainer = document.getElementById('pricelist-catalogue-container');
    const tableContainer = document.getElementById('pricelist-table-container');
    const btnCards = document.getElementById('view-toggle-cards');
    const btnTable = document.getElementById('view-toggle-table');

    if (view === 'table') {
      if (cardsContainer) cardsContainer.style.setProperty('display', 'none', 'important');
      if (tableContainer) {
        tableContainer.style.setProperty('display', 'block', 'important');
        tableContainer.style.setProperty('opacity', '1', 'important');
        tableContainer.style.setProperty('visibility', 'visible', 'important');
      }
      if (btnCards) btnCards.classList.remove('active');
      if (btnTable) btnTable.classList.add('active');
    } else {
      if (cardsContainer) {
        cardsContainer.style.setProperty('display', 'grid', 'important');
        cardsContainer.style.setProperty('opacity', '1', 'important');
        cardsContainer.style.setProperty('visibility', 'visible', 'important');
      }
      if (tableContainer) tableContainer.style.setProperty('display', 'none', 'important');
      if (btnCards) btnCards.classList.add('active');
      if (btnTable) btnTable.classList.remove('active');
    }
  };

  // Clear filters
  window.clearPricelistFilters = function() {
    searchQuery = '';
    currentCategory = 'All';
    const sInput = document.getElementById('pricelist-search');
    if (sInput) sInput.value = '';
    renderFilterTabs();
    renderPublicCatalogue();
  };

  // Download CSV
  function downloadCSV() {
    const catalog = getCatalog();
    let csv = "Product Name,Category,250g Price,500g Price,1kg Price,Availability\n";
    catalog.forEach(item => {
      const name = item.name.includes(',') ? `"${item.name}"` : item.name;
      const cat = getItemCategory(item);
      const p250 = item.price250g || '';
      const p500 = item.price500g || '';
      const p1kg = item.price1kg || '';
      const avail = item.availability || 'available';
      csv += `${name},${cat},${p250},${p500},${p1kg},${avail}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Karol_Grove_Price_List_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Setup Real-time Listeners
  function setupLiveSync() {
    // 1. BroadcastChannel: instant cross-tab / cross-window
    if (window.BroadcastChannel) {
      try {
        const bc = new BroadcastChannel('kg_catalog_channel');
        bc.onmessage = function(ev) {
          if (ev.data && ev.data.type === 'CATALOG_UPDATED') {
            console.log('⚡ Real-time price update received via BroadcastChannel');
            renderFilterTabs();
            renderPublicCatalogue();
            showLiveSyncBanner();
          }
        };
      } catch (e) {}
    }

    // 2. Storage event
    window.addEventListener('storage', function(e) {
      if (e.key === 'kg_live_catalog' || e.key === 'kg_prices_local') {
        console.log('⚡ Real-time price update received via storage event');
        renderFilterTabs();
        renderPublicCatalogue();
        showLiveSyncBanner();
      }
    });

    // 3. Periodic cloud polling (every 25 seconds)
    setInterval(function() {
      if (typeof window.syncFromCloud === 'function') {
        window.syncFromCloud().then(() => {
          renderFilterTabs();
          renderPublicCatalogue();
        });
      }
    }, 25000);
  }

  // Brief subtle pulse banner when live price updates arrive
  function showLiveSyncBanner() {
    let pill = document.getElementById('live-sync-pill');
    if (!pill) {
      pill = document.createElement('div');
      pill.id = 'live-sync-pill';
      pill.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#0E3B2E; color:#FFFFFF; padding:10px 18px; border-radius:30px; font-size:13px; font-weight:700; box-shadow:0 10px 30px rgba(0,0,0,0.3); z-index:99999; display:flex; align-items:center; gap:8px; border:1px solid #C89A3C; transform:translateY(100px); opacity:0; transition:all 0.3s ease;';
      pill.innerHTML = '<span>⚡</span> Live Prices Updated!';
      document.body.appendChild(pill);
    }
    pill.style.transform = 'translateY(0)';
    pill.style.opacity = '1';
    setTimeout(() => {
      pill.style.transform = 'translateY(100px)';
      pill.style.opacity = '0';
    }, 2500);
  }

  // Initialize
  function init() {
    renderFilterTabs();
    renderPublicCatalogue();
    setupLiveSync();

    // Search input listener
    const searchInput = document.getElementById('pricelist-search');
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        searchQuery = e.target.value;
        renderPublicCatalogue();
      });
    }

    // CSV & Print
    const csvBtn = document.getElementById('btn-download-csv');
    if (csvBtn) csvBtn.addEventListener('click', downloadCSV);

    const pdfBtn = document.getElementById('btn-download-pdf');
    if (pdfBtn) pdfBtn.addEventListener('click', () => window.print());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
