import React, { useState, useEffect, useRef } from 'react';

// Bespoke templates for different categories
const PRODUCT_TEMPLATES = {
  'visiting-cards': [
    {
      id: 'vc-blank',
      name: 'Start from Scratch',
      bg: '#ffffff',
      elements: []
    },
    {
      id: 'vc-navy',
      name: 'Corporate Navy Slate',
      bg: '#0f172a',
      elements: [
        { id: 'logo-1', type: 'graphic', content: 'globe', x: 40, y: 40, width: 40, height: 40, rotation: 0, color: '#ffcc00', isLocked: false },
        { id: 'comp-name', type: 'text', content: 'NEXUS INDUSTRIES', x: 95, y: 45, width: 220, height: 30, fontSize: 16, fontFamily: 'Outfit', fontWeight: 'bold', color: '#ffffff', rotation: 0, isLocked: false },
        { id: 'name', type: 'text', content: 'Mansi Shetty', x: 40, y: 120, width: 200, height: 35, fontSize: 24, fontFamily: 'Outfit', fontWeight: 'bold', color: '#ffcc00', rotation: 0, isLocked: false },
        { id: 'title', type: 'text', content: 'Head of Marketing', x: 40, y: 155, width: 200, height: 20, fontSize: 11, fontFamily: 'Outfit', fontWeight: '600', color: '#94a3b8', rotation: 0, isLocked: false },
        { id: 'divider', type: 'shape', content: 'rect-solid', x: 40, y: 190, width: 440, height: 2, rotation: 0, color: 'rgba(255,255,255,0.15)', isLocked: true },
        { id: 'phone', type: 'text', content: '📞 +91 98765 01234', x: 40, y: 210, width: 140, height: 18, fontSize: 10, fontFamily: 'Outfit', color: '#ffffff', rotation: 0, isLocked: false },
        { id: 'email', type: 'text', content: '✉️ mansi.s@nexus.com', x: 200, y: 210, width: 150, height: 18, fontSize: 10, fontFamily: 'Outfit', color: '#ffffff', rotation: 0, isLocked: false },
        { id: 'addr', type: 'text', content: '📍 BKC G-Block, Mumbai - 400051', x: 40, y: 235, width: 300, height: 18, fontSize: 10, fontFamily: 'Outfit', color: '#ffffff', rotation: 0, isLocked: false }
      ]
    },
    {
      id: 'vc-gold',
      name: 'Luxury Royal Gold',
      bg: '#111111',
      elements: [
        { id: 'gold-border', type: 'shape', content: 'rect-border', x: 15, y: 15, width: 490, height: 270, rotation: 0, color: '#d4af37', isLocked: true },
        { id: 'logo-2', type: 'graphic', content: 'shield', x: 240, y: 55, width: 40, height: 40, rotation: 0, color: '#d4af37', isLocked: false },
        { id: 'comp-name', type: 'text', content: 'THE SUPREME CLUB', x: 160, y: 110, width: 200, height: 25, fontSize: 13, fontFamily: 'Cinzel', fontWeight: 'bold', color: '#d4af37', rotation: 0, isLocked: false, align: 'center' },
        { id: 'name', type: 'text', content: 'JAYESH SHARMA', x: 110, y: 155, width: 300, height: 35, fontSize: 20, fontFamily: 'Playfair Display', fontWeight: 'bold', color: '#ffffff', rotation: 0, isLocked: false, align: 'center' },
        { id: 'title', type: 'text', content: 'FOUNDING PARTNER', x: 160, y: 190, width: 200, height: 18, fontSize: 9, fontFamily: 'Outfit', color: '#d4af37', rotation: 0, isLocked: false, align: 'center' },
        { id: 'contact', type: 'text', content: '+91 99999 88888  |  VIP@SUPREME.COM', x: 60, y: 230, width: 400, height: 18, fontSize: 9, fontFamily: 'Outfit', color: '#ffffff', rotation: 0, isLocked: false, align: 'center' }
      ]
    },
    {
      id: 'vc-creative',
      name: 'Creative Studio Split',
      bg: '#fcfaf2',
      elements: [
        { id: 'decor-blob', type: 'graphic', content: 'tech', x: 30, y: 40, width: 180, height: 180, rotation: 12, color: 'rgba(255, 204, 0, 0.2)', isLocked: false },
        { id: 'name', type: 'text', content: 'Arjun Sen', x: 50, y: 80, width: 200, height: 35, fontSize: 24, fontFamily: 'Space Grotesk', fontWeight: 'bold', color: '#111111', rotation: 0, isLocked: false },
        { id: 'title', type: 'text', content: 'Lead Graphic Designer', x: 50, y: 115, width: 200, height: 20, fontSize: 12, fontFamily: 'Space Grotesk', color: '#666666', rotation: 0, isLocked: false },
        { id: 'line', type: 'shape', content: 'rect-solid', x: 50, y: 145, width: 80, height: 3, rotation: 0, color: '#ffcc00', isLocked: false },
        { id: 'comp-name', type: 'text', content: 'STUDIO APEX', x: 310, y: 80, width: 170, height: 25, fontSize: 15, fontFamily: 'Space Grotesk', fontWeight: 'bold', color: '#111111', rotation: 0, isLocked: false },
        { id: 'phone', type: 'text', content: '📱 9876543210', x: 310, y: 130, width: 160, height: 18, fontSize: 10, fontFamily: 'Space Grotesk', color: '#444444', rotation: 0, isLocked: false },
        { id: 'email', type: 'text', content: '✉️ arjun@apex.in', x: 310, y: 155, width: 160, height: 18, fontSize: 10, fontFamily: 'Space Grotesk', color: '#444444', rotation: 0, isLocked: false },
        { id: 'web', type: 'text', content: '🕸️ www.studioapex.in', x: 310, y: 180, width: 160, height: 18, fontSize: 10, fontFamily: 'Space Grotesk', color: '#444444', rotation: 0, isLocked: false }
      ]
    }
  ],
  'stationery': [
    {
      id: 'st-blank',
      name: 'Blank Letterhead',
      bg: '#ffffff',
      elements: []
    },
    {
      id: 'st-corporate',
      name: 'Classic Corporate Letterhead',
      bg: '#ffffff',
      elements: [
        { id: 'top-bar', type: 'shape', content: 'rect-solid', x: 0, y: 0, width: 350, height: 10, rotation: 0, color: '#0f172a', isLocked: true },
        { id: 'logo-1', type: 'graphic', content: 'globe', x: 25, y: 25, width: 24, height: 24, rotation: 0, color: '#0f172a', isLocked: false },
        { id: 'comp-name', type: 'text', content: 'NEXUS INDUSTRIES', x: 55, y: 28, width: 180, height: 20, fontSize: 11, fontFamily: 'Outfit', fontWeight: 'bold', color: '#0f172a', rotation: 0, isLocked: false },
        { id: 'tagline', type: 'text', content: 'Premium Printing Solutions', x: 55, y: 44, width: 180, height: 12, fontSize: 7, fontFamily: 'Outfit', color: '#64748b', rotation: 0, isLocked: false },
        { id: 'contact-details', type: 'text', content: '📞 +91 98765 01234 | ✉️ contact@nexus.com | 📍 Mumbai, India', x: 25, y: 450, width: 300, height: 15, fontSize: 7, fontFamily: 'Outfit', color: '#64748b', rotation: 0, isLocked: false, align: 'center' },
        { id: 'bottom-bar', type: 'shape', content: 'rect-solid', x: 0, y: 470, width: 350, height: 10, rotation: 0, color: '#0f172a', isLocked: true }
      ]
    }
  ],
  'polo-shirts': [
    {
      id: 'ts-blank',
      name: 'Blank Tee Design',
      bg: '#ffffff',
      elements: []
    },
    {
      id: 'ts-badge',
      name: 'Athletic Division Chest Badge',
      bg: '#ffffff',
      elements: [
        { id: 'logo-badge', type: 'graphic', content: 'shield', x: 180, y: 80, width: 40, height: 40, rotation: 0, color: '#ffcc00', isLocked: false },
        { id: 'badge-text', type: 'text', content: 'ATHLETIC DEPT.', x: 100, y: 130, width: 200, height: 20, fontSize: 12, fontFamily: 'Space Grotesk', fontWeight: 'bold', color: '#ffffff', rotation: 0, isLocked: false, align: 'center' },
        { id: 'badge-year', type: 'text', content: 'EST. 2026', x: 150, y: 150, width: 100, height: 15, fontSize: 9, fontFamily: 'Space Grotesk', color: '#94a3b8', rotation: 0, isLocked: false, align: 'center' }
      ]
    }
  ],
  'drinkware': [
    {
      id: 'mug-blank',
      name: 'Blank Mug Canvas',
      bg: '#ffffff',
      elements: []
    },
    {
      id: 'mug-corporate',
      name: 'Classic Corporate Mug',
      bg: '#f8fafc',
      elements: [
        { id: 'logo-mug', type: 'graphic', content: 'globe', x: 175, y: 100, width: 50, height: 50, rotation: 0, color: '#0284c7', isLocked: false },
        { id: 'comp-name-mug', type: 'text', content: 'NEXUS CORP', x: 100, y: 165, width: 200, height: 25, fontSize: 15, fontFamily: 'Outfit', fontWeight: 'bold', color: '#0f172a', rotation: 0, isLocked: false, align: 'center' },
        { id: 'slogan-mug', type: 'text', content: 'Sip with Success', x: 100, y: 195, width: 200, height: 18, fontSize: 9, fontFamily: 'Outfit', color: '#64748b', rotation: 0, isLocked: false, align: 'center' }
      ]
    }
  ]
};

