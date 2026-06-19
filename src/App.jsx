import React, { useState, useEffect } from 'react';
import PromoBar from './components/PromoBar';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import Categories from './components/Categories';
import ProductSection from './components/ProductSection';
import Customizer from './components/Customizer';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import TrustBar from './components/TrustBar';

// Full product catalog data from Vistaprint India homepage JSON
const PRODUCT_CATALOG = [
  // Visiting Cards
  {
    id: 'standardBusinessCards',
    name: 'Standard Visiting Cards',
    category: 'visiting-cards',
    categoryName: 'Visiting Cards',
    price: 200,
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/New%20Vistaprint%20Core%20Website/NVHP%20Tiles/IN_NVHPTiles_VistingCards_01',
    rating: 4.8,
    reviewsCount: 124,
    offerText: 'BUY 100 @ Rs.200',
    tag: 'POPULAR'
  },
  {
    id: 'roundedCornerBusinessCards',
    name: 'Rounded Corner Visiting Cards',
    category: 'visiting-cards',
    categoryName: 'Visiting Cards',
    price: 250,
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/NVHP/New%20Home%20Page/NEW%20-%20NVHP%20Tiles/Trending%20Products/Rounded-Corner-Visiting-Cards_01',
    rating: 4.7,
    reviewsCount: 86,
    offerText: 'BUY 100 @ Rs.250',
    tag: 'NEW'
  },
  
  // Stationery
  {
    id: 'letterhead',
    name: 'Premium Letterheads',
    category: 'stationery',
    categoryName: 'Custom Stationery',
    price: 230,
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/NVHP/New%20Home%20Page/NEW%20-%20NVHP%20Tiles/Our%20Most%20Popular%20Products/IN_NVHPTiles_Letterheads_01',
    rating: 4.6,
    reviewsCount: 52,
    offerText: 'BUY 10 @ Rs.230',
    tag: ''
  },
  
  // Photo Gifts
  {
    id: 'photobook',
    name: 'Personalised Photo Albums',
    category: 'photo-gifts',
    categoryName: 'Photo Gifts',
    price: 715,
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/NVHP/New%20Home%20Page/NEW%20-%20NVHP%20Tiles/Our%20Most%20Popular%20Products/IN_NVHPTiles_Photo-Albums_01',
    rating: 4.9,
    reviewsCount: 148,
    offerText: 'BUY 1 @ Rs.715',
    tag: 'POPULAR'
  },
  
  // Stickers & Labels
  {
    id: 'stickers',
    name: 'Custom Stickers',
    category: 'labels-packaging',
    categoryName: 'Labels & Stickers',
    price: 150,
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/NVHP/New%20Home%20Page/NEW%20-%20NVHP%20Tiles/Labels%2C%20Stickers%20and%20Packaging/Custom-Stickers-01',
    rating: 4.5,
    reviewsCount: 64,
    offerText: 'BUY 10 @ Rs.150',
    tag: '5% OFF'
  },
  {
    id: 'sheetStickers',
    name: 'Custom Sheet Stickers',
    category: 'labels-packaging',
    categoryName: 'Labels & Stickers',
    price: 160,
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/NVHP/New%20Home%20Page/NEW%20-%20NVHP%20Tiles/Labels%2C%20Stickers%20and%20Packaging/Sheet-Stickers_01',
    rating: 4.5,
    reviewsCount: 41,
    offerText: 'BUY 24 @ Rs. 160',
    tag: ''
  },
  {
    id: 'productLabels',
    name: 'Product & Packaging Labels',
    category: 'labels-packaging',
    categoryName: 'Labels & Stickers',
    price: 160,
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/NVHP/New%20Home%20Page/Explore%20More/Product-_-Packaging-Labels01',
    rating: 4.6,
    reviewsCount: 77,
    offerText: 'BUY 24 @ Rs.160',
    tag: 'POPULAR'
  },
  {
    id: 'customShapeSticker',
    name: 'Custom Shape Stickers',
    category: 'labels-packaging',
    categoryName: 'Labels & Stickers',
    price: 190,
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/NVHP/New%20Home%20Page/NEW%20-%20NVHP%20Tiles/Labels%2C%20Stickers%20and%20Packaging/Custom-Shape-Stickers_01',
    rating: 4.7,
    reviewsCount: 39,
    offerText: 'BUY 10 @ Rs. 190',
    tag: 'NEW'
  },

  // Clothing & Bags (Polos)
  {
    id: 'embroideredMensPoloTShirts',
    name: "Men's Polo T-Shirts",
    category: 'polo-shirts',
    categoryName: 'Clothing & Apparel',
    price: 320,
    image: '/ai_model_man_polo_tshirt.png',
    rating: 4.7,
    reviewsCount: 210,
    offerText: 'BUY 1 @ Rs.320',
    tag: 'BESTSELLER'
  },
  {
    id: 'womenPoloTShirts',
    name: "Women's Polo T-shirts",
    category: 'polo-shirts',
    categoryName: 'Clothing & Apparel',
    price: 320,
    image: '/ai_model_polo_tshirt.png',
    rating: 4.7,
    reviewsCount: 210,
    offerText: 'BUY 1 @ Rs.320',
    tag: 'BESTSELLER'
  },
  {
    id: 'pumaPoloTShirtsIndia',
    name: 'Puma® Polo T-shirts',
    category: 'polo-shirts',
    categoryName: 'Clothing & Apparel',
    price: 1640,
    image: '/ai_model_man_polo_tshirt.png',
    rating: 4.8,
    reviewsCount: 94,
    offerText: 'BUY 1 @ Rs.1640',
    tag: 'NEW'
  },
  {
    id: 'customMugWhite',
    name: 'Personalised White Mugs',
    category: 'photo-gifts',
    categoryName: 'Photo Gifts',
    price: 280,
    image: '/personalised_coffee_mug.png',
    rating: 4.6,
    reviewsCount: 185,
    offerText: 'BUY 1 @ Rs.280',
    tag: 'POPULAR'
  },
  {
    id: 'printedToteBags',
    name: 'Printed Tote Bags',
    category: 'bags',
    categoryName: 'Custom Bags',
    price: 330,
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/NVHP/New%20Home%20Page/NEW%20-%20NVHP%20Tiles/Top%20Selling%20Bulk%20Products/IN_Tote-Bags_01',
    rating: 4.4,
    reviewsCount: 68,
    offerText: 'BUY 1 @ Rs.330',
    tag: ''
  },

  // Stamps & Ink
  {
    id: 'selfInkingStamps',
    name: 'Self Inking Stamps',
    category: 'stamps-ink',
    categoryName: 'Stamps & Ink',
    price: 310,
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/New%20Vistaprint%20Core%20Website/NVHP%20Tiles/IN_NVHPTiles_Stamps_01',
    rating: 4.7,
    reviewsCount: 110,
    offerText: 'BUY 1 @ Rs.310',
    tag: ''
  },

  // Rainwear & Umbrellas
  {
    id: 'singleFoldUmbrella',
    name: 'Single Fold Umbrellas',
    category: 'rainwear',
    categoryName: 'Rainwear',
    price: 655,
    image: '/ai_model_rainwear.png',
    rating: 4.5,
    reviewsCount: 33,
    offerText: 'BUY 1 @ Rs. 655',
    tag: 'NEW'
  },

  // New Products - Pens
  {
    id: 'customizedPens',
    name: 'Customized Pens',
    category: 'pens',
    categoryName: 'Pens & Writing',
    price: 150,
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/Pens/Bestsellers/Customized-Pens_01',
    rating: 4.6,
    reviewsCount: 78,
    offerText: 'Pack of 5 @ Rs.150',
    tag: 'BESTSELLER'
  },
  {
    id: 'personalisedPens',
    name: 'Personalised Pens',
    category: 'pens',
    categoryName: 'Pens & Writing',
    price: 180,
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/Pens/Bestsellers/Personalised-Pens_01',
    rating: 4.7,
    reviewsCount: 56,
    offerText: 'BUY 1 @ Rs.180',
    tag: ''
  },
  {
    id: 'premiumMagneticPens',
    name: 'Premium Magnetic Metal Roller Pens',
    category: 'pens',
    categoryName: 'Pens & Writing',
    price: 350,
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/Pens/Bestsellers/Premium-Magnetic-Metal-Roller-Pens_01',
    rating: 4.8,
    reviewsCount: 42,
    offerText: 'BUY 1 @ Rs.350',
    tag: 'POPULAR'
  },
  {
    id: 'blackMattePens',
    name: 'Black Matte Ball Pens',
    category: 'pens',
    categoryName: 'Pens & Writing',
    price: 190,
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/Pens/Bestsellers/Black-Matte-Ball-Pens_01',
    rating: 4.5,
    reviewsCount: 29,
    offerText: 'BUY 1 @ Rs.190',
    tag: ''
  },
  {
    id: 'parkerOdysseyPen',
    name: 'Parker Odyssey Laque Black Gold Trim Roller Ball Pen',
    category: 'pens',
    categoryName: 'Pens & Writing',
    price: 999,
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/Pens/Luxury/Parker-Odyssey-Laque-Black_01',
    rating: 4.9,
    reviewsCount: 19,
    offerText: 'BUY 1 @ Rs.999',
    tag: 'LUXURY'
  },

  // New Products - Drinkware
  {
    id: 'customWaterBottles',
    name: 'Custom Water Bottles',
    category: 'drinkware',
    categoryName: 'Drinkware',
    price: 399,
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/Drinkware/Bestsellers/Custom-Water-Bottles_01',
    rating: 4.7,
    reviewsCount: 93,
    offerText: 'BUY 1 @ Rs.399',
    tag: 'BESTSELLER'
  },
  {
    id: 'tempDisplayBottles',
    name: 'Temperature Display Bottles',
    category: 'drinkware',
    categoryName: 'Drinkware',
    price: 499,
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/Drinkware/Bestsellers/Temperature-Display-Bottles_01',
    rating: 4.6,
    reviewsCount: 65,
    offerText: 'BUY 1 @ Rs.499',
    tag: 'NEW'
  },
  {
    id: 'celloDuroKentBottles',
    name: 'Cello Duro Kent Water Bottles',
    category: 'drinkware',
    categoryName: 'Drinkware',
    price: 599,
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/Drinkware/Bestsellers/Cello-Duro-Kent-Water-Bottles_01',
    rating: 4.8,
    reviewsCount: 88,
    offerText: 'BUY 1 @ Rs.599',
    tag: 'POPULAR'
  },
  {
    id: 'skinnyTumbler',
    name: 'Personalised Skinny Tumbler 600ml',
    category: 'drinkware',
    categoryName: 'Drinkware',
    price: 450,
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/Drinkware/Sippers/Personalised-Skinny-Tumbler_01',
    rating: 4.5,
    reviewsCount: 37,
    offerText: 'BUY 1 @ Rs.450',
    tag: ''
  },
  {
    id: 'customisedBeerMugs',
    name: 'Customised Beer Mugs',
    category: 'drinkware',
    categoryName: 'Drinkware',
    price: 350,
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/Drinkware/New/Customised-Beer-Mugs_01',
    rating: 4.6,
    reviewsCount: 42,
    offerText: 'BUY 1 @ Rs.350',
    tag: 'NEW'
  },

  // New Products - Rainwear
  {
    id: 'golfUmbrella',
    name: 'Golf Umbrellas',
    category: 'rainwear',
    categoryName: 'Rainwear',
    price: 950,
    image: '/ai_model_rainwear.png',
    rating: 4.7,
    reviewsCount: 22,
    offerText: 'BUY 1 @ Rs.950',
    tag: 'BESTSELLER'
  },
  {
    id: 'sunTwoFoldUmbrella',
    name: 'Sun Two Fold Umbrellas',
    category: 'rainwear',
    categoryName: 'Rainwear',
    price: 550,
    image: '/ai_model_rainwear.png',
    rating: 4.4,
    reviewsCount: 15,
    offerText: 'BUY 1 @ Rs.550',
    tag: 'NEW'
  },
  {
    id: 'scottWaterproofJacket',
    name: 'Scott Waterproof Jackets',
    category: 'rainwear',
    categoryName: 'Rainwear',
    price: 1250,
    image: '/ai_model_rainwear.png',
    rating: 4.8,
    reviewsCount: 31,
    offerText: 'BUY 1 @ Rs.1250',
    tag: 'POPULAR'
  }
];

