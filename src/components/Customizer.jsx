import React, { useState } from 'react';

const Customizer = ({ product, onAddToCart, onGoBack }) => {
  // Config defaults based on product type
  const isCard = product.id.toLowerCase().includes('card');
  const isTshirt = product.id.toLowerCase().includes('polo') || product.id.toLowerCase().includes('tshirt') || product.id.toLowerCase().includes('shirt');

  // Interactive state
  const [view, setView] = useState('front'); // 'front' | 'back'
  const [companyName, setCompanyName] = useState('Acme Corporation');
  const [fullName, setFullName] = useState('Jayesh Sharma');
  const [title, setTitle] = useState('Managing Director');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('jayesh@acme.com');
  const [address, setAddress] = useState('Nariman Point, Mumbai, India');
  const [fontFamily, setFontFamily] = useState('Outfit'); // 'Outfit' | 'Playfair Display' | 'Courier New' | 'Georgia'
  const [themeColor, setThemeColor] = useState('#0f62fe'); // Royal Blue default
  const [layoutStyle, setLayoutStyle] = useState('modern'); // 'minimal' | 'modern' | 'split'
  const [corners, setCorners] = useState('rounded'); // 'standard' | 'rounded'
  const [paperFinish, setPaperFinish] = useState('matte'); // 'matte' | 'glossy' | 'velvet'
  const [quantity, setQuantity] = useState(100);
  const [shirtSize, setShirtSize] = useState('L'); // 'S' | 'M' | 'L' | 'XL'

  // Predefined color presets
  const colors = [
    { name: 'Royal Blue', hex: '#0f62fe' },
    { name: 'Classic Black', hex: '#111111' },
    { name: 'Vibrant Yellow', hex: '#ffcc00' },
    { name: 'Warm Cream', hex: '#fcfaf2' },
    { name: 'Navy Slate', hex: '#0c72a9' },
    { name: 'Pure White', hex: '#ffffff' }
  ];

  // Pricing calculations
  const getBaseUnitPrice = () => {
    if (isCard) {
      if (quantity >= 1000) return 1.20;
      if (quantity >= 500) return 1.50;
      if (quantity >= 250) return 1.80;
      return 2.00;
    } else if (isTshirt) {
      return 550;
    }
    return 100;
  };

  const getAddonCost = () => {
    let addon = 0;
    if (isCard) {
      if (corners === 'rounded') addon += 0.50;
      if (paperFinish === 'glossy') addon += 0.30;
      if (paperFinish === 'velvet') addon += 0.80;
    }
    return addon;
  };

  const unitPrice = getBaseUnitPrice() + getAddonCost();
  const totalPrice = Math.round(unitPrice * quantity);

  const handleAddToCart = () => {
    const customConfig = {
      companyName,
      fullName,
      title,
      phone,
      email,
      address,
      fontFamily,
      themeColor,
      layoutStyle,
      corners,
      paperFinish,
      shirtSize,
      quantity,
      unitPrice,
      totalPrice,
      viewPreview: view
    };
    onAddToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      config: customConfig,
      quantity,
      price: totalPrice
    });
  };

  return (
    <section style={styles.container} className="container animate-fade-in">
      {/* Go Back Link */}
      <button onClick={onGoBack} style={styles.backBtn}>
        ← Back to Gallery
      </button>

      <div style={styles.splitLayout}>
        {/* Left Section: Live Visual Canvas */}
        <div style={styles.leftSection}>
          <div style={styles.stickyCanvas}>
            <h2 style={styles.previewHeading}>Live Preview Mockup</h2>

            {/* Toggle view tabs */}
            {isCard && (
              <div style={styles.tabContainer}>
                <button 
                  onClick={() => setView('front')}
                  style={{...styles.tab, borderBottom: view === 'front' ? '3px solid var(--color-primary)' : '3px solid transparent', fontWeight: view === 'front' ? '600' : '400'}}
                >
                  Card Front
                </button>
                <button 
                  onClick={() => setView('back')}
                  style={{...styles.tab, borderBottom: view === 'back' ? '3px solid var(--color-primary)' : '3px solid transparent', fontWeight: view === 'back' ? '600' : '400'}}
                >
                  Card Back
                </button>
              </div>
            )}

            {/* Canvas Mockup Frame */}
            <div style={styles.canvasFrame}>
              {/* Business Card Render */}
              {isCard && (
                <div 
                  style={{
                    ...styles.businessCard, 
                    backgroundColor: themeColor, 
                    fontFamily: fontFamily,
                    color: themeColor === '#ffffff' || themeColor === '#fcfaf2' || themeColor === '#ffcc00' ? '#111111' : '#ffffff',
                    borderRadius: corners === 'rounded' ? '18px' : '4px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  {view === 'front' ? (
                    /* Front View templates */
                    layoutStyle === 'modern' ? (
                      <div style={styles.cardModern}>
                        <div style={styles.cardHeader}>
                          <span style={styles.cardLogoIcon}>⬡</span>
                          <span style={styles.cardCompanyName}>{companyName}</span>
                        </div>
                        <div style={styles.cardBody}>
                          <h4 style={styles.cardName}>{fullName}</h4>
                          <span style={styles.cardTitle}>{title}</span>
                        </div>
                        <div style={styles.cardFooter}>
                          <div>📞 {phone}</div>
                          <div>✉️ {email}</div>
                          <div>📍 {address}</div>
                        </div>
                      </div>
                    ) : layoutStyle === 'minimal' ? (
                      <div style={styles.cardMinimal}>
                        <h4 style={styles.cardName}>{fullName}</h4>
                        <span style={styles.cardTitle}>{title}</span>
                        <div style={styles.divider}></div>
                        <div style={styles.cardMinimalDetails}>
                          <div>{companyName} | {phone} | {email}</div>
                          <div style={{marginTop: '4px'}}>{address}</div>
                        </div>
                      </div>
                    ) : (
                      /* Split template */
                      <div style={styles.cardSplit}>
                        <div style={{...styles.cardLeftCol, borderRight: `1px solid ${themeColor === '#ffffff' || themeColor === '#fcfaf2' || themeColor === '#ffcc00' ? '#e2e8f0' : 'rgba(255, 255, 255, 0.2)'}`}}>
                          <span style={styles.cardLogoBig}>⬡</span>
                          <span style={styles.cardCompanyName}>{companyName}</span>
                        </div>
                        <div style={styles.cardRightCol}>
                          <div>
                            <h4 style={styles.cardName}>{fullName}</h4>
                            <span style={styles.cardTitle}>{title}</span>
                          </div>
                          <div style={styles.cardSplitContact}>
                            <div>📞 {phone}</div>
                            <div>✉️ {email}</div>
                            <div style={{fontSize: '9px', opacity: 0.8}}>{address}</div>
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    /* Back View */
                    <div style={styles.cardBack}>
                      <span style={styles.cardLogoHuge}>⬡</span>
                      <h3 style={styles.cardCompanyNameHuge}>{companyName}</h3>
                      <p style={styles.tagline}>Est. 2026 • Premium Print</p>
                    </div>
                  )}
                </div>
              )}

              {/* T-Shirt Render */}
              {isTshirt && (
                <div style={styles.tshirtContainer}>
                  {/* Tshirt outline SVG mockup */}
                  <svg width="280" height="280" viewBox="0 0 100 100" style={styles.tshirtSvg}>
                    <path 
                      d="M50,12 L65,18 L70,30 L60,32 L58,22 L58,85 L42,85 L42,22 L40,32 L30,30 L35,18 Z" 
                      fill={themeColor} 
                      stroke="#1d1d1d" 
                      strokeWidth="1.5"
                    />
                    <path d="M42,12 C44,15 56,15 58,12" fill="none" stroke="#1d1d1d" strokeWidth="1.2"/>
                  </svg>
                  
                  {/* Text Overlay on shirt */}
                  <div 
                    style={{
                      ...styles.tshirtTextOverlay, 
                      fontFamily: fontFamily,
                      color: themeColor === '#ffffff' || themeColor === '#fcfaf2' || themeColor === '#ffcc00' ? '#111111' : '#ffffff'
                    }}
                  >
                    <span style={styles.tshirtLogoIcon}>⬡</span>
                    <span style={styles.tshirtTextCompany}>{companyName}</span>
                    <span style={styles.tshirtTextSub}>{fullName}</span>
                  </div>
                </div>
              )}
            </div>
            
            <p style={styles.previewInfo}>* Preview serves as a visual layout guide. Printed product color tones may vary slightly.</p>
          </div>
        </div>

        {/* Right Section: Configuration Settings */}
        <div style={styles.rightSection}>
          <h1 style={styles.productTitle}>{product.name}</h1>
          <p style={styles.startingPrice}>Product Design Customizer Studio</p>
          
          <div style={styles.sectionDivider}></div>

          {/* Form Fields */}
          <div style={styles.optionSection}>
            <h3 style={styles.optionSectionTitle}>1. Contact & Branding Details</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Company/Brand Name</label>
              <input 
                type="text" 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)} 
                style={styles.textInput}
              />
            </div>

            {isCard && (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Employee Name</label>
                  <input 
                    type="text" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    style={styles.textInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Job Title / Designation</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    style={styles.textInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    style={styles.textInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input 
                    type="text" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    style={styles.textInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Location Address</label>
                  <input 
                    type="text" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    style={styles.textInput}
                  />
                </div>
              </>
            )}
            
            {isTshirt && (
              <div style={styles.formGroup}>
                <label style={styles.label}>T-shirt Chest Label Text</label>
                <input 
                  type="text" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  style={styles.textInput}
                  placeholder="E.g., Staff Name or Tagline"
                />
              </div>
            )}
          </div>

          {/* Design System Settings */}
          <div style={styles.optionSection}>
            <h3 style={styles.optionSectionTitle}>2. Palette & Layout System</h3>
            
            {/* Color Presets */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Background Base Color</label>
              <div style={styles.colorGrid}>
                {colors.map(c => (
                  <button 
                    key={c.hex} 
                    onClick={() => setThemeColor(c.hex)}
                    style={{
                      ...styles.colorCircle, 
                      backgroundColor: c.hex,
                      border: themeColor === c.hex ? '3px solid var(--color-secondary)' : '1px solid var(--color-border)'
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Fonts Dropdown */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Typography Font Style</label>
              <select 
                value={fontFamily} 
                onChange={(e) => setFontFamily(e.target.value)} 
                style={styles.selectInput}
              >
                <option value="Outfit">Outfit (Clean Sans-Serif)</option>
                <option value="Playfair Display">Playfair (Elegant Editorial Serif)</option>
                <option value="Courier New">Courier (Modern Monospace)</option>
                <option value="Georgia">Georgia (Classic Bookish)</option>
              </select>
            </div>

            {/* Template layouts for cards */}
            {isCard && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Layout Template</label>
                <div style={styles.btnGroup}>
                  <button 
                    onClick={() => setLayoutStyle('modern')}
                    style={{...styles.toggleBtn, backgroundColor: layoutStyle === 'modern' ? 'var(--color-primary)' : '#ffffff', color: layoutStyle === 'modern' ? '#ffffff' : 'var(--color-primary)'}}
                  >
                    Modern
                  </button>
                  <button 
                    onClick={() => setLayoutStyle('minimal')}
                    style={{...styles.toggleBtn, backgroundColor: layoutStyle === 'minimal' ? 'var(--color-primary)' : '#ffffff', color: layoutStyle === 'minimal' ? '#ffffff' : 'var(--color-primary)'}}
                  >
                    Minimal
                  </button>
                  <button 
                    onClick={() => setLayoutStyle('split')}
                    style={{...styles.toggleBtn, backgroundColor: layoutStyle === 'split' ? 'var(--color-primary)' : '#ffffff', color: layoutStyle === 'split' ? '#ffffff' : 'var(--color-primary)'}}
                  >
                    Split Col
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Premium upgrades */}
          <div style={styles.optionSection}>
            <h3 style={styles.optionSectionTitle}>3. Finish & Quantity Options</h3>

            {isCard && (
              <>
                {/* Corners */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Card Corners</label>
                  <div style={styles.btnGroup}>
                    <button 
                      onClick={() => setCorners('standard')}
                      style={{...styles.toggleBtn, backgroundColor: corners === 'standard' ? 'var(--color-primary)' : '#ffffff', color: corners === 'standard' ? '#ffffff' : 'var(--color-primary)'}}
                    >
                      Standard (Straight)
                    </button>
                    <button 
                      onClick={() => setCorners('rounded')}
                      style={{...styles.toggleBtn, backgroundColor: corners === 'rounded' ? 'var(--color-primary)' : '#ffffff', color: corners === 'rounded' ? '#ffffff' : 'var(--color-primary)'}}
                    >
                      Rounded (+₹0.50/card)
                    </button>
                  </div>
                </div>

                {/* Paper Finish */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Paper Finish Coating</label>
                  <div style={styles.btnGroup}>
                    <button 
                      onClick={() => setPaperFinish('matte')}
                      style={{...styles.toggleBtn, backgroundColor: paperFinish === 'matte' ? 'var(--color-primary)' : '#ffffff', color: paperFinish === 'matte' ? '#ffffff' : 'var(--color-primary)'}}
                    >
                      Standard Matte
                    </button>
                    <button 
                      onClick={() => setPaperFinish('glossy')}
                      style={{...styles.toggleBtn, backgroundColor: paperFinish === 'glossy' ? 'var(--color-primary)' : '#ffffff', color: paperFinish === 'glossy' ? '#ffffff' : 'var(--color-primary)'}}
                    >
                      High Gloss (+₹0.30)
                    </button>
                    <button 
                      onClick={() => setPaperFinish('velvet')}
                      style={{...styles.toggleBtn, backgroundColor: paperFinish === 'velvet' ? 'var(--color-primary)' : '#ffffff', color: paperFinish === 'velvet' ? '#ffffff' : 'var(--color-primary)'}}
                    >
                      Velvet Touch (+₹0.80)
                    </button>
                  </div>
                </div>
              </>
            )}

            {isTshirt && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Select Size</label>
                <div style={styles.btnGroup}>
                  {['S', 'M', 'L', 'XL', 'XXL'].map(sz => (
                    <button 
                      key={sz} 
                      onClick={() => setShirtSize(sz)}
                      style={{...styles.toggleBtn, minWidth: '48px', backgroundColor: shirtSize === sz ? 'var(--color-primary)' : '#ffffff', color: shirtSize === sz ? '#ffffff' : 'var(--color-primary)'}}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Print Quantity</label>
              {isCard ? (
                <select 
                  value={quantity} 
                  onChange={(e) => setQuantity(Number(e.target.value))} 
                  style={styles.selectInput}
                >
                  <option value="100">100 Cards (₹{2.00 + getAddonCost()}/card)</option>
                  <option value="250">250 Cards (₹{1.80 + getAddonCost()}/card) - Bulk Save!</option>
                  <option value="500">500 Cards (₹{1.50 + getAddonCost()}/card) - High Save!</option>
                  <option value="1000">1000 Cards (₹{1.20 + getAddonCost()}/card) - Super Save!</option>
                </select>
              ) : (
                <input 
                  type="number" 
                  min="1" 
                  max="100" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} 
                  style={styles.textInput}
                />
              )}
            </div>
          </div>

          <div style={styles.sectionDivider}></div>

          {/* Price Summary & Add to Cart */}
          <div style={styles.summaryBox}>
            <div style={styles.priceSummary}>
              <span style={styles.summaryLabel}>Total Pricing Summary:</span>
              <div style={styles.summaryPriceRow}>
                <span style={styles.summaryDetails}>₹{unitPrice.toFixed(2)} unit × {quantity} qty</span>
                <span style={styles.summaryTotal}>₹{totalPrice}</span>
              </div>
            </div>
            
            <div style={styles.actions}>
              <button 
                className="btn btn-secondary" 
                onClick={handleAddToCart}
                style={{width: '100%', padding: '16px 24px', fontSize: '16px'}}
              >
                Add Design to Cart 🛍️
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  container: {
    padding: '40px 0 80px',
  },
  backBtn: {
    marginBottom: '24px',
    color: 'var(--color-text-muted)',
    fontSize: '14px',
    fontWeight: '500',
  },
  splitLayout: {
    display: 'flex',
    gap: '48px',
  },
  leftSection: {
    flex: '1.2',
    minWidth: '350px',
  },
  stickyCanvas: {
    position: 'sticky',
    top: '160px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  previewHeading: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    marginBottom: '20px',
    alignSelf: 'flex-start',
  },
  tabContainer: {
    display: 'flex',
    gap: '20px',
    marginBottom: '24px',
    width: '100%',
    borderBottom: '1px solid var(--color-border)',
  },
  tab: {
    padding: '8px 12px 6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  canvasFrame: {
    backgroundColor: '#eaeaea',
    width: '100%',
    height: '320px',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm) inset',
  },
  businessCard: {
    width: '380px',
    height: '220px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'var(--transition-normal)',
    boxSizing: 'border-box',
    border: '1px solid rgba(0, 0, 0, 0.05)',
  },
  cardModern: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  cardLogoIcon: {
    fontSize: '22px',
    lineHeight: 1,
  },
  cardCompanyName: {
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  cardBody: {
    margin: '12px 0',
  },
  cardName: {
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '0.2px',
  },
  cardTitle: {
    fontSize: '11px',
    opacity: 0.85,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  cardFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    fontSize: '9px',
    opacity: 0.85,
    borderTop: '0.5px solid rgba(255, 255, 255, 0.15)',
    paddingTop: '6px',
  },
  cardMinimal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
  },
  divider: {
    width: '40px',
    height: '1.5px',
    backgroundColor: 'currentColor',
    margin: '12px 0',
    opacity: 0.5,
  },
  cardMinimalDetails: {
    fontSize: '9px',
    opacity: 0.85,
  },
  cardSplit: {
    display: 'flex',
    height: '100%',
  },
  cardLeftCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingRight: '12px',
  },
  cardLogoBig: {
    fontSize: '36px',
    lineHeight: 1,
    marginBottom: '8px',
  },
  cardRightCol: {
    flex: 1.3,
    paddingLeft: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardSplitContact: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    fontSize: '9px',
    opacity: 0.85,
  },
  cardBack: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
  },
  cardLogoHuge: {
    fontSize: '56px',
    lineHeight: 1,
    marginBottom: '10px',
  },
  cardCompanyNameHuge: {
    fontSize: '22px',
    fontWeight: '700',
  },
  tagline: {
    fontSize: '10px',
    opacity: 0.7,
    marginTop: '6px',
  },
  tshirtContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tshirtSvg: {
    filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.15))',
    transition: 'var(--transition-normal)',
  },
  tshirtTextOverlay: {
    position: 'absolute',
    top: '36%',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    pointerEvents: 'none',
    width: '120px',
  },
  tshirtLogoIcon: {
    fontSize: '18px',
    lineHeight: 1,
  },
  tshirtTextCompany: {
    fontSize: '10px',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tshirtTextSub: {
    fontSize: '8px',
    opacity: 0.8,
  },
  previewInfo: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    marginTop: '16px',
    textAlign: 'center',
  },
  rightSection: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
  },
  productTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    lineHeight: '1.2',
  },
  startingPrice: {
    fontSize: '15px',
    color: 'var(--color-secondary)',
    fontWeight: '600',
    marginTop: '4px',
  },
  sectionDivider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '20px 0',
  },
  optionSection: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: 'var(--shadow-sm)',
  },
  optionSectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    marginBottom: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '16px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-text-dark)',
    marginBottom: '6px',
  },
  textInput: {
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 14px',
    outline: 'none',
    fontSize: '14px',
    transition: 'var(--transition-fast)',
  },
  selectInput: {
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 14px',
    outline: 'none',
    fontSize: '14px',
    backgroundColor: '#ffffff',
  },
  colorGrid: {
    display: 'flex',
    gap: '12px',
  },
  colorCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  btnGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  toggleBtn: {
    border: '1px solid var(--color-primary)',
    borderRadius: 'var(--radius-md)',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'var(--transition-fast)',
  },
  summaryBox: {
    backgroundColor: '#f6f6ec',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    marginTop: '12px',
  },
  priceSummary: {
    marginBottom: '20px',
  },
  summaryLabel: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    fontWeight: '600',
  },
  summaryPriceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '6px',
  },
  summaryDetails: {
    fontSize: '14px',
    color: 'var(--color-text-dark)',
  },
  summaryTotal: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--color-text-dark)',
  },
  actions: {
    display: 'flex',
    gap: '16px',
  }
};

export default Customizer;
