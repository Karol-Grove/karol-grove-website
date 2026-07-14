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
  const canvas = document.getElementById('vfx-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const mouse = { x: null, y: null, radius: 160 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
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
  let imagesLoaded = false;
  let loadedCount = 0;

  imageUrls.forEach((url, index) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      loadedImages[index] = img;
      loadedCount++;
      if (loadedCount === imageUrls.length) {
        imagesLoaded = true;
      }
    };
    img.onerror = () => {
      console.warn('Failed to load particle image:', url);
      loadedImages[index] = img;
      loadedCount++;
      if (loadedCount === imageUrls.length) {
        imagesLoaded = true;
      }
    };
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      // Increased size range for clear, beautiful display of cartoon characters (20px to 38px)
      this.size = Math.random() * 18 + 20; 
      this.speedX = Math.random() * 0.3 - 0.15;
      this.speedY = Math.random() * 0.8 + 0.4; // Drizzles downward slowly and elegantly
      // 0 = Almond, 1 = Cashew, 2 = Raisin, 3 = Walnut, 4 = Pistachio
      this.type = Math.floor(Math.random() * 5);
      this.alpha = Math.random() * 0.35 + 0.35; // Translucent and subtle
      this.angle = Math.random() * Math.PI * 2;
      this.spin = Math.random() * 0.015 - 0.0075; // Subtle rotate
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.angle += this.spin;

      // Wrap-around edges for drizzle
      if (this.y > height + 40) {
        this.y = -40;
        this.x = Math.random() * width;
        this.speedY = Math.random() * 0.8 + 0.4;
      }
      if (this.x < -40) this.x = width + 40;
      if (this.x > width + 40) this.x = -40;

      // Mouse interactive push
      if (mouse.x != null && mouse.y != null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = dx / distance;
          let directionY = dy / distance;
          this.x += directionX * force * 3.0;
          this.y += directionY * force * 3.0;
        }
      }
    }

    draw() {
      if (!imagesLoaded) return;
      const img = loadedImages[this.type];
      if (!img) return;

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
    const count = Math.min(45, Math.floor((width * height) / 35000));
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

  // Create UI elements if they do not exist
  createCartUI();
  updateCartCounters();

  // Attach event listeners to all Add to Order buttons
  const addButtons = document.querySelectorAll('.add-to-order-btn');
  addButtons.forEach(btn => {
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
          <h3>Your WhatsApp Order Basket</h3>
          <button class="close-drawer" onclick="toggleCartDrawer(false)">&times;</button>
        </div>
        <div class="drawer-body" id="drawer-items-list">
          <!-- Items will render here -->
        </div>
        <div class="drawer-footer">
          <div class="footer-summary">
            <span>Total Items:</span>
            <strong id="drawer-total-count">0</strong>
          </div>
          <button class="btn btn-primary btn-block" onclick="sendWhatsAppOrder()">
            Order on WhatsApp &rarr;
          </button>
          <button class="btn btn-clear btn-block" onclick="clearCart()">Clear Basket</button>
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
    if (!list) return;

    if (cart.length === 0) {
      list.innerHTML = `
        <div class="empty-cart-state">
          <span class="ico">🍃</span>
          <p>Your basket is empty. Add premium dry fruits, nuts & seeds from the catalog to build your WhatsApp order!</p>
        </div>
      `;
      totalEl.textContent = '0';
      return;
    }

    let itemsHtml = '';
    let totalItems = 0;

    cart.forEach(item => {
      totalItems += item.quantity;
      itemsHtml += `
        <div class="cart-item-row">
          <div class="item-info">
            <h4>${item.name}</h4>
            <span class="variant">${item.variant}</span>
          </div>
          <div class="item-controls">
            <button onclick="addToCart('${item.name}', '${item.variant}', -1)">-</button>
            <span class="qty">${item.quantity}</span>
            <button onclick="addToCart('${item.name}', '${item.variant}', 1)">+</button>
            <button class="remove" onclick="removeFromCart('${item.name}', '${item.variant}')">&times;</button>
          </div>
        </div>
      `;
    });

    list.innerHTML = itemsHtml;
    totalEl.textContent = totalItems;
  }

  function sendWhatsAppOrder() {
    if (cart.length === 0) {
      alert('Your basket is empty. Please add items to order!');
      return;
    }

    const phoneNumber = '+918494832492';
    let text = `Hello Karol Grove! I would like to place an order for the following premium items:\n\n`;

    cart.forEach((item, index) => {
      text += `${index + 1}. *${item.name}* (${item.variant}) — Qty: ${item.quantity}\n`;
    });

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