const CATEGORIES = [
  {
    id: 'visiting-cards',
    name: 'Visiting Cards',
    columns: [
      {
        title: 'Visiting Cards',
        items: [
          { name: 'Standard Visiting Cards', productId: 'standardBusinessCards' },
          { name: 'Rounded Corner Cards', productId: 'roundedCornerBusinessCards' },
          { name: 'Square Visiting Cards' },
          { name: 'Folded Visiting Cards' }
        ]
      },
      {
        title: 'Visiting Card Holders',
        items: [
          { name: 'Metal Card Holders' },
          { name: 'Leather Card Holders' }
        ]
      }
    ]
  },
  {
    id: 'stationery',
    name: 'Stationery & Notebooks',
    columns: [
      {
        title: 'Custom Stationery',
        items: [
          { name: 'Premium Letterheads', productId: 'letterhead' },
          { name: 'Custom Letterhead Pads' },
          { name: 'Bill Books' },
          { name: 'Envelopes' },
          { name: 'Envelope Seals' }
        ]
      },
      {
        title: 'Office Supplies',
        items: [
          { name: 'Lanyards' },
          { name: 'ID Cards' },
          { name: 'Invoice Books' },
          { name: 'Note Cards' },
          { name: 'Custom Certificates' }
        ]
      },
      {
        title: 'Notebooks & Diaries',
        items: [
          { name: 'Personalised Notebooks' },
          { name: 'Diary with Pen Holder' },
          { name: 'Personalised A5 Diary' },
          { name: 'Diary with Magnetic Lock' }
        ]
      },
      {
        title: 'Invitations',
        items: [
          { name: 'Wedding Invitations' },
          { name: 'Save The Date Cards' },
          { name: 'Thank You Cards' },
          { name: 'Birthday Invitations' }
        ]
      },
      {
        title: 'Files & Folders',
        items: [
          { name: 'Presentation Folders' },
          { name: 'Ring Binder File' },
          { name: 'Presentation File with Pocket' }
        ]
      }
    ]
  },
  {
    id: 'pens',
    name: 'Pens & Writing',
    columns: [
      {
        title: 'Bestsellers',
        items: [
          { name: 'Customized Pens', productId: 'customizedPens' },
          { name: 'Personalised Pens', productId: 'personalisedPens' },
          { name: 'Premium Magnetic Metal Roller Pens', productId: 'premiumMagneticPens' },
          { name: 'Submarine Sleek Metal Roller Pens' },
          { name: 'Plastic Pens' },
          { name: 'Sleek Metal Ballpoint Pens' },
          { name: 'Premium Brass Metal Golden Ball Pens' },
          { name: 'Black Matte Ball Pens', productId: 'blackMattePens' }
        ]
      },
      {
        title: 'Value Pens',
        items: [
          { name: 'Triangle Wire Clip Ball Pens' },
          { name: 'Grand Opaque Ballpoint Pen' },
          { name: 'New Getz Cap Type Ballpoint Pens' },
          { name: 'Twist Plastic Ball Pens' },
          { name: 'New Cap Plastic Ball Pens' },
          { name: 'Getz Opaque Push Type Ballpoint Pen' }
        ]
      },
      {
        title: 'Executive Pens',
        items: [
          { name: 'Submarine Sleek Metal Roller Pens' },
          { name: 'Submarine Artistic Plastic Pens with Round Ring' },
          { name: 'Submarine Mini Flat Clip Rose Gold Tip Metal Pens' },
          { name: 'Executive Metal Ball Pen' },
          { name: 'Black Matte Roller Pens' },
          { name: 'Submarine Premium Xylo Steel Finish Roller Pens' },
          { name: 'Submarine Gold Plated Ball Pens' }
        ]
      },
      {
        title: 'Premium Pens',
        items: [
          { name: 'Premium Matte Pens' },
          { name: 'Black Matte Ball Pens', productId: 'blackMattePens' },
          { name: 'Premium Brush Stone Black Ballpoint Pens' },
          { name: 'Submarine Roller Pens with Swarovski Crystal' },
          { name: 'Marble Design Metal Ball Pens' },
          { name: 'Submarine Fountain Pens' },
          { name: 'Submarine Liberty Watermark Ball Pens' }
        ]
      },
      {
        title: 'Luxury Pens',
        items: [
          { name: 'Parker Odyssey Laque Black Gold Trim Roller Ball Pen', productId: 'parkerOdysseyPen' },
          { name: 'Parker Odyssey Laque Black Chrome Trim Ball Pen' },
          { name: 'SwissBrand® Legacy Trim Roller Ball Pens' },
          { name: 'SwissBrand® Eternia Fountain Pens' },
          { name: 'SwissBrand® Zenith Trim Roller Ball Pens' }
        ]
      },
      {
        title: 'Newly Launched',
        items: [
          { name: 'Promotional Pens' },
          { name: 'Click Ball Pens' },
          { name: 'Bulk Ball Pens' },
          { name: 'Green with Silver Ball Pens' }
        ]
      }
    ]
  },
  {
    id: 'drinkware',
    name: 'Drinkware',
    columns: [
      {
        title: 'BestSellers',
        items: [
          { name: 'Custom Water Bottles', productId: 'customWaterBottles' },
          { name: 'Customised Tumblers' },
          { name: 'Cello Duro Kent Water Bottles', productId: 'celloDuroKentBottles' },
          { name: 'Temperature Display Bottles', productId: 'tempDisplayBottles' },
          { name: 'Stainless Steel Sipper Bottles' }
        ]
      },
      {
        title: 'Water Bottles',
        items: [
          { name: 'Cello Duro Flip Water Bottles' },
          { name: 'Custom Sipper Bottles' },
          { name: 'Vacuum Bottles' },
          { name: 'Cello Swift Bottles' },
          { name: 'Inox Bottles' },
          { name: 'Gym Bottles' },
          { name: 'Thermal Suction Bottles' }
        ]
      },
      {
        title: 'Sippers & Tumblers',
        items: [
          { name: 'Personalised Skinny Tumbler 600ml', productId: 'skinnyTumbler' },
          { name: 'Aluminium Water Bottles' },
          { name: 'Wine Tumbler' },
          { name: 'Personalized Travel Tumbler' },
          { name: 'Pexpo Cocoa Vacuum Steel Tumblers', isNew: true }
        ]
      },
      {
        title: 'Looking for more?',
        items: [
          { name: 'Vacuum Insulation Cup' },
          { name: 'Water Bottle with Wireless Speaker' },
          { name: 'Cello Flip Style Water Flasks' },
          { name: 'Insulated Vacuum Coffee Flasks' },
          { name: 'Frosted Beer Mugs' },
          { name: 'Hip Flask - 7 OZ - Black' },
          { name: 'Printed Cola Bottles 600ml' }
        ]
      },
      {
        title: 'New in Drinkware',
        items: [
          { name: 'Temperature Display Mugs' },
          { name: 'Customised Beer Mugs', productId: 'customisedBeerMugs' },
          { name: 'Personalised Champagne Glasses' },
          { name: 'Personalised Wine Glasses' },
          { name: 'Personalised Vacuum Insulated Tumbler' },
          { name: 'Pexpo Austin Steel Water Bottles', isNew: true },
          { name: 'Pexpo Cameo Compact Steel Bottles', isNew: true },
          { name: 'Pexpo Morocco Thermo Steel Bottles', isNew: true },
          { name: 'Pexpo Orio Thermo Steel Bottles', isNew: true },
          { name: 'Pexpo Bravo Vacuum Bottles', isNew: true }
        ]
      }
    ]
  },
  {
    id: 'polo-shirts',
    name: 'Custom Polo Shirts',
    columns: [
      {
        title: 'Bestsellers',
        items: [
          { name: "Men's Polo T-Shirts", productId: 'embroideredMensPoloTShirts' },
          { name: "Women's Polo T-shirts", productId: 'womenPoloTShirts' },
          { name: 'Premium Polo T-Shirts' },
          { name: 'Printed Polos - Multi Location' },
          { name: "Men's Scott Polo T-Shirts" },
          { name: 'Embroidered Polos - Multi Location' },
          { name: 'Polyester Polo T-Shirts' }
        ]
      },
      {
        title: 'Branded Polos',
        items: [
          { name: "Women's Scott Polo T-Shirts" },
          { name: 'Mark & Spencer® Polo T-Shirts' },
          { name: 'Parx® Premium Polo T-Shirts' },
          { name: 'Levi\'s® Polo T-Shirts' },
          { name: 'Arrow® Tipping Polo T-Shirts' },
          { name: 'Monte Carlo® Polo T-Shirts' },
          { name: 'US POLO ASSN.® Polo T-Shirts' },
          { name: 'Woodland® Polo T-Shirts' },
          { name: 'Arrow® Mercerized Polo T-Shirts' }
        ]
      },
      {
        title: 'Multi-location Polos',
        items: [
          { name: 'Polyester Polos - Multi Location' },
          { name: 'Full Custom Polo T-Shirts' }
        ]
      },
      {
        title: 'Puma & Adidas',
        items: [
          { name: 'Puma® Polo T-shirts', productId: 'pumaPoloTShirtsIndia' },
          { name: 'Adidas® 3 stripe Polo T-shirts' },
          { name: 'Adidas® Polycotton T-shirts' },
          { name: 'Adidas® Climalite Dryfit Polo T-shirts' },
          { name: 'Adidas® Polo T-Shirts' },
          { name: 'Adidas Men\'s Polo T-Shirts' }
        ]
      },
      {
        title: 'Sports Polos',
        items: [
          { name: 'Sports Republic Acti-Play Dryfit Polo T-Shirts - Men' },
          { name: '6 Degree Polo T-Shirts' },
          { name: 'Golfer Polo T-Shirts' },
          { name: 'Flying Machine® Dry Fit Polo T-Shirts' },
          { name: 'Sports Republic ACTI - PLAY Dry-Fit POLO Neck Front' },
          { name: 'Dry Fit Golf Polo T-Shirts' },
          { name: 'Sports Republic ACTI - PLAY Dry-Fit POLO Neck-Back' },
          { name: 'Pocket Polo T-Shirts' }
        ]
      },
      {
        title: 'More in Polos',
        items: [
          { name: 'Pikmee Tipline Double tipped Polo T-shirts - Men (Back Side)' },
          { name: 'Pikmee Highline Polo T-Shirts' },
          { name: 'Pikmee Fastees Polo T shirts - Men (Back & Left) old' },
          { name: 'Pikmee Promo Tees Polo T-Shirts' },
          { name: 'Pikmee Titlis Climate Control Polo T Shirts - Men' },
          { name: 'TURMS Anti Stain Polo T-Shirts' },
          { name: 'Bulk Polo T Shirts' },
          { name: 'Safety Reflector Polos' },
          { name: 'Two Tone Polo T-Shirts' }
        ]
      }
    ]
  },
  {
    id: 'photo-gifts',
    name: 'Photo Gifts & Hampers',
    columns: [
      {
        title: 'Bestsellers',
        items: [
          { name: 'Photo Albums' },
          { name: 'Layflat Photo Albums' },
          { name: 'Custom Mouse Pads' },
          { name: 'Canvas Prints' },
          { name: 'Photo With Frame' },
          { name: 'Employee Welcome Kit' }
        ]
      },
      {
        title: 'Mugs',
        items: [
          { name: 'Personalised Mugs', productId: 'customMugWhite' },
          { name: 'Colour Changing Magic Mugs' },
          { name: 'Custom Mugs Black' },
          { name: 'Decorative Mugs', isNew: true }
        ]
      },
      {
        title: 'Gift Hampers',
        items: [
          { name: 'Travel Accessories Hampers' },
          { name: 'Welcome Kit' },
          { name: 'Hamper with Stainless Steel Bottle' }
        ]
      },
      {
        title: 'Custom Magnets',
        items: [
          { name: 'Fridge Magnets' },
          { name: 'Photo Magnets' },
          { name: 'Magnetic Visiting Cards' },
          { name: 'Acrylic Photo Magnets' }
        ]
      },
      {
        title: 'Custom Calendars',
        items: [
          { name: 'Desk Calendars' },
          { name: 'Wall Calendars' },
          { name: 'Flip Desk Calendars' },
          { name: 'Poster Calendars' }
        ]
      }
    ]
  },
  {
    id: 'labels-packaging',
    name: 'Labels & Packaging',
    columns: [
      {
        title: 'Custom Packaging',
        items: [
          { name: 'Self Adhesive Tapes' },
          { name: 'Custom Paper Bags' },
          { name: 'Printed Carry Bags' },
          { name: 'Premium Gift Bags' },
          { name: 'Courier Bags' }
        ]
      },
      {
        title: 'Custom Stickers',
        items: [
          { name: 'Custom Stickers', productId: 'stickers' },
          { name: 'Sheet Stickers', productId: 'sheetStickers' },
          { name: 'Custom Shape Stickers' },
          { name: 'UV Ink Transfer Stickers' }
        ]
      },
      {
        title: 'Custom Labels',
        items: [
          { name: 'Product & Packaging Labels', productId: 'productLabels' },
          { name: 'Return Address Labels' },
          { name: 'Custom Iron-on Labels' },
          { name: 'Transparent Labels' }
        ]
      },
      {
        title: 'Packaging Boxes',
        items: [
          { name: 'Promotional Product Boxes', isNew: true },
          { name: 'Tuck Top Boxes', isNew: true },
          { name: 'Lock Bottom Boxes' },
          { name: 'Soap Boxes', isNew: true }
        ]
      },
      {
        title: 'Newly Launched',
        items: [
          { name: 'QR Code Stickers' },
          { name: 'Frosted Slider Bags' },
          { name: 'Holographic Stickers' },
          { name: 'Roll Labels', isNew: true }
        ]
      }
    ]
  },
  {
    id: 'rainwear',
    name: 'Signs, Banners & Rainwear',
    columns: [
      {
        title: 'Bestsellers',
        items: [
          { name: 'Golf Umbrellas', productId: 'golfUmbrella' },
          { name: 'Single Fold Umbrellas', productId: 'singleFoldUmbrella' },
          { name: 'Bulk Single Fold Umbrellas' },
          { name: 'Mirage Safari Rain Suit' },
          { name: 'Rainsuits' },
          { name: 'Industrial Safety Rainsuits' },
          { name: 'Poncho Raincoats' }
        ]
      },
      {
        title: 'Umbrellas',
        items: [
          { name: 'Two-Fold Umbrellas' },
          { name: 'Sun Three Fold Umbrellas' },
          { name: 'Promotional Umbrellas' },
          { name: 'Sun Two Fold Umbrellas', productId: 'sunTwoFoldUmbrella', isNew: true }
        ]
      },
      {
        title: 'Raincoats & Rainwear',
        items: [
          { name: 'Scott Waterproof Jackets', productId: 'scottWaterproofJacket' },
          { name: 'Waterproof Jackets' },
          { name: 'Rain Suit LBW Safari' },
          { name: 'Skylark Safari Rain Suit' },
          { name: 'Raincare Safari Rain Suit' },
          { name: 'Kiara Kids Raincoats' },
          { name: 'Kiara Women\'s Long Raincoats' },
          { name: 'Foldable Waterproof Jackets', isNew: true }
        ]
      },
      {
        title: 'Explore More',
        items: [
          { name: 'Bulk Golf Umbrellas' },
          { name: 'Waterproof Rain Caps' },
          { name: 'Freedom Rain Caps', isNew: true },
          { name: 'Waterproof Bag Covers', isNew: true },
          { name: 'Bulk Two-Fold Umbrellas', isNew: true },
          { name: 'Bulk Three-Fold Umbrellas', isNew: true },
          { name: 'Basic Promotional Golf Umbrellas', isNew: true }
        ]
      }
    ]
  }
];

