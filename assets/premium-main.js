document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const hoverElements = document.querySelectorAll('a, button, .category-card, .product-card, .icon-btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    // 2. Sticky Header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Dark Mode Toggle
    const darkModeBtn = document.getElementById('dark-mode-toggle');
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            darkModeBtn.innerHTML = isDark ? '<i class="fa-regular fa-sun"></i>' : '<i class="fa-regular fa-moon"></i>';
        });
    }

    // 5. Dynamic Product Rendering
    if (window.priceListData) {
        // Map category to image placeholder logic based on original assets
        const getProductImage = (p) => {
            let img = 'assets/product-nuts-mixed.png'; // default fallback
            const n = p.name.toLowerCase();
            
            // Nuts
            if (n.includes('almond')) img = 'assets/product-almonds.png';
            if (n.includes('cashew')) img = 'assets/product-cashews.png';
            if (n.includes('chilli cashew')) img = 'assets/product-chilli-cashews.png';
            if (n.includes('pepper cashew')) img = 'assets/product-pepper-cashews.png';
            if (n.includes('pistachio') || n.includes('pista')) img = 'assets/product-pistachios.png';
            if (n.includes('walnut')) img = 'assets/product-walnuts.png';
            
            // Dates
            if (n.includes('date')) img = 'assets/product-dates.png';
            if (n.includes('medjool')) img = 'assets/product-dates-premium.png';
            if (n.includes('black date')) img = 'assets/product-black-dates.png';
            if (n.includes('dry date') || n.includes('kharik')) img = 'assets/product-dry-dates.png';

            // Dried Fruits
            if (n.includes('raisin')) img = 'assets/product-raisins.png';
            if (n.includes('black raisin')) img = 'assets/product-black-raisins.png';
            if (n.includes('fig') || n.includes('anjeer')) img = 'assets/product-figs.png';
            if (n.includes('apricot')) img = 'assets/product-apricots.png';
            if (n.includes('cranberr')) img = 'assets/product-dry-cranberry.png';
            if (n.includes('blueberr')) img = 'assets/product-dry-blueberry.png';
            
            // Seeds
            if (n.includes('chia')) img = 'assets/product-chia-seeds.png';
            if (n.includes('pumpkin')) img = 'assets/product-pumpkin-seeds.png';
            if (n.includes('sunflower')) img = 'assets/product-sunflower-seeds.png';
            if (n.includes('flax')) img = 'assets/product-flax-seeds.png';
            if (n.includes('watermelon')) img = 'assets/product-watermelon-seeds.png';
            if (n.includes('sabja') || n.includes('basil seed')) img = 'assets/product-sabja-seeds.png';

            // Sweeteners
            if (n.includes('honey')) img = 'assets/product-honey.png';
            
            // Gifts
            if (p.category.toLowerCase().includes('gift')) {
                img = 'assets/product-gift-box.png';
                if (n.includes('seed') || n.includes('mix')) img = 'assets/product-seed-nuts-mix.png';
            }
            
            return img;
        };

        const productsGrid = document.getElementById('dynamic-products-grid');

        const renderProducts = (productsToRender, targetGrid = productsGrid) => {
            if (!targetGrid) return;
            targetGrid.innerHTML = '';
            productsToRender.forEach((p, index) => {
                const delay = (index % 4) * 0.1;
                const price = p.price500g || p.price250g || p.price1kg || 'Enquire';
                const card = document.createElement('div');
                card.className = 'product-card reveal';
                card.style.transitionDelay = delay + 's';
                card.innerHTML = `
                    <div class="product-image-wrap">
                        <img src="${getProductImage(p)}" alt="${p.name}">
                        <div class="product-actions">
                            <button class="action-btn"><i class="fa-regular fa-heart"></i></button>
                            <button class="action-btn"><i class="fa-solid fa-eye"></i></button>
                            <button class="action-btn add-to-cart-btn" data-name="${p.name}" data-price="${price}"><i class="fa-solid fa-cart-plus"></i></button>
                        </div>
                    </div>
                    <div class="product-info">
                        <div style="color:#C8A75A; font-size:0.8rem; margin-bottom:4px;"><i class="fa-solid fa-star"></i> 4.9 (120)</div>
                        <h4>${p.name}</h4>
                        <div class="product-price">₹${price}</div>
                    </div>
                `;
                targetGrid.appendChild(card);
            });
            document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
            
            // Wire up add to cart buttons
            document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const name = e.currentTarget.getAttribute('data-name');
                    const price = e.currentTarget.getAttribute('data-price');
                    addToCart(name, price);
                });
            });
        };

        if (productsGrid) {
            renderProducts(window.priceListData);

            // Search Logic
            const searchInput = document.querySelector('.ai-search-bar input');
            const searchBtn = document.querySelector('.ai-search-btn');
            
            if (searchInput) {
                const handleSearch = () => {
                    const query = searchInput.value.toLowerCase();
                    const filtered = window.priceListData.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
                    renderProducts(filtered, productsGrid);
                };
                searchInput.addEventListener('input', handleSearch);
                if(searchBtn) searchBtn.addEventListener('click', handleSearch);
            }
        }

        const featuredGrid = document.getElementById('featured-products-grid');
        if (featuredGrid) {
            // Pick 4 random products for the front page
            const shuffled = [...window.priceListData].sort(() => 0.5 - Math.random());
            const random4 = shuffled.slice(0, 4);
            renderProducts(random4, featuredGrid);
        }

        const priceListBody = document.getElementById('dynamic-price-list');
        if (priceListBody) {
            window.priceListData.forEach(p => {
                const tr = document.createElement('tr');
                const bestPrice = p.price500g || p.price1kg || p.price250g;
                tr.innerHTML = `
                    <td><strong>${p.name}</strong></td>
                    <td>${p.category}</td>
                    <td>${p.price500g ? '500g' : (p.price1kg ? '1kg' : '250g')}</td>
                    <td style="color:var(--color-secondary); font-weight:700;">₹${bestPrice}</td>
                `;
                priceListBody.appendChild(tr);
            });
        }
    }

    // 6. Global Premium Footer Injection
    if (!document.querySelector('.premium-footer')) {
        const footer = document.createElement('footer');
        footer.className = 'premium-footer';
        footer.style.cssText = `
            background: var(--color-dark-card);
            color: rgba(255,255,255,0.7);
            padding: 80px 5% 40px;
            margin-top: 80px;
            font-family: var(--font-body);
        `;
        
        footer.innerHTML = `
            <div style="max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:40px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:60px; margin-bottom:40px;">
                <div>
                    <img src="assets/karol-grove-logo-full.png" alt="Karol Grove" style="height:50px; margin-bottom:24px; background:white; padding:8px 12px; border-radius:8px;">
                    <p style="font-size:0.95rem; line-height:1.6; max-width:280px;">Premium dry fruits, nuts, seeds, and natural sweeteners — handpicked, honest, and delivered fresh to your door.</p>
                </div>
                <div>
                    <h4 style="color:#fff; font-family:var(--font-heading); font-size:1.2rem; margin-bottom:24px;">Quick Links</h4>
                    <ul style="list-style:none; display:flex; flex-direction:column; gap:12px;">
                        <li><a href="products.html" style="color:inherit; text-decoration:none; cursor:none;">Shop</a></li>
                        <li><a href="pricelist.html" style="color:inherit; text-decoration:none; cursor:none;">Wholesale Prices</a></li>
                        <li><a href="corporate-gifts.html" style="color:inherit; text-decoration:none; cursor:none;">Corporate Gifting</a></li>
                        <li><a href="about.html" style="color:inherit; text-decoration:none; cursor:none;">Our Story</a></li>
                        <li><a href="admin.html" style="color:inherit; text-decoration:none; cursor:none;"><i class="fa-solid fa-lock" style="margin-right:4px; font-size:0.8rem; color:var(--color-secondary);"></i>Admin Portal</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style="color:#fff; font-family:var(--font-heading); font-size:1.2rem; margin-bottom:24px;">Contact Us</h4>
                    <ul style="list-style:none; display:flex; flex-direction:column; gap:12px;">
                        <li><i class="fa-solid fa-location-dot" style="margin-right:8px; color:var(--color-secondary);"></i> SRG Stores, Erode, TN 638115</li>
                        <li><i class="fa-solid fa-phone" style="margin-right:8px; color:var(--color-secondary);"></i> +91 84948 32492</li>
                        <li><i class="fa-solid fa-envelope" style="margin-right:8px; color:var(--color-secondary);"></i> karolgrovenuts@gmail.com</li>
                    </ul>
                </div>
            </div>
            <div style="max-width:1200px; margin:0 auto; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px; font-size:0.85rem;">
                <div>&copy; ${new Date().getFullYear()} Karol Grove. All rights reserved.</div>
                <div style="display:flex; gap:24px;">
                    <span><strong>Marketed & Packed by:</strong> SRG Stores</span>
                    <span><strong>GSTIN:</strong> 33JQUPK0008M1ZH</span>
                    <span><strong>FSSAI Lic. No.:</strong> 22421062000070</span>
                </div>
            </div>
        `;
        document.body.appendChild(footer);
    }

    // 7. Floating Basket & WhatsApp Logic
    window.cartItems = [];
    
    // Inject floating container
    const floatContainer = document.createElement('div');
    floatContainer.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 15px;
        font-family: var(--font-body);
    `;
    
    // The Basket View
    const basketView = document.createElement('div');
    basketView.style.cssText = `
        background: var(--color-bg);
        border: 1px solid var(--glass-border);
        box-shadow: var(--shadow-hover);
        border-radius: var(--radius-md);
        padding: 20px;
        width: 300px;
        display: none;
        flex-direction: column;
        color: var(--color-text);
    `;
    
    // The WhatsApp Icon
    const waIcon = document.createElement('a');
    waIcon.href = "https://wa.me/+918494832492";
    waIcon.target = "_blank";
    waIcon.innerHTML = `<i class="fa-brands fa-whatsapp" style="font-size: 32px;"></i>`;
    waIcon.style.cssText = `
        background: #25D366;
        color: white;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: var(--shadow-soft);
        text-decoration: none;
        transition: transform 0.3s ease;
    `;
    waIcon.onmouseover = () => waIcon.style.transform = 'scale(1.1)';
    waIcon.onmouseout = () => waIcon.style.transform = 'scale(1)';

    // The Cart Icon
    const cartIcon = document.createElement('a');
    cartIcon.href = "javascript:void(0)";
    cartIcon.innerHTML = `<i class="fa-solid fa-cart-shopping" style="font-size: 24px;"></i><span id="cart-count" style="position:absolute; top:-5px; right:-5px; background:var(--color-secondary); color:white; font-size:12px; font-weight:bold; width:22px; height:22px; border-radius:50%; display:none; justify-content:center; align-items:center;">0</span>`;
    cartIcon.style.cssText = `
        background: var(--color-primary);
        color: white;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: var(--shadow-soft);
        text-decoration: none;
        transition: transform 0.3s ease;
        position: relative;
    `;
    cartIcon.onmouseover = () => cartIcon.style.transform = 'scale(1.1)';
    cartIcon.onmouseout = () => cartIcon.style.transform = 'scale(1)';

    floatContainer.appendChild(basketView);
    floatContainer.appendChild(cartIcon);
    floatContainer.appendChild(waIcon);
    document.body.appendChild(floatContainer);

    window.addToCart = (name, price) => {
        window.cartItems.push({ name, price });
        updateBasket();
    };

    const updateBasket = () => {
        const countBadge = document.getElementById('cart-count');
        if(window.cartItems.length === 0) {
            basketView.style.display = 'none';
            if(countBadge) countBadge.style.display = 'none';
            return;
        }
        
        if(countBadge) {
            countBadge.style.display = 'flex';
            countBadge.innerText = window.cartItems.length;
        }

        basketView.style.display = 'flex';
        let html = `<h4 style="margin-bottom:15px; border-bottom:1px solid rgba(0,0,0,0.1); padding-bottom:10px;">Your Basket (${window.cartItems.length})</h4>`;
        html += `<ul style="list-style:none; padding:0; margin:0 0 15px 0; max-height:200px; overflow-y:auto;">`;
        
        window.cartItems.forEach(item => {
            html += `<li style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.9rem;">
                <span>${item.name}</span>
                <span style="font-weight:600;">₹${item.price}</span>
            </li>`;
        });
        html += `</ul>`;
        html += `<button id="checkout-wa" style="background:var(--color-primary); color:white; border:none; padding:10px; border-radius:var(--radius-sm); cursor:pointer; font-weight:600;">Order via WhatsApp</button>`;
        
        basketView.innerHTML = html;

        document.getElementById('checkout-wa').addEventListener('click', () => {
            let msg = "Hello! I would like to order the following items:\n\n";
            window.cartItems.forEach(item => {
                msg += `- ${item.name} (₹${item.price})\n`;
            });
            msg += "\nPlease let me know the payment details.";
            window.open(`https://wa.me/+918494832492?text=${encodeURIComponent(msg)}`, '_blank');
        });
    };

    cartIcon.addEventListener('click', () => {
        basketView.style.display = basketView.style.display === 'none' ? 'flex' : 'none';
    });

});