// Preset SVG Graphics Icons
const PRESET_GRAPHICS = {
  globe: (color) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  shield: (color) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  leaf: (color) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.2 1 6.5A11 11 0 0 1 11 20z" />
      <path d="M9 22v-4" />
    </svg>
  ),
  heart: (color) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  bolt: (color) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  medical: (color) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  tech: (color) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
};

const Customizer = ({ product, onAddToCart, onBuyNow, onGoBack }) => {
  // Config defaults based on product type
  const isCard = product.id.toLowerCase().includes('card');
  const isTshirt = product.id.toLowerCase().includes('polo') || product.id.toLowerCase().includes('tshirt') || product.id.toLowerCase().includes('shirt');
  const isDrinkware = product.id.toLowerCase().includes('mug') || product.id.toLowerCase().includes('bottle') || product.id.toLowerCase().includes('sipper') || product.category === 'drinkware';
  const isStationery = product.category === 'stationery';
  const isSticker = product.category === 'labels-packaging';
  const isPen = product.category === 'pens';

  // Multi-step customizer state
  // 'config' (Step 1) | 'templates' (Step 2) | 'editor' (Step 3) | 'orientation' (Step 4)
  const [customizerStep, setCustomizerStep] = useState('config');

  // Specs Config state (Step 1)
  const [corners, setCorners] = useState('standard');
  const [paperFinish, setPaperFinish] = useState('matte');
  const [deliverySpeed, setDeliverySpeed] = useState('standard');
  const [quantity, setQuantity] = useState(isCard ? 100 : isSticker ? 24 : isPen ? 10 : 1);
  const [shirtSize, setShirtSize] = useState('L');
  const [frontPrint, setFrontPrint] = useState(true);
  const [backPrint, setBackPrint] = useState(false);
  const [drinkwareColor, setDrinkwareColor] = useState('white');
  const [inkColor, setInkColor] = useState('black');

  // Editor State (Step 3)
  const [view, setView] = useState('front'); // 'front' | 'back'
  const [activeTab, setActiveTab] = useState('text'); // 'options' | 'text' | 'uploads' | 'graphics' | 'background' | 'template' | 'qrcodes'
  const [activeElementId, setActiveElementId] = useState(null);
  const [canvasElements, setCanvasElements] = useState([]);
  const [backElements, setBackElements] = useState([]);
  const [canvasBgColor, setCanvasBgColor] = useState('#ffffff');
  const [backBgColor, setBackBgColor] = useState('#ffffff');
  const [editorZoom, setEditorZoom] = useState(100);
  const [qrText, setQrText] = useState('https://infistyle.in');

  // Templates Sidebar Filter state (Step 2)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedColorFilter, setSelectedColorFilter] = useState('all');

  // Undo/Redo history
  const [historyStack, setHistoryStack] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Dynamic Google Font Loader
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=Outfit:wght@400;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Space+Grotesk:wght@500;700&family=Inter:wght@400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Fetch templates for current product
  const getProductCategory = () => {
    if (isCard) return 'visiting-cards';
    if (isStationery) return 'stationery';
    if (isTshirt) return 'polo-shirts';
    if (isDrinkware) return 'drinkware';
    return 'visiting-cards'; // default fallback
  };

  const getAvailableTemplates = () => {
    const cat = getProductCategory();
    return PRODUCT_TEMPLATES[cat] || PRODUCT_TEMPLATES['visiting-cards'];
  };

  // Base canvas dims based on category
  const getCanvasDimensions = () => {
    if (isStationery) return { width: 350, height: 490 }; // Portrait Letterhead
    if (isSticker) return { width: 360, height: 360 }; // Square Sticker
    if (isDrinkware) return { width: 380, height: 300 }; // Mug wrap bounds
    if (isPen) return { width: 480, height: 60 }; // Very narrow pen strip
    return { width: 520, height: 300 }; // Standard Card size
  };

  const canvasDims = getCanvasDimensions();

  // Price calculations
  const getBaseUnitPrice = () => {
    if (isCard) {
      if (quantity >= 1000) return 1.20;
      if (quantity >= 500) return 1.40;
      if (quantity >= 250) return 1.60;
      return 2.00;
    } else if (isTshirt) {
      let base = product.price || 320;
      if (quantity >= 50) return base * 0.8;
      if (quantity >= 10) return base * 0.9;
      return base;
    } else if (isDrinkware) {
      return product.price || 350;
    } else if (isPen) {
      return product.price || 150;
    }
    return product.price || 200;
  };

  const getAddonCost = () => {
    let addon = 0;
    if (isCard) {
      if (corners === 'rounded') addon += 0.50;
      if (paperFinish === 'glossy') addon += 0.30;
      if (paperFinish === 'velvet') addon += 0.80;
    } else if (isTshirt) {
      if (shirtSize === 'XXL') addon += 50;
      if (frontPrint) addon += 100;
      if (backPrint) addon += 100;
    }
    return addon;
  };

  const unitPrice = getBaseUnitPrice() + getAddonCost();
  const totalPrice = Math.round(unitPrice * quantity);

  // Generate cart configuration details
  const getCustomConfig = () => {
    // Extract name/company from canvas fields if they exist
    const compText = canvasElements.find(el => el.id === 'comp-name' || el.id?.includes('comp'))?.content || 'InfiStyle Print';
    const nameText = canvasElements.find(el => el.id === 'name' || el.id?.includes('name'))?.content || '';
    
    return {
      companyName: compText,
      fullName: nameText,
      fontFamily: canvasElements.find(el => el.type === 'text')?.fontFamily || 'Outfit',
      themeColor: canvasBgColor,
      corners,
      paperFinish,
      shirtSize,
      frontPrint,
      backPrint,
      quantity,
      unitPrice,
      totalPrice,
      customCanvasLayout: JSON.stringify({
        bg: canvasBgColor,
        backBg: backBgColor,
        front: canvasElements,
        back: backElements
      })
    };
  };

  const handleAddToCart = () => {
    onAddToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      config: getCustomConfig(),
      quantity,
      price: totalPrice
    });
  };

  const handleBuyNow = () => {
    onBuyNow({
      id: product.id,
      name: product.name,
      image: product.image,
      config: getCustomConfig(),
      quantity,
      price: totalPrice
    });
  };

  // Undo / Redo Mechanics
  const recordHistory = (newElements) => {
    const items = JSON.stringify(newElements);
    const updatedStack = historyStack.slice(0, historyIndex + 1);
    setHistoryStack([...updatedStack, items]);
    setHistoryIndex(updatedStack.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      const layers = JSON.parse(historyStack[prevIdx]);
      if (view === 'front') {
        setCanvasElements(layers);
      } else {
        setBackElements(layers);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      const layers = JSON.parse(historyStack[nextIdx]);
      if (view === 'front') {
        setCanvasElements(layers);
      } else {
        setBackElements(layers);
      }
    }
  };

  const updateLayers = (updateFn) => {
    const currentList = view === 'front' ? canvasElements : backElements;
    const nextList = updateFn(currentList);
    if (view === 'front') {
      setCanvasElements(nextList);
    } else {
      setBackElements(nextList);
    }
    recordHistory(nextList);
  };

  // Select a template
  const handleSelectTemplate = (template) => {
    setCanvasBgColor(template.bg || '#ffffff');
    setCanvasElements(JSON.parse(JSON.stringify(template.elements)));
    
    // Back elements template fallback
    const backSide = [
      { id: 'back-logo', type: 'graphic', content: 'globe', x: 235, y: 100, width: 50, height: 50, rotation: 0, color: '#ffcc00', isLocked: false },
      { id: 'back-text', type: 'text', content: template.name === 'Start from Scratch' ? 'DESIGN LAB' : template.elements.find(el => el.id === 'comp-name')?.content || 'Nexus', x: 160, y: 165, width: 200, height: 25, fontSize: 16, fontFamily: 'Outfit', fontWeight: 'bold', color: '#ffcc00', rotation: 0, isLocked: false, align: 'center' }
    ];
    setBackElements(backSide);
    setBackBgColor(template.bg || '#ffffff');

    // Initialize history
    setHistoryStack([JSON.stringify(template.elements)]);
    setHistoryIndex(0);
    
    setCustomizerStep('editor');
  };

  // Draggable Mechanics
  const activeElementRef = useRef(null);

  const handleElementMouseDown = (e, element) => {
    if (element.isLocked) return;
    e.stopPropagation();
    setActiveElementId(element.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const initX = element.x;
    const initY = element.y;

    const handleMouseMove = (moveEvent) => {
      const deltaX = (moveEvent.clientX - startX) * (100 / editorZoom);
      const deltaY = (moveEvent.clientY - startY) * (100 / editorZoom);
      
      updateLayers(prev => prev.map(el => {
        if (el.id === element.id) {
          return {
            ...el,
            x: Math.round(initX + deltaX),
            y: Math.round(initY + deltaY)
          };
        }
        return el;
      }));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Resizing element corner drag
  const handleResizeMouseDown = (e, element) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const initWidth = element.width || 120;
    const initHeight = element.height || 30;
    const initFontSize = element.fontSize || 14;

    const handleMouseMove = (moveEvent) => {
      const deltaX = (moveEvent.clientX - startX) * (100 / editorZoom);
      const deltaY = (moveEvent.clientY - startY) * (100 / editorZoom);

      updateLayers(prev => prev.map(el => {
        if (el.id === element.id) {
          const w = Math.max(30, Math.round(initWidth + deltaX));
          const h = Math.max(15, Math.round(initHeight + deltaY));
          
          // Re-scale font size if it is a text box
          let fSize = el.fontSize;
          if (el.type === 'text') {
            const ratio = w / initWidth;
            fSize = Math.max(8, Math.min(64, Math.round(initFontSize * ratio)));
          }

          return {
            ...el,
            width: w,
            height: h,
            fontSize: fSize
          };
        }
        return el;
      }));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Rotator handle drag
  const handleRotateMouseDown = (e, element) => {
    e.stopPropagation();
    const elementNode = document.getElementById(`canvas-layer-${element.id}`);
    if (!elementNode) return;

    const rect = elementNode.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const handleMouseMove = (moveEvent) => {
      const rad = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX);
      let deg = rad * (180 / Math.PI) - 90; // Align with top handle direction
      if (deg < 0) deg += 360;

      updateLayers(prev => prev.map(el => {
        if (el.id === element.id) {
          return {
            ...el,
            rotation: Math.round(deg)
          };
        }
        return el;
      }));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Quick Layer manipulations
  const handleDeleteElement = (id) => {
    updateLayers(prev => prev.filter(el => el.id !== id));
    if (activeElementId === id) setActiveElementId(null);
  };

  const handleDuplicateElement = (element) => {
    const newEl = {
      ...JSON.parse(JSON.stringify(element)),
      id: 'el-' + Math.random().toString(36).substr(2, 9),
      x: element.x + 20,
      y: element.y + 20,
      isLocked: false
    };
    updateLayers(prev => [...prev, newEl]);
    setActiveElementId(newEl.id);
  };

  const handleToggleLock = (id) => {
    updateLayers(prev => prev.map(el => {
      if (el.id === id) {
        return { ...el, isLocked: !el.isLocked };
      }
      return el;
    }));
  };

  // Canvas insertions (Step 3 panels)
  const handleAddText = () => {
    const newText = {
      id: 'el-text-' + Date.now(),
      type: 'text',
      content: 'New Text Field',
      x: Math.round(canvasDims.width / 2 - 75),
      y: Math.round(canvasDims.height / 2 - 15),
      width: 150,
      height: 30,
      fontSize: 14,
      fontFamily: 'Outfit',
      color: '#111111',
      rotation: 0,
      isLocked: false
    };
    updateLayers(prev => [...prev, newText]);
    setActiveElementId(newText.id);
  };

  const handleAddShape = (shapeType) => {
    const newShape = {
      id: 'el-shape-' + Date.now(),
      type: 'shape',
      content: shapeType, // 'rect-solid' | 'circle-solid' | 'triangle-solid'
      x: Math.round(canvasDims.width / 2 - 40),
      y: Math.round(canvasDims.height / 2 - 40),
      width: 80,
      height: 80,
      rotation: 0,
      color: '#ffcc00',
      isLocked: false
    };
    updateLayers(prev => [...prev, newShape]);
    setActiveElementId(newShape.id);
  };

  const handleAddGraphic = (graphicType) => {
    const newGraphic = {
      id: 'el-graphic-' + Date.now(),
      type: 'graphic',
      content: graphicType, // 'globe' | 'shield' | 'leaf' etc.
      x: Math.round(canvasDims.width / 2 - 25),
      y: Math.round(canvasDims.height / 2 - 25),
      width: 50,
      height: 50,
      rotation: 0,
      color: '#0f172a',
      isLocked: false
    };
    updateLayers(prev => [...prev, newGraphic]);
    setActiveElementId(newGraphic.id);
  };

  const handleAddQrCode = () => {
    const newQr = {
      id: 'el-qr-' + Date.now(),
      type: 'qrcode',
      content: qrText,
      x: Math.round(canvasDims.width - 90),
      y: Math.round(canvasDims.height - 90),
      width: 70,
      height: 70,
      rotation: 0,
      isLocked: false
    };
    updateLayers(prev => [...prev, newQr]);
    setActiveElementId(newQr.id);
  };

  const handleImageUploadSimulate = (src) => {
    const newImg = {
      id: 'el-img-' + Date.now(),
      type: 'image',
      content: src,
      x: Math.round(canvasDims.width / 2 - 60),
      y: Math.round(canvasDims.height / 2 - 60),
      width: 120,
      height: 120,
      rotation: 0,
      isLocked: false
    };
    updateLayers(prev => [...prev, newImg]);
    setActiveElementId(newImg.id);
  };

  const activeElement = (view === 'front' ? canvasElements : backElements).find(el => el.id === activeElementId);

  // Filters for templates grid (Step 2)
  const filteredTemplates = getAvailableTemplates().filter(t => {
    // Search keyword query matching name or elements content
    const matchQuery = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.elements.some(e => e.type === 'text' && e.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Background color filtering
    let matchColor = true;
    if (selectedColorFilter !== 'all') {
      const bgHex = t.bg || '#ffffff';
      if (selectedColorFilter === 'dark' && bgHex === '#ffffff') matchColor = false;
      if (selectedColorFilter === 'light' && bgHex !== '#ffffff' && bgHex !== '#fcfaf2') matchColor = false;
    }

    return matchQuery && matchColor;
  });

  return (
    <div style={styles.container}>
      {/* ------------------ STEP 1: SPEC CONFIGURATION ------------------ */}
      {customizerStep === 'config' && (
        <div style={styles.configScreen} className="animate-fade-in">
          <button onClick={onGoBack} style={styles.backButton}>
            ← Back to products
          </button>
          
          <div style={styles.configLayout}>
            {/* Left Col: High-Res Mockup Gallery */}
            <div style={styles.configGalleryCol}>
              <div style={styles.mainMockupFrame}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  style={styles.mainMockupImage} 
                />
                <span style={styles.badgePremium}>PREMIUM PRINT</span>
              </div>
              <div style={styles.thumbnailRow}>
                <div style={{...styles.thumbnail, borderColor: 'var(--color-border)'}}>
                  <img src={product.image} alt="front view" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                </div>
                <div style={styles.thumbnail}>
                  <div style={{fontSize:'11px', color:'#777', textAlign:'center', marginTop:'14px'}}>Back</div>
                </div>
                <div style={styles.thumbnail}>
                  <div style={{fontSize:'11px', color:'#777', textAlign:'center', marginTop:'14px'}}>3D Card</div>
                </div>
              </div>
            </div>

            {/* Right Col: Configure Attributes */}
            <div style={styles.configFormCol}>
              <h1 style={styles.titleText}>{product.name}</h1>
              <div style={styles.ratingRow}>
                <span style={{color: '#ffcc00'}}>★★★★★</span>
                <span style={{fontSize: '13px', color: '#666', marginLeft: '6px'}}>(1,438 reviews)</span>
              </div>
              
              <p style={styles.productDesc}>
                Personalized {product.name} with a cohesive professional look. Choose standard formats or customize corner finishes, premium cardstocks, and bulk orders directly.
              </p>

              <div style={styles.specsDivider}></div>

              {/* Specific Options - Corners */}
              {isCard && (
                <div style={styles.formSection}>
                  <label style={styles.sectionLabel}>Corners</label>
                  <div style={styles.optionCardsGrid}>
                    <div 
                      onClick={() => setCorners('standard')}
                      style={{...styles.optionSelectCard, borderColor: corners === 'standard' ? 'var(--color-border)' : '#e2e8f0', backgroundColor: corners === 'standard' ? '#fffdf5' : '#ffffff'}}
                    >
                      <div style={styles.cornerStandardIcon}></div>
                      <div style={styles.cardInfo}>
                        <div style={styles.cardNameTitle}>Standard</div>
                        <div style={styles.cardPriceLabel}>Included</div>
                      </div>
                    </div>
                    <div 
                      onClick={() => setCorners('rounded')}
                      style={{...styles.optionSelectCard, borderColor: corners === 'rounded' ? 'var(--color-border)' : '#e2e8f0', backgroundColor: corners === 'rounded' ? '#fffdf5' : '#ffffff'}}
                    >
                      <div style={styles.cornerRoundedIcon}></div>
                      <div style={styles.cardInfo}>
                        <div style={styles.cardNameTitle}>Rounded</div>
                        <div style={styles.cardPriceLabel}>+₹0.50 / unit</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Specific Options - Sizes (Clothing) */}
              {isTshirt && (
                <div style={styles.formSection}>
                  <label style={styles.sectionLabel}>Size Selection</label>
                  <div style={styles.btnGridRow}>
                    {['S', 'M', 'L', 'XL', 'XXL'].map(sz => (
                      <button 
                        key={sz}
                        onClick={() => setShirtSize(sz)}
                        style={{
                          ...styles.specBadgeBtn, 
                          backgroundColor: shirtSize === sz ? '#ffcc00' : '#ffffff',
                          borderColor: shirtSize === sz ? '#ffcc00' : '#cbd5e1',
                          color: '#111111',
                          fontWeight: shirtSize === sz ? '700' : '400'
                        }}
                      >
                        {sz} {sz === 'XXL' && '(+₹50)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specific Options - Materials */}
              {isCard && (
                <div style={styles.formSection}>
                  <label style={styles.sectionLabel}>Paper Finish</label>
                  <select 
                    value={paperFinish}
                    onChange={(e) => setPaperFinish(e.target.value)}
                    style={styles.selectSpecs}
                  >
                    <option value="matte">Matte (Smooth & Anti-Glare)</option>
                    <option value="glossy">Glossy (Highly Reflective +₹0.30)</option>
                    <option value="velvet">Velvet Touch (Soft-Feel +₹0.80)</option>
                  </select>
                </div>
              )}

              {/* Specific Options - Ink Colors (Stamps) */}
              {product.category === 'stamps-ink' && (
                <div style={styles.formSection}>
                  <label style={styles.sectionLabel}>Ink color</label>
                  <div style={styles.btnGridRow}>
                    {['black', 'blue', 'red'].map(col => (
                      <button 
                        key={col}
                        onClick={() => setInkColor(col)}
                        style={{
                          ...styles.specBadgeBtn,
                          backgroundColor: inkColor === col ? '#ffcc00' : '#ffffff',
                          borderColor: inkColor === col ? '#ffcc00' : '#cbd5e1'
                        }}
                      >
                        {col.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specific Options - Quantity Selection */}
              <div style={styles.formSection}>
                <label style={styles.sectionLabel}>Select Quantity</label>
                {isCard ? (
                  <select 
                    value={quantity} 
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    style={styles.selectSpecs}
                  >
                    <option value="100">100 units (₹{(2.00 + getAddonCost()).toFixed(2)} / card)</option>
                    <option value="250">250 units (₹{(1.60 + getAddonCost()).toFixed(2)} / card) - Save 20%</option>
                    <option value="500">500 units (₹{(1.40 + getAddonCost()).toFixed(2)} / card) - Save 30%</option>
                    <option value="1000">1000 units (₹{(1.20 + getAddonCost()).toFixed(2)} / card) - Save 40%</option>
                  </select>
                ) : isSticker ? (
                  <select 
                    value={quantity} 
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    style={styles.selectSpecs}
                  >
                    <option value="24">24 units</option>
                    <option value="50">50 units</option>
                    <option value="100">100 units</option>
                  </select>
                ) : isPen ? (
                  <select 
                    value={quantity} 
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    style={styles.selectSpecs}
                  >
                    <option value="10">10 units</option>
                    <option value="50">50 units</option>
                    <option value="100">100 units</option>
                  </select>
                ) : (
                  <div style={styles.qtyRowInput}>
                    <input 
                      type="number" 
                      min="1" 
                      max="200" 
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      style={styles.numberInputSpec}
                    />
                    <span style={{fontSize: '12px', color: '#666'}}>pieces</span>
                  </div>
                )}
              </div>

              {/* Main Customization CTA Triggers */}
              <div style={styles.ctaCardButtonGroup}>
                <button 
                  onClick={() => setCustomizerStep('templates')}
                  style={styles.browseDesignsBtn}
                >
                  Browse designs 🎨
                </button>
                <button 
                  onClick={() => {
                    const empty = { bg: '#ffffff', name: 'Blank Template', elements: [] };
                    handleSelectTemplate(empty);
                  }}
                  style={styles.uploadDesignBtn}
                >
                  Upload design / Start Blank 📤
                </button>
              </div>

              {/* Total calculations display */}
              <div style={styles.priceStrip}>
                <span style={{fontSize: '13px', color: '#555'}}>Estimated Total:</span>
                <span style={{fontSize: '24px', fontWeight: '800', color: 'var(--color-primary)'}}>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Explore popular templates gallery grid (Step 1 Bottom) */}
          <div style={styles.exploreTemplatesBlock}>
            <h3 style={styles.exploreHeading}>Explore most popular templates</h3>
            <div style={styles.popularTemplatesGrid}>
              {getAvailableTemplates().slice(1, 4).map(temp => (
                <div 
                  key={temp.id} 
                  onClick={() => handleSelectTemplate(temp)}
                  style={styles.popularTemplateCard}
                >
                  <div style={{...styles.miniTemplatePreview, backgroundColor: temp.bg || '#ffffff'}}>
                    {temp.elements.map(el => (
                      <div 
                        key={el.id}
                        style={{
                          position: 'absolute',
                          left: `${(el.x / 520) * 100}%`,
                          top: `${(el.y / 300) * 100}%`,
                          width: `${(el.width / 520) * 100}%`,
                          height: `${(el.height / 300) * 100}%`,
                          fontSize: '3px',
                          color: el.color || '#333',
                          fontWeight: el.fontWeight || 'normal',
                          lineHeight: '1'
                        }}
                      >
                        {el.type === 'text' ? el.content.substring(0, 10) : '◼'}
                      </div>
                    ))}
                  </div>
                  <div style={styles.popularTemplateMeta}>
                    <span style={{fontWeight: '600', fontSize: '13px'}}>{temp.name}</span>
                    <span style={{fontSize: '11px', color: '#ffcc00'}}>★ 4.8</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------ STEP 2: TEMPLATE GALLERY BROWSER ------------------ */}
      {customizerStep === 'templates' && (
        <div style={styles.templatesScreen} className="animate-fade-in">
          <div style={styles.templatesHeader}>
            <div>
              <button 
                onClick={() => setCustomizerStep('config')}
                style={styles.backLinkSmall}
              >
                ← Back to product options
              </button>
              <h2 style={{fontSize: '28px', fontWeight: '800', marginTop: '8px'}}>{product.name} Designs & Templates</h2>
            </div>
            <div style={styles.searchBarBox}>
              <input 
                type="text" 
                placeholder="Search templates (e.g. corporate, modern)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchTemplatesInput}
              />
            </div>
          </div>

          <div style={styles.templatesLayout}>
            {/* Left Sidebar Filter panel */}
            <div style={styles.templatesSidebar}>
              <h4 style={styles.sidebarSectionTitle}>Filter By</h4>
              
              <div style={styles.filterSection}>
                <label style={styles.filterLabel}>Design Colour</label>
                <select 
                  value={selectedColorFilter}
                  onChange={(e) => setSelectedColorFilter(e.target.value)}
                  style={styles.selectFilter}
                >
                  <option value="all">All Colours</option>
                  <option value="dark">Dark Backgrounds</option>
                  <option value="light">Light Backgrounds</option>
                </select>
              </div>

              <div style={styles.filterSection}>
                <label style={styles.filterLabel}>Industry / Theme</label>
                <select 
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  style={styles.selectFilter}
                >
                  <option value="all">All Industries</option>
                  <option value="corporate">Corporate</option>
                  <option value="creative">Creative / Arts</option>
                  <option value="medical">Medical / Health</option>
                  <option value="luxury">Luxury / VIP</option>
                </select>
              </div>

              <div style={styles.helpPromoBox}>
                <div style={{fontWeight: '700', fontSize: '14px', marginBottom: '6px'}}>Need design help?</div>
                <div style={{fontSize: '11px', color: '#555', marginBottom: '12px'}}>Work with an InfiStyle designer to create a layout from scratch.</div>
                <button style={styles.promoContactBtn}>Contact Designer</button>
              </div>
            </div>

            {/* Right grid gallery list */}
            <div style={styles.templatesGalleryGridCol}>
              <div style={styles.templatesGrid}>
                {/* Upload your own / Blank layout card */}
                <div 
                  onClick={() => {
                    const empty = { bg: '#ffffff', name: 'Blank Template', elements: [] };
                    handleSelectTemplate(empty);
                  }}
                  style={{...styles.templateGalleryCard, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', border: '2px dashed var(--color-border)'}}
                >
                  <span style={{fontSize: '36px'}}>📤</span>
                  <span style={{fontWeight: '700', fontSize: '14px', marginTop: '12px'}}>Upload your design</span>
                  <span style={{fontSize: '11px', color: '#666', marginTop: '4px'}}>Start with a blank canvas</span>
                </div>

                {filteredTemplates.map(temp => (
                  <div 
                    key={temp.id}
                    onClick={() => handleSelectTemplate(temp)}
                    style={styles.templateGalleryCard}
                  >
                    <div style={{...styles.templateGalleryPreviewFrame, backgroundColor: temp.bg || '#ffffff'}}>
                      {temp.elements.map(el => (
                        <div 
                          key={el.id}
                          style={{
                            position: 'absolute',
                            left: `${(el.x / 520) * 100}%`,
                            top: `${(el.y / 300) * 100}%`,
                            width: `${(el.width / 520) * 100}%`,
                            height: `${(el.height / 300) * 100}%`,
                            fontSize: '4px',
                            color: el.color || '#333',
                            fontWeight: el.fontWeight || 'normal',
                            fontFamily: el.fontFamily || 'sans-serif',
                            lineHeight: '1',
                            overflow: 'hidden'
                          }}
                        >
                          {el.type === 'text' ? el.content.substring(0, 15) : el.type === 'graphic' ? '★' : '■'}
                        </div>
                      ))}
                    </div>
                    <div style={styles.templateGalleryCardInfo}>
                      <span style={{fontWeight: '700', fontSize: '13px'}}>{temp.name}</span>
                      <div style={styles.colorPaletteIndicators}>
                        <div style={{...styles.paletteDot, backgroundColor: temp.bg || '#ffffff'}}></div>
                        <div style={{...styles.paletteDot, backgroundColor: temp.elements[0]?.color || '#ffcc00'}}></div>
                        <div style={{...styles.paletteDot, backgroundColor: temp.elements[1]?.color || '#0f172a'}}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ STEP 3: STUDIO EDITOR WORKSPACE ------------------ */}
      {customizerStep === 'editor' && (
        <div style={styles.editorScreen} className="animate-fade-in">
          {/* Top Figma/Canva-Style Header Bar */}
          <div style={styles.editorTopBar}>
            <div style={styles.editorHeaderLeft}>
              <span style={styles.brandIcon}>⬡</span>
              <span style={styles.activeFileName}>InfiStyle Studio - {product.name}</span>
              <div style={styles.undoRedoGroup}>
                <button onClick={handleUndo} disabled={historyIndex <= 0} style={styles.historyBtn} title="Undo">↶</button>
                <button onClick={handleRedo} disabled={historyIndex >= historyStack.length - 1} style={styles.historyBtn} title="Redo">↷</button>
              </div>
            </div>
            <div style={styles.editorHeaderRight}>
              <div style={styles.priceBanner}>₹{totalPrice}</div>
              <button 
                onClick={() => setCustomizerStep('orientation')}
                style={styles.previewApproveBtn}
              >
                Next (Preview Mockup) →
              </button>
            </div>
          </div>

          <div style={styles.editorWorkspaceLayout}>
            {/* Left Toolbar panel */}
            <div style={styles.editorSidebarTabs}>
              <div 
                onClick={() => setActiveTab('options')}
                style={{...styles.sidebarTabBtn, backgroundColor: activeTab === 'options' ? '#ffffff' : 'transparent', borderLeft: activeTab === 'options' ? '3px solid var(--color-border)' : '3px solid transparent'}}
              >
                <span style={styles.tabIcon}>⚙️</span>
                <span style={styles.tabLabel}>Options</span>
              </div>
              <div 
                onClick={() => setActiveTab('text')}
                style={{...styles.sidebarTabBtn, backgroundColor: activeTab === 'text' ? '#ffffff' : 'transparent', borderLeft: activeTab === 'text' ? '3px solid var(--color-border)' : '3px solid transparent'}}
              >
                <span style={styles.tabIcon}>T</span>
                <span style={styles.tabLabel}>Text</span>
              </div>
              <div 
                onClick={() => setActiveTab('uploads')}
                style={{...styles.sidebarTabBtn, backgroundColor: activeTab === 'uploads' ? '#ffffff' : 'transparent', borderLeft: activeTab === 'uploads' ? '3px solid var(--color-border)' : '3px solid transparent'}}
              >
                <span style={styles.tabIcon}>📤</span>
                <span style={styles.tabLabel}>Uploads</span>
              </div>
              <div 
                onClick={() => setActiveTab('graphics')}
                style={{...styles.sidebarTabBtn, backgroundColor: activeTab === 'graphics' ? '#ffffff' : 'transparent', borderLeft: activeTab === 'graphics' ? '3px solid var(--color-border)' : '3px solid transparent'}}
              >
                <span style={styles.tabIcon}>▲</span>
                <span style={styles.tabLabel}>Graphics</span>
              </div>
              <div 
                onClick={() => setActiveTab('background')}
                style={{...styles.sidebarTabBtn, backgroundColor: activeTab === 'background' ? '#ffffff' : 'transparent', borderLeft: activeTab === 'background' ? '3px solid var(--color-border)' : '3px solid transparent'}}
              >
                <span style={styles.tabIcon}>🎨</span>
                <span style={styles.tabLabel}>Background</span>
              </div>
              <div 
                onClick={() => setActiveTab('qrcodes')}
                style={{...styles.sidebarTabBtn, backgroundColor: activeTab === 'qrcodes' ? '#ffffff' : 'transparent', borderLeft: activeTab === 'qrcodes' ? '3px solid var(--color-border)' : '3px solid transparent'}}
              >
                <span style={styles.tabIcon}>🏁</span>
                <span style={styles.tabLabel}>QR Codes</span>
              </div>
            </div>

            {/* Sidebar Sub-panel options content */}
            <div style={styles.editorPanelContent}>
              {/* Product configuration options tab */}
              {activeTab === 'options' && (
                <div className="animate-fade-in">
                  <h4 style={styles.panelTitle}>Product Settings</h4>
                  <div style={styles.panelGroup}>
                    <label style={styles.panelLabel}>Print Quantity</label>
                    <select 
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      style={styles.selectPanelField}
                    >
                      <option value="100">100 Cards</option>
                      <option value="250">250 Cards</option>
                      <option value="500">500 Cards</option>
                      <option value="1000">1000 Cards</option>
                    </select>
                  </div>
                  {isCard && (
                    <>
                      <div style={styles.panelGroup}>
                        <label style={styles.panelLabel}>Corners</label>
                        <select 
                          value={corners}
                          onChange={(e) => setCorners(e.target.value)}
                          style={styles.selectPanelField}
                        >
                          <option value="standard">Standard Corners</option>
                          <option value="rounded">Rounded Corners (+₹0.50)</option>
                        </select>
                      </div>
                      <div style={styles.panelGroup}>
                        <label style={styles.panelLabel}>Coating Finish</label>
                        <select 
                          value={paperFinish}
                          onChange={(e) => setPaperFinish(e.target.value)}
                          style={styles.selectPanelField}
                        >
                          <option value="matte">Matte</option>
                          <option value="glossy">Glossy</option>
                          <option value="velvet">Velvet Touch</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Text Management tab */}
              {activeTab === 'text' && (
                <div className="animate-fade-in">
                  <h4 style={styles.panelTitle}>Edit Typography</h4>
                  <button onClick={handleAddText} style={styles.addTextBtn}>
                    + New Text Field
                  </button>

                  <div style={styles.panelDivider}></div>

                  {activeElement && activeElement.type === 'text' ? (
                    <div style={styles.layerEditBlock}>
                      <label style={styles.panelLabel}>Text Content</label>
                      <textarea 
                        value={activeElement.content}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateLayers(prev => prev.map(el => el.id === activeElementId ? { ...el, content: val } : el));
                        }}
                        style={styles.textareaField}
                      />

                      <label style={styles.panelLabel}>Font Family</label>
                      <select 
                        value={activeElement.fontFamily}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateLayers(prev => prev.map(el => el.id === activeElementId ? { ...el, fontFamily: val } : el));
                        }}
                        style={styles.selectPanelField}
                      >
                        <option value="Outfit">Outfit</option>
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Cinzel">Cinzel</option>
                        <option value="Space Grotesk">Space Grotesk</option>
                        <option value="Inter">Inter</option>
                      </select>

                      <label style={styles.panelLabel}>Color</label>
                      <input 
                        type="color" 
                        value={activeElement.color}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateLayers(prev => prev.map(el => el.id === activeElementId ? { ...el, color: val } : el));
                        }}
                        style={styles.colorPickerField}
                      />
                    </div>
                  ) : (
                    <div style={styles.emptySelectionMsg}>
                      Click any text element on the canvas to modify its font, color, or alignment properties.
                    </div>
                  )}
                </div>
              )}

              {/* Image Upload simulation tab */}
              {activeTab === 'uploads' && (
                <div className="animate-fade-in">
                  <h4 style={styles.panelTitle}>Add Photos & Logos</h4>
                  <div 
                    onClick={() => handleImageUploadSimulate('https://images.unsplash.com/photo-1557683316-973673baf926?w=200&fit=crop')}
                    style={styles.uploadBoxSimulate}
                  >
                    <span>📁 Click to Upload file</span>
                    <span style={{fontSize: '11px', color: '#666', marginTop:'4px'}}>Supports JPG, PNG, SVG</span>
                  </div>

                  <div style={styles.panelDivider}></div>
                  <label style={styles.panelLabel}>Demo Assets</label>
                  <div style={styles.presetImagesGrid}>
                    <img 
                      src="https://images.unsplash.com/photo-1557683316-973673baf926?w=200&fit=crop" 
                      onClick={() => handleImageUploadSimulate('https://images.unsplash.com/photo-1557683316-973673baf926?w=200&fit=crop')}
                      style={styles.presetImgThumb} 
                      alt="grad"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&fit=crop" 
                      onClick={() => handleImageUploadSimulate('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&fit=crop')}
                      style={styles.presetImgThumb} 
                      alt="abstract"
                    />
                  </div>
                </div>
              )}

              {/* Graphics presets (Shapes/Icons) tab */}
              {activeTab === 'graphics' && (
                <div className="animate-fade-in" style={{maxHeight:'80vh', overflowY:'auto'}}>
                  <h4 style={styles.panelTitle}>Add Vector Graphics</h4>
                  
                  <label style={styles.panelLabel}>Preset Shapes</label>
                  <div style={styles.presetGraphicsGrid}>
                    <button onClick={() => handleAddShape('rect-solid')} style={styles.shapeBtn} title="Rectangle">◼</button>
                    <button onClick={() => handleAddShape('circle-solid')} style={styles.shapeBtn} title="Circle">●</button>
                    <button onClick={() => handleAddShape('triangle-solid')} style={styles.shapeBtn} title="Triangle">▲</button>
                  </div>

                  <label style={styles.panelLabel}>Preset Icons</label>
                  <div style={styles.presetGraphicsGrid}>
                    {Object.keys(PRESET_GRAPHICS).map(key => (
                      <button 
                        key={key} 
                        onClick={() => handleAddGraphic(key)} 
                        style={styles.graphicPresetIconBtn}
                      >
                        {PRESET_GRAPHICS[key]('#111111')}
                      </button>
                    ))}
                  </div>

                  {activeElement && (activeElement.type === 'shape' || activeElement.type === 'graphic') && (
                    <div style={{marginTop: '16px'}}>
                      <label style={styles.panelLabel}>Graphic Color</label>
                      <input 
                        type="color" 
                        value={activeElement.color}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateLayers(prev => prev.map(el => el.id === activeElementId ? { ...el, color: val } : el));
                        }}
                        style={styles.colorPickerField}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Background Color selector tab */}
              {activeTab === 'background' && (
                <div className="animate-fade-in">
                  <h4 style={styles.panelTitle}>Canvas Background</h4>
                  <div style={styles.colorPaletteGrid}>
                    {['#ffffff', '#0f172a', '#111111', '#fcfaf2', '#ffcc00', '#ea580c', '#059669', '#dc2626'].map(col => (
                      <div 
                        key={col}
                        onClick={() => {
                          if (view === 'front') {
                            setCanvasBgColor(col);
                          } else {
                            setBackBgColor(col);
                          }
                        }}
                        style={{
                          ...styles.bgPaletteDot, 
                          backgroundColor: col,
                          borderColor: (view === 'front' ? canvasBgColor : backBgColor) === col ? 'var(--color-border)' : '#cbd5e1'
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              )}

              {/* QR Code generator tab */}
              {activeTab === 'qrcodes' && (
                <div className="animate-fade-in">
                  <h4 style={styles.panelTitle}>Insert QR Code</h4>
                  <label style={styles.panelLabel}>Destination URL</label>
                  <input 
                    type="text" 
                    value={qrText}
                    onChange={(e) => setQrText(e.target.value)}
                    style={styles.textPanelInput}
                  />
                  <button onClick={handleAddQrCode} style={styles.addTextBtn}>
                    Generate & Place QR Code
                  </button>
                </div>
              )}
            </div>

            {/* Core Canvas Workspace panel */}
            <div style={styles.canvasWorkspaceArea}>
              {/* Contextual Editor toolbar above canvas */}
              <div style={styles.contextualToolbar}>
                <button style={styles.toolbarBtn} onClick={() => handleAddText()}>📝 Text</button>
                <button style={styles.toolbarBtn} onClick={() => handleAddShape('rect-solid')}>⬛ Rectangle</button>
                <button style={styles.toolbarBtn} onClick={() => handleAddShape('circle-solid')}>⚫ Circle</button>
                <span style={styles.toolbarDivider}></span>
                <span style={{fontSize: '11px', color: '#666', fontStyle: 'italic'}}>Double-click elements to edit text.</span>
              </div>

              {/* The absolute-positioned canvas viewport */}
              <div 
                style={{
                  ...styles.canvasContainerScale,
                  transform: `scale(${editorZoom / 100})`,
                  width: `${canvasDims.width}px`,
                  height: `${canvasDims.height}px`
                }}
              >
                <div 
                  style={{
                    ...styles.editorCanvas,
                    width: `${canvasDims.width}px`,
                    height: `${canvasDims.height}px`,
                    backgroundColor: view === 'front' ? canvasBgColor : backBgColor
                  }}
                  onClick={() => setActiveElementId(null)}
                >
                  {/* Safety Area guide boundary lines */}
                  <div style={styles.safetyGuideLine}></div>
                  <div style={styles.bleedGuideLine}></div>
                  
                  {/* Layer rendering */}
                  {(view === 'front' ? canvasElements : backElements).map(el => {
                    const isSelected = activeElementId === el.id;
                    
                    return (
                      <div 
                        key={el.id}
                        id={`canvas-layer-${el.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveElementId(el.id);
                        }}
                        onMouseDown={(e) => handleElementMouseDown(e, el)}
                        style={{
                          position: 'absolute',
                          left: `${el.x}px`,
                          top: `${el.y}px`,
                          width: el.width ? `${el.width}px` : 'auto',
                          height: el.height ? `${el.height}px` : 'auto',
                          transform: `rotate(${el.rotation || 0}deg)`,
                          transformOrigin: 'center center',
                          cursor: el.isLocked ? 'not-allowed' : 'move',
                          border: isSelected ? '1px dashed var(--color-border)' : '1px solid transparent',
                          boxSizing: 'border-box',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: el.align === 'center' ? 'center' : 'flex-start'
                        }}
                      >
                        {/* Selected overlay bounding box handles */}
                        {isSelected && !el.isLocked && (
                          <>
                            {/* Rotate handle */}
                            <div 
                              onMouseDown={(e) => handleRotateMouseDown(e, el)}
                              style={styles.rotateHandleAnchor} 
                              title="Drag to Rotate"
                            ></div>
                            {/* Resize handle */}
                            <div 
                              onMouseDown={(e) => handleResizeMouseDown(e, el)}
                              style={styles.resizeHandleAnchor} 
                              title="Drag to Resize"
                            ></div>
                            {/* Duplicate handle */}
                            <div 
                              onClick={(e) => { e.stopPropagation(); handleDuplicateElement(el); }}
                              style={styles.duplicateHandleAnchor} 
                              title="Duplicate layer"
                            >📋</div>
                            {/* Lock handle */}
                            <div 
                              onClick={(e) => { e.stopPropagation(); handleToggleLock(el.id); }}
                              style={styles.lockHandleAnchor} 
                              title="Lock coordinates"
                            >🔓</div>
                            {/* Delete handle */}
                            <div 
                              onClick={(e) => { e.stopPropagation(); handleDeleteElement(el.id); }}
                              style={styles.deleteHandleAnchor} 
                              title="Delete layer"
                            >✕</div>
                          </>
                        )}

                        {/* Render based on layer type */}
                        {el.type === 'text' && (
                          <div 
                            style={{
                              fontSize: `${el.fontSize || 14}px`,
                              fontFamily: el.fontFamily || 'Outfit',
                              color: el.color || '#000000',
                              fontWeight: el.fontWeight || 'normal',
                              width: '100%',
                              height: '100%',
                              textAlign: el.align || 'left',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {el.content}
                          </div>
                        )}

                        {el.type === 'shape' && (
                          <div 
                            style={{
                              width: '100%',
                              height: '100%',
                              backgroundColor: el.content.includes('solid') ? el.color : 'transparent',
                              border: el.content.includes('border') ? `2px solid ${el.color}` : 'none',
                              borderRadius: el.content.includes('circle') ? '50%' : '0%',
                              clipPath: el.content.includes('triangle') ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
                            }}
                          ></div>
                        )}

                        {el.type === 'graphic' && (
                          <div style={{ width: '100%', height: '100%' }}>
                            {PRESET_GRAPHICS[el.content] ? PRESET_GRAPHICS[el.content](el.color) : '★'}
                          </div>
                        )}

                        {el.type === 'image' && (
                          <img 
                            src={el.content} 
                            alt="layer" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        )}

                        {el.type === 'qrcode' && (
                          <div style={styles.qrMockupBox}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" style={{width:'80%', height:'80%'}}>
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <rect x="7" y="7" width="3" height="3" fill="#111111" />
                              <rect x="14" y="7" width="3" height="3" fill="#111111" />
                              <rect x="7" y="14" width="3" height="3" fill="#111111" />
                              <rect x="14" y="14" width="3" height="3" fill="#111111" />
                            </svg>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom workspace action row (Zoom bar, front/back buttons) */}
              <div style={styles.bottomWorkspaceControls}>
                <div style={styles.zoomControlBlock}>
                  <button onClick={() => setEditorZoom(prev => Math.max(50, prev - 10))} style={styles.zoomBtn}>-</button>
                  <span style={{fontSize:'12px', width:'40px', textAlign:'center'}}>{editorZoom}%</span>
                  <button onClick={() => setEditorZoom(prev => Math.min(150, prev + 10))} style={styles.zoomBtn}>+</button>
                </div>

                <div style={styles.pageToggleBlock}>
                  <button 
                    onClick={() => setView('front')}
                    style={{...styles.pageBtnToggle, borderBottom: view === 'front' ? '2.5px solid var(--color-border)' : 'none', fontWeight: view==='front' ? '700' : '400'}}
                  >
                    Front View
                  </button>
                  <button 
                    onClick={() => setView('back')}
                    style={{...styles.pageBtnToggle, borderBottom: view === 'back' ? '2.5px solid var(--color-border)' : 'none', fontWeight: view==='back' ? '700' : '400'}}
                  >
                    Back View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ STEP 4: 3D HAND / ORIENTATION MOCKUP ------------------ */}
      {customizerStep === 'orientation' && (
        <div style={styles.orientationScreen} className="animate-fade-in">
          <div style={styles.orientationLayout}>
            {/* Left: 3D perspective mockup frame */}
            <div style={styles.orientationVisualCol}>
              <h3 style={{fontSize: '18px', fontWeight: '700', marginBottom: '24px', textAlign: 'center'}}>Premium Mockup Representation</h3>
              
              {/* Business card skew mockup */}
              {isCard && (
                <div style={styles.mockupHandFrame}>
                  {/* Outer hand illustration/photo wrap simulated */}
                  <div style={styles.cardThreeDHolder}>
                    <div 
                      style={{
                        ...styles.cardThreeDBody,
                        backgroundColor: view === 'front' ? canvasBgColor : backBgColor,
                        borderRadius: corners === 'rounded' ? '18px' : '4px'
                      }}
                    >
                      {/* Scale render contents of elements onto mockup card */}
                      {(view === 'front' ? canvasElements : backElements).map(el => (
                        <div 
                          key={el.id}
                          style={{
                            position: 'absolute',
                            left: `${(el.x / 520) * 100}%`,
                            top: `${(el.y / 300) * 100}%`,
                            width: `${(el.width / 520) * 100}%`,
                            height: `${(el.height / 300) * 100}%`,
                            fontSize: `${(el.fontSize / 300) * 220}px`,
                            color: el.color || '#333',
                            fontWeight: el.fontWeight || 'normal',
                            fontFamily: el.fontFamily || 'Outfit',
                            transform: `rotate(${el.rotation || 0}deg)`,
                            lineHeight: '1',
                            overflow: 'hidden'
                          }}
                        >
                          {el.type === 'text' ? el.content : el.type === 'graphic' ? '⬡' : '◼'}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={styles.handMockupShadow}></div>
                </div>
              )}

              {/* T-Shirt mockup overlay */}
              {isTshirt && (
                <div style={styles.clothingMockupFrame}>
                  <svg width="340" height="340" viewBox="0 0 100 100" style={{fill: canvasBgColor, stroke: '#cbd5e1', strokeWidth:'1'}}>
                    <path d="M50,12 L65,18 L70,30 L60,32 L58,22 L58,85 L42,85 L42,22 L40,32 L30,30 L35,18 Z" />
                  </svg>
                  <div style={styles.tshirtPrintContentOverlay}>
                    {canvasElements.map(el => (
                      <div 
                        key={el.id}
                        style={{
                          fontSize: `${(el.fontSize / 3) * 0.5}px`,
                          color: el.color || '#fff',
                          fontFamily: el.fontFamily || 'Outfit',
                          fontWeight: el.fontWeight || 'normal',
                          textAlign: 'center'
                        }}
                      >
                        {el.type === 'text' ? el.content : '⬡'}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mug mockup wrap */}
              {isDrinkware && (
                <div style={styles.mugMockupFrame}>
                  <div style={styles.mugHandle}></div>
                  <div style={{...styles.mugBody, backgroundColor: canvasBgColor}}>
                    <div style={styles.mugContentOverlay}>
                      {canvasElements.map(el => (
                        <div 
                          key={el.id}
                          style={{
                            fontSize: `${(el.fontSize / 2) * 0.5}px`,
                            color: el.color || '#333',
                            fontFamily: el.fontFamily || 'Outfit',
                            fontWeight: el.fontWeight || 'normal'
                          }}
                        >
                          {el.type === 'text' ? el.content : '⬡'}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div style={styles.mockupToggleRow}>
                <button 
                  onClick={() => setView('front')}
                  style={{...styles.mockupToggleBtn, borderBottom: view==='front' ? '2px solid var(--color-border)' : 'none'}}
                >
                  Front
                </button>
                <button 
                  onClick={() => setView('back')}
                  style={{...styles.mockupToggleBtn, borderBottom: view==='back' ? '2px solid var(--color-border)' : 'none'}}
                >
                  Back
                </button>
              </div>
            </div>

            {/* Right: Checkout spec panel options */}
            <div style={styles.orientationFormCol}>
              <h2 style={{fontSize: '28px', fontWeight: '800'}}>Approve & Review</h2>
              <p style={{fontSize: '14px', color: '#555', marginTop: '8px'}}>Please check the placement of all text elements. Ensure your layout fits entirely within the safety boundaries before adding to cart.</p>

              <div style={styles.reviewSpecsTable}>
                <div style={styles.reviewSpecsRow}>
                  <span>Product Format</span>
                  <span style={{fontWeight: '700'}}>{product.name}</span>
                </div>
                <div style={styles.reviewSpecsRow}>
                  <span>Paper corners</span>
                  <span style={{fontWeight: '700'}}>{corners.toUpperCase()}</span>
                </div>
                <div style={styles.reviewSpecsRow}>
                  <span>Coated Finish</span>
                  <span style={{fontWeight: '700'}}>{paperFinish.toUpperCase()}</span>
                </div>
                <div style={styles.reviewSpecsRow}>
                  <span>Quantity ordered</span>
                  <span style={{fontWeight: '700'}}>{quantity} units</span>
                </div>
                <div style={styles.reviewSpecsRow}>
                  <span>Delivery Speed</span>
                  <span style={{fontWeight: '700'}}>{deliverySpeed === 'standard' ? 'Standard Delivery' : 'Same Day Shipping'}</span>
                </div>
              </div>

              <div style={{height: '1px', backgroundColor: '#e2e8f0', margin: '24px 0'}}></div>

              <div style={styles.actionsPanelOrientation}>
                <button 
                  onClick={() => setCustomizerStep('editor')}
                  style={styles.backToEditorBtn}
                >
                  Edit Layout ✏️
                </button>
                <button 
                  onClick={handleBuyNow}
                  style={styles.orientationBuyNowBtn}
                >
                  Buy Now ⚡
                </button>
                <button 
                  onClick={handleAddToCart}
                  style={styles.orientationCartBtn}
                >
                  Add to Cart 🛍️
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '24px 0 80px',
    fontFamily: '"Inter", sans-serif',
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '20px',
    fontWeight: '500'
  },
  titleText: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: '1.2'
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    margin: '10px 0 16px'
  },
  productDesc: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#475569'
  },
  specsDivider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '20px 0'
  },
  configLayout: {
    display: 'flex',
    gap: '40px',
    flexWrap: 'wrap'
  },
  configGalleryCol: {
    flex: '1.2',
    minWidth: '320px'
  },
  mainMockupFrame: {
    width: '100%',
    height: '350px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1.5px solid var(--color-border)',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mainMockupImage: {
    maxWidth: '85%',
    maxHeight: '85%',
    objectFit: 'contain',
    borderRadius: '4px'
  },
  badgePremium: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    backgroundColor: '#0f172a',
    color: '#ffcc00',
    fontSize: '10px',
    fontWeight: '700',
    padding: '4px 8px',
    borderRadius: '4px',
    letterSpacing: '1px'
  },
  thumbnailRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px'
  },
  thumbnail: {
    width: '70px',
    height: '60px',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    cursor: 'pointer',
    overflow: 'hidden'
  },
  configFormCol: {
    flex: '1',
    minWidth: '320px'
  },
  formSection: {
    marginBottom: '20px'
  },
  sectionLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
    display: 'block'
  },
  optionCardsGrid: {
    display: 'flex',
    gap: '12px'
  },
  optionSelectCard: {
    flex: '1',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.2s ease'
  },
  cornerStandardIcon: {
    width: '16px',
    height: '16px',
    border: '1.5px solid #0f172a',
    borderRadius: '0px'
  },
  cornerRoundedIcon: {
    width: '16px',
    height: '16px',
    border: '1.5px solid #0f172a',
    borderRadius: '4px'
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  cardNameTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0f172a'
  },
  cardPriceLabel: {
    fontSize: '11px',
    color: '#666',
    marginTop: '2px'
  },
  selectSpecs: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1.5px solid #cbd5e1',
    outline: 'none',
    fontSize: '14px'
  },
  btnGridRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  specBadgeBtn: {
    border: '1.5px solid #cbd5e1',
    borderRadius: '6px',
    padding: '8px 14px',
    fontSize: '13px',
    cursor: 'pointer',
    background: '#ffffff',
    transition: 'all 0.2s ease'
  },
  qtyRowInput: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  numberInputSpec: {
    width: '80px',
    padding: '10px',
    borderRadius: '6px',
    border: '1.5px solid #cbd5e1',
    outline: 'none'
  },
  ctaCardButtonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  },
  browseDesignsBtn: {
    flex: '1.2',
    backgroundColor: '#0f62fe',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '14px 10px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(15, 98, 254, 0.15)'
  },
  uploadDesignBtn: {
    flex: '1',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    border: '1.5px solid var(--color-border)',
    borderRadius: '6px',
    padding: '14px 10px',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  priceStrip: {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  exploreTemplatesBlock: {
    marginTop: '56px'
  },
  exploreHeading: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '20px'
  },
  popularTemplatesGrid: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap'
  },
  popularTemplateCard: {
    flex: '1',
    minWidth: '220px',
    backgroundColor: '#ffffff',
    border: '1.5px solid var(--color-border)',
    borderRadius: '10px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  miniTemplatePreview: {
    width: '100%',
    height: '140px',
    position: 'relative',
    overflow: 'hidden',
    borderBottom: '1.5px solid var(--color-border)'
  },
  popularTemplateMeta: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  templatesScreen: {
    padding: '10px 0 60px'
  },
  templatesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '20px',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  backLinkSmall: {
    background: 'none',
    border: 'none',
    color: '#555',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
  },
  searchBarBox: {
    width: '320px',
    minWidth: '240px'
  },
  searchTemplatesInput: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1.5px solid var(--color-border)',
    outline: 'none'
  },
  templatesLayout: {
    display: 'flex',
    gap: '32px'
  },
  templatesSidebar: {
    width: '260px',
    flexShrink: '0',
    backgroundColor: '#ffffff',
    border: '1.5px solid var(--color-border)',
    borderRadius: '10px',
    padding: '20px',
    height: 'fit-content'
  },
  sidebarSectionTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  filterSection: {
    marginBottom: '20px'
  },
  filterLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#666',
    display: 'block',
    marginBottom: '6px'
  },
  selectFilter: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    outline: 'none',
    fontSize: '13px'
  },
  helpPromoBox: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '14px',
    marginTop: '32px',
    border: '1px solid #e2e8f0'
  },
  promoContactBtn: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  templatesGalleryGridCol: {
    flex: '1'
  },
  templatesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '24px'
  },
  templateGalleryCard: {
    backgroundColor: '#ffffff',
    border: '1.5px solid var(--color-border)',
    borderRadius: '10px',
    overflow: 'hidden',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    height: '220px',
    transition: 'all 0.2s ease'
  },
  templateGalleryPreviewFrame: {
    height: '140px',
    position: 'relative',
    overflow: 'hidden',
    borderBottom: '1.5px solid var(--color-border)'
  },
  templateGalleryCardInfo: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: '1'
  },
  colorPaletteIndicators: {
    display: 'flex',
    gap: '4px'
  },
  paletteDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    border: '1px solid #ddd'
  },
  editorScreen: {
    backgroundColor: '#f1f5f9',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1.5px solid var(--color-border)',
    boxShadow: 'var(--shadow-md)'
  },
  editorTopBar: {
    backgroundColor: '#0f172a',
    height: '56px',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#ffffff',
    borderBottom: '1px solid #1e293b'
  },
  editorHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  brandIcon: {
    fontSize: '24px',
    color: '#ffcc00',
    fontWeight: 'bold'
  },
  activeFileName: {
    fontWeight: '700',
    fontSize: '14px',
    letterSpacing: '0.2px'
  },
  undoRedoGroup: {
    display: 'flex',
    gap: '4px',
    backgroundColor: '#1e293b',
    borderRadius: '6px',
    padding: '2px'
  },
  historyBtn: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '16px',
    cursor: 'pointer',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px'
  },
  editorHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  priceBanner: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#ffcc00'
  },
  previewApproveBtn: {
    backgroundColor: '#ffcc00',
    color: '#111111',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  editorWorkspaceLayout: {
    display: 'flex',
    height: '600px'
  },
  editorSidebarTabs: {
    width: '80px',
    backgroundColor: '#0f172a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 0',
    borderRight: '1px solid #1e293b',
    flexShrink: '0'
  },
  sidebarTabBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: '12px 0',
    cursor: 'pointer',
    color: '#94a3b8',
    transition: 'all 0.2s ease'
  },
  tabIcon: {
    fontSize: '18px',
    marginBottom: '4px'
  },
  tabLabel: {
    fontSize: '10px',
    fontWeight: '500'
  },
  editorPanelContent: {
    width: '260px',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRight: '1px solid #cbd5e1',
    flexShrink: '0',
    overflowY: 'auto'
  },
  panelTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '16px'
  },
  panelGroup: {
    marginBottom: '16px'
  },
  panelLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
    display: 'block'
  },
  selectPanelField: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    outline: 'none',
    fontSize: '13px'
  },
  addTextBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#0f62fe',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    marginBottom: '12px'
  },
  panelDivider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '16px 0'
  },
  layerEditBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  textareaField: {
    width: '100%',
    height: '60px',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '13px',
    outline: 'none',
    resize: 'none'
  },
  colorPickerField: {
    width: '100%',
    height: '36px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  emptySelectionMsg: {
    fontSize: '12px',
    color: '#777',
    textAlign: 'center',
    padding: '20px 0',
    lineHeight: '1.4'
  },
  uploadBoxSimulate: {
    border: '2px dashed #cbd5e1',
    borderRadius: '8px',
    padding: '24px 12px',
    textAlign: 'center',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  presetImagesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px'
  },
  presetImgThumb: {
    width: '100%',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px',
    cursor: 'pointer',
    border: '1px solid #cbd5e1'
  },
  presetGraphicsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    marginBottom: '16px'
  },
  shapeBtn: {
    height: '40px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '20px',
    backgroundColor: '#ffffff',
    cursor: 'pointer'
  },
  graphicPresetIconBtn: {
    height: '45px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    padding: '8px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  colorPaletteGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px'
  },
  bgPaletteDot: {
    height: '32px',
    borderRadius: '4px',
    cursor: 'pointer',
    border: '2px solid transparent'
  },
  textPanelInput: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '13px',
    outline: 'none',
    marginBottom: '12px'
  },
  canvasWorkspaceArea: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden'
  },
  contextualToolbar: {
    position: 'absolute',
    top: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '6px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid #e2e8f0',
    zIndex: '10'
  },
  toolbarBtn: {
    background: 'none',
    border: 'none',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px'
  },
  toolbarDivider: {
    width: '1px',
    height: '16px',
    backgroundColor: '#ddd'
  },
  canvasContainerScale: {
    position: 'relative',
    transition: 'transform 0.1s ease',
    transformOrigin: 'center center'
  },
  editorCanvas: {
    borderRadius: '4px',
    boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
    border: '1px solid #ddd',
    position: 'relative',
    overflow: 'hidden'
  },
  safetyGuideLine: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    right: '10px',
    bottom: '10px',
    border: '1px dotted rgba(15, 98, 254, 0.4)',
    pointerEvents: 'none',
    borderRadius: '2px'
  },
  bleedGuideLine: {
    position: 'absolute',
    top: '4px',
    left: '4px',
    right: '4px',
    bottom: '4px',
    border: '1px dashed rgba(220, 38, 38, 0.35)',
    pointerEvents: 'none'
  },
  rotateHandleAnchor: {
    position: 'absolute',
    top: '-32px',
    left: '50%',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#ffcc00',
    border: '1.5px solid #0f172a',
    transform: 'translateX(-50%)',
    cursor: 'alias',
    zIndex: '5'
  },
  resizeHandleAnchor: {
    position: 'absolute',
    bottom: '-5px',
    right: '-5px',
    width: '10px',
    height: '10px',
    backgroundColor: '#ffcc00',
    border: '1.5px solid #0f172a',
    cursor: 'se-resize',
    zIndex: '5'
  },
  duplicateHandleAnchor: {
    position: 'absolute',
    top: '-12px',
    left: '-12px',
    fontSize: '12px',
    cursor: 'pointer',
    backgroundColor: '#ffffff',
    border: '1px solid #ddd',
    borderRadius: '2px',
    padding: '1px 3px'
  },
  lockHandleAnchor: {
    position: 'absolute',
    bottom: '-12px',
    left: '-12px',
    fontSize: '12px',
    cursor: 'pointer',
    backgroundColor: '#ffffff',
    border: '1px solid #ddd',
    borderRadius: '2px',
    padding: '1px 3px'
  },
  deleteHandleAnchor: {
    position: 'absolute',
    top: '-12px',
    right: '-12px',
    fontSize: '10px',
    cursor: 'pointer',
    backgroundColor: '#ffffff',
    border: '1px solid #ddd',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  qrMockupBox: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    border: '1px solid #111',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomWorkspaceControls: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '24px',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '16px'
  },
  zoomControlBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  zoomBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '4px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    cursor: 'pointer'
  },
  pageToggleBlock: {
    display: 'flex',
    gap: '12px'
  },
  pageBtnToggle: {
    background: 'none',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '6px 12px'
  },
  orientationScreen: {
    padding: '30px 0 60px'
  },
  orientationLayout: {
    display: 'flex',
    gap: '48px',
    flexWrap: 'wrap'
  },
  orientationVisualCol: {
    flex: '1.2',
    minWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  mockupHandFrame: {
    width: '100%',
    height: '350px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  cardThreeDHolder: {
    perspective: '1200px'
  },
  cardThreeDBody: {
    width: '380px',
    height: '220px',
    borderRadius: '6px',
    boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
    transform: 'rotateX(30deg) rotateY(-35deg) rotateZ(10deg)',
    transition: 'all 0.4s ease',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  handMockupShadow: {
    position: 'absolute',
    bottom: '20px',
    width: '280px',
    height: '30px',
    background: 'radial-gradient(ellipse, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 70%)',
    zIndex: '-1'
  },
  clothingMockupFrame: {
    position: 'relative',
    width: '340px',
    height: '340px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tshirtPrintContentOverlay: {
    position: 'absolute',
    top: '38%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '120px'
  },
  mugMockupFrame: {
    width: '320px',
    height: '320px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  mugHandle: {
    position: 'absolute',
    right: '40px',
    width: '50px',
    height: '110px',
    border: '14px solid #e2e8f0',
    borderLeft: 'none',
    borderRadius: '0 40px 40px 0',
    zIndex: '0'
  },
  mugBody: {
    width: '160px',
    height: '180px',
    borderRadius: '12px 12px 18px 18px',
    border: '1px solid #cbd5e1',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    zIndex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  mugContentOverlay: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px'
  },
  mockupToggleRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  },
  mockupToggleBtn: {
    background: 'none',
    border: 'none',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    padding: '4px 12px'
  },
  orientationFormCol: {
    flex: '1',
    minWidth: '320px'
  },
  reviewSpecsTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '24px'
  },
  reviewSpecsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '8px'
  },
  actionsPanelOrientation: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '24px'
  },
  backToEditorBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    border: '1.5px solid var(--color-border)',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer'
  },
  orientationBuyNowBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#0f62fe',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(15, 98, 254, 0.15)'
  },
  orientationCartBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#ffcc00',
    color: '#111111',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer'
  }
};

export default Customizer;
