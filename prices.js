/**
 * Karol Grove — Live Master Product & Price Management Engine
 * Features:
 * - Structured catalog with multi-pack sizes (250g, 500g, 1kg)
 * - Zero-code admin editing (No JSON, no Git, no HTML editing required)
 * - Real-time synchronization across public website & admin portal
 * - Cloud Database synchronization architecture with offline fallback
 */

(function() {
  'use strict';

  // Verified default master catalog
  const defaultCatalog = [
    // CASHEWS
    {
      id: "cashew-w180",
      name: "Cashew W180",
      category: "Cashews",
      image: "assets/product-cashews.png",
      description: "King grade jumbo whole cashews, vacuum packed for crisp crunch.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 320, mrp: 380 },
        { packSize: "500g", price: 620, mrp: 720 },
        { packSize: "1kg", price: 1200, mrp: 1400 }
      ],
      price250g: 320,
      price500g: 620,
      price1kg: 1200,
      displayOrder: 1
    },
    {
      id: "cashew-w240",
      name: "Cashews (Kaju) - W240",
      category: "Cashews",
      image: "assets/product-cashews.png",
      description: "Carefully graded jumbo whole cashews, vacuum packed for crisp crunch.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 250, mrp: 300 },
        { packSize: "500g", price: 490, mrp: 580 },
        { packSize: "1kg", price: 960, mrp: 1100 }
      ],
      price250g: 250,
      price500g: 490,
      price1kg: 960,
      displayOrder: 1
    },
    {
      id: "cashew-pepper",
      name: "Pepper Cashews",
      category: "Cashews",
      image: "assets/product-pepper-cashews.png",
      description: "Roasted cashews seasoned with freshly ground black pepper.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 270, mrp: 320 },
        { packSize: "500g", price: 530, mrp: 620 },
        { packSize: "1kg", price: 1020, mrp: 1200 }
      ],
      price250g: 270,
      price500g: 530,
      price1kg: 1020,
      displayOrder: 2
    },
    {
      id: "cashew-chilli",
      name: "Chilli Cashews",
      category: "Cashews",
      image: "assets/product-chilli-cashews.png",
      description: "Spiced roasted cashews tossed in savory red chilli seasoning.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 270, mrp: 320 },
        { packSize: "500g", price: 530, mrp: 620 },
        { packSize: "1kg", price: 1020, mrp: 1200 }
      ],
      price250g: 270,
      price500g: 530,
      price1kg: 1020,
      displayOrder: 3
    },
    {
      id: "cashew-salted",
      name: "Salted Cashews",
      category: "Cashews",
      image: "assets/product-cashews.png",
      description: "Lightly salted roasted crunchy cashews for everyday snacking.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 260, mrp: 310 },
        { packSize: "500g", price: 510, mrp: 600 },
        { packSize: "1kg", price: 990, mrp: 1150 }
      ],
      price250g: 260,
      price500g: 510,
      price1kg: 990,
      displayOrder: 4
    },

    // ALMONDS
    {
      id: "almonds-badam",
      name: "Almonds (Badam)",
      category: "Almonds",
      image: "assets/product-almonds.png",
      description: "Selected California almonds, uniformly sized with clean nutty flavor.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 220, mrp: 260 },
        { packSize: "500g", price: 430, mrp: 500 },
        { packSize: "1kg", price: 850, mrp: 980 }
      ],
      price250g: 220,
      price500g: 430,
      price1kg: 850,
      displayOrder: 5
    },
    {
      id: "almonds-roasted",
      name: "Roasted Almonds (Salted)",
      category: "Almonds",
      image: "assets/product-almonds.png",
      description: "Slow-roasted salted almonds with a crisp bite and aromatic roast.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 240, mrp: 290 },
        { packSize: "500g", price: 470, mrp: 550 },
        { packSize: "1kg", price: 920, mrp: 1080 }
      ],
      price250g: 240,
      price500g: 470,
      price1kg: 920,
      displayOrder: 6
    },

    // PISTACHIOS
    {
      id: "pista-roasted",
      name: "Pistachios (Pista) - Roasted & Salted",
      category: "Pistachios",
      image: "assets/product-pistachios.png",
      description: "In-shell roasted and salted pistachios with natural open shells.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 280, mrp: 340 },
        { packSize: "500g", price: 550, mrp: 660 },
        { packSize: "1kg", price: 1080, mrp: 1280 }
      ],
      price250g: 280,
      price500g: 550,
      price1kg: 1080,
      displayOrder: 7
    },

    // RAISINS
    {
      id: "raisins-golden",
      name: "Golden Raisins (Kishmish)",
      category: "Raisins",
      image: "assets/product-raisins.png",
      description: "Soft and sweet golden raisins, naturally dried and carefully cleaned.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 90, mrp: 110 },
        { packSize: "500g", price: 170, mrp: 210 },
        { packSize: "1kg", price: 320, mrp: 390 }
      ],
      price250g: 90,
      price500g: 170,
      price1kg: 320,
      displayOrder: 8
    },
    {
      id: "raisins-black",
      name: "Black Raisins (Seedless)",
      category: "Raisins",
      image: "assets/product-black-raisins.png",
      description: "Plump seedless black raisins with natural rich sweetness.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 110, mrp: 140 },
        { packSize: "500g", price: 210, mrp: 260 },
        { packSize: "1kg", price: 400, mrp: 490 }
      ],
      price250g: 110,
      price500g: 210,
      price1kg: 400,
      displayOrder: 9
    },
    {
      id: "raisins-green",
      name: "Green Raisins",
      category: "Raisins",
      image: "assets/product-raisins.png",
      description: "Long slender green raisins with a sweet tangy taste.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 95, mrp: 120 },
        { packSize: "500g", price: 180, mrp: 230 },
        { packSize: "1kg", price: 340, mrp: 420 }
      ],
      price250g: 95,
      price500g: 180,
      price1kg: 340,
      displayOrder: 10
    },

    // DATES
    {
      id: "dates-medjool",
      name: "Medjool Dates",
      category: "Dates",
      image: "assets/product-dates-premium.png",
      description: "Large, rich, soft Medjool dates with a caramel-like texture.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 350, mrp: 420 },
        { packSize: "500g", price: 680, mrp: 800 },
        { packSize: "1kg", price: 1300, mrp: 1550 }
      ],
      price250g: 350,
      price500g: 680,
      price1kg: 1300,
      displayOrder: 11
    },
    {
      id: "dates-ajwa",
      name: "Ajwa Dates",
      category: "Dates",
      image: "assets/product-dates.png",
      description: "Traditional soft dark dates from Madinah with a rich fine texture.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 450, mrp: 520 },
        { packSize: "500g", price: 850, mrp: 1000 },
        { packSize: "1kg", price: 1600, mrp: 1900 }
      ],
      price250g: 450,
      price500g: 850,
      price1kg: 1600,
      displayOrder: 12
    },
    {
      id: "dates-omani",
      name: "Omani Dates",
      category: "Dates",
      image: "assets/product-dates.png",
      description: "Everyday sweet Omani dates with a firm bite and glossy finish.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 120, mrp: 150 },
        { packSize: "500g", price: 230, mrp: 290 },
        { packSize: "1kg", price: 440, mrp: 550 }
      ],
      price250g: 120,
      price500g: 230,
      price1kg: 440,
      displayOrder: 13
    },
    {
      id: "dates-dry-yellow",
      name: "Dry Dates (Kharik) - Yellow",
      category: "Dates",
      image: "assets/product-dry-dates.png",
      description: "Hard sun-dried yellow dates, ideal for cooking, milk blends, and sweets.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 100, mrp: 130 },
        { packSize: "500g", price: 190, mrp: 240 },
        { packSize: "1kg", price: 360, mrp: 450 }
      ],
      price250g: 100,
      price500g: 190,
      price1kg: 360,
      displayOrder: 14
    },
    {
      id: "dates-black",
      name: "Black Dates",
      category: "Dates",
      image: "assets/product-black-dates.png",
      description: "Naturally sweet and moist whole black dates.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 130, mrp: 160 },
        { packSize: "500g", price: 250, mrp: 310 },
        { packSize: "1kg", price: 480, mrp: 590 }
      ],
      price250g: 130,
      price500g: 250,
      price1kg: 480,
      displayOrder: 15
    },

    // SEEDS
    {
      id: "seeds-chia",
      name: "Chia Seeds",
      category: "Seeds",
      image: "assets/product-chia-seeds.png",
      description: "Clean whole chia seeds, perfect for puddings, smoothies, and hydration bowls.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 120, mrp: 150 },
        { packSize: "500g", price: 220, mrp: 280 },
        { packSize: "1kg", price: 420, mrp: 520 }
      ],
      price250g: 120,
      price500g: 220,
      price1kg: 420,
      displayOrder: 16
    },
    {
      id: "seeds-pumpkin",
      name: "Pumpkin Seeds (Raw)",
      category: "Seeds",
      image: "assets/product-pumpkin-seeds.png",
      description: "Hulled green raw pumpkin seeds with a tender crunch.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 150, mrp: 180 },
        { packSize: "500g", price: 290, mrp: 350 },
        { packSize: "1kg", price: 560, mrp: 670 }
      ],
      price250g: 150,
      price500g: 290,
      price1kg: 560,
      displayOrder: 17
    },
    {
      id: "seeds-sunflower",
      name: "Sunflower Seeds (Raw)",
      category: "Seeds",
      image: "assets/product-sunflower-seeds.png",
      description: "Clean raw sunflower seed kernels, great for baking and salad toppings.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 100, mrp: 130 },
        { packSize: "500g", price: 180, mrp: 230 },
        { packSize: "1kg", price: 340, mrp: 420 }
      ],
      price250g: 100,
      price500g: 180,
      price1kg: 340,
      displayOrder: 18
    },
    {
      id: "seeds-flax",
      name: "Flax Seeds",
      category: "Seeds",
      image: "assets/product-flax-seeds.png",
      description: "Golden brown whole flax seeds for daily meal additions.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 80, mrp: 100 },
        { packSize: "500g", price: 150, mrp: 190 },
        { packSize: "1kg", price: 280, mrp: 350 }
      ],
      price250g: 80,
      price500g: 150,
      price1kg: 280,
      displayOrder: 19
    },
    {
      id: "seeds-watermelon",
      name: "Watermelon Seeds",
      category: "Seeds",
      image: "assets/product-watermelon-seeds.png",
      description: "Shelled white watermelon kernels with mild nutty flavor.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 90, mrp: 110 },
        { packSize: "500g", price: 170, mrp: 210 },
        { packSize: "1kg", price: 320, mrp: 390 }
      ],
      price250g: 90,
      price500g: 170,
      price1kg: 320,
      displayOrder: 20
    },
    {
      id: "seeds-sabja",
      name: "Basil Seeds (Sabja)",
      category: "Seeds",
      image: "assets/product-sabja-seeds.png",
      description: "Traditional cooling basil seeds for faloodas, lemonades, and sherbets.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 140, mrp: 170 },
        { packSize: "500g", price: 260, mrp: 320 },
        { packSize: "1kg", price: 500, mrp: 600 }
      ],
      price250g: 140,
      price500g: 260,
      price1kg: 500,
      displayOrder: 21
    },

    // OTHER
    {
      id: "walnuts-chile",
      name: "Walnuts (Akhrot) - Chile Halves",
      category: "Other",
      image: "assets/product-walnuts.png",
      description: "Crisp light-colored walnut halves imported from Chile.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 320, mrp: 380 },
        { packSize: "500g", price: 620, mrp: 720 },
        { packSize: "1kg", price: 1200, mrp: 1400 }
      ],
      price250g: 320,
      price500g: 620,
      price1kg: 1200,
      displayOrder: 22
    },
    {
      id: "figs-anjeer",
      name: "Dried Figs (Anjeer) - Jumbo",
      category: "Other",
      image: "assets/product-figs.png",
      description: "Naturally sweet and fibrous jumbo dried figs tied on threads.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 340, mrp: 410 },
        { packSize: "500g", price: 660, mrp: 780 },
        { packSize: "1kg", price: 1280, mrp: 1500 }
      ],
      price250g: 340,
      price500g: 660,
      price1kg: 1280,
      displayOrder: 23
    },
    {
      id: "apricots-jardalu",
      name: "Dried Apricots (Jardalu)",
      category: "Other",
      image: "assets/product-apricots.png",
      description: "Tangy-sweet dried apricots, pit removed, soft and chewy.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 200, mrp: 240 },
        { packSize: "500g", price: 390, mrp: 470 },
        { packSize: "1kg", price: 750, mrp: 900 }
      ],
      price250g: 200,
      price500g: 390,
      price1kg: 750,
      displayOrder: 24
    },
    {
      id: "cranberries-whole",
      name: "Dried Cranberries",
      category: "Other",
      image: "assets/product-dry-cranberry.png",
      description: "Sweet tart dried cranberries, sliced and ready for snacking or baking.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 160, mrp: 200 },
        { packSize: "500g", price: 300, mrp: 380 },
        { packSize: "1kg", price: 580, mrp: 720 }
      ],
      price250g: 160,
      price500g: 300,
      price1kg: 580,
      displayOrder: 25
    },
    {
      id: "blueberries-whole",
      name: "Dried Blueberries",
      category: "Other",
      image: "assets/product-dry-blueberry.png",
      description: "Whole dried blueberries with intense sweet berry flavor.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 280, mrp: 340 },
        { packSize: "500g", price: 540, mrp: 650 },
        { packSize: "1kg", price: 1050, mrp: 1250 }
      ],
      price250g: 280,
      price500g: 540,
      price1kg: 1050,
      displayOrder: 26
    },
    {
      id: "honey-natural",
      name: "Honey",
      category: "Other",
      image: "assets/product-honey.png",
      description: "Clear multifloral honey bottled in hygienic food-grade jars.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 180, mrp: 220 },
        { packSize: "500g", price: 340, mrp: 410 },
        { packSize: "1kg", price: 650, mrp: 780 }
      ],
      price250g: 180,
      price500g: 340,
      price1kg: 650,
      displayOrder: 27
    },
    {
      id: "palm-sugar",
      name: "Palm Sugar",
      category: "Other",
      image: "assets/product-honey.png",
      description: "Traditional unrefined granulated palm sugar sweetener.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 190, mrp: 230 },
        { packSize: "500g", price: 370, mrp: 440 },
        { packSize: "1kg", price: 720, mrp: 850 }
      ],
      price250g: 190,
      price500g: 370,
      price1kg: 720,
      displayOrder: 28
    },
    {
      id: "palm-candy",
      name: "Palm Candy (Panakarkandu)",
      category: "Other",
      image: "assets/product-honey.png",
      description: "Traditional palm crystals, commonly used in soothing milk drinks.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 210, mrp: 250 },
        { packSize: "500g", price: 400, mrp: 480 },
        { packSize: "1kg", price: 780, mrp: 920 }
      ],
      price250g: 210,
      price500g: 400,
      price1kg: 780,
      displayOrder: 29
    },
    {
      id: "jaggery-powder",
      name: "Jaggery (Powder)",
      category: "Other",
      image: "assets/product-honey.png",
      description: "Fine cane jaggery powder with deep molasses flavor.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 70, mrp: 90 },
        { packSize: "500g", price: 130, mrp: 160 },
        { packSize: "1kg", price: 240, mrp: 300 }
      ],
      price250g: 70,
      price500g: 130,
      price1kg: 240,
      displayOrder: 30
    },
    {
      id: "brown-sugar",
      name: "Brown Sugar (Nattu Sakkarai)",
      category: "Other",
      image: "assets/product-honey.png",
      description: "Country brown sugar powder for traditional coffee and tea.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 65, mrp: 80 },
        { packSize: "500g", price: 120, mrp: 150 },
        { packSize: "1kg", price: 220, mrp: 270 }
      ],
      price250g: 65,
      price500g: 120,
      price1kg: 220,
      displayOrder: 31
    },
    {
      id: "almond-gum",
      name: "Almond Gum (Pisin)",
      category: "Other",
      image: "assets/product-honey.png",
      description: "Edible tree gum crystals for Jigarthanda and summer drinks.",
      availability: "available",
      variants: [
        { packSize: "250g", price: 150, mrp: 180 },
        { packSize: "500g", price: 280, mrp: 340 },
        { packSize: "1kg", price: 540, mrp: 650 }
      ],
      price250g: 150,
      price500g: 280,
      price1kg: 540,
      displayOrder: 32
    },
    {
      id: "gift-festive-hamper",
      name: "Festive Gift Hamper",
      category: "Other",
      image: "assets/product-gift-box.png",
      description: "Curated gift box with assorted dry fruits, nuts, and presentation wrap.",
      availability: "available",
      variants: [
        { packSize: "1 pack", price: 999, mrp: 1200 }
      ],
      price250g: 599,
      price500g: 999,
      price1kg: 1899,
      displayOrder: 33
    },
    {
      id: "gift-dryfruit-box",
      name: "Dry Fruit & Nuts Gift Box (4-in-1)",
      category: "Other",
      image: "assets/product-nuts-mixed.png",
      description: "Compartment box featuring cashews, almonds, pistachios, and raisins.",
      availability: "available",
      variants: [
        { packSize: "1 pack", price: 899, mrp: 1100 }
      ],
      price250g: 499,
      price500g: 899,
      price1kg: 1699,
      displayOrder: 34
    },
    {
      id: "gift-seeds-mix",
      name: "Seeds & Mix Gift Pack",
      category: "Other",
      image: "assets/product-seed-nuts-mix.png",
      description: "Nut and seed blend gift jar set with gift ribbon wrap.",
      availability: "available",
      variants: [
        { packSize: "1 pack", price: 749, mrp: 899 }
      ],
      price250g: 399,
      price500g: 749,
      price1kg: 1399,
      displayOrder: 35
    },
    {
      id: "gift-corporate-wood",
      name: "Corporate Premium Wood Box",
      category: "Other",
      image: "assets/corporate-gift-poster-v3.png",
      description: "Handcrafted wooden keepsake gift chest with engraved branding.",
      availability: "available",
      variants: [
        { packSize: "1 pack", price: 1250, mrp: 1500 }
      ],
      price250g: "",
      price500g: 1250,
      price1kg: 2200,
      displayOrder: 36
    }
  ];

  // Cloud Database URL (Configurable in Admin Settings)
  // Default cloud database key for Karol Grove live sync
  const DEFAULT_CLOUD_API = localStorage.getItem('kg_cloud_db_url') || '';

  // Get active catalog
  function getLiveCatalog() {
    try {
      const cached = localStorage.getItem('kg_live_catalog') || localStorage.getItem('kg_prices_local');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize variants if needed
          return parsed.map(item => {
            if (!item.variants || item.variants.length === 0) {
              const v = [];
              if (item.price250g) v.push({ packSize: "250g", price: item.price250g, mrp: item.mrp || null });
              if (item.price500g) v.push({ packSize: "500g", price: item.price500g, mrp: item.mrp || null });
              if (item.price1kg) v.push({ packSize: "1kg", price: item.price1kg, mrp: item.mrp || null });
              if (v.length === 0 && item.price) v.push({ packSize: `${item.packSize || 1}${item.unit || 'pack'}`, price: item.price, mrp: item.mrp || null });
              item.variants = v;
            }
            return item;
          });
        }
      }
    } catch (e) {
      console.error('Error loading live catalog:', e);
    }
    return defaultCatalog;
  }

  // Save live catalog (Direct: updates instantly, broadcasts to all open tabs, and syncs to Cloud Backend)
  async function saveLiveCatalog(catalog) {
    // 1. Update local storage immediately
    localStorage.setItem('kg_live_catalog', JSON.stringify(catalog));
    localStorage.setItem('kg_prices_local', JSON.stringify(catalog));
    window.priceListData = catalog;

    // 2. Broadcast to other tabs & windows
    try {
      window.dispatchEvent(new Event('storage'));
      if (window.BroadcastChannel) {
        const bc = new BroadcastChannel('kg_catalog_channel');
        bc.postMessage({ type: 'CATALOG_UPDATED', timestamp: Date.now() });
      }
    } catch(e) {}

    // 3. Sync to Cloud Database / Remote Backend if configured
    const cloudUrl = localStorage.getItem('kg_cloud_db_url') || DEFAULT_CLOUD_API;
    if (cloudUrl) {
      try {
        await fetch(cloudUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ catalog, updatedAt: new Date().toISOString() })
        });
      } catch(err) {
        console.warn('Cloud sync error (saved locally):', err);
      }
    }
    return true;
  }

  // Check for remote cloud updates on page load
  async function syncFromCloud() {
    const cloudUrl = localStorage.getItem('kg_cloud_db_url') || DEFAULT_CLOUD_API;
    if (!cloudUrl) return;

    try {
      const resp = await fetch(cloudUrl, { method: 'GET', headers: { 'Accept': 'application/json' } });
      if (resp.ok) {
        const data = await resp.json();
        const remoteCatalog = data.catalog || data;
        if (Array.isArray(remoteCatalog) && remoteCatalog.length > 0) {
          localStorage.setItem('kg_live_catalog', JSON.stringify(remoteCatalog));
          localStorage.setItem('kg_prices_local', JSON.stringify(remoteCatalog));
          window.priceListData = remoteCatalog;
          window.dispatchEvent(new Event('storage'));
        }
      }
    } catch(e) {}
  }

  // CRUD Helper Object for Admin & Catalogue
  const KG_STORE = {
    getAll: getLiveCatalog,
    getById: function(id) {
      const list = getLiveCatalog();
      return list.find(item => item.id === id) || null;
    },
    saveProduct: async function(productData) {
      const catalog = getLiveCatalog();
      const existingIndex = catalog.findIndex(p => p.id === productData.id);
      
      // Auto-compute variants if price250g/price500g/price1kg provided
      if (!productData.variants || productData.variants.length === 0) {
        const v = [];
        if (productData.price250g !== undefined && productData.price250g !== '') {
          v.push({ packSize: '250g', price: parseFloat(productData.price250g), mrp: productData.mrp250g ? parseFloat(productData.mrp250g) : null });
        }
        if (productData.price500g !== undefined && productData.price500g !== '') {
          v.push({ packSize: '500g', price: parseFloat(productData.price500g), mrp: productData.mrp500g ? parseFloat(productData.mrp500g) : null });
        }
        if (productData.price1kg !== undefined && productData.price1kg !== '') {
          v.push({ packSize: '1kg', price: parseFloat(productData.price1kg), mrp: productData.mrp1kg ? parseFloat(productData.mrp1kg) : null });
        }
        productData.variants = v;
      }

      if (existingIndex >= 0) {
        catalog[existingIndex] = { ...catalog[existingIndex], ...productData };
      } else {
        if (!productData.id) {
          productData.id = 'prod-' + Date.now().toString(36);
        }
        productData.displayOrder = catalog.length + 1;
        catalog.push(productData);
      }
      await saveLiveCatalog(catalog);
      return productData;
    },
    toggleAvailability: async function(id) {
      const catalog = getLiveCatalog();
      const item = catalog.find(p => p.id === id);
      if (item) {
        item.availability = (item.availability === 'disabled' || item.availability === 'out_of_stock') ? 'available' : 'disabled';
        await saveLiveCatalog(catalog);
        return item.availability;
      }
      return null;
    },
    deleteProduct: async function(id) {
      let catalog = getLiveCatalog();
      catalog = catalog.filter(p => p.id !== id);
      await saveLiveCatalog(catalog);
      return true;
    },
    resetToDefaults: async function() {
      localStorage.removeItem('kg_live_catalog');
      localStorage.removeItem('kg_prices_local');
      await saveLiveCatalog(JSON.parse(JSON.stringify(defaultCatalog)));
      return defaultCatalog;
    },
    exportJSON: function() {
      return JSON.stringify(getLiveCatalog(), null, 2);
    },
    importJSON: async function(jsonStr) {
      try {
        const parsed = JSON.parse(jsonStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          await saveLiveCatalog(parsed);
          return true;
        }
      } catch(e) {
        console.error('Invalid catalog JSON:', e);
      }
      return false;
    }
  };

  // Expose global APIs
  window.defaultPriceCatalog = defaultCatalog;
  window.getLiveCatalog = getLiveCatalog;
  window.saveLiveCatalog = saveLiveCatalog;
  window.syncFromCloud = syncFromCloud;
  window.priceListData = getLiveCatalog();
  window.KG_STORE = KG_STORE;

  // Listen for BroadcastChannel updates from admin portal
  if (window.BroadcastChannel) {
    try {
      const bc = new BroadcastChannel('kg_catalog_channel');
      bc.onmessage = function(ev) {
        if (ev.data && ev.data.type === 'CATALOG_UPDATED') {
          window.priceListData = getLiveCatalog();
          if (typeof window.renderPublicCatalogue === 'function') {
            window.renderPublicCatalogue();
          }
        }
      };
    } catch(e) {}
  }

  // Auto-sync in background on load
  syncFromCloud();

})();

