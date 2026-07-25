/**
 * Karol Grove — Weekly Price List Data
 * This file contains the default list of products and their prices.
 * It is structured as a global array so it works natively in static deployment.
 * Admin can edit this data directly from the Price List page, save it, and download an updated version of this file.
 */

window.priceListData = [
  // NUTS
  { category: "Nuts", name: "Premium Almonds (Badam)", price250g: 220, price500g: 430, price1kg: 850 },
  { category: "Nuts", name: "Premium Cashews (Kaju) - W240", price250g: 250, price500g: 490, price1kg: 960 },
  { category: "Nuts", name: "Pistachios (Pista) - Roasted & Salted", price250g: 280, price500g: 550, price1kg: 1080 },
  { category: "Nuts", name: "Premium Walnuts (Akhrot) - Chile Halves", price250g: 320, price500g: 620, price1kg: 1200 },
  { category: "Nuts", name: "Pepper Cashews", price250g: 270, price500g: 530, price1kg: 1020 },
  { category: "Nuts", name: "Chilli Cashews", price250g: 270, price500g: 530, price1kg: 1020 },
  { category: "Nuts", name: "Salted Cashews", price250g: 260, price500g: 510, price1kg: 990 },
  { category: "Nuts", name: "Roasted Almonds - Salted", price250g: 240, price500g: 470, price1kg: 920 },
  { category: "Nuts", name: "Macadamia Nuts", price250g: 650, price500g: 1250, price1kg: 2400 },
  { category: "Nuts", name: "Brazil Nuts", price250g: 450, price500g: 880, price1kg: 1700 },
  { category: "Nuts", name: "Pecan Nuts", price250g: 480, price500g: 920, price1kg: 1800 },
  { category: "Nuts", name: "Pine Nuts (Chilgoza)", price250g: 950, price500g: 1850, price1kg: 3600 },

  // DATES
  { category: "Dates", name: "Medjool Dates (Premium)", price250g: 350, price500g: 680, price1kg: 1300 },
  { category: "Dates", name: "Ajwa Dates (Saudi Arabia)", price250g: 450, price500g: 850, price1kg: 1600 },
  { category: "Dates", name: "Omani Dates", price250g: 120, price500g: 230, price1kg: 440 },
  { category: "Dates", name: "Dry Dates (Kharik) - Yellow", price250g: 100, price500g: 190, price1kg: 360 },
  { category: "Dates", name: "Black Dates (Premium)", price250g: 130, price500g: 250, price1kg: 480 },

  // DRIED FRUITS
  { category: "Dried Fruits", name: "Golden Raisins (Kishmish)", price250g: 90, price500g: 170, price1kg: 320 },
  { category: "Dried Fruits", name: "Black Raisins (Seedless)", price250g: 110, price500g: 210, price1kg: 400 },
  { category: "Dried Fruits", name: "Green Raisins (Premium)", price250g: 95, price500g: 180, price1kg: 340 },
  { category: "Dried Fruits", name: "Dried Figs (Anjeer) - Premium Jumbo", price250g: 340, price500g: 660, price1kg: 1280 },
  { category: "Dried Fruits", name: "Dried Apricots (Jardalu)", price250g: 200, price500g: 390, price1kg: 750 },
  { category: "Dried Fruits", name: "Dried Cranberries (Whole)", price250g: 160, price500g: 300, price1kg: 580 },
  { category: "Dried Fruits", name: "Dried Blueberries", price250g: 280, price500g: 540, price1kg: 1050 },

  // HEALTHY SEEDS
  { category: "Seeds", name: "Chia Seeds (Organic)", price250g: 120, price500g: 220, price1kg: 420 },
  { category: "Seeds", name: "Pumpkin Seeds (Raw)", price250g: 150, price500g: 290, price1kg: 560 },
  { category: "Seeds", name: "Sunflower Seeds (Raw)", price250g: 100, price500g: 180, price1kg: 340 },
  { category: "Seeds", name: "Flax Seeds (Organic)", price250g: 80, price500g: 150, price1kg: 280 },
  { category: "Seeds", name: "Watermelon Seeds", price250g: 90, price500g: 170, price1kg: 320 },
  { category: "Seeds", name: "Basil Seeds (Sabja)", price250g: 140, price500g: 260, price1kg: 500 },

  // SWEETENERS & OTHERS
  { category: "Sweeteners & Others", name: "Pure Organic Honey", price250g: 180, price500g: 340, price1kg: 650 },
  { category: "Sweeteners & Others", name: "Palm Sugar", price250g: 190, price500g: 370, price1kg: 720 },
  { category: "Sweeteners & Others", name: "Palm Candy (Panakarkandu)", price250g: 210, price500g: 400, price1kg: 780 },
  { category: "Sweeteners & Others", name: "Organic Jaggery (Powder)", price250g: 70, price500g: 130, price1kg: 240 },
  { category: "Sweeteners & Others", name: "Brown Sugar (Nattu Sakkarai)", price250g: 65, price500g: 120, price1kg: 220 },
  { category: "Sweeteners & Others", name: "Almond Gum (Pisin)", price250g: 150, price500g: 280, price1kg: 540 },
  { category: "Sweeteners & Others", name: "Country Chicken Egg", price250g: "", price500g: "", price1kg: 180 }, // Egg sold per pack/dozen or 1kg equivalent

  // GIFT PACKS
  { category: "Gift Packs", name: "Premium Festive Gift Hamper", price250g: 599, price500g: 999, price1kg: 1899 },
  { category: "Gift Packs", name: "Dry Fruit & Nuts Gift Box (4-in-1)", price250g: 499, price500g: 899, price1kg: 1699 },
  { category: "Gift Packs", name: "Healthy Seeds & Mix Gift Pack", price250g: 399, price500g: 749, price1kg: 1399 },
  { category: "Gift Packs", name: "Corporate Premium Wood Box", price250g: "", price500g: 1250, price1kg: 2200 }
];
