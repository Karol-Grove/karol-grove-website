/**
 * Karol Grove — Price List Handler Script
 * Powers rendering, search/filters, admin editing mode, CSV export, PDF print, and GitHub Sync.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Dynamically load prices.js with a cache-buster to completely bypass browser and CDN cache
  const cacheBuster = document.createElement('script');
  cacheBuster.src = `assets/prices.js?t=${Date.now()}`;
  cacheBuster.onload = () => {
    initPriceList();
  };
  cacheBuster.onerror = () => {
    console.error('Failed to load fresh prices.js, falling back to cached.');
    initPriceList();
  };
  document.head.appendChild(cacheBuster);
});

function initPriceList() {
  const tableBody = document.getElementById('pricelist-table-body');
  const searchInput = document.getElementById('pricelist-search');
  const filterTabsContainer = document.getElementById('pricelist-filter-tabs');
  const localBanner = document.getElementById('local-edits-banner');
  const adminToolbar = document.getElementById('admin-toolbar');
  
  let priceListData = [];
  let activeCategory = 'all';
  let searchQuery = '';
  let isAdmin = sessionStorage.getItem('kg_admin_logged_in') === 'true';

  // Load Pricing Data
  function loadData() {
    const cached = localStorage.getItem('kg_prices_local');
    if (cached) {
      try {
        priceListData = JSON.parse(cached);
        if (localBanner) localBanner.style.display = 'flex';
      } catch (e) {
        console.error('Failed to parse cached prices, loading default:', e);
        priceListData = [...window.priceListData];
      }
    } else {
      if (window.priceListData) {
        priceListData = [...window.priceListData];
      } else {
        priceListData = [];
      }
      if (localBanner) localBanner.style.display = 'none';
    }
  }

  loadData();

  // Render Table Rows
  function renderTable() {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    // Filter data
    const filtered = priceListData.filter(item => {
      const catMatch = activeCategory === 'all' || item.category === activeCategory;
      const nameMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return catMatch && nameMatch;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="${isAdmin ? 6 : 5}" style="text-align: center; padding: 40px; color: var(--text-muted);">
            No items match your search.
          </td>
        </tr>
      `;
      return;
    }

    // Group items by category for cleaner display in normal mode (unless searching or editing)
    const isGroupingActive = !isAdmin && searchQuery === '' && activeCategory === 'all';

    if (isGroupingActive) {
      // Grouping logic
      const grouped = {};
      filtered.forEach(item => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
      });

      Object.keys(grouped).forEach(categoryName => {
        // Render category header row
        const headerRow = document.createElement('tr');
        headerRow.className = 'category-header-row';
        headerRow.innerHTML = `
          <td colspan="5">
            📂 ${getTranslatedCategory(categoryName)}
          </td>
        `;
        tableBody.appendChild(headerRow);

        // Render items under this category
        grouped[categoryName].forEach((item, index) => {
          const originalIndex = priceListData.findIndex(p => p === item);
          tableBody.appendChild(createRowElement(item, originalIndex));
        });
      });
    } else {
      // Non-grouped view (used when search/filter is active, or in admin mode)
      filtered.forEach(item => {
        const originalIndex = priceListData.findIndex(p => p === item);
        tableBody.appendChild(createRowElement(item, originalIndex));
      });
    }
  }

  // Helper to translate category names dynamically
  function getTranslatedCategory(cat) {
    const currentLang = localStorage.getItem('kg_lang') || 'en';
    if (currentLang === 'en') return cat;
    
    // Mapping key
    let key = 'cat_other';
    if (cat === 'Nuts') key = 'cat_nuts';
    else if (cat === 'Dates') key = 'cat_dates';
    else if (cat === 'Dried Fruits') key = 'cat_dried-fruits';
    else if (cat === 'Seeds') key = 'cat_seeds';
    else if (cat === 'Gift Packs') key = 'cat_mixed';
    else if (cat === 'Sweeteners & Others') key = 'cat_other';
    
    // Look up in uiTranslations (from translations.js)
    if (window.uiTranslations && window.uiTranslations[key]) {
      return window.uiTranslations[key][currentLang] || cat;
    }
    return cat;
  }

  // Create Row DOM Element
  function createRowElement(item, index) {
    const row = document.createElement('tr');
    
    if (isAdmin) {
      row.innerHTML = `
        <td style="width: 20%;">
          <select class="admin-editable-select" data-index="${index}" data-field="category">
            <option value="Nuts" ${item.category === 'Nuts' ? 'selected' : ''}>Nuts</option>
            <option value="Dates" ${item.category === 'Dates' ? 'selected' : ''}>Dates</option>
            <option value="Dried Fruits" ${item.category === 'Dried Fruits' ? 'selected' : ''}>Dried Fruits</option>
            <option value="Seeds" ${item.category === 'Seeds' ? 'selected' : ''}>Healthy Seeds</option>
            <option value="Sweeteners & Others" ${item.category === 'Sweeteners & Others' ? 'selected' : ''}>Sweeteners & Others</option>
            <option value="Gift Packs" ${item.category === 'Gift Packs' ? 'selected' : ''}>Gift Packs</option>
          </select>
        </td>
        <td style="width: 45%;">
          <input type="text" class="admin-editable-input" data-index="${index}" data-field="name" value="${escapeHtml(item.name)}">
        </td>
        <td style="width: 10%;">
          <input type="text" class="admin-editable-input" data-index="${index}" data-field="price250g" value="${item.price250g || ''}" placeholder="-">
        </td>
        <td style="width: 10%;">
          <input type="text" class="admin-editable-input" data-index="${index}" data-field="price500g" value="${item.price500g || ''}" placeholder="-">
        </td>
        <td style="width: 10%;">
          <input type="text" class="admin-editable-input" data-index="${index}" data-field="price1kg" value="${item.price1kg || ''}" placeholder="-">
        </td>
        <td style="width: 5%; text-align: center;">
          <button class="row-delete-btn" data-index="${index}" title="Delete Item">🗑️</button>
        </td>
      `;
      
      // Wire change listeners
      row.querySelectorAll('.admin-editable-input, .admin-editable-select').forEach(el => {
        el.addEventListener('change', handleCellEdit);
      });
      
      row.querySelector('.row-delete-btn').addEventListener('click', handleDeleteRow);

    } else {
      // Normal User Row
      const display250 = item.price250g ? `<span class="price-cart-icon">🛒</span> ₹${item.price250g}` : '-';
      const display500 = item.price500g ? `<span class="price-cart-icon">🛒</span> ₹${item.price500g}` : '-';
      const display1kg = item.price1kg ? `<span class="price-cart-icon">🛒</span> ₹${item.price1kg}` : '-';

      const tagClass = getCategoryTagClass(item.category);

      row.innerHTML = `
        <td><span class="item-category-tag ${tagClass}">${getTranslatedCategory(item.category)}</span></td>
        <td><strong>${escapeHtml(item.name)}</strong></td>
        <td class="price-col">
          <span class="price-val ${item.price250g ? '' : 'no-price'}" data-name="${escapeHtml(item.name)}" data-variant="250gm" data-price="${item.price250g || ''}">
            ${display250}
          </span>
        </td>
        <td class="price-col">
          <span class="price-val ${item.price500g ? '' : 'no-price'}" data-name="${escapeHtml(item.name)}" data-variant="500gm" data-price="${item.price500g || ''}">
            ${display500}
          </span>
        </td>
        <td class="price-col">
          <span class="price-val ${item.price1kg ? '' : 'no-price'}" data-name="${escapeHtml(item.name)}" data-variant="1kg" data-price="${item.price1kg || ''}">
            ${display1kg}
          </span>
        </td>
      `;

      // Wire cart clicks
      row.querySelectorAll('.price-val:not(.no-price)').forEach(span => {
        span.addEventListener('click', handleAddToCart);
      });
    }

    return row;
  }

  function getCategoryTagClass(cat) {
    if (cat === 'Nuts') return 'tag-nuts';
    if (cat === 'Dates') return 'tag-dates';
    if (cat === 'Dried Fruits') return 'tag-dryfruits';
    if (cat === 'Seeds') return 'tag-seeds';
    if (cat === 'Gift Packs') return 'tag-gifts';
    return 'tag-other';
  }

  // Add Item to WhatsApp Basket Cart (from Click)
  function handleAddToCart(e) {
    const span = e.currentTarget;
    const name = span.getAttribute('data-name');
    const variant = span.getAttribute('data-variant');
    const price = span.getAttribute('data-price');

    if (window.addToCart) {
      window.addToCart(name, variant, 1);
      
      // Visual feedback
      const originalText = span.innerHTML;
      span.innerHTML = '✨ Added!';
      span.style.color = 'var(--gold)';
      setTimeout(() => {
        span.innerHTML = originalText;
        span.style.color = '';
      }, 1000);

      // Open dynamic cart drawer for quick feedback
      if (window.toggleCartDrawer) {
        window.toggleCartDrawer(true);
      }
    } else {
      console.warn('WhatsApp Order Builder is not loaded.');
    }
  }

  // Handle Input Changes in Admin Edit Mode
  function handleCellEdit(e) {
    const input = e.target;
    const index = parseInt(input.getAttribute('data-index'));
    const field = input.getAttribute('data-field');
    let value = input.value.trim();

    // Convert prices to numbers if editable numeric fields
    if (field.startsWith('price')) {
      if (value === '') {
        value = '';
      } else {
        const num = parseFloat(value);
        value = isNaN(num) ? '' : num;
      }
    }

    priceListData[index][field] = value;
  }

  // Handle Delete Row
  function handleDeleteRow(e) {
    const btn = e.target;
    const index = parseInt(btn.getAttribute('data-index'));
    
    if (confirm(`Are you sure you want to delete "${priceListData[index].name}"?`)) {
      priceListData.splice(index, 1);
      renderTable();
    }
  }

  // Add New Row in Edit Mode
  function handleAddRow() {
    priceListData.push({
      category: 'Nuts',
      name: 'New Premium Item',
      price250g: '',
      price500g: '',
      price1kg: ''
    });
    renderTable();
    // Scroll to the bottom of the table
    const tableContainer = document.querySelector('.pricelist-table-wrapper');
    if (tableContainer) {
      tableContainer.scrollTop = tableContainer.scrollHeight;
    }
  }

  // Save changes locally (localStorage)
  function handleSaveLocal() {
    localStorage.setItem('kg_prices_local', JSON.stringify(priceListData));
    if (localBanner) localBanner.style.display = 'flex';
    
    // Toggle admin view save status
    const saveBtn = document.getElementById('admin-save-btn');
    if (saveBtn) {
      const origText = saveBtn.innerHTML;
      saveBtn.innerHTML = '✅ Saved Locally!';
      setTimeout(() => {
        saveBtn.innerHTML = origText;
      }, 1500);
    }
    
    renderTable();
    alert('Changes saved locally in your browser! Remember to download "prices.js" and overwrite the file in your codebase, or use GitHub Sync, to save them permanently for all users.');
  }

  // Reset local edits (clear localStorage)
  function handleResetLocal() {
    if (confirm('Are you sure you want to discard all local edits and restore the prices from prices.js? This cannot be undone.')) {
      localStorage.removeItem('kg_prices_local');
      loadData();
      renderTable();
    }
  }

  // Download updated prices.js
  function handleDownloadJS() {
    // Generate clean javascript source content
    let content = `/**\n * Karol Grove — Weekly Price List Data\n * This file contains the default list of products and their prices.\n */\n\nwindow.priceListData = [\n`;
    
    priceListData.forEach((item, index) => {
      const comma = index === priceListData.length - 1 ? '' : ',';
      const p250 = item.price250g === '' ? '""' : item.price250g;
      const p500 = item.price500g === '' ? '""' : item.price500g;
      const p1kg = item.price1kg === '' ? '""' : item.price1kg;
      
      content += `  { category: "${item.category}", name: "${item.name.replace(/"/g, '\\"')}", price250g: ${p250}, price500g: ${p500}, price1kg: ${p1kg} }${comma}\n`;
    });
    
    content += `];\n`;

    const blob = new Blob([content], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prices.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Download CSV Format
  function handleDownloadCSV() {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Category,Item Name,250g Price (INR),500g Price (INR),1kg Price (INR)\r\n';

    priceListData.forEach(item => {
      const name = item.name.includes(',') ? `"${item.name}"` : item.name;
      const category = item.category.includes(',') ? `"${item.category}"` : item.category;
      csvContent += `${category},${name},${item.price250g || '-'},${item.price500g || '-'},${item.price1kg || '-'}\r\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Karol_Grove_Price_List_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // GitHub Sync Panel Open/Toggle
  function toggleGithubPanel() {
    const panel = document.getElementById('github-sync-panel');
    if (!panel) return;
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    
    // Pre-populate fields
    document.getElementById('gh-username').value = localStorage.getItem('gh_username') || '';
    document.getElementById('gh-repo').value = localStorage.getItem('gh_repo') || '';
    document.getElementById('gh-path').value = localStorage.getItem('gh_path') || 'assets/prices.js';
    document.getElementById('gh-pat').value = localStorage.getItem('gh_pat') || '';
  }

  // Save via GitHub API directly from the browser!
  async function handleGithubSync() {
    const username = document.getElementById('gh-username').value.trim();
    const repo = document.getElementById('gh-repo').value.trim();
    const pat = document.getElementById('gh-pat').value.trim();
    let path = document.getElementById('gh-path').value.trim() || 'assets/prices.js';
    const syncStatus = document.getElementById('gh-sync-status');

    if (!username || !repo || !pat) {
      alert('Please fill out GitHub Username, Repository Name, and Personal Access Token (PAT).');
      return;
    }

    // Cache credentials locally in local storage for convenience (except security concerns, it's local)
    localStorage.setItem('gh_username', username);
    localStorage.setItem('gh_repo', repo);
    localStorage.setItem('gh_pat', pat);
    localStorage.setItem('gh_path', path);

    if (syncStatus) {
      syncStatus.textContent = '🔄 Querying repository...';
      syncStatus.style.color = 'var(--gold)';
    }

    let url = `https://api.github.com/repos/${username}/${repo}/contents/${path}`;

    try {
      // 1. Get the current file content to get the SHA (try specified path first, fallback if not found and was default)
      let getResponse = await fetch(url, {
        headers: {
          'Authorization': `token ${pat}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      let sha = '';
      if (getResponse.ok) {
        const fileData = await getResponse.json();
        sha = fileData.sha;
      } else if (getResponse.status === 404) {
        // Fallback to legacy path if assets/prices.js is not found at root and was used as default
        if (path === 'assets/prices.js') {
          const fallbackPath = 'karol-grove/assets/prices.js';
          const fallbackUrl = `https://api.github.com/repos/${username}/${repo}/contents/${fallbackPath}`;
          const fallbackResponse = await fetch(fallbackUrl, {
            headers: {
              'Authorization': `token ${pat}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          
          if (fallbackResponse.ok) {
            path = fallbackPath;
            url = fallbackUrl;
            const fileData = await fallbackResponse.json();
            sha = fileData.sha;
            
            // Update UI/localStorage with detected path
            document.getElementById('gh-path').value = fallbackPath;
            localStorage.setItem('gh_path', fallbackPath);
          } else if (fallbackResponse.status !== 404) {
            throw new Error(`Failed to fetch file SHA from fallback path. Status: ${fallbackResponse.status}`);
          }
        }
      } else {
        throw new Error(`Failed to fetch file SHA. Check repository name, token permissions, and file path. Status: ${getResponse.status}`);
      }

      // 2. Generate updated file contents
      let fileContent = `/**\n * Karol Grove — Weekly Price List Data\n * This file contains the default list of products and their prices.\n */\n\nwindow.priceListData = [\n`;
      priceListData.forEach((item, index) => {
        const comma = index === priceListData.length - 1 ? '' : ',';
        const p250 = item.price250g === '' ? '""' : item.price250g;
        const p500 = item.price500g === '' ? '""' : item.price500g;
        const p1kg = item.price1kg === '' ? '""' : item.price1kg;
        fileContent += `  { category: "${item.category}", name: "${item.name.replace(/"/g, '\\"')}", price250g: ${p250}, price500g: ${p500}, price1kg: ${p1kg} }${comma}\n`;
      });
      fileContent += `];\n`;

      // 3. PUT the content back in base64
      const base64Content = btoa(unescape(encodeURIComponent(fileContent)));
      
      if (syncStatus) syncStatus.textContent = '🔄 Committing to GitHub...';

      const putResponse = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${pat}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: 'Update price list via admin web dashboard',
          content: base64Content,
          sha: sha || undefined
        })
      });

      if (putResponse.ok) {
        if (syncStatus) {
          syncStatus.textContent = '✨ Saved to GitHub successfully! Rebuilding site...';
          syncStatus.style.color = '#3c8f5f';
        }
        alert('Successfully pushed edits to your GitHub repository! GitHub Pages will rebuild and show the updated prices globally in a few minutes.');
        // Update in-memory default list so UI doesn't revert to old values before page reload
        window.priceListData = JSON.parse(JSON.stringify(priceListData));
        // We can now safely clear local edits as they are synced
        localStorage.removeItem('kg_prices_local');
        loadData();
        renderTable();
        // Close panel
        setTimeout(toggleGithubPanel, 2000);
      } else {
        const errJson = await putResponse.json();
        throw new Error(errJson.message || 'Error updating repository.');
      }

    } catch (e) {
      console.error(e);
      if (syncStatus) {
        syncStatus.textContent = `❌ Error: ${e.message}`;
        syncStatus.style.color = 'var(--berry)';
      }
      alert(`GitHub sync failed: ${e.message}`);
    }
  }

  // Search input event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderTable();
    });
  }

  // Setup dynamic category filters
  function initFilterTabs() {
    if (!filterTabsContainer) return;
    
    // Get unique categories from data
    const categories = ['all', 'Nuts', 'Dates', 'Dried Fruits', 'Seeds', 'Sweeteners & Others', 'Gift Packs'];
    
    filterTabsContainer.innerHTML = '';
    categories.forEach(cat => {
      const tab = document.createElement('button');
      tab.className = `cat-filter-tab ${cat === activeCategory ? 'active' : ''}`;
      tab.setAttribute('data-category', cat);
      
      // Translate tab text
      let tabText = cat;
      if (cat === 'all') {
        tabText = 'All';
        tab.setAttribute('data-tr', 'tab_all');
      } else {
        tabText = getTranslatedCategory(cat);
      }
      
      tab.textContent = tabText;
      
      tab.addEventListener('click', (e) => {
        filterTabsContainer.querySelectorAll('.cat-filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeCategory = cat;
        renderTable();
      });
      
      filterTabsContainer.appendChild(tab);
    });
  }

  initFilterTabs();
  renderTable();

  // Watch for language change to update headers/tabs
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('lang-dropdown-item') || e.target.id === 'mobile-lang-select') {
      setTimeout(() => {
        initFilterTabs();
        renderTable();
      }, 100);
    }
  });

  // Admin Auth Logic
  const loginForm = document.getElementById('admin-login-form');
  const loginModal = document.getElementById('admin-login-modal');
  const passwordInput = document.getElementById('admin-password');
  
  window.openAdminLogin = function() {
    if (loginModal) loginModal.classList.add('open');
    if (passwordInput) passwordInput.focus();
  };

  window.closeAdminLogin = function() {
    if (loginModal) loginModal.classList.remove('open');
  };

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pw = passwordInput.value;
      if (pw === 'karoladmin') {
        sessionStorage.setItem('kg_admin_logged_in', 'true');
        isAdmin = true;
        closeAdminLogin();
        enterAdminMode();
      } else {
        alert('Incorrect password. Please try again.');
        passwordInput.value = '';
      }
    });
  }

  function enterAdminMode() {
    isAdmin = true;
    if (adminToolbar) adminToolbar.style.display = 'block';
    
    // Style table headers to show "Actions" column
    const headerRow = document.querySelector('.pricelist-table thead tr');
    if (headerRow && !document.getElementById('action-th')) {
      const actionTh = document.createElement('th');
      actionTh.id = 'action-th';
      actionTh.style.width = '5%';
      actionTh.style.textAlign = 'center';
      actionTh.textContent = 'Del';
      headerRow.appendChild(actionTh);
    }
    
    // Hide standard category tabs and search filters during edit for structural integrity
    // Or render standard inputs in all cells
    renderTable();
  }

  window.exitAdminMode = function() {
    sessionStorage.removeItem('kg_admin_logged_in');
    isAdmin = false;
    if (adminToolbar) adminToolbar.style.display = 'none';
    
    const actionTh = document.getElementById('action-th');
    if (actionTh) actionTh.remove();
    
    loadData();
    renderTable();
  };

  // Check initial admin state
  if (isAdmin) {
    enterAdminMode();
  }

  // Wire Admin Toolbar Buttons
  const addRowBtn = document.getElementById('admin-add-row-btn');
  if (addRowBtn) addRowBtn.addEventListener('click', handleAddRow);

  const saveLocalBtn = document.getElementById('admin-save-btn');
  if (saveLocalBtn) saveLocalBtn.addEventListener('click', handleSaveLocal);

  const downloadJsBtn = document.getElementById('admin-download-btn');
  if (downloadJsBtn) downloadJsBtn.addEventListener('click', handleDownloadJS);

  const syncGhBtn = document.getElementById('admin-sync-btn');
  if (syncGhBtn) syncGhBtn.addEventListener('click', toggleGithubPanel);

  const doSyncGhBtn = document.getElementById('gh-sync-now-btn');
  if (doSyncGhBtn) doSyncGhBtn.addEventListener('click', handleGithubSync);

  const cancelSyncGhBtn = document.getElementById('gh-sync-cancel-btn');
  if (cancelSyncGhBtn) cancelSyncGhBtn.addEventListener('click', toggleGithubPanel);

  const resetLocalBtn = document.getElementById('admin-reset-btn');
  if (resetLocalBtn) resetLocalBtn.addEventListener('click', handleResetLocal);

  // Wire Download Excel/CSV buttons
  const csvDownloadBtn = document.getElementById('btn-download-csv');
  if (csvDownloadBtn) csvDownloadBtn.addEventListener('click', handleDownloadCSV);

  // Wire Print/PDF buttons
  const pdfDownloadBtn = document.getElementById('btn-download-pdf');
  if (pdfDownloadBtn) {
    pdfDownloadBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

// Simple HTML Escape function to prevent XSS
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
