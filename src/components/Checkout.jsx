import React, { useState } from 'react';

const Checkout = ({ cartItems, grandTotal, promoDiscount, onOrderSuccess, onGoBack, user }) => {
  // Shipping form state
  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi' | 'cod'

  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Processing state
  const [processing, setProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Cost breakups
  const tax = Math.round(grandTotal * 0.18); // 18% GST standard in India
  const shipping = grandTotal > 1000 ? 0 : 80; // Free shipping on orders > ₹1,000
  const finalPayable = grandTotal + tax + shipping;

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Full Name is required';
    if (!address.trim()) errors.address = 'Delivery address is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!pinCode.trim() || pinCode.length !== 6) errors.pinCode = 'Enter a valid 6-digit postal PIN code';
    if (!phone.trim() || phone.length < 10) errors.phone = 'Enter a valid 10-digit phone number';

    if (paymentMethod === 'card') {
      if (!cardNumber.trim() || cardNumber.length < 16) errors.cardNumber = 'Enter a valid 16-digit card number';
      if (!cardExpiry.trim()) errors.cardExpiry = 'Expiry is required (MM/YY)';
      if (!cardCvv.trim() || cardCvv.length !== 3) errors.cardCvv = 'CVV must be 3 digits';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setProcessing(true);
    
    // Simulate payment processing for 1.8 seconds
    setTimeout(() => {
      setProcessing(false);
      const orderId = `IS-${Math.floor(100000 + Math.random() * 900000)}-IN`;
      onOrderSuccess({
        orderId,
        shippingName: name,
        shippingAddress: `${address}, ${city} - ${pinCode}`,
        payable: finalPayable,
        itemsCount: cartItems.length
      });
    }, 1800);
  };

  return (
    <section style={styles.container} className="container animate-fade-in">
      <button onClick={onGoBack} style={styles.backBtn}>
        ← Back to Cart / Edit Design
      </button>

      <h1 style={styles.pageTitle}>Secure Checkout</h1>
      <div style={styles.sectionDivider}></div>

      {processing ? (
        <div style={styles.loadingBox}>
          <div className="loading-spinner" style={styles.spinner}></div>
          <h3 style={styles.loadingText}>Processing Secure Payment...</h3>
          <p style={styles.loadingSub}>Please do not refresh the page or click back.</p>
        </div>
      ) : (
        <div style={styles.layout}>
          {/* Shipping and Payment Forms */}
          <form onSubmit={handlePlaceOrder} style={styles.formSection}>
            {/* Step 1: Address */}
            <div style={styles.panel}>
              <h3 style={styles.panelTitle}>1. Delivery Address</h3>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  style={{...styles.input, borderColor: formErrors.name ? 'var(--color-error)' : 'var(--color-border)'}}
                  placeholder="Jayesh Sharma"
                />
                {formErrors.name && <span style={styles.error}>{formErrors.name}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Street Address</label>
                <input 
                  type="text" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)}
                  style={{...styles.input, borderColor: formErrors.address ? 'var(--color-error)' : 'var(--color-border)'}}
                  placeholder="House No, Apartment, Landmark, Area"
                />
                {formErrors.address && <span style={styles.error}>{formErrors.address}</span>}
              </div>

              <div style={styles.row}>
                <div style={{...styles.formGroup, flex: 1}}>
                  <label style={styles.label}>City</label>
                  <input 
                    type="text" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                    style={{...styles.input, borderColor: formErrors.city ? 'var(--color-error)' : 'var(--color-border)'}}
                    placeholder="Mumbai"
                  />
                  {formErrors.city && <span style={styles.error}>{formErrors.city}</span>}
                </div>
                
                <div style={{...styles.formGroup, flex: 1}}>
                  <label style={styles.label}>PIN Code</label>
                  <input 
                    type="text" 
                    maxLength="6"
                    value={pinCode} 
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    style={{...styles.input, borderColor: formErrors.pinCode ? 'var(--color-error)' : 'var(--color-border)'}}
                    placeholder="400001"
                  />
                  {formErrors.pinCode && <span style={styles.error}>{formErrors.pinCode}</span>}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number (For delivery updates)</label>
                <input 
                  type="text" 
                  maxLength="10"
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  style={{...styles.input, borderColor: formErrors.phone ? 'var(--color-error)' : 'var(--color-border)'}}
                  placeholder="9876543210"
                />
                {formErrors.phone && <span style={styles.error}>{formErrors.phone}</span>}
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div style={styles.panel}>
              <h3 style={styles.panelTitle}>2. Payment Method</h3>
              
              <div style={styles.tabGroup}>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    ...styles.paymentTab, 
                    borderColor: paymentMethod === 'card' ? 'var(--color-secondary)' : 'var(--color-border)',
                    backgroundColor: paymentMethod === 'card' ? '#f0f9ff' : '#ffffff'
                  }}
                >
                  💳 Credit/Debit Card
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  style={{
                    ...styles.paymentTab, 
                    borderColor: paymentMethod === 'upi' ? 'var(--color-secondary)' : 'var(--color-border)',
                    backgroundColor: paymentMethod === 'upi' ? '#f0f9ff' : '#ffffff'
                  }}
                >
                  📱 UPI / PhonePe / GPay
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  style={{
                    ...styles.paymentTab, 
                    borderColor: paymentMethod === 'cod' ? 'var(--color-secondary)' : 'var(--color-border)',
                    backgroundColor: paymentMethod === 'cod' ? '#f0f9ff' : '#ffffff'
                  }}
                >
                  📦 Cash on Delivery
                </button>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div style={styles.paymentDetails}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Card Number</label>
                    <input 
                      type="text" 
                      maxLength="16"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      style={{...styles.input, borderColor: formErrors.cardNumber ? 'var(--color-error)' : 'var(--color-border)'}}
                      placeholder="1234 5678 9101 1121"
                    />
                    {formErrors.cardNumber && <span style={styles.error}>{formErrors.cardNumber}</span>}
                  </div>
                  
                  <div style={styles.row}>
                    <div style={{...styles.formGroup, flex: 1}}>
                      <label style={styles.label}>Expiry Date</label>
                      <input 
                        type="text" 
                        maxLength="5"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        style={{...styles.input, borderColor: formErrors.cardExpiry ? 'var(--color-error)' : 'var(--color-border)'}}
                        placeholder="MM/YY"
                      />
                      {formErrors.cardExpiry && <span style={styles.error}>{formErrors.cardExpiry}</span>}
                    </div>

                    <div style={{...styles.formGroup, flex: 1}}>
                      <label style={styles.label}>CVV</label>
                      <input 
                        type="password" 
                        maxLength="3"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        style={{...styles.input, borderColor: formErrors.cardCvv ? 'var(--color-error)' : 'var(--color-border)'}}
                        placeholder="***"
                      />
                      {formErrors.cardCvv && <span style={styles.error}>{formErrors.cardCvv}</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Inputs */}
              {paymentMethod === 'upi' && (
                <div style={styles.paymentDetails}>
                  <p style={styles.upiInfo}>Scan the QR Code on display at check-out or enter your VPA / UPI ID below:</p>
                  <div style={styles.qrMockup}>
                    <div style={styles.qrInner}>
                      {/* Simulated QR block */}
                      <span style={{fontSize: '48px'}}>🔳</span>
                    </div>
                    <span style={styles.qrText}>Mock UPI Merchant QR</span>
                  </div>
                  <div style={styles.formGroup}>
                    <input 
                      type="text" 
                      style={styles.input} 
                      placeholder="username@upi"
                    />
                  </div>
                </div>
              )}

              {/* COD info */}
              {paymentMethod === 'cod' && (
                <div style={styles.paymentDetails}>
                  <p style={{...styles.upiInfo, color: 'var(--color-success)', fontWeight: '600'}}>
                    ✓ Cash on Delivery selected. Pay at your doorstep upon receiving the prints.
                  </p>
                </div>
              )}
            </div>
            
            <button type="submit" className="btn btn-secondary" style={styles.orderBtn}>
              Place Order & Print Now 🖨️
            </button>
          </form>

          {/* Right Section: Order summary breakdown */}
          <div style={styles.summarySection}>
            <div style={styles.summaryPanel}>
              <h3 style={styles.panelTitle}>Order Summary</h3>
              <div style={styles.summaryList}>
                {cartItems.map((item, idx) => (
                  <div key={idx} style={styles.summaryItem}>
                    <div style={styles.summaryItemDesc}>
                      <span style={styles.summaryItemName}>{item.name}</span>
                      <span style={styles.summaryItemQty}>Qty: {item.quantity}</span>
                    </div>
                    <span style={styles.summaryItemVal}>₹{item.price}</span>
                  </div>
                ))}
              </div>

              <div style={styles.sectionDivider}></div>

              <div style={styles.summaryRow}>
                <span>Items Subtotal</span>
                <span>₹{cartItems.reduce((acc, item) => acc + item.price, 0)}</span>
              </div>
              
              {promoDiscount > 0 && (
                <div style={{...styles.summaryRow, color: 'var(--color-success)', fontWeight: '600'}}>
                  <span>Promo Discount Applied</span>
                  <span>-₹{promoDiscount}</span>
                </div>
              )}

              <div style={styles.summaryRow}>
                <span>GST Tax (18%)</span>
                <span>₹{tax}</span>
              </div>

              <div style={styles.summaryRow}>
                <span>Shipping Fee</span>
                <span>{shipping === 0 ? <strong style={{color: 'var(--color-success)'}}>FREE</strong> : `₹${shipping}`}</span>
              </div>

              <div style={styles.sectionDivider}></div>

              <div style={{...styles.summaryRow, fontSize: '18px', fontWeight: '700'}}>
                <span>Grand Total</span>
                <span>₹{finalPayable}</span>
              </div>
            </div>

            {/* Satisfaction Guarantee Badge */}
            <div style={styles.guaranteeBox}>
              <span style={styles.guaranteeIcon}>🛡️</span>
              <div>
                <h4 style={styles.guaranteeTitle}>Satisfaction Guaranteed</h4>
                <p style={styles.guaranteeText}>If you're not completely satisfied with your printed custom templates, we'll make it right.</p>
              </div>
            </div>
          </div>
        </div>
      )}
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
  pageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--color-primary)',
  },
  sectionDivider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '20px 0',
  },
  layout: {
    display: 'flex',
    gap: '40px',
  },
  formSection: {
    flex: '1.4',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  panel: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
  },
  panelTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    marginBottom: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '16px',
    position: 'relative',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-text-dark)',
    marginBottom: '6px',
  },
  input: {
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 14px',
    outline: 'none',
    fontSize: '14px',
    transition: 'var(--transition-fast)',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  error: {
    color: 'var(--color-error)',
    fontSize: '11px',
    marginTop: '4px',
    fontWeight: '500',
  },
  tabGroup: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  paymentTab: {
    flex: '1',
    minWidth: '130px',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '12px',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-dark)',
    transition: 'var(--transition-fast)',
  },
  paymentDetails: {
    backgroundColor: '#fafafa',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '20px',
  },
  upiInfo: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    marginBottom: '16px',
  },
  qrMockup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '16px',
  },
  qrInner: {
    padding: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
  },
  qrText: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    marginTop: '4px',
  },
  orderBtn: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '700',
  },
  summarySection: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  summaryPanel: {
    backgroundColor: '#f9f9f9',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
  },
  summaryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
  },
  summaryItemDesc: {
    display: 'flex',
    flexDirection: 'column',
  },
  summaryItemName: {
    fontWeight: '600',
    color: 'var(--color-text-dark)',
  },
  summaryItemQty: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
  },
  summaryItemVal: {
    fontWeight: '700',
    color: 'var(--color-text-dark)',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: 'var(--color-text-dark)',
    marginBottom: '10px',
  },
  guaranteeBox: {
    border: '1px dashed var(--color-secondary)',
    borderRadius: 'var(--radius-lg)',
    padding: '18px',
    display: 'flex',
    gap: '14px',
    backgroundColor: '#f0f9ff',
  },
  guaranteeIcon: {
    fontSize: '28px',
  },
  guaranteeTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0c72a9',
    marginBottom: '2px',
  },
  guaranteeText: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.4',
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0',
    textAlign: 'center',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid var(--color-secondary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  loadingText: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    marginBottom: '6px',
  },
  loadingSub: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
  }
};

// Add spinner keyframes to index.css if not present
export default Checkout;
