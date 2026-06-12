import React, { useState } from 'react';

const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQty, onRemoveItem, onCheckout }) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  // Calculate prices
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const getPromoDiscount = () => {
    if (discountApplied) {
      if (promoCode.toUpperCase() === 'SAVE5') {
        // Flat 5% off if subtotal >= 10000
        if (subtotal >= 10000) {
          return Math.round(subtotal * 0.05);
        }
      } else {
        // Standard welcome discount of 10% off for testing
        return Math.round(subtotal * 0.1);
      }
    }
    return 0;
  };

  const discount = getPromoDiscount();
  const total = subtotal - discount;

  const handleApplyPromo = () => {
    setPromoError('');
    const codeUpper = promoCode.toUpperCase().trim();
    if (codeUpper === 'SAVE5') {
      if (subtotal >= 10000) {
        setDiscountApplied(true);
      } else {
        setPromoError('Code SAVE5 requires a minimum order of ₹10,000');
        setDiscountApplied(false);
      }
    } else if (codeUpper === 'WELCOME10') {
      setDiscountApplied(true);
    } else {
      setPromoError('Invalid promo code');
      setDiscountApplied(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Your Cart 🛍️</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* Drawer Body - Items list */}
        <div style={styles.body}>
          {cartItems.length === 0 ? (
            <div style={styles.emptyCart}>
              <span style={styles.emptyIcon}>🛒</span>
              <p style={styles.emptyText}>Your shopping cart is empty</p>
              <button className="btn btn-primary" onClick={onClose} style={{marginTop: '16px'}}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={`${item.id}-${index}`} style={styles.cartItem}>
                <img src={item.image} alt={item.name} style={styles.itemImg} />
                <div style={styles.itemDetails}>
                  <h4 style={styles.itemName}>{item.name}</h4>
                  
                  {/* Custom configuration details */}
                  {item.config && (
                    <div style={styles.itemConfigSummary}>
                      <div>🏢 {item.config.companyName}</div>
                      {item.config.fullName && <div>👤 {item.config.fullName}</div>}
                      {item.config.paperFinish && (
                        <div style={{textTransform: 'capitalize'}}>
                          ✨ {item.config.corners} • {item.config.paperFinish}
                        </div>
                      )}
                      {item.config.shirtSize && <div>📏 Size: {item.config.shirtSize}</div>}
                    </div>
                  )}

                  <div style={styles.qtyRow}>
                    <div style={styles.qtyControls}>
                      <button 
                        onClick={() => onUpdateQty(index, Math.max(1, item.quantity - (item.config?.companyName ? 100 : 1)))} 
                        style={styles.qtyBtn}
                      >
                        -
                      </button>
                      <span style={styles.qtyVal}>{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQty(index, item.quantity + (item.config?.companyName ? 100 : 1))} 
                        style={styles.qtyBtn}
                      >
                        +
                      </button>
                    </div>
                    <button onClick={() => onRemoveItem(index)} style={styles.removeBtn}>
                      Remove
                    </button>
                  </div>
                </div>
                <div style={styles.itemPrice}>
                  ₹{item.price}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer - Totals & Checkout */}
        {cartItems.length > 0 && (
          <div style={styles.footer}>
            {/* Promo Code Input */}
            <div style={styles.promoWrapper}>
              <div style={styles.promoInputRow}>
                <input 
                  type="text" 
                  placeholder="Enter Promo Code (E.g. SAVE5)" 
                  value={promoCode} 
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={styles.promoInput}
                  disabled={discountApplied}
                />
                <button 
                  onClick={handleApplyPromo} 
                  style={{
                    ...styles.promoBtn,
                    backgroundColor: discountApplied ? 'var(--color-success)' : 'var(--color-primary)',
                    color: '#ffffff'
                  }}
                  disabled={discountApplied}
                >
                  {discountApplied ? 'Applied ✓' : 'Apply'}
                </button>
              </div>
              {promoError && <p style={styles.errorText}>{promoError}</p>}
              {discountApplied && (
                <p style={styles.successText}>
                  Discount applied! Saved ₹{discount}
                </p>
              )}
            </div>

            {/* Calculations */}
            <div style={styles.totalsTable}>
              <div style={styles.totalRow}>
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              
              {discount > 0 && (
                <div style={{...styles.totalRow, color: 'var(--color-success)', fontWeight: '600'}}>
                  <span>Promo Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div style={styles.sectionDivider}></div>
              
              <div style={{...styles.totalRow, fontSize: '18px', fontWeight: '700'}}>
                <span>Grand Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button 
              className="btn btn-secondary" 
              onClick={() => onCheckout(total, discount)}
              style={styles.checkoutBtn}
            >
              Secure Checkout 🔒
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end',
    animation: 'fadeIn 0.3s forwards',
  },
  drawer: {
    backgroundColor: '#ffffff',
    width: '450px',
    maxWidth: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--shadow-lg)',
    animation: 'slideInRight 0.3s forwards',
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--color-primary)',
  },
  closeBtn: {
    fontSize: '22px',
    color: 'var(--color-text-muted)',
  },
  body: {
    padding: '24px',
    flex: 1,
    overflowY: 'auto',
  },
  emptyCart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60%',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyText: {
    color: 'var(--color-text-muted)',
    fontSize: '16px',
  },
  cartItem: {
    display: 'flex',
    gap: '16px',
    paddingBottom: '20px',
    marginBottom: '20px',
    borderBottom: '1px solid var(--color-border)',
  },
  itemImg: {
    width: '72px',
    height: '72px',
    objectFit: 'cover',
    borderRadius: 'var(--radius-md)',
    backgroundColor: '#f8f8f8',
    border: '1px solid var(--color-border)',
  },
  itemDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text-dark)',
    marginBottom: '4px',
  },
  itemConfigSummary: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.4',
    marginBottom: '8px',
  },
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: 'auto',
  },
  qtyControls: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden',
  },
  qtyBtn: {
    width: '28px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-light-gray)',
    fontSize: '14px',
    fontWeight: '700',
  },
  qtyVal: {
    padding: '0 10px',
    fontSize: '13px',
    fontWeight: '600',
  },
  removeBtn: {
    fontSize: '12px',
    color: 'var(--color-error)',
    fontWeight: '500',
  },
  itemPrice: {
    fontWeight: '700',
    fontSize: '15px',
    color: 'var(--color-text-dark)',
  },
  footer: {
    padding: '24px',
    borderTop: '1px solid var(--color-border)',
    backgroundColor: '#f9f9f9',
  },
  promoWrapper: {
    marginBottom: '20px',
  },
  promoInputRow: {
    display: 'flex',
    gap: '8px',
  },
  promoInput: {
    flex: 1,
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '8px 12px',
    fontSize: '13px',
    outline: 'none',
  },
  promoBtn: {
    borderRadius: 'var(--radius-md)',
    padding: '0 16px',
    fontSize: '13px',
    fontWeight: '600',
  },
  errorText: {
    color: 'var(--color-error)',
    fontSize: '11px',
    marginTop: '4px',
    fontWeight: '500',
  },
  successText: {
    color: 'var(--color-success)',
    fontSize: '12px',
    marginTop: '4px',
    fontWeight: '600',
  },
  totalsTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: 'var(--color-text-dark)',
  },
  sectionDivider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '6px 0',
  },
  checkoutBtn: {
    width: '100%',
    padding: '14px 24px',
    fontSize: '15px',
  }
};

export default CartDrawer;
