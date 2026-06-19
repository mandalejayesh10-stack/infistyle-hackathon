import React, { useState } from 'react';

const Checkout = ({ cartItems, grandTotal, promoDiscount, onOrderSuccess, onGoBack, user }) => {
  // Shipping form state
  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState(user?.shipping_address || '');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [companyName, setCompanyName] = useState(user?.company_name || '');
  const [gstin, setGstin] = useState(user?.gstin || '');
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi' | 'cod'

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Geolocation & maps state
  const [lat, setLat] = useState(19.0760);
  const [lng, setLng] = useState(72.8777);
  const [mapSearch, setMapSearch] = useState('');
  const [mapMsg, setMapMsg] = useState('Centered on default city area. Select or search coordinates below.');
  const [showMap, setShowMap] = useState(false);

  // Razorpay Gateway Simulation Modal
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [razorpayCardNo, setRazorpayCardNo] = useState('');
  const [razorpayCardName, setRazorpayCardName] = useState('');
  const [razorpayExpiry, setRazorpayExpiry] = useState('');
  const [razorpayCvv, setRazorpayCvv] = useState('');
  const [razorpayUpi, setRazorpayUpi] = useState('');
  const [razorpayProcessing, setRazorpayProcessing] = useState(false);
  const [razorpayError, setRazorpayError] = useState('');

  // Processing state
  const [processing, setProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Cost calculations
  const activeSubtotal = Math.max(0, grandTotal - couponDiscount);
  const tax = Math.round(activeSubtotal * 0.18); // 18% GST standard in India
  const shipping = activeSubtotal > 1000 ? 0 : 80; // Free shipping on orders > ₹1,000
  const finalPayable = activeSubtotal + tax + shipping;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'SUMMER20') {
      const discountVal = Math.round(grandTotal * 0.20);
      setAppliedCoupon({ code, type: 'percent', value: 20 });
      setCouponDiscount(discountVal);
    } else if (code === 'WELCOME10') {
      const discountVal = Math.round(grandTotal * 0.10);
      setAppliedCoupon({ code, type: 'percent', value: 10 });
      setCouponDiscount(discountVal);
    } else if (code === 'FIRSTORDER') {
      const discountVal = Math.min(grandTotal, 100);
      setAppliedCoupon({ code, type: 'flat', value: 100 });
      setCouponDiscount(discountVal);
    } else {
      setCouponError('Invalid coupon. Use WELCOME10, FIRSTORDER, or SUMMER20.');
      setAppliedCoupon(null);
      setCouponDiscount(0);
    }
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          setLat(userLat);
          setLng(userLng);
          setMapMsg(`Location auto-detected via GPS: ${userLat.toFixed(4)}, ${userLng.toFixed(4)}`);
          // Auto-fill address details based on location
          setAddress('Regus BKC, G-Block, Bandra Kurla Complex');
          setCity('Mumbai');
          setPinCode('400051');
        },
        () => {
          setMapMsg('GPS Authorization blocked. Defaulting to city center.');
        }
      );
    } else {
      setMapMsg('Geolocation is not supported by your browser.');
    }
  };

  const handleMapSearch = (e) => {
    e.preventDefault();
    if (!mapSearch.trim()) return;
    setMapMsg(`Searching Google Places API for: "${mapSearch}"...`);
    setTimeout(() => {
      if (mapSearch.toLowerCase().includes('delhi')) {
        setLat(28.6139);
        setLng(77.2090);
        setAddress('Connaught Place, Radial Road 3, Near Metro Station Gate');
        setCity('New Delhi');
        setPinCode('110001');
        setMapMsg('Places Auto-complete: Connaught Place, New Delhi');
      } else if (mapSearch.toLowerCase().includes('bangalore') || mapSearch.toLowerCase().includes('bengaluru')) {
        setLat(12.9716);
        setLng(77.5946);
        setAddress('Indiranagar 100 Feet Road, Near HAL Flyover');
        setCity('Bengaluru');
        setPinCode('560038');
        setMapMsg('Places Auto-complete: Indiranagar, Bengaluru');
      } else {
        setLat(19.0760 + (Math.random() - 0.5) * 0.1);
        setLng(72.8777 + (Math.random() - 0.5) * 0.1);
        setAddress(`${mapSearch}, Sector 5, Near Main Market Road`);
        setCity('Mumbai Suburban');
        setPinCode('400072');
        setMapMsg(`Places Auto-complete: ${mapSearch}`);
      }
    }, 600);
  };

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Full Name is required';
    if (!address.trim()) errors.address = 'Street address is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!pinCode.trim() || pinCode.length !== 6) errors.pinCode = 'Enter a valid 6-digit postal PIN code';
    if (!phone.trim() || phone.length < 10) errors.phone = 'Enter a valid 10-digit phone number';
    if (!email.trim() || !email.includes('@')) errors.email = 'Enter a valid email address';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (paymentMethod === 'cod') {
      // Process COD immediately
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        triggerSuccess('cod', 'pending', `COD-${Math.floor(100000 + Math.random() * 900000)}`);
      }, 1500);
    } else {
      // Launch Razorpay Dialog Simulator (Level 7 Verification)
      setRazorpayError('');
      setShowRazorpay(true);
    }
  };

  const submitRazorpayPayment = (e) => {
    e.preventDefault();
    setRazorpayError('');
    
    if (paymentMethod === 'card') {
      if (!razorpayCardNo.trim() || razorpayCardNo.length < 16) {
        setRazorpayError('Please enter a valid 16-digit card number');
        return;
      }
      if (!razorpayExpiry.trim() || !razorpayExpiry.includes('/')) {
        setRazorpayError('Please enter a valid expiry MM/YY');
        return;
      }
      if (!razorpayCvv.trim() || razorpayCvv.length !== 3) {
        setRazorpayError('Please enter a 3-digit CVV');
        return;
      }
    } else {
      if (!razorpayUpi.trim() || !razorpayUpi.includes('@')) {
        setRazorpayError('Please enter a valid VPA address e.g. name@upi');
        return;
      }
    }

    setRazorpayProcessing(true);
    setTimeout(() => {
      setRazorpayProcessing(false);
      setShowRazorpay(false);
      // Success triggers verified signature
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        const paymentId = `pay_${Math.random().toString(36).substring(2, 11)}`;
        triggerSuccess(paymentMethod, 'paid', paymentId);
      }, 1200);
    }, 1800);
  };

  const triggerSuccess = (method, status, paymentId) => {
    const orderId = `IS-${Math.floor(100000 + Math.random() * 900000)}-IN`;
    onOrderSuccess({
      orderId,
      shippingName: name,
      shippingAddress: `${address}, ${city} - ${pinCode}`,
      latitude: lat,
      longitude: lng,
      subtotal: grandTotal,
      discount: couponDiscount,
      tax_amount: tax,
      payable: finalPayable,
      itemsCount: cartItems.length,
      phone,
      email,
      paymentMethod: method,
      paymentStatus: status,
      paymentId,
      companyName,
      gstin
    });
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
          <h3 style={styles.loadingText}>Verifying Payment & Routing Order...</h3>
          <p style={styles.loadingSub}>Fulfillment logs are updating in the background. Please wait.</p>
        </div>
      ) : (
        <div style={styles.layout}>
          {/* Left Side: Checkout Forms */}
          <form onSubmit={handlePlaceOrder} style={styles.formSection}>
            {/* Step 1: Delivery Address */}
            <div style={styles.panel}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h3 style={{...styles.panelTitle, margin: 0}}>1. Shipping & Billing Details</h3>
                <button 
                  type="button" 
                  onClick={() => setShowMap(!showMap)} 
                  style={styles.mapToggleBtn}
                >
                  📍 {showMap ? 'Hide Map Picker' : 'Show Map Location Picker'}
                </button>
              </div>

              {/* Swiggy/Zepto-style Map Address Picker */}
              {showMap && (
                <div style={styles.mapPickerBox}>
                  <div style={styles.mapSearchRow}>
                    <input 
                      type="text" 
                      value={mapSearch}
                      onChange={(e) => setMapSearch(e.target.value)}
                      placeholder="Search landmark, building, street..."
                      style={styles.mapSearchInput}
                    />
                    <button type="button" onClick={handleMapSearch} style={styles.mapSearchBtn}>Search Area</button>
                  </div>
                  
                  <div style={styles.mapCanvas}>
                    {/* Simulated Swiggy Map Pin */}
                    <div style={styles.mapPinContainer}>
                      <span style={{fontSize: '36px', zIndex: 2}}>📍</span>
                      <div style={styles.pinShadow}></div>
                    </div>
                    {/* Map Grid Grid lines representing streets */}
                    <div style={styles.mapGridBackground}></div>
                  </div>

                  <div style={styles.mapFooter}>
                    <span style={styles.mapCoordinates}>Coordinates Locked: {lat.toFixed(5)}, {lng.toFixed(5)}</span>
                    <button type="button" onClick={handleDetectLocation} style={styles.mapDetectBtn}>⚡ Auto-Detect GPS</button>
                  </div>
                  <p style={styles.mapAlert}>{mapMsg}</p>
                </div>
              )}

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

              <div style={styles.row}>
                <div style={{...styles.formGroup, flex: 1}}>
                  <label style={styles.label}>Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    style={{...styles.input, borderColor: formErrors.email ? 'var(--color-error)' : 'var(--color-border)'}}
                    placeholder="jayesh@acme.com"
                  />
                  {formErrors.email && <span style={styles.error}>{formErrors.email}</span>}
                </div>
                
                <div style={{...styles.formGroup, flex: 1}}>
                  <label style={styles.label}>Phone Number</label>
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

              <div style={styles.row}>
                <div style={{...styles.formGroup, flex: 1}}>
                  <label style={styles.label}>Company Name (Optional)</label>
                  <input 
                    type="text" 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)}
                    style={styles.input}
                    placeholder="Acme Corporation"
                  />
                </div>
                
                <div style={{...styles.formGroup, flex: 1}}>
                  <label style={styles.label}>GSTIN / GST Number (Optional)</label>
                  <input 
                    type="text" 
                    maxLength="15"
                    value={gstin} 
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    style={styles.input}
                    placeholder="27AAAAA1111A1Z1"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Street Address</label>
                <input 
                  type="text" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)}
                  style={{...styles.input, borderColor: formErrors.address ? 'var(--color-error)' : 'var(--color-border)'}}
                  placeholder="Flat/House No, Building, Area Road"
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
            </div>

            {/* Step 2: Payment Method */}
            <div style={styles.panel}>
              <h3 style={styles.panelTitle}>2. Payment Method (Razorpay Secured)</h3>
              
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
                  📱 UPI (PhonePe / GPay)
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  style={{
                    ...styles.paymentTab, 
                    borderColor: paymentMethod === 'cod' ? 'var(--color-secondary)' : 'var(--color-border)',
                    backgroundColor: paymentMethod === 'cod' ? '#fef7e0' : '#ffffff'
                  }}
                >
                  📦 Cash on Delivery (COD)
                </button>
              </div>

              {/* COD description */}
              {paymentMethod === 'cod' && (
                <div style={styles.paymentDetails}>
                  <p style={{...styles.upiInfo, color: '#b06000', fontWeight: '600', margin: 0}}>
                    ✓ Cash on Delivery selected. Verify order details below and proceed to generate printing invoice.
                  </p>
                </div>
              )}

              {/* Card / UPI notice */}
              {paymentMethod !== 'cod' && (
                <div style={styles.paymentDetails}>
                  <p style={{...styles.upiInfo, margin: 0}}>
                    🔒 Click place order to proceed to the secure Razorpay payment window. Do not refresh.
                  </p>
                </div>
              )}
            </div>
            
            <button type="submit" className="btn btn-secondary" style={styles.orderBtn}>
              {paymentMethod === 'cod' ? 'Confirm COD Order 📦' : 'Secure Online Payment ⚡'}
            </button>
          </form>

          {/* Right Side: Order Summary & Coupon code */}
          <div style={styles.summarySection}>
            {/* Coupon Code Panel */}
            <div style={styles.panel}>
              <h3 style={{...styles.panelTitle, marginBottom: '12px'}}>Apply Coupon</h3>
              <form onSubmit={handleApplyCoupon} style={styles.couponForm}>
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="SUMMER20"
                  style={styles.couponInput}
                />
                <button type="submit" style={styles.couponBtn}>Apply</button>
              </form>
              {appliedCoupon && (
                <p style={{color: 'var(--color-success)', fontSize: '12px', fontWeight: '600', marginTop: '6px', margin: 0}}>
                  ✓ Coupon "{appliedCoupon.code}" applied! Save ₹{couponDiscount}
                </p>
              )}
              {couponError && (
                <p style={{color: 'var(--color-error)', fontSize: '12px', fontWeight: '600', marginTop: '6px', margin: 0}}>
                  × {couponError}
                </p>
              )}
            </div>

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
                <span>₹{grandTotal}</span>
              </div>
              
              {couponDiscount > 0 && (
                <div style={{...styles.summaryRow, color: 'var(--color-success)', fontWeight: '600'}}>
                  <span>Coupon Discount</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}

              <div style={styles.summaryRow}>
                <span>18% GST Breakdown</span>
                <span>₹{tax}</span>
              </div>

              <div style={styles.summaryRow}>
                <span>Shipping Fee</span>
                <span>{shipping === 0 ? <strong style={{color: 'var(--color-success)'}}>FREE</strong> : `₹${shipping}`}</span>
              </div>

              <div style={styles.sectionDivider}></div>

              <div style={{...styles.summaryRow, fontSize: '18px', fontWeight: '800'}}>
                <span>Grand Total</span>
                <span>₹{finalPayable}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Razorpay Gateway Modal Simulator */}
      {showRazorpay && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.razorpayHeader}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span style={{fontSize: '20px'}}>💳</span>
                <span style={{fontWeight: '800', fontSize: '16px', color: '#ffffff'}}>Razorpay Secure Checkout</span>
              </div>
              <button style={styles.razorpayClose} onClick={() => setShowRazorpay(false)}>×</button>
            </div>
            
            <div style={styles.razorpayAmountBar}>
              <span>Paying to InfiStyle India:</span>
              <strong style={{fontSize: '18px'}}>₹{finalPayable}</strong>
            </div>

            <form onSubmit={submitRazorpayPayment} style={styles.modalBody}>
              {razorpayError && <div style={styles.razorpayError}>{razorpayError}</div>}
              
              {paymentMethod === 'card' ? (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.modalLabel}>Credit / Debit Card Number</label>
                    <input 
                      type="text" 
                      maxLength="16"
                      value={razorpayCardNo}
                      onChange={(e) => setRazorpayCardNo(e.target.value.replace(/\D/g, ''))}
                      placeholder="4321 5678 9101 1121"
                      style={styles.modalInput}
                      required
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.modalLabel}>Card Holder Name</label>
                    <input 
                      type="text" 
                      value={razorpayCardName}
                      onChange={(e) => setRazorpayCardName(e.target.value)}
                      placeholder="Jayesh Sharma"
                      style={styles.modalInput}
                      required
                    />
                  </div>

                  <div style={styles.row}>
                    <div style={{...styles.formGroup, flex: 1}}>
                      <label style={styles.modalLabel}>Expiry Date</label>
                      <input 
                        type="text" 
                        maxLength="5"
                        value={razorpayExpiry}
                        onChange={(e) => setRazorpayExpiry(e.target.value)}
                        placeholder="MM/YY"
                        style={styles.modalInput}
                        required
                      />
                    </div>
                    <div style={{...styles.formGroup, flex: 1}}>
                      <label style={styles.modalLabel}>CVV Code</label>
                      <input 
                        type="password" 
                        maxLength="3"
                        value={razorpayCvv}
                        onChange={(e) => setRazorpayCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="***"
                        style={styles.modalInput}
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div style={styles.formGroup}>
                  <label style={styles.modalLabel}>UPI Virtual Payment Address (VPA)</label>
                  <input 
                    type="text" 
                    value={razorpayUpi}
                    onChange={(e) => setRazorpayUpi(e.target.value)}
                    placeholder="jayesh@paytm"
                    style={styles.modalInput}
                    required
                  />
                  <span style={{fontSize: '11px', color: '#666', marginTop: '4px'}}>Supports GPay, PhonePe, Paytm, and BHIM App</span>
                </div>
              )}

              {razorpayProcessing ? (
                <div style={{textAlign: 'center', padding: '10px 0'}}>
                  <span style={{fontSize: '13px', color: '#0f62fe', fontWeight: 'bold'}}>🔒 Verifying transaction signature & bank protocols...</span>
                </div>
              ) : (
                <button type="submit" style={styles.razorpaySubmit}>
                  Authorize Payment (₹{finalPayable})
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

const styles = {
  container: {
    padding: '40px 0 80px',
    fontFamily: 'var(--font-primary)',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-secondary)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    padding: '0',
    marginBottom: '20px',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#111111',
    margin: 0,
  },
  sectionDivider: {
    height: '1.5px',
    backgroundColor: 'var(--color-border)',
    margin: '20px 0',
  },
  layout: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
  },
  formSection: {
    flex: '1.4',
    minWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  panel: {
    backgroundColor: '#ffffff',
    border: '1.5px solid var(--color-border)',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 4px 10px rgba(255, 204, 0, 0.03)',
  },
  panelTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#111111',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  mapToggleBtn: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-secondary)',
    backgroundColor: '#f0f9ff',
    border: '1px solid var(--color-secondary)',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  mapPickerBox: {
    backgroundColor: '#fffdf5',
    border: '1.5px solid var(--color-border)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px',
  },
  mapSearchRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '12px',
  },
  mapSearchInput: {
    flex: 1,
    border: '1.5px solid var(--color-border)',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '13px',
    outline: 'none',
    backgroundColor: '#ffffff'
  },
  mapSearchBtn: {
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '700',
    backgroundColor: 'var(--color-primary)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  mapCanvas: {
    height: '180px',
    backgroundColor: '#e5e9f0',
    borderRadius: '6px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    border: '1.5px solid var(--color-border)',
  },
  mapPinContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  pinShadow: {
    width: '12px',
    height: '4px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '50%',
    marginTop: '-4px',
  },
  mapGridBackground: {
    position: 'absolute',
    width: '200%',
    height: '200%',
    backgroundImage: 'radial-gradient(circle, #ccc 1px, transparent 1px)',
    backgroundSize: '16px 16px',
    opacity: 0.5,
  },
  mapFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  mapCoordinates: {
    fontSize: '11px',
    color: '#666',
    fontWeight: '700',
  },
  mapDetectBtn: {
    padding: '8px 12px',
    fontSize: '11px',
    fontWeight: '800',
    color: '#ffffff',
    backgroundColor: 'var(--color-secondary)',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  mapAlert: {
    fontSize: '11px',
    color: '#b06000',
    margin: '8px 0 0 0',
    fontWeight: '700'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '16px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#555',
    marginBottom: '6px',
  },
  input: {
    border: '1.5px solid var(--color-border)',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  row: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  error: {
    color: 'var(--color-error)',
    fontSize: '12px',
    marginTop: '4px',
    fontWeight: '600',
  },
  tabGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  paymentTab: {
    flex: 1,
    padding: '14px',
    fontSize: '13px',
    fontWeight: '700',
    border: '1.5px solid var(--color-border)',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none',
  },
  paymentDetails: {
    backgroundColor: '#fffdf5',
    border: '1.5px solid var(--color-border)',
    borderRadius: '6px',
    padding: '16px',
    marginTop: '12px',
  },
  upiInfo: {
    fontSize: '13px',
    color: '#555',
    lineHeight: '1.5',
  },
  orderBtn: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '800',
    backgroundColor: 'var(--color-primary)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  summarySection: {
    flex: '1',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  couponForm: {
    display: 'flex',
    gap: '8px',
  },
  couponInput: {
    flex: 1,
    border: '1.5px solid var(--color-border)',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '14px',
    outline: 'none',
  },
  couponBtn: {
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '700',
    backgroundColor: 'var(--color-primary)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  summaryPanel: {
    backgroundColor: '#ffffff',
    border: '1.5px solid var(--color-accent)',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(255, 204, 0, 0.05)',
  },
  summaryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
  },
  summaryItemDesc: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  summaryItemName: {
    fontWeight: '700',
    color: '#111111',
  },
  summaryItemQty: {
    fontSize: '11px',
    color: '#666666',
  },
  summaryItemVal: {
    fontWeight: '700',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    marginBottom: '8px',
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
    textAlign: 'center',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid var(--color-secondary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  loadingText: {
    fontSize: '18px',
    fontWeight: '800',
  },
  loadingSub: {
    fontSize: '13px',
    color: '#666',
    marginTop: '6px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '450px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
  },
  razorpayHeader: {
    backgroundColor: '#0f62fe',
    color: '#ffffff',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  razorpayClose: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '24px',
    cursor: 'pointer',
    lineHeight: '1',
  },
  razorpayAmountBar: {
    backgroundColor: '#f4f6fa',
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '13px',
    color: '#444',
  },
  modalBody: {
    padding: '20px',
  },
  modalLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#333333',
    marginBottom: '4px',
    textTransform: 'uppercase',
  },
  modalInput: {
    border: '1.5px solid #cbd5e1',
    borderRadius: '6px',
    padding: '10px 12px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  razorpayError: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    border: '1px solid #fee2e2',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  razorpaySubmit: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#0f62fe',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '700',
    marginTop: '12px',
    transition: 'background-color 0.2s',
  }
};

export default Checkout;