function App() {
  const [view, setView] = useState('home'); // 'home' | 'customizer' | 'checkout' | 'success' | 'favorites' | 'account'
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Theme state
  const [theme, setTheme] = useState('light');
  
  // Printing queue simulator step
  const [printingStep, setPrintingStep] = useState(1);

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);

  // Dynamic users database state
  const [usersDb, setUsersDb] = useState({
    'jayesh@acme.com': {
      name: 'Jayesh Sharma',
      email: 'jayesh@acme.com',
      initials: 'JS',
      level: 'VIP Corporate',
      wallet: 450,
      orders: [
        { id: 'IS-84291-IN', date: '2026-04-12', items: '100 Standard Visiting Cards', total: 200, status: 'Delivered ✓' },
        { id: 'IS-91028-IN', date: '2026-05-18', items: "2 Men's Polo T-Shirts", total: 1140, status: 'Delivered ✓' }
      ]
    },
    'amit.verma@gmail.com': {
      name: 'Amit Verma',
      email: 'amit.verma@gmail.com',
      initials: 'AV',
      level: 'Standard Member',
      wallet: 150,
      orders: [
        { id: 'IS-10492-IN', date: '2026-05-02', items: 'Premium Letterheads', total: 230, status: 'Delivered ✓' }
      ]
    }
  });

  // Login wizard step: 'credentials' | 'otp'
  const [loginStep, setLoginStep] = useState('credentials');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginPhone, setLoginPhone] = useState('9876543210');
  const [loginOtp, setLoginOtp] = useState('');
  const [loginError, setLoginError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginNotification, setLoginNotification] = useState('');

  const handleSocialLogin = (provider) => {
    let email = 'jayesh@acme.com';
    let phone = '9876543210';
    if (provider === 'Facebook') {
      email = 'amit.verma@gmail.com';
      phone = '9123456789';
    }
    if (provider === 'Apple') {
      email = 'apple-user@gmail.com';
      phone = '9345678901';
    }
    
    setLoginEmail(email);
    setLoginPassword('socialpassword123');
    setLoginPhone(phone);
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setLoginError('');
    setLoginStep('otp');
    console.log(`[${provider} Auth OTP Code]: ${otp}`);
    setLoginNotification(`[${provider} Verification Code sent to +91 ${phone}]: Use code ${otp} to verify.`);
  };

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setLoginError('Please enter a valid Gmail / Email address');
      return;
    }
    if (!loginPassword.trim() || loginPassword.length < 6) {
      setLoginError('Password must be at least 6 characters long');
      return;
    }
    
    // Simulate sending OTP code to user's registered phone
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setLoginError('');
    setLoginStep('otp');
    console.log(`[Email Auth OTP Code]: ${otp}`);
    setLoginNotification(`[Verification Code sent to +91 ${loginPhone}]: Use code ${otp} to verify.`);
  };

  const handleCreateAccountTrigger = (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setLoginError('Please enter a valid Gmail / Email address to create an account');
      return;
    }
    if (!loginPassword.trim() || loginPassword.length < 6) {
      setLoginError('Password must be at least 6 characters long');
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setLoginError('');
    setLoginStep('otp');
    console.log(`[Registration OTP Code]: ${otp}`);
    setLoginNotification(`[Account Registration Code sent to +91 ${loginPhone}]: Use code ${otp} to verify.`);
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    if (loginOtp !== generatedOtp && loginOtp !== '123456') { // Allow 123456 as bypass code
      setLoginError('Incorrect 6-digit verification code. Please check your SMS.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');
    
    setTimeout(() => {
      setIsLoggingIn(false);
      
      const emailKey = loginEmail.toLowerCase().trim();
      let loggedUser = usersDb[emailKey];
      
      if (!loggedUser) {
        // Create new dynamic profile on first login!
        const usernamePart = emailKey.split('@')[0];
        const formattedName = usernamePart.split(/[\._\-]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        const initials = formattedName.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);

        loggedUser = {
          name: formattedName,
          email: emailKey,
          initials: initials || 'US',
          level: 'SaaS Client',
          wallet: 100, // Signup bonus
          orders: []
        };

        // Add to db
        setUsersDb(prev => ({
          ...prev,
          [emailKey]: loggedUser
        }));
      }

      setIsLoggedIn(true);
      setUser(loggedUser);
      setOrderHistory(loggedUser.orders || []);
      
      // Reset wizard fields
      setLoginStep('credentials');
      setLoginEmail('');
      setLoginPassword('');
      setLoginOtp('');
      setLoginError('');
      setLoginNotification('');
      
      if (redirectAfterLogin) {
        setViewWithHistory(redirectAfterLogin);
        setRedirectAfterLogin(null);
      } else {
        setViewWithHistory('account');
      }
    }, 1200);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setLoginStep('credentials');
    setLoginNotification('');
    setViewWithHistory('home');
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  };

  // Run printing simulator on success screen
  useEffect(() => {
    if (view === 'success') {
      setPrintingStep(1);
      const t1 = setTimeout(() => setPrintingStep(2), 3000);
      const t2 = setTimeout(() => setPrintingStep(3), 6000);
      const t3 = setTimeout(() => setPrintingStep(4), 10000);
      const t4 = setTimeout(() => setPrintingStep(5), 14000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [view]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  
  // Global Shopping Cart
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutPriceBreakup, setCheckoutPriceBreakup] = useState({ total: 0, discount: 0 });

  // Favorites/Wishlist
  const [favorites, setFavorites] = useState([]);

  // Successful Order receipt
  const [orderReceipt, setOrderReceipt] = useState(null);

  // User Order History Mock
  const [orderHistory, setOrderHistory] = useState([
    { id: 'IS-84291-IN', date: '2026-04-12', items: '100 Standard Visiting Cards', total: 200, status: 'Delivered ✓' },
    { id: 'IS-91028-IN', date: '2026-05-18', items: "2 Men's Polo T-Shirts", total: 1140, status: 'Delivered ✓' }
  ]);

  // Handle wishlist toggle
  const handleToggleFav = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Browser History Sync Helpers
  const pushHistoryState = (v, prodId = null, catFilter = null, sFilter = null) => {
    window.history.pushState({
      view: v,
      selectedProductId: prodId,
      selectedCategoryFilter: catFilter !== null ? catFilter : selectedCategoryFilter,
      searchFilter: sFilter !== null ? sFilter : searchFilter
    }, '', '');
  };

  const setViewWithHistory = (v) => {
    setView(v);
    pushHistoryState(v, selectedProduct ? selectedProduct.id : null);
  };

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        const { view: v, selectedProductId, selectedCategoryFilter: catFilter, searchFilter: sFilter } = event.state;
        setView(v || 'home');
        if (selectedProductId) {
          const prod = PRODUCT_CATALOG.find(p => p.id === selectedProductId);
          setSelectedProduct(prod || null);
        } else {
          setSelectedProduct(null);
        }
        if (catFilter) setSelectedCategoryFilter(catFilter);
        if (sFilter !== undefined) setSearchFilter(sFilter);
      } else {
        setView('home');
        setSelectedProduct(null);
        setSelectedCategoryFilter('all');
        setSearchFilter('');
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Set initial state
    window.history.replaceState({
      view: 'home',
      selectedProductId: null,
      selectedCategoryFilter: 'all',
      searchFilter: ''
    }, '', '');

    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedProduct, selectedCategoryFilter, searchFilter]);

  // Select product to customize
  const handleSelectProduct = (productId) => {
    const prod = PRODUCT_CATALOG.find(p => p.id === productId);
    if (prod) {
      setSelectedProduct(prod);
      setView('customizer');
      pushHistoryState('customizer', productId);
      window.scrollTo(0, 0);
    }
  };

  // Navigations
  const handleNavigate = (target) => {
    setView(target);
    setSearchFilter('');
    
    let catFilter = 'all';
    // Check if target is a category filter
    const foundCat = CATEGORIES.find(c => c.id === target);
    if (foundCat) {
      setSelectedCategoryFilter(target);
      catFilter = target;
      setView('home');
    } else if (target === 'home') {
      setSelectedCategoryFilter('all');
      catFilter = 'all';
    }
    
    pushHistoryState(foundCat ? 'home' : target, null, catFilter, '');
    window.scrollTo(0, 0);
  };

  // Search logic
  const handleSearch = (query) => {
    setSearchFilter(query);
    setSelectedCategoryFilter('all');
    setView('home');
    pushHistoryState('home', null, 'all', query);
  };

  // Cart operations
  const handleAddToCart = (cartItem) => {
    setCart(prev => [...prev, cartItem]);
    setView('home');
    setIsCartOpen(true);
    pushHistoryState('home', null, selectedCategoryFilter, searchFilter);
  };

  const handleUpdateQty = (index, newQty) => {
    setCart(prev => prev.map((item, idx) => {
      if (idx === index) {
        // Calculate new total based on quantities
        const originalUnitPrice = item.config ? item.config.unitPrice : (item.price / item.quantity);
        return {
          ...item,
          quantity: newQty,
          price: Math.round(originalUnitPrice * newQty)
        };
      }
      return item;
    }));
  };

  const handleRemoveItem = (index) => {
    setCart(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleCheckout = (grandTotal, promoDiscount) => {
    setCheckoutPriceBreakup({ total: grandTotal, discount: promoDiscount });
    setIsCartOpen(false);
    if (!isLoggedIn) {
      setRedirectAfterLogin('checkout');
      setViewWithHistory('account');
    } else {
      setViewWithHistory('checkout');
    }
    window.scrollTo(0, 0);
  };

  const handleOrderSuccess = (receipt) => {
    setOrderReceipt(receipt);
    
    // Add to order history
    const itemSummaries = cart.map(c => `${c.quantity} ${c.name}`).join(', ');
    const newOrder = {
      id: receipt.orderId,
      date: new Date().toISOString().split('T')[0],
      items: itemSummaries,
      total: receipt.payable,
      status: 'Printing In Progress 🖨️'
    };
    
    setOrderHistory(prev => [newOrder, ...prev]);
    if (isLoggedIn && user) {
      setUsersDb(prev => ({
        ...prev,
        [user.email]: {
          ...prev[user.email],
          orders: [newOrder, ...(prev[user.email]?.orders || [])]
        }
      }));
    }
    setCart([]); // Clear cart
    setViewWithHistory('success');
    window.scrollTo(0, 0);
  };

  // Filter products based on search/category filters
  const getFilteredProducts = () => {
    let list = PRODUCT_CATALOG;
    if (selectedCategoryFilter !== 'all') {
      list = list.filter(p => p.category === selectedCategoryFilter);
    }
    if (searchFilter.trim().length > 0) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }
    return list;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="App">
      {/* 1. Promotional code bar */}
      <PromoBar />

      {/* 2. Dynamic Sticky Header */}
      <Header 
        cartCount={cart.length}
        favCount={favorites.length}
        onNavigate={handleNavigate}
        onSearch={handleSearch}
        onToggleCart={() => setIsCartOpen(true)}
        currentTab={selectedCategoryFilter}
        categories={CATEGORIES}
        onSelectProduct={handleSelectProduct}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
      />

      {/* 3. Main Routing Section */}
      <main style={{ minHeight: '60vh' }}>
        {view === 'home' && (
          <>
            {/* Show slider & circular categories only on the main page with no filters */}
            {selectedCategoryFilter === 'all' && !searchFilter && (
              <>
                <HeroSlider onAction={handleNavigate} />
                <TrustBar />
                <Categories onSelectCategory={handleNavigate} />
              </>
            )}

            {/* If a category is selected or searched, show a heading filter */}
            {(selectedCategoryFilter !== 'all' || searchFilter) && (
              <div className="container" style={styles.filterHeader}>
                <h2 style={styles.filterTitle}>
                  {searchFilter 
                    ? `Search Results for "${searchFilter}"` 
                    : CATEGORIES.find(c => c.id === selectedCategoryFilter)?.name}
                </h2>
                <button onClick={() => handleNavigate('home')} style={styles.clearFilterBtn}>
                  Clear Filters ✕
                </button>
              </div>
            )}

            {/* Render items by shelves */}
            {selectedCategoryFilter === 'all' && !searchFilter ? (
              <>
                <ProductSection 
                  title="Our Most Popular Products"
                  products={PRODUCT_CATALOG.filter(p => p.tag === 'POPULAR' || p.tag === 'BESTSELLER')}
                  onSelectProduct={handleSelectProduct}
                  onToggleFav={handleToggleFav}
                  favorites={favorites}
                />
                
                <ProductSection 
                  title="Trending Business Prints"
                  products={PRODUCT_CATALOG.filter(p => p.tag === 'NEW' || p.category === 'visiting-cards')}
                  onSelectProduct={handleSelectProduct}
                  onToggleFav={handleToggleFav}
                  favorites={favorites}
                />

                <ProductSection 
                  title="Labels, Stickers & Custom Packaging"
                  products={PRODUCT_CATALOG.filter(p => p.category === 'labels-packaging')}
                  onSelectProduct={handleSelectProduct}
                  onToggleFav={handleToggleFav}
                  favorites={favorites}
                />
              </>
            ) : (
              // Filtered list
              <ProductSection 
                title={`${filteredProducts.length} Items Available`}
                products={filteredProducts}
                onSelectProduct={handleSelectProduct}
                onToggleFav={handleToggleFav}
                favorites={favorites}
              />
            )}
          </>
        )}

        {/* Live Customizer Studio */}
        {view === 'customizer' && selectedProduct && (
          <Customizer 
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onGoBack={() => setViewWithHistory('home')}
          />
        )}

        {/* Secure Checkout Form */}
        {view === 'checkout' && (
          <Checkout 
            cartItems={cart}
            grandTotal={checkoutPriceBreakup.total}
            promoDiscount={checkoutPriceBreakup.discount}
            onOrderSuccess={handleOrderSuccess}
            onGoBack={() => setViewWithHistory('home')}
            user={user}
          />
        )}

        {/* Order Success Summary screen */}
        {view === 'success' && orderReceipt && (
          <div className="container animate-fade-in" style={styles.successScreen}>
            <div style={styles.successCard}>
              <span style={styles.successIcon}>🎉</span>
              <h1 style={styles.successTitle}>Order Placed Successfully!</h1>
              <p style={styles.successMessage}>
                Thank you for your order, <strong>{orderReceipt.shippingName}</strong>. InfiStyle has received your design and started the high-quality printing process!
              </p>
              
              <div style={styles.receiptBox}>
                <div style={styles.receiptRow}>
                  <span>Order Receipt ID:</span>
                  <strong>{orderReceipt.orderId}</strong>
                </div>
                <div style={styles.receiptRow}>
                  <span>Total Payable:</span>
                  <strong>₹{orderReceipt.payable}</strong>
                </div>
                <div style={styles.receiptRow}>
                  <span>Items:</span>
                  <strong>{orderReceipt.itemsCount} Customized Templates</strong>
                </div>
                <div style={styles.receiptRow}>
                  <span>Delivery Destination:</span>
                  <span style={{textAlign: 'right', maxWidth: '60%'}}>{orderReceipt.shippingAddress}</span>
                </div>
              </div>

              {/* Interactive Printing Tracker Simulator */}
              <div style={styles.trackerContainer}>
                <h3 style={styles.trackerTitle}>Live Printing Queue Status</h3>
                <div style={styles.trackerSteps}>
                  {[
                    { label: 'Received', icon: '📥', step: 1 },
                    { label: 'Proofed', icon: '🔍', step: 2 },
                    { label: 'Printing', icon: '🖨️', step: 3 },
                    { label: 'QC Audit', icon: '✨', step: 4 },
                    { label: 'Shipped', icon: '🚚', step: 5 }
                  ].map((s) => {
                    const isActive = printingStep >= s.step;
                    const isCurrent = printingStep === s.step;
                    return (
                      <div key={s.step} style={styles.trackerStep}>
                        <div 
                          style={{
                            ...styles.trackerIconWrapper,
                            backgroundColor: isActive ? 'var(--color-secondary)' : '#e4e5e9',
                            color: isActive ? '#ffffff' : 'var(--color-text-muted)',
                            boxShadow: isCurrent ? '0 0 12px rgba(12, 114, 169, 0.4)' : 'none',
                            transform: isCurrent ? 'scale(1.15)' : 'scale(1)'
                          }}
                          className={isCurrent ? 'animate-pulse' : ''}
                        >
                          {s.icon}
                        </div>
                        <span 
                          style={{
                            ...styles.trackerLabel,
                            fontWeight: isCurrent ? '700' : '400',
                            color: isActive ? 'var(--color-text-dark)' : 'var(--color-text-muted)'
                          }}
                        >
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Progress status note */}
                <p style={styles.statusNote}>
                  {printingStep === 1 && '📥 Your custom layout is locked and saved.'}
                  {printingStep === 2 && '🔍 Pre-flight files checked and approved by proofers.'}
                  {printingStep === 3 && '🖨️ Designing layers on modern digital inkjet press...'}
                  {printingStep === 4 && '✨ Scanning print density and checking edge cuts...'}
                  {printingStep === 5 && '🚚 Package handed over to courier service. Shipped!'}
                </p>
              </div>

              <p style={styles.satisfactionFooter}>
                🛡️ Backed by Cimpress 100% Satisfaction Guarantee. 
              </p>

              <button className="btn btn-secondary" onClick={() => setViewWithHistory('home')} style={{marginTop: '20px'}}>
                Return to Shop Home Page
              </button>
            </div>
          </div>
        )}

        {/* Favorites Page */}
        {view === 'favorites' && (
          <div className="container animate-fade-in" style={{padding: '40px 0'}}>
            <h1 style={styles.pageHeaderTitle}>Your Favorites ❤️</h1>
            <div style={styles.sectionDivider}></div>
            {favorites.length === 0 ? (
              <div style={styles.emptyMsg}>
                <span style={{fontSize: '48px'}}>🤍</span>
                <p>You haven't bookmarked any print designs yet.</p>
                <button className="btn btn-primary" onClick={() => setViewWithHistory('home')} style={{marginTop: '16px'}}>
                  Browse Bestsellers
                </button>
              </div>
            ) : (
              <div style={{marginTop: '32px'}}>
                <ProductSection 
                  title="Saved Items"
                  products={PRODUCT_CATALOG.filter(p => favorites.includes(p.id))}
                  onSelectProduct={handleSelectProduct}
                  onToggleFav={handleToggleFav}
                  favorites={favorites}
                />
              </div>
            )}
          </div>
        )}

        {/* Account Dashboard Page */}
        {view === 'account' && (
          !isLoggedIn ? (
            <div className="container animate-fade-in" style={styles.loginContainer}>
              <div style={styles.loginCard} className="glass-panel">
                
                {/* 1. Sign In credentials form & Social buttons */}
                {loginStep === 'credentials' && (
                  <div style={{ width: '100%', textAlign: 'left' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-text-dark)', marginBottom: '8px', lineHeight: '1.2', letterSpacing: '-0.5px' }}>
                      Three great brands. One account.
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.5', marginBottom: '24px' }}>
                      Sign in to <strong>InfiStyle</strong>, <strong>InfiCreate</strong>, or <strong>99designs by Infi</strong> and we’ll sync your accounts. If you have multiple accounts, including InfiStyle, sign in with your InfiStyle account.
                    </p>

                    {/* Social Buttons Stacked */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                      <button 
                        type="button"
                        onClick={() => handleSocialLogin('Google')}
                        className="google-btn social-btn"
                        style={styles.socialBtn}
                      >
                        <svg style={styles.socialIcon} viewBox="0 0 24 24">
                          <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.57 15.02 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.78 2.93c.9-2.7 3.41-4.45 6.83-4.45z"/>
                          <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.99 3.7-8.62z"/>
                          <path fill="#FBBC05" d="M5.17 10.49c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.39 7.56c-.89 1.77-1.39 3.77-1.39 5.88s.5 4.11 1.39 5.88l3.78-2.93c-.24-.72-.38-1.49-.38-2.29z"/>
                          <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.73-2.89c-1.03.69-2.35 1.1-4.23 1.1-3.42 0-5.93-1.75-6.83-4.45l-3.78 2.93C3.37 20.33 7.35 23 12 23z"/>
                        </svg>
                        <span>Continue with Google</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => handleSocialLogin('Facebook')}
                        className="facebook-btn social-btn"
                        style={{ ...styles.socialBtn, border: '1.5px solid #1877f2', color: '#1877f2' }}
                      >
                        <svg style={styles.socialIcon} viewBox="0 0 24 24" fill="#1877f2">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span>Continue with Facebook</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => handleSocialLogin('Apple')}
                        className="apple-btn social-btn"
                        style={{ ...styles.socialBtn, border: '1.5px solid #000000', color: '#000000' }}
                      >
                        <svg style={styles.socialIcon} viewBox="0 0 24 24" fill="#000000">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z"/>
                        </svg>
                        <span>Continue with Apple</span>
                      </button>
                    </div>

                    <div style={{ ...styles.loginDivider, margin: '24px 0 16px' }}>
                      <span style={{ ...styles.loginDividerText, fontSize: '13px', color: 'var(--color-text-dark)', fontWeight: '700' }}>
                        Or, sign in with email.
                      </span>
                    </div>

                    <form onSubmit={handleCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={styles.formGroup}>
                        <input 
                          type="email" 
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="Email address"
                          className="loginFormInput"
                          style={styles.loginFormInput}
                          required
                        />
                      </div>

                      <div style={{ ...styles.formGroup, position: 'relative' }}>
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Password"
                          className="loginFormInput"
                          style={styles.loginFormInput}
                          required
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          style={styles.eyeBtn}
                          title={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>

                      <a href="#forgot" style={{ fontSize: '13px', color: 'var(--color-text-dark)', textDecoration: 'underline', fontWeight: '600', alignSelf: 'flex-start' }}>
                        Forgot password?
                      </a>

                      <p style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', lineHeight: '1.4', margin: '8px 0' }}>
                        By signing in, you have read and agree to our <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>InfiStyle Account Terms</span> and <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Privacy and Cookie Policy</span>. By clicking on the 'Sign in' button, you authorize us (Cimpress India Pvt Ltd) and its representatives to contact you through Call, Email, SMS, or WhatsApp for transactional, promotional and/or commercial purposes. This consent overrides your registration under DNC/NDNC.
                      </p>

                      {loginError && (
                        <div style={{ color: 'var(--color-error)', fontSize: '12px', fontWeight: '600' }}>
                          ⚠ {loginError}
                        </div>
                      )}

                      <button 
                        type="submit" 
                        className="btn btn-secondary" 
                        style={{
                          ...styles.vistaprintSubmitBtn,
                          backgroundColor: (loginEmail.trim().includes('@') && loginPassword.trim().length >= 6) ? 'var(--color-primary)' : '#e4e5e9',
                          color: (loginEmail.trim().includes('@') && loginPassword.trim().length >= 6) ? '#ffffff' : '#a6b0c3',
                          cursor: (loginEmail.trim().includes('@') && loginPassword.trim().length >= 6) ? 'pointer' : 'not-allowed'
                        }}
                        disabled={!(loginEmail.trim().includes('@') && loginPassword.trim().length >= 6)}
                      >
                        Sign in
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0', fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                        or
                      </div>

                      <button 
                        type="button"
                        onClick={handleCreateAccountTrigger}
                        className="btn btn-outline"
                        style={styles.vistaprintCreateBtn}
                      >
                        Create an account
                      </button>
                    </form>
                  </div>
                )}

                {/* 2. 2-Step OTP Verification Step */}
                {loginStep === 'otp' && (
                  <div style={{ width: '100%', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                      <svg style={{ width: '32px', height: '32px' }} viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                      </svg>
                    </div>
                    <h2 style={{ ...styles.loginTitle, textAlign: 'center', margin: '0 0 4px 0' }}>2-Step Verification</h2>
                    <p style={{ ...styles.loginSubtitle, textAlign: 'center', margin: '0 0 24px 0' }}>
                      A text message with a 6-digit verification code was sent to <strong>+91 {loginPhone}</strong>.
                    </p>

                    {loginNotification && (
                      <div className="notificationBanner" style={styles.notificationBanner}>
                        <span style={{ marginRight: '8px', fontSize: '16px' }}>✉️</span>
                        <span>{loginNotification}</span>
                      </div>
                    )}

                    {isLoggingIn ? (
                      <div style={styles.loadingBox}>
                        <div className="loading-spinner" style={styles.spinner}></div>
                        <h3 style={styles.loadingText}>Verifying code...</h3>
                      </div>
                    ) : (
                      <form onSubmit={handleOtpVerify} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Enter 6-digit code</label>
                          <input 
                            type="text" 
                            maxLength="6"
                            value={loginOtp}
                            onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="G-123456"
                            className="loginFormInput"
                            style={styles.loginFormInput}
                            required
                          />
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                            (For testing, you can use code: <strong>{generatedOtp || '123456'}</strong>)
                          </span>
                        </div>

                        {loginError && (
                          <div style={{ color: 'var(--color-error)', fontSize: '12px', fontWeight: '600' }}>
                            ⚠ {loginError}
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                          <button 
                            type="button" 
                            onClick={() => { setLoginStep('credentials'); setLoginNotification(''); }} 
                            className="btn btn-outline" 
                            style={{ flex: 1, padding: '10px' }}
                          >
                            Back
                          </button>
                          
                          <button 
                            type="submit" 
                            className="btn btn-secondary" 
                            style={{ 
                              ...styles.vistaprintSubmitBtn, 
                              flex: 1, 
                              padding: '12px',
                              backgroundColor: loginOtp.length === 6 ? 'var(--color-primary)' : '#e4e5e9',
                              color: loginOtp.length === 6 ? '#ffffff' : '#a6b0c3',
                              cursor: loginOtp.length === 6 ? 'pointer' : 'not-allowed'
                            }}
                            disabled={loginOtp.length !== 6}
                          >
                            Verify
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="container animate-fade-in" style={{padding: '40px 0'}}>
              <h1 style={styles.pageHeaderTitle}>Account Dashboard 👤</h1>
              <div style={styles.sectionDivider}></div>
              
              <div style={styles.accountLayout}>
                {/* Profile card */}
                <div style={styles.profileCard}>
                  <div style={styles.avatar}>{user?.initials || 'JS'}</div>
                  <h3 style={styles.profileName}>{user?.name || 'Jayesh Sharma'}</h3>
                  <span style={styles.profileMail}>{user?.email || 'jayesh@acme.com'}</span>
                  <div style={styles.sectionDivider}></div>
                  <div style={styles.profileDetail}>
                    <span>Customer Level:</span>
                    <strong>{user?.level || 'VIP Corporate'}</strong>
                  </div>
                  <div style={styles.profileDetail}>
                    <span>InfiStyle Wallet:</span>
                    <strong style={{color: 'var(--color-success)'}}>₹{user?.wallet ?? 450}</strong>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-outline" 
                    style={{marginTop: '24px', width: '100%', padding: '12px'}}
                  >
                    Sign Out ➔
                  </button>
                </div>

                {/* Order history list */}
                <div style={styles.historyCard}>
                  <h3 style={styles.historyTitle}>Your Order History</h3>
                  <div style={styles.historyList}>
                    {orderHistory.map(ord => (
                      <div key={ord.id} style={styles.historyItem}>
                        <div style={styles.historyDetails}>
                          <strong>Order {ord.id}</strong>
                          <span style={styles.historyDate}>Date: {ord.date}</span>
                          <span style={styles.historyDesc}>{ord.items}</span>
                        </div>
                        <div style={styles.historySum}>
                          <strong>₹{ord.total}</strong>
                          <span style={{
                            ...styles.historyStatus, 
                            color: ord.status.includes('Delivered') ? 'var(--color-success)' : '#d4620b'
                          }}>
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* 4. Slide-out Cart Sidebar Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* 5. Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

const styles = {
  filterHeader: {
    padding: '30px 0 10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--color-primary)',
  },
  clearFilterBtn: {
    fontSize: '13px',
    color: 'var(--color-error)',
    fontWeight: '600',
    border: '1px solid var(--color-error)',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    transition: 'var(--transition-fast)',
  },
  successScreen: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0 100px',
  },
  successCard: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-md)',
    borderRadius: 'var(--radius-lg)',
    padding: '48px',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  successIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--color-success)',
    marginBottom: '12px',
  },
  successMessage: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  receiptBox: {
    backgroundColor: 'var(--color-light-gray)',
    width: '100%',
    padding: '20px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '24px',
  },
  receiptRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: 'var(--color-text-dark)',
  },
  satisfactionFooter: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    fontWeight: '600',
    marginBottom: '20px',
  },
  pageHeaderTitle: {
    fontSize: '26px',
    fontWeight: '700',
    color: 'var(--color-primary)',
  },
  sectionDivider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '20px 0',
  },
  emptyMsg: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
    textAlign: 'center',
    color: 'var(--color-text-muted)',
  },
  accountLayout: {
    display: 'flex',
    gap: '40px',
    marginTop: '32px',
  },
  profileCard: {
    flex: '1',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '30px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    boxShadow: 'var(--shadow-sm)',
    height: 'fit-content',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary)',
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  profileName: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-primary)',
  },
  profileMail: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    marginBottom: '10px',
  },
  profileDetail: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    fontSize: '13px',
    marginBottom: '8px',
  },
  historyCard: {
    flex: '2',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
  },
  historyTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    marginBottom: '20px',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  historyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: '#ffffff',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    transition: 'var(--transition-fast)',
  },
  historyDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  historyDate: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
  },
  historyDesc: {
    fontSize: '13px',
    color: 'var(--color-text-dark)',
    fontWeight: '500',
  },
  historySum: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  historyStatus: {
    fontSize: '12px',
    fontWeight: '600',
    marginTop: '4px',
  },
  trackerContainer: {
    backgroundColor: 'var(--color-light-gray)',
    width: '100%',
    padding: '24px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    border: '1.5px dashed var(--color-border)',
  },
  trackerTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    alignSelf: 'flex-start',
  },
  trackerSteps: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
    padding: '0 10px',
  },
  trackerStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    zIndex: 2,
  },
  trackerIconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    transition: 'all 0.4s ease',
  },
  trackerLabel: {
    fontSize: '11px',
    transition: 'all 0.4s ease',
  },
  statusNote: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-secondary)',
    textAlign: 'center',
    marginTop: '4px',
  },
  loginContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0 120px',
  },
  loginCard: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-lg)',
    borderRadius: 'var(--radius-lg)',
    padding: '40px',
    maxWidth: '420px',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  loginLogoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  loginLogo: {
    width: '48px',
    height: '36px',
  },
  loginBrandText: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    letterSpacing: '-0.5px',
  },
  loginTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    marginBottom: '8px',
  },
  loginSubtitle: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    marginBottom: '32px',
    lineHeight: '1.5',
  },
  googleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    backgroundColor: '#ffffff',
    color: '#1f1f1f',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-full)',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600',
    width: '100%',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  },
  googleSpinner: {
    width: '18px',
    height: '18px',
    border: '2px solid #f3f3f3',
    borderTop: '2px solid var(--color-secondary)',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  },
  googleIcon: {
    width: '18px',
    height: '18px',
  },
  socialBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1.5px solid var(--color-border)',
    backgroundColor: '#ffffff',
    color: '#1d1d1d',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  socialIcon: {
    width: '18px',
    height: '18px',
    marginRight: '8px',
    display: 'inline-block',
  },
  loginFormInput: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1.5px solid var(--color-border)',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },
  vistaprintSubmitBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '15px',
    border: 'none',
    transition: 'all 0.2s ease',
  },
  vistaprintCreateBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#1d1d1d',
    border: '1.5px solid var(--color-border)',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  notificationBanner: {
    backgroundColor: '#e6f4ea',
    color: '#137333',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '20px',
    border: '1px solid #ceead6',
    display: 'flex',
    alignItems: 'center',
    lineHeight: '1.4',
  },
  loginDivider: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    margin: '30px 0 20px',
  },
  loginDividerText: {
    fontSize: '10px',
    color: 'var(--color-text-muted)',
    letterSpacing: '1.5px',
    fontWeight: '600',
    width: '100%',
    textAlign: 'center',
    position: 'relative',
  },
  loginFooterText: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.4',
  },
  accountChooserList: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    marginBottom: '20px',
  },
  accountListItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px 16px',
    borderBottom: '1px solid var(--color-border)',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  accountItemAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-secondary)',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountItemDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  accountItemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text-dark)',
  },
  accountItemEmail: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
  },
  chooserBackBtn: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    fontWeight: '600',
    alignSelf: 'center',
    padding: '6px 12px',
    transition: 'var(--transition-fast)',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  }
};

export default App;
