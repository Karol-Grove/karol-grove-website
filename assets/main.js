/**
 * KAROL GROVE — Premium Redesign VFX and Interactive Script
 * Contains: Canvas Particles, 3D Tilt, Scroll Reveal, WhatsApp Order Builder, and Filters.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCanvasParticles();
  initScrollReveal();
  initTiltEffect();
  initOrderBuilder();
  initProductFilters();
  initContactForm();
  initHeroVideoLoop();
});

/* ==========================================================================
   Mobile Nav Menu
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobileNav');
  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileNav.classList.toggle('open');
      toggleBtn.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && !toggleBtn.contains(e.target)) {
        mobileNav.classList.remove('open');
        toggleBtn.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   Canvas Particles VFX
   ========================================================================== */
function initCanvasParticles() {
  let canvas = document.getElementById('vfx-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'vfx-canvas';
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let particles = [];
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    init();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Load cute cartoon dry fruit images for the drizzle effect
  const imageUrls = [
    'assets/drizzle-almond.png',
    'assets/drizzle-cashew.png',
    'assets/drizzle-raisin.png',
    'assets/drizzle-walnut.png',
    'assets/drizzle-pistachio.png'
  ];

  const loadedImages = [];
  let loadedCount = 0;

  imageUrls.forEach((url, index) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      loadedImages[index] = img;
      loadedCount++;
    };
    img.onerror = () => {
      console.warn('Failed to load particle image:', url);
    };
  });

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -50;
      // Crisp, cute size for cartoon dry fruit characters (22px to 38px radius)
      this.size = Math.random() * 16 + 22; 
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.7 + 0.6; // Drizzles downward smoothly
      // 0 = Almond, 1 = Cashew, 2 = Raisin, 3 = Walnut, 4 = Pistachio
      this.type = Math.floor(Math.random() * 5);
      this.alpha = Math.random() * 0.25 + 0.6; // Clearly visible & playful
      this.angle = Math.random() * Math.PI * 2;
      this.spin = Math.random() * 0.016 - 0.008; // Subtle rotation
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.angle += this.spin;

      // Wrap-around edges for drizzle
      if (this.y > height + 50) {
        this.reset(false);
      }
      if (this.x < -50) this.x = width + 50;
      if (this.x > width + 50) this.x = -50;

      // Mouse and Touch interactive push
      if (mouse.x != null && mouse.y != null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = dx / (distance || 1);
          let directionY = dy / (distance || 1);
          this.x += directionX * force * 3.5;
          this.y += directionY * force * 3.5;
        }
      }
    }

    draw() {
      const img = loadedImages[this.type];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      const size = this.size;
      // Draw image centered
      ctx.drawImage(img, -size, -size, size * 2, size * 2);

      ctx.restore();
    }
  }

  function init() {
    particles = [];
    const count = Math.min(36, Math.max(16, Math.floor((width * height) / 32000)));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }

  init();
  animate();
}

/* ==========================================================================
   Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once revealed, no need to track it anymore
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   3D Tilt Effect
   ========================================================================== */
function initTiltEffect() {
  const tilts = document.querySelectorAll('.tilt-card');
  if (tilts.length === 0) return;

  // Skip tilt effect on touch devices for performance and UX
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  tilts.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate inside element
      const y = e.clientY - rect.top;  // y coordinate inside element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation percentage (-10 to 10 degrees)
      const rotateX = ((centerY - y) / centerY) * 10; 
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    });
  });
}

/* ==========================================================================
   WhatsApp Order Builder
   ========================================================================== */
