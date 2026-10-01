/**
 * Karol Grove — Modern Public Price List Handler
 * Supports dynamic category filters, search, mobile responsive cards,
 * WhatsApp 1-click cart addition, and real-time synchronization with Admin Mode.
 */

(function() {
  'use strict';

  // Target filter categories requested by specification
  const PREFERRED_CATEGORIES = [
    "Cashews",
    "Almonds",
    "Pistachios",
    "Raisins",
    "Dates",
    "Seeds",
    "Other Products"
  ];

  let currentCategory = 'all';
  let searchQuery = '';

  // Get active items from the master catalog
  function getActiveItems() {
    const catalog = window.getActivePriceCatalog ? window.getActivePriceCatalog() : (window.priceListData || []);
    // Only return items that are NOT disabled
    return catalog.filter(item => item.availability !== 'disabled');
  }

  // Determine which categories actually have active products
  function getAvailableCategories(items) {
    const presentCats = new Set();
    items.forEach(item => {
      if (item.category) presentCats.add(item.category);
    });

    // Return in specified order, filtered to only those present
    const ordered = PREFERRED_CATEGORIES.filter(c => presentCats.has(c));
    // Add any remaining categories that might have been custom created
    presentCats.forEach(c => {
      if (!ordered.includes(c)) ordered.push(c);
    });
    return ordered;
  }

  // Render category filter buttons
  function renderFilterTabs(items) {
    const container = document.getElementById('pricelist-filter-tabs');
    if (!container) return;

    const availableCats = getAvailableCategories(items);
    
    // Build tabs HTML
    let html = `
      <button class="cat-pill ${currentCategory === 'all' ? 'active' : ''}" data-cat="all">
        All Products (${items.length})
      </button>
    `;

    availableCats.forEach(cat => {
      const count = items.filter(i => i.category === cat).length;
      html += `
        <button class="cat-pill ${currentCategory === cat ? 'active' : ''}" data-cat="${cat}">
          ${cat} (${count})
        </button>
      `;
    });

    container.innerHTML = html;

    // Attach click events
    container.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-cat');
        renderTable();
      });
    });
  }

  // Render the table rows
  function renderTable() {
    const tbody = document.getElementById('pricelist-table-body');
    if (!tbody) return;

    const items = getActiveItems();

    // Sort by displayOrder if available
    items.sort((a, b) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));

    // Filter items
    const filtered = items.filter(item => {
      const matchesCat = currentCategory === 'all' || item.category === currentCategory;
      const term = searchQuery.toLowerCase().trim();
      const matchesSearch = !term || 
        (item.name && item.name.toLowerCase().includes(term)) ||
        (item.category && item.category.toLowerCase().includes(term)) ||
        (`${item.packSize}${item.unit}`.toLowerCase().includes(term));
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
            <div style="font-size: 32px; margin-bottom: 10px;">🔍</div>
            <p style="font-size: 16px; font-weight: 600;">No items found matching your criteria</p>
            <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">Try selecting another category or clearing your search.</p>
          </td>
        </tr>
      `;
      return;
    }

    let rowsHtml = '';
    filtered.forEach(item => {
      const packFormatted = `${item.packSize || ''} ${item.unit || ''}`.trim();
      const priceFormatted = `₹${item.price}`;
      const mrpFormatted = item.mrp ? `<span class="price-mrp" style="text-decoration: line-through; color: #8C9B90; font-size: 12px; margin-right: 6px;">₹${item.mrp}</span>` : '';
      const discountFormatted = item.discount ? `<span class="discount-badge" style="background: rgba(216, 147, 42, 0.15); color: #B37D14; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">${item.discount}</span>` : '';
      const imgSrc = item.image || 'assets/product-cashews.png';

      rowsHtml += `
        <tr class="pricelist-item-row" data-id="${item.id || ''}">
          <td class="col-product" data-label="PRODUCT">
            <div class="product-cell-flex" style="display: flex; align-items: center; gap: 14px;">
              <img src="${imgSrc}" alt="${item.name}" class="product-thumb" style="width: 44px; height: 44px; object-fit: contain; border-radius: 8px; background: #FAF8F5; padding: 3px; border: 1px solid rgba(0,0,0,0.06); flex-shrink: 0;" onerror="this.src='assets/karol-grove-icon.png'">
              <div>
                <strong class="product-title" style="color: var(--forest-deep); font-size: 15px; display: block;">${item.name}</strong>
                <span class="product-cat-tag" style="font-size: 11.5px; color: var(--gold-deep); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${item.category || ''}</span>
              </div>
            </div>
          </td>
          <td class="col-pack" data-label="PACK SIZE" style="text-align: center; font-weight: 600; color: var(--forest-deep); font-size: 14.5px;">
            <span class="pack-size-pill" style="background: #F3EFEA; padding: 4px 10px; border-radius: 6px; display: inline-block;">${packFormatted}</span>
          </td>
          <td class="col-price" data-label="PRICE" style="text-align: center;">
            <div class="price-stack" style="display: inline-flex; align-items: center; justify-content: center; gap: 4px; flex-wrap: wrap;">
              ${mrpFormatted}
              <span class="price-val" style="font-weight: 800; font-size: 16px; color: var(--forest);">${priceFormatted}</span>
              ${discountFormatted}
            </div>
          </td>
          <td class="col-action" data-label="ORDER" style="text-align: center;">
            <button class="add-cart-btn-v2" onclick="handlePriceListAddToCart('${item.name.replace(/'/g, "\\'")}', '${packFormatted.replace(/\s+/g, '')}', ${item.price})" style="background: var(--forest); color: #fff; border: none; padding: 7px 14px; border-radius: 6px; font-weight: 700; font-size: 12.5px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 5px;">
              <span>🛒</span> Add
            </button>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = rowsHtml;
  }

  // Global handler for adding to cart from the Price List
  window.handlePriceListAddToCart = function(name, variant, price) {
    if (typeof window.addToCart === 'function') {
      window.addToCart(name, variant);
      // Give feedback toast
      if (typeof window.showToastNotification === 'function') {
        window.showToastNotification(`Added ${name} (${variant}) to Cart`);
      }
    } else {
      // Direct WhatsApp redirect if cart unavailable
      const text = encodeURIComponent(`Hi Karol Grove, I would like to order: ${name} (${variant}) - ₹${price}`);
      window.open(`https://wa.me/918494832492?text=${text}`, '_blank');
    }
  };

  // CSV Exporter
  function exportCSV() {
    const items = getActiveItems();
    let csv = "Category,Product Name,Pack Size,Unit,Price,MRP,Discount\n";
    items.forEach(i => {
      const cleanName = (i.name || '').replace(/"/g, '""');
      const cleanCat = (i.category || '').replace(/"/g, '""');
      csv += `"${cleanCat}","${cleanName}","${i.packSize || ''}","${i.unit || ''}","${i.price || ''}","${i.mrp || ''}","${i.discount || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Karol_Grove_Price_List_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Print Handler
  function printPDF() {
    window.print();
  }

  // Init
  function init() {
    const items = getActiveItems();
    renderFilterTabs(items);
    renderTable();

    // Search bar event
    const searchInput = document.getElementById('pricelist-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderTable();
      });
    }

    // CSV & Print buttons
    const csvBtn = document.getElementById('btn-download-csv');
    if (csvBtn) csvBtn.addEventListener('click', exportCSV);

    const pdfBtn = document.getElementById('btn-download-pdf');
    if (pdfBtn) pdfBtn.addEventListener('click', printPDF);

    // Listen for storage events (e.g., changes made in Admin Mode in another tab or window)
    window.addEventListener('storage', (e) => {
      if (e.key === 'kg_prices_local') {
        const refreshedItems = getActiveItems();
        renderFilterTabs(refreshedItems);
        renderTable();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
