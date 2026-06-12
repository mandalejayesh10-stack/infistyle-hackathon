import React, { useState, useRef, useEffect } from 'react';

const Header = ({ 
  cartCount, 
  favCount, 
  onNavigate, 
  onSearch, 
  onToggleCart, 
  currentTab,
  categories,
  onSelectProduct,
  theme,
  onToggleTheme,
  isLoggedIn,
  user
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const suggestionRef = useRef(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter products for suggestions
  const allProducts = [
    { id: 'standardBusinessCards', name: 'Standard Visiting Cards', cat: 'visiting-cards', price: 200 },
    { id: 'roundedCornerBusinessCards', name: 'Rounded Corner Visiting Cards', cat: 'visiting-cards', price: 250 },
    { id: 'letterhead', name: 'Premium Letterheads', cat: 'stationery', price: 230 },
    { id: 'photobook', name: 'Personalised Photo Albums', cat: 'photo-gifts', price: 715 },
    { id: 'stickers', name: 'Custom Stickers', cat: 'labels-packaging', price: 150 },
    { id: 'embroideredMensPoloTShirts', name: "Men's Polo T-Shirts", cat: 'clothing-bags', price: 570 },
    { id: 'pumaPoloTShirtsIndia', name: 'Puma® Polo T-shirts', cat: 'clothing-bags', price: 1640 },
    { id: 'customMugWhite', name: 'Personalised White Mugs', cat: 'photo-gifts', price: 280 },
    { id: 'printedToteBags', name: 'Printed Tote Bags', cat: 'clothing-bags', price: 330 },
    { id: 'selfInkingStamps', name: 'Self Inking Stamps', cat: 'stamps-ink', price: 310 },
    { id: 'singleFoldUmbrella', name: 'Single Fold Umbrellas', cat: 'clothing-bags', price: 860 }
  ];

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 0) {
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestedProducts(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestedProducts([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (prod) => {
    setSearchQuery(prod.name);
    setShowSuggestions(false);
    onSelectProduct(prod.id);
  };

  return (
    <header style={styles.header}>
      {/* Top Navbar */}
      <div style={styles.topNav}>
        <div className="container" style={styles.topNavContainer}>
          {/* Logo */}
          <div style={styles.logoContainer} onClick={() => onNavigate('home')}>
            <svg style={styles.logoPrism} viewBox="0 0 100 60">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00c6ff" />
                  <stop offset="100%" stopColor="#0072ff" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path 
                d="M 50,30 C 35,15 20,15 20,30 C 20,45 35,45 50,30 C 65,15 80,15 80,30 C 80,45 65,45 50,30 Z" 
                fill="none" 
                stroke="url(#logoGrad)" 
                strokeWidth="7" 
                strokeLinecap="round"
                filter="url(#glow)"
              />
            </svg>
            <span style={styles.logoText}>InfiStyle</span>
            <span style={styles.logoCountry}>India</span>
          </div>

          {/* Search Form */}
          <div style={styles.searchWrapper} ref={suggestionRef}>
            <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
              <input 
                type="text" 
                placeholder="Search for visiting cards, t-shirts, mugs..." 
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.trim().length > 0 && setShowSuggestions(true)}
                style={styles.searchInput}
              />
              <button type="submit" style={styles.searchBtn}>
                🔍
              </button>
            </form>
            
            {showSuggestions && (
              <div style={styles.suggestions}>
                {suggestedProducts.length > 0 ? (
                  suggestedProducts.map(prod => (
                    <div 
                      key={prod.id} 
                      onClick={() => handleSelectSuggestion(prod)}
                      style={styles.suggestionItem}
                    >
                      <span style={styles.suggestionName}>{prod.name}</span>
                      <span style={styles.suggestionPrice}>starts at ₹{prod.price}</span>
                    </div>
                  ))
                ) : (
                  <div style={styles.noSuggestionItem}>No products found matching "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          {/* Utility Functions */}
          <div style={styles.utilityMenu}>
            <div style={styles.utilityItem} className="swan-visible-lg">
              <span style={styles.utilityIcon}>📞</span>
              <div style={styles.utilityDetails}>
                <span style={styles.utilityTitle}>Help is here</span>
                <span style={styles.utilitySub}>02522-669393</span>
              </div>
            </div>

            <div style={styles.utilityItem} onClick={() => onNavigate('favorites')}>
              <span style={styles.utilityIcon}>❤️</span>
              <span className="swan-visible-lg" style={styles.utilityLinkText}>Favorites</span>
              {favCount > 0 && <span style={styles.badge}>{favCount}</span>}
            </div>

            <div style={styles.utilityItem} onClick={() => onNavigate('account')}>
              {isLoggedIn && user ? (
                <div style={styles.headerAvatar}>{user.initials}</div>
              ) : (
                <span style={styles.utilityIcon}>👤</span>
              )}
              <span className="swan-visible-lg" style={styles.utilityLinkText}>
                {isLoggedIn && user ? user.name.split(' ')[0] : 'Account'}
              </span>
            </div>

            <div style={styles.utilityItem} onClick={onToggleCart}>
              <span style={styles.utilityIcon}>🛒</span>
              <span className="swan-visible-lg" style={styles.utilityLinkText}>Cart</span>
              {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
            </div>

            <div style={styles.utilityItem} onClick={onToggleTheme} title="Toggle Dark/Light Mode">
              <span style={styles.utilityIcon}>{theme === 'dark' ? '☀️' : '🌙'}</span>
              <span className="swan-visible-lg" style={styles.utilityLinkText}>
                {theme === 'dark' ? 'Light' : 'Dark'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Categories Navigation Menu */}
      <nav style={styles.mainNav}>
        <div className="container" style={styles.mainNavContainer}>
          {categories.map(cat => (
            <div 
              key={cat.id} 
              style={{
                ...styles.navItem, 
                borderBottom: currentTab === cat.id ? '3px solid var(--color-primary)' : '3px solid transparent',
                fontWeight: currentTab === cat.id ? '600' : '400'
              }}
              onClick={() => onNavigate(cat.id)}
            >
              {cat.name}
              
              {/* Dropdown Menu Mockup */}
              {cat.subcategories && (
                <div className="nav-dropdown" style={styles.dropdown}>
                  <div style={styles.dropdownGrid}>
                    {cat.subcategories.map((sub, idx) => (
                      <div 
                        key={idx} 
                        style={styles.dropdownItem}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (sub.productId) {
                            onSelectProduct(sub.productId);
                          } else {
                            onNavigate(cat.id);
                          }
                        }}
                      >
                        {sub.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 900,
    boxShadow: 'var(--shadow-sm)',
    backgroundColor: 'var(--color-white)',
  },
  topNav: {
    borderBottom: '1px solid var(--color-border)',
    padding: '12px 0',
  },
  topNavContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none',
  },
  logoPrism: {
    width: '40px',
    height: '32px',
    marginRight: '8px',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    letterSpacing: '-0.5px',
  },
  logoCountry: {
    fontSize: '10px',
    fontWeight: '600',
    alignSelf: 'flex-end',
    marginBottom: '4px',
    marginLeft: '3px',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
  },
  searchWrapper: {
    position: 'relative',
    flex: '1',
    maxWidth: '550px',
  },
  searchForm: {
    display: 'flex',
    border: '1px solid var(--color-primary)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    padding: '10px 18px',
    outline: 'none',
    fontSize: '14px',
  },
  searchBtn: {
    padding: '0 16px',
    backgroundColor: 'var(--color-primary)',
    color: '#ffffff',
    fontSize: '14px',
  },
  suggestions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    boxShadow: 'var(--shadow-md)',
    borderRadius: 'var(--radius-lg)',
    marginTop: '6px',
    zIndex: 999,
    overflow: 'hidden',
    border: '1px solid var(--color-border)',
  },
  suggestionItem: {
    padding: '12px 18px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--color-light-gray)',
    transition: 'var(--transition-fast)',
  },
  suggestionItemHover: {
    backgroundColor: 'var(--color-light-gray)',
  },
  suggestionName: {
    fontWeight: '500',
    fontSize: '14px',
  },
  suggestionPrice: {
    fontSize: '12px',
    color: 'var(--color-success)',
    fontWeight: '600',
  },
  noSuggestionItem: {
    padding: '14px 18px',
    fontSize: '13px',
    color: 'var(--color-text-muted)',
  },
  utilityMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  utilityItem: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    gap: '8px',
    position: 'relative',
    transition: 'var(--transition-fast)',
  },
  utilityIcon: {
    fontSize: '20px',
  },
  utilityDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  utilityTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-text-dark)',
  },
  utilitySub: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
  },
  utilityLinkText: {
    fontSize: '14px',
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: '-6px',
    left: '12px',
    backgroundColor: 'var(--color-error)',
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: '700',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainNav: {
    backgroundColor: 'var(--color-white)',
    borderBottom: '1px solid var(--color-border)',
    overflowX: 'auto',
  },
  mainNavContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 var(--space-lg)',
  },
  navItem: {
    padding: '12px 6px 10px',
    fontSize: '14px',
    cursor: 'pointer',
    position: 'relative',
    whiteSpace: 'nowrap',
    transition: 'var(--transition-fast)',
  },
  dropdown: {
    display: 'none',
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: '#ffffff',
    boxShadow: 'var(--shadow-md)',
    padding: '16px',
    borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
    zIndex: 999,
    border: '1px solid var(--color-border)',
    minWidth: '220px',
  },
  dropdownGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  dropdownItem: {
    fontSize: '13px',
    padding: '6px 8px',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--color-text-dark)',
    transition: 'var(--transition-fast)',
  },
  headerAvatar: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-secondary)',
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

// Add CSS hover style for dropdown menu
const globalStyles = `
  .site-header-nav-item:hover .nav-dropdown {
    display: block !important;
  }
`;

export default Header;