function initOrderBuilder() {
  let cart = JSON.parse(localStorage.getItem('kg_order_cart')) || [];

  // Helper to escape single quotes for onclick HTML handlers
  function escapeQuote(str) {
    return str.replace(/'/g, "\\'");
  }

  // Expose lookup function globally to find the price of an item from priceListData / local storage cache
  window.findPriceInList = function(name, variant) {
    let priceListData = [];
    const cached = localStorage.getItem('kg_prices_local');
    if (cached) {
      try {
        priceListData = JSON.parse(cached);
      } catch (e) {
        console.error('Failed to parse cached prices:', e);
      }
    }
    if (!priceListData || priceListData.length === 0) {
      priceListData = window.priceListData || [];
    }

    if (priceListData.length === 0) return null;

    const normName = name.toLowerCase().trim();
    let found = priceListData.find(item => item.name.toLowerCase() === normName);

    if (!found) {
      const aliasKey = normName.replace(/^(premium|organic|raw|pure|dried|dry|fresh)\s+/i, '')
                               .replace(/\s+(premium|organic|raw|pure|dried|dry|fresh)$/i, '');
      const nameAliases = {
        "almonds": "Premium Almonds (Badam)",
        "cashews": "Premium Cashews (Kaju) - W240",
        "pistachios": "Pistachios (Pista) - Roasted & Salted",
        "salted pistachios": "Pistachios (Pista) - Roasted & Salted",
        "walnuts": "Premium Walnuts (Akhrot) - Chile Halves",
        "dates": "Medjool Dates (Premium)",
        "dry date": "Dry Dates (Kharik) - Yellow",
        "black date": "Black Dates (Premium)",
        "raisins": "Golden Raisins (Kishmish)",
        "dried figs": "Dried Figs (Anjeer) - Premium Jumbo",
        "apricots": "Dried Apricots (Jardalu)",
        "honey": "Pure Organic Honey",
        "jaggery": "Organic Jaggery (Powder)",
        "palm sugar": "Palm Sugar",
        "palm candy": "Palm Candy (Panakarkandu)",
        "almond gum": "Almond Gum (Pisin)",
        "brown sugar": "Brown Sugar (Nattu Sakkarai)",
        "deluxe harvest mix": "Premium Festive Gift Hamper",
        "festive dry fruits box": "Dry Fruit & Nuts Gift Box (4-in-1)",
        "seed mixed": "Healthy Seeds & Mix Gift Pack",
        "nuts mixed": "Dry Fruit & Nuts Gift Box (4-in-1)",
        "karol grove deluxe harvest mix": "Premium Festive Gift Hamper",
        "dry cherry": "Dried Cranberries (Whole)",
        "dried kiwi": "Dried Cranberries (Whole)",
        "dried pineapple": "Dried Cranberries (Whole)",
        "dry strawberry": "Dried Cranberries (Whole)",
        "dry amla": "Dried Cranberries (Whole)",
        "honey amla": "Pure Organic Honey",
        "dry mango": "Dried Cranberries (Whole)",
        "dry blueberry": "Dried Blueberries",
        "dry cranberry": "Dried Cranberries (Whole)",
        "sabja seeds": "Basil Seeds (Sabja)",
        "chia seeds": "Chia Seeds (Organic)",
        "pumpkin seeds": "Pumpkin Seeds (Raw)",
        "sunflower seeds": "Sunflower Seeds (Raw)",
        "flax seeds": "Flax Seeds (Organic)",
        "watermelon seeds": "Watermelon Seeds",
      };
      const mappedRealName = nameAliases[normName] || nameAliases[aliasKey];
      if (mappedRealName) {
        found = priceListData.find(item => item.name === mappedRealName);
      }
    }

    if (!found) {
      found = priceListData.find(item => {
        const itemNorm = item.name.toLowerCase();
        return itemNorm.includes(normName) || normName.includes(itemNorm);
      });
    }

    if (!found) {
      const words = normName.split(/\s+/).filter(w => w.length > 2);
      found = priceListData.find(item => {
        const itemNorm = item.name.toLowerCase();
        return words.some(w => itemNorm.includes(w));
      });
    }

    if (!found) return null;

    const variantNorm = variant.toLowerCase().replace(/\s+/g, '');
    if (variantNorm.includes('250g')) {
      return found.price250g || null;
    } else if (variantNorm.includes('500g')) {
      return found.price500g || null;
    } else if (variantNorm.includes('1kg')) {
      return found.price1kg || null;
    } else if (variantNorm.includes('6egg')) {
      return 36;
    } else if (variantNorm.includes('12egg') || variantNorm.includes('1dozen')) {
      return 72;
    } else if (variantNorm.includes('30egg')) {
      return found.price1kg || 180;
    }

    return found.price250g || found.price500g || found.price1kg || null;
  };

  // Helper alias for internal usage
  const findPriceInList = window.findPriceInList;

  // Real-time synchronization across all product cards on the page
  window.syncAllProductCardPrices = function() {
    const cards = document.querySelectorAll('.product-card');
    if (!cards.length) return;

    cards.forEach(card => {
      const titleEl = card.querySelector('h3');
      if (!titleEl) return;
      const productName = titleEl.textContent.trim();
      const select = card.querySelector('.variant-select');
      if (!select) return;

      // Update option label prices dynamically
      Array.from(select.options).forEach(opt => {
        const val = opt.value;
        const price = window.findPriceInList(productName, val);
        if (price) {
          const cleanVal = val.replace(/gm$/i, 'g');
          opt.textContent = `${cleanVal} — ₹${price}`;
        }
      });

      // Insert or update live price badge
      let priceTag = card.querySelector('.card-live-price-tag');
      if (!priceTag) {
        priceTag = document.createElement('div');
        priceTag.className = 'card-live-price-tag';
        const body = card.querySelector('.product-card-body');
        const selector = card.querySelector('.product-selector');
        if (body && selector) {
          body.insertBefore(priceTag, selector);
        }
      }

      const updatePriceDisplay = () => {
        const currentVariant = select.value;
        const currentPrice = window.findPriceInList(productName, currentVariant);
        if (currentPrice) {
          const cleanVar = currentVariant.replace(/gm$/i, 'g');
          priceTag.innerHTML = `<span class="price-curr">₹</span><span class="price-val">${currentPrice}</span><span class="price-unit">/${cleanVar}</span>`;
          priceTag.style.display = 'inline-flex';
        } else {
          priceTag.style.display = 'none';
        }
      };

      updatePriceDisplay();

      if (!select.dataset.priceBound) {
        select.dataset.priceBound = "true";
        select.addEventListener('change', updatePriceDisplay);
      }
    });
  };

  // Dynamic loader for prices.js — ensures fresh Git-synced prices bypass any browser/CDN cache
  function checkAndLoadPrices(callback) {
    const cached = localStorage.getItem('kg_prices_local');
    // If admin has a local preview draft in this browser, use it immediately
    if (cached) {
      if (callback) callback();
      return;
    }

    // If static prices already exist, run initial callback immediately to avoid any UI flicker
    let initialRendered = false;
    if (window.priceListData && callback) {
      callback();
      initialRendered = true;
    }

    // Always fetch the freshest Git-synced prices.js using a timestamp to bypass browser cache
    const script = document.createElement('script');
    script.src = `assets/prices.js?t=${Date.now()}`;
    script.onload = () => {
      window.syncAllProductCardPrices();
      if (typeof renderCartItems === 'function') renderCartItems();
      if (!initialRendered && callback) callback();
    };
    script.onerror = () => {
      console.warn('Network issue fetching live prices.js, using static fallback.');
      if (!initialRendered && callback) callback();
    };
    document.head.appendChild(script);
  }

  // Initialize once prices are loaded
  checkAndLoadPrices(() => {
    createCartUI();
    updateCartCounters();
    window.syncAllProductCardPrices();
  });

  // Listen to cross-tab price updates (from Admin portal or Price List editor)
  window.addEventListener('storage', (e) => {
    if (e.key === 'kg_prices_local') {
      window.syncAllProductCardPrices();
      renderCartItems();
    }
  });

  // Listen to in-tab price updates
  window.addEventListener('kg_prices_changed', () => {
    window.syncAllProductCardPrices();
    renderCartItems();
  });

  // Connect header cart buttons and triggers
  document.querySelectorAll('.header-cart-btn, [data-toggle-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleCartDrawer(true);
    });
  });

  // Attach event listeners to all Add to Order buttons
  const attachAddButtons = () => {
    const addButtons = document.querySelectorAll('.add-to-order-btn');
    addButtons.forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = "true";
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = btn.closest('.product-card');
        if (!productCard) return;

        const productName = productCard.querySelector('h3').textContent.trim();
        const variantSelect = productCard.querySelector('.variant-select');
        const selectedVariant = variantSelect ? variantSelect.value : 'Default';

        addToCart(productName, selectedVariant, 1);
        
        // Visual feedback on button
        const originalText = btn.innerHTML;
        btn.innerHTML = '✨ Added!';
        btn.style.background = 'var(--gradient-gold)';
        btn.style.color = 'var(--forest-deep)';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.style.color = '';
        }, 1000);
      });
    });
  };
  attachAddButtons();
  window.attachAddButtons = attachAddButtons;

  // Initialize Corporate Quote Forms
  const initCorporateForms = () => {
    const forms = document.querySelectorAll('#corporateQuoteForm, .corp-quick-form');
    forms.forEach(form => {
      if (form.dataset.bound) return;
      form.dataset.bound = "true";
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const companyInput = form.querySelector('[name="company"]') || form.querySelector('#corpCompany');
        const nameInput = form.querySelector('[name="name"]') || form.querySelector('#corpName');
        const mobileInput = form.querySelector('[name="mobile"]') || form.querySelector('#corpMobile');
        const emailInput = form.querySelector('[name="email"]') || form.querySelector('#corpEmail');
        const qtyInput = form.querySelector('[name="quantity"]') || form.querySelector('#corpQty');
        const budgetInput = form.querySelector('[name="budget"]') || form.querySelector('#corpBudget');
        const notesInput = form.querySelector('[name="notes"]') || form.querySelector('#corpNotes');

        const company = companyInput ? companyInput.value.trim() : '';
        const contactName = nameInput ? nameInput.value.trim() : '';
        const mobile = mobileInput ? mobileInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const qty = qtyInput ? qtyInput.value.trim() : '';
        const budget = budgetInput ? budgetInput.value.trim() : '';
        const notes = notesInput ? notesInput.value.trim() : '';

        let msg = `Hello Karol Grove! I would like to request a quotation for Corporate Gifting:\n\n`;
        if (company) msg += `🏢 *Company / Organization:* ${company}\n`;
        if (contactName) msg += `👤 *Contact Person:* ${contactName}\n`;
        if (mobile) msg += `📱 *Mobile / WhatsApp:* ${mobile}\n`;
        if (email) msg += `📧 *Send Quotation to Gmail/Email:* ${email}\n`;
        if (budget) msg += `💰 *Selected Target Budget:* ${budget}\n`;
        if (qty) msg += `📦 *Estimated Quantity:* ${qty}\n`;
        if (notes) msg += `📝 *Notes/Requirements:* ${notes}\n`;
        msg += `\nPlease email the customized quotation and corporate catalog to ${email}. Our team will wait for your contact. Thank you!`;

        const waUrl = `https://wa.me/+918494832492?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, '_blank');
        
        alert(`✅ Thank you! Your quotation request for "${company || contactName}" has been received. We will send the customized quotation and catalog to your Gmail ID (${email || 'your email'}) and contact you shortly.`);
        form.reset();
      });
    });
  };
  initCorporateForms();

  // Export functions globally to allow HTML inline handlers
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.toggleCartDrawer = toggleCartDrawer;
  window.sendWhatsAppOrder = sendWhatsAppOrder;
  window.clearCart = clearCart;

  function addToCart(name, variant, qty) {
    const existing = cart.find(item => item.name === name && item.variant === variant);
    if (existing) {
      existing.quantity += qty;
      if (existing.quantity <= 0) {
        removeFromCart(name, variant);
        return;
      }
    } else {
      cart.push({ name, variant, quantity: qty });
    }
    saveCart();
  }

  function removeFromCart(name, variant) {
    cart = cart.filter(item => !(item.name === name && item.variant === variant));
    saveCart();
  }

  function clearCart() {
    cart = [];
    saveCart();
  }

  function saveCart() {
    localStorage.setItem('kg_order_cart', JSON.stringify(cart));
    updateCartCounters();
    renderCartItems();
  }

  function updateCartCounters() {
    const badges = document.querySelectorAll('.cart-badge');
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    badges.forEach(badge => {
      badge.textContent = totalCount;
      if (totalCount > 0) {
        badge.classList.add('visible');
      } else {
        badge.classList.remove('visible');
      }
    });

    const floatingBtn = document.getElementById('floating-cart-trigger');
    if (floatingBtn) {
      if (totalCount > 0) {
        floatingBtn.classList.add('visible');
      } else {
        floatingBtn.classList.remove('visible');
      }
    }
  }

  function createCartUI() {
    // 1. Floating bottom right button
    if (!document.getElementById('floating-cart-trigger')) {
      const trigger = document.createElement('button');
      trigger.id = 'floating-cart-trigger';
      trigger.className = 'floating-cart-btn';
      trigger.setAttribute('aria-label', 'Open Order Cart');
      trigger.innerHTML = `
        <span class="icon">🛒</span>
        <span class="badge cart-badge">0</span>
      `;
      trigger.addEventListener('click', () => toggleCartDrawer(true));
      document.body.appendChild(trigger);
    }

    // 2. Drawer markup
    if (!document.getElementById('order-drawer')) {
      const drawer = document.createElement('div');
      drawer.id = 'order-drawer';
      drawer.className = 'order-drawer';
      drawer.innerHTML = `
        <div class="drawer-header">
          <h3 style="color: #123020; font-weight: 800; margin: 0; font-size: 19px;">Your WhatsApp Order Basket</h3>
          <button class="close-drawer" onclick="toggleCartDrawer(false)" aria-label="Close Cart" style="color: #64756a; background: none; border: none; font-size: 32px; cursor: pointer; line-height: 1;">&times;</button>
        </div>
        <div class="drawer-body" id="drawer-items-list">
          <!-- Items will render here -->
        </div>
        <div class="drawer-footer">
          <div class="footer-summary" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="color: #123020 !important; font-weight: 700; font-size: 14.5px;">Total Items:</span>
            <strong id="drawer-total-count" style="color: #b07314 !important; font-weight: 800; font-size: 16px;">0</strong>
          </div>
          <div class="footer-summary" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="color: #123020 !important; font-weight: 700; font-size: 14.5px;">Subtotal:</span>
            <strong id="drawer-subtotal-price" style="color: #b07314 !important; font-weight: 800; font-size: 16px;">₹0</strong>
          </div>
          <div class="footer-summary" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border-top: 1px dashed rgba(18,48,32,0.18); padding-top: 12px;">
            <span style="font-weight: 800; font-size: 16px; color: #123020 !important;">Estimated Total:</span>
            <strong id="drawer-total-price" style="font-size: 21px; color: #b07314 !important; font-weight: 900;">₹0</strong>
          </div>
          <button class="btn btn-primary btn-block" style="width: 100%; margin-bottom: 10px; font-weight: 800; padding: 14px 20px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; background: #123020; color: #ffffff;" onclick="sendWhatsAppOrder()">
            <span>Proceed to WhatsApp Order</span> &rarr;
          </button>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary btn-block" style="flex: 1; padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; text-align: center; background: #ffffff; color: #123020; border: 1.5px solid #E9ECEF;" onclick="toggleCartDrawer(false)">Continue Shopping</button>
            <button class="btn btn-clear btn-block" style="flex: 1; padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; text-align: center; background: #ffffff; color: #a84250; border: 1.5px solid #E9ECEF;" onclick="clearCart()">Clear Basket</button>
          </div>
        </div>
      `;
      document.body.appendChild(drawer);

      // Back overlay
      const overlay = document.createElement('div');
      overlay.id = 'drawer-overlay';
      overlay.className = 'drawer-overlay';
      overlay.addEventListener('click', () => toggleCartDrawer(false));
      document.body.appendChild(overlay);
    }
  }

  function toggleCartDrawer(open) {
    const drawer = document.getElementById('order-drawer');
    const overlay = document.getElementById('drawer-overlay');
    if (drawer && overlay) {
      if (open) {
        renderCartItems();
        drawer.classList.add('open');
        overlay.classList.add('visible');
      } else {
        drawer.classList.remove('open');
        overlay.classList.remove('visible');
      }
    }
  }

  function renderCartItems() {
    const list = document.getElementById('drawer-items-list');
    const totalEl = document.getElementById('drawer-total-count');
    const totalValEl = document.getElementById('drawer-total-price');
    const subtotalValEl = document.getElementById('drawer-subtotal-price');
    if (!list) return;

    if (cart.length === 0) {
      list.innerHTML = `
        <div class="empty-cart-state">
          <span class="ico">🍃</span>
          <p style="color: #3b5c47; font-size: 14.5px; line-height: 1.6;">Your basket is empty. Add premium dry fruits, nuts & seeds from the catalog to build your WhatsApp order!</p>
        </div>
      `;
      totalEl.textContent = '0';
      if (subtotalValEl) subtotalValEl.textContent = '₹0';
      if (totalValEl) totalValEl.textContent = '₹0';
      return;
    }

    let itemsHtml = '';
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
      totalItems += item.quantity;
      
      const price = findPriceInList(item.name, item.variant);
      let priceDisplay = '';
      let qtyDisplay = `${item.quantity}`;
      
      if (price) {
        const itemTotal = price * item.quantity;
        totalPrice += itemTotal;
        priceDisplay = ` &bull; ₹${price}`;
        qtyDisplay = `${item.quantity} <span style="font-size: 11.5px; color: #3b5c47; font-weight: 600;">(₹${itemTotal})</span>`;
      }

      itemsHtml += `
        <div class="cart-item-row" style="background: #ffffff; padding: 14px 16px; border-radius: 12px; margin-bottom: 12px; border: 1px solid rgba(18, 48, 32, 0.08); display: flex; justify-content: space-between; align-items: center; gap: 12px;">
          <div class="item-info" style="flex: 1;">
            <h4 style="color: #123020 !important; font-size: 15px; font-weight: 800; margin: 0 0 3px; line-height: 1.3;">${item.name}</h4>
            <span class="variant" style="color: #b07314 !important; font-size: 12px; font-weight: 700; text-transform: uppercase;">${item.variant}${priceDisplay}</span>
          </div>
          <div class="item-controls" style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
            <button onclick="addToCart('${escapeQuote(item.name)}', '${escapeQuote(item.variant)}', -1)" aria-label="Decrease quantity" style="width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid #226b42 !important; background: #ffffff !important; color: #123020 !important; font-size: 16px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; line-height: 1;">-</button>
            <span class="qty" style="color: #123020 !important; font-size: 14px; font-weight: 800; min-width: 20px; text-align: center;">${qtyDisplay}</span>
            <button onclick="addToCart('${escapeQuote(item.name)}', '${escapeQuote(item.variant)}', 1)" aria-label="Increase quantity" style="width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid #226b42 !important; background: #ffffff !important; color: #123020 !important; font-size: 16px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; line-height: 1;">+</button>
            <button class="remove" onclick="removeFromCart('${escapeQuote(item.name)}', '${escapeQuote(item.variant)}')" aria-label="Remove item" style="background: none !important; border: none !important; color: #782631 !important; font-size: 22px; cursor: pointer; margin-left: 4px; line-height: 1;">&times;</button>
          </div>
        </div>
      `;
    });

    list.innerHTML = itemsHtml;
    totalEl.textContent = totalItems;
    if (subtotalValEl) subtotalValEl.textContent = `₹${totalPrice}`;
    if (totalValEl) totalValEl.textContent = `₹${totalPrice}`;
  }

  function sendWhatsAppOrder() {
    if (cart.length === 0) {
      alert('Your basket is empty. Please add items to order!');
      return;
    }

    const phoneNumber = '+918494832492';
    let text = `Hello Karol Grove! I would like to place an order for the following premium items:\n\n`;
    let totalPrice = 0;
    let hasPrice = false;

    cart.forEach((item, index) => {
      const price = findPriceInList(item.name, item.variant);
      if (price) {
        const itemTotal = price * item.quantity;
        totalPrice += itemTotal;
        hasPrice = true;
        text += `${index + 1}. *${item.name}* (${item.variant}) — Qty: ${item.quantity} @ ₹${price} = *₹${itemTotal}*\n`;
      } else {
        text += `${index + 1}. *${item.name}* (${item.variant}) — Qty: ${item.quantity}\n`;
      }
    });

    if (hasPrice) {
      text += `\n*Estimated Total: ₹${totalPrice}*\n`;
    }

    text += `\nPlease let me know the current pricing and payment details. Thank you!`;
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
  }
}

/* ==========================================================================
   Product Filters and Search (Products Page)
   ========================================================================== */
function initProductFilters() {
  const searchInput = document.getElementById('product-search');
  const catTabs = document.querySelectorAll('.cat-tab');
  const productCards = document.querySelectorAll('.product-grid .product-card');

  if (productCards.length === 0) return;

  let activeCategory = 'all';
  let searchTerm = '';

  // Setup tab listeners
  catTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      catTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      activeCategory = tab.getAttribute('data-category');
      applyFilters();
    });
  });

  // Setup explore banner buttons
  const bannerBtns = document.querySelectorAll('.banner-btn');
  bannerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetCategory = btn.getAttribute('data-category');
      
      // Find the corresponding category tab and click it
      const targetTab = document.querySelector(`.cat-tab[data-category="${targetCategory}"]`);
      if (targetTab) {
        targetTab.click();
      }
      
      // Smooth scroll to the products section
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Setup search listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  function applyFilters() {
    productCards.forEach(card => {
      const parentCategory = card.closest('.product-category');
      if (!parentCategory) return;

      const categoryId = parentCategory.id;
      const productName = card.querySelector('h3').textContent.toLowerCase();
      const productBenefits = card.querySelector('p').textContent.toLowerCase();

      // Check category match
      const categoryMatch = (activeCategory === 'all' || categoryId === activeCategory);
      // Check search match
      const searchMatch = (productName.includes(searchTerm) || productBenefits.includes(searchTerm));

      if (categoryMatch && searchMatch) {
        card.style.display = '';
        card.classList.add('reveal-item');
      } else {
        card.style.display = 'none';
        card.classList.remove('reveal-item');
      }
    });

    // Hide empty category sections
    const categories = document.querySelectorAll('.product-category');
    categories.forEach(cat => {
      const visibleCards = cat.querySelectorAll('.product-grid .product-card[style=""]');
      const allCardsCount = cat.querySelectorAll('.product-grid .product-card').length;
      const hiddenCardsCount = cat.querySelectorAll('.product-grid .product-card[style*="display: none"]').length;

      if (allCardsCount === hiddenCardsCount) {
        cat.style.display = 'none';
      } else {
        cat.style.display = '';
      }
    });
  }
}

/* ==========================================================================
   Contact Form Custom Logic
   ========================================================================== */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const inputs = form.querySelectorAll('input, textarea');
  
  // Custom Floating Label animation handler (adds class on focus/has value)
  inputs.forEach(input => {
    // Add logic if label wrapping or styling is needed
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
      if (input.value.trim() !== '') {
        input.parentElement.classList.add('has-value');
      } else {
        input.parentElement.classList.remove('has-value');
      }
    });
    // Check initially
    if (input.value.trim() !== '') {
      input.parentElement.classList.add('has-value');
    }
  });

  // If this form is configured for WhatsApp direct submission (no access_key), do not intercept with Web3Forms
  if (!form.querySelector('input[name="access_key"]')) {
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message &rarr;';
    
    // Show sending/loading state
    if (submitBtn) {
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;
    }
    
    const formData = new FormData(form);
    
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        // Create custom success feedback VFX
        const formCard = form.closest('.contact-form-card');
        if (formCard) {
          formCard.innerHTML = `
            <div class="form-success-animation text-center" style="padding: 40px 10px;">
              <div class="success-icon-wrap" style="width: 80px; height: 80px; background: rgba(31, 92, 61, 0.15); color: var(--forest-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 40px; animation: scaleUpPulse 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;">
                ✓
              </div>
              <h3 style="font-family: var(--font-display); font-size: 26px; color: var(--forest-deep); margin-bottom: 12px;">Message Received!</h3>
              <p style="color: var(--charcoal-soft); font-size: 16px; max-width: 320px; margin: 0 auto 28px;">
                Thank you for reaching out to Karol Grove. We have received your inquiry and our team will get back to you shortly.
              </p>
              <button class="btn btn-primary" onclick="window.location.reload();">Send Another Message</button>
            </div>
          `;
        }
      } else {
        console.error(json);
        alert(json.message || 'Something went wrong. Please try again.');
        if (submitBtn) {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }
      }
    })
    .catch((error) => {
      console.error(error);
      alert('Form submission failed. Please check your internet connection and try again.');
      if (submitBtn) {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  });
}

/* ==========================================================================
   Seamless Hero Video Loop & Auto-Play Guarantee
   ========================================================================== */
function initHeroVideoLoop() {
  const heroVideo = document.querySelector('.hero-bg-video');
  if (!heroVideo) return;

  // Guarantee browser autoplay compatibility
  heroVideo.muted = true;
  heroVideo.defaultMuted = true;
  heroVideo.playsInline = true;
  heroVideo.setAttribute('playsinline', '');
  heroVideo.setAttribute('muted', '');

  const startPlayback = () => {
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => {
        console.warn('Autoplay waiting for user gesture:', e);
        const resumeOnTouchOrScroll = () => {
          heroVideo.play().catch(() => {});
          window.removeEventListener('click', resumeOnTouchOrScroll);
          window.removeEventListener('scroll', resumeOnTouchOrScroll);
          window.removeEventListener('touchstart', resumeOnTouchOrScroll);
        };
        window.addEventListener('click', resumeOnTouchOrScroll, { passive: true });
        window.addEventListener('scroll', resumeOnTouchOrScroll, { passive: true });
        window.addEventListener('touchstart', resumeOnTouchOrScroll, { passive: true });
      });
    }
  };

  startPlayback();

  // Ensure seamless looping without pause or frozen trailing frames.
  heroVideo.addEventListener('timeupdate', () => {
    if (heroVideo.currentTime >= 9.92 || (heroVideo.duration && heroVideo.currentTime >= heroVideo.duration - 0.15)) {
      heroVideo.currentTime = 0;
      heroVideo.play().catch(() => {});
    }
  });
}

