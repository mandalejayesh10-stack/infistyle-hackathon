import React, { useState } from 'react';

const OrderDetail = ({ 
  order, 
  userRole = 'customer', 
  onUpdateStatus, 
  onUpdateInternalNotes,
  onUpdateTags,
  onDownloadInvoice,
  onGoBack,
  onRaiseReplacement,
  onSendNotification
}) => {
  const [internalNotes, setInternalNotes] = useState(order.internal_notes || '');
  const [newTag, setNewTag] = useState('');
  const [showReplacementModal, setShowReplacementModal] = useState(false);
  const [replacementReason, setReplacementReason] = useState('Wrong Print');
  const [replacementDesc, setReplacementDesc] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  // 10-Stage Production Workflow
  const stages = [
    { label: 'Order Received', icon: '📥' },
    { label: 'Payment Verified', icon: '💳' },
    { label: 'Design Review', icon: '🔍' },
    { label: 'Printing Queue', icon: '🗂️' },
    { label: 'Printing Started', icon: '🖨️' },
    { label: 'Quality Check', icon: '✨' },
    { label: 'Packed', icon: '📦' },
    { label: 'Shipped', icon: '🚚' },
    { label: 'Delivered', icon: '✓' }
  ];

  // Helper to determine active index
  const getCurrentStageIndex = () => {
    const status = order.status || '';
    if (status.includes('Delivered')) return 8;
    if (status.includes('Shipped')) return 7;
    if (status.includes('Packed')) return 6;
    if (status.includes('Quality Check')) return 5;
    if (status.includes('Printing Started')) return 4;
    if (status.includes('Printing Queue')) return 3;
    if (status.includes('Design Review')) return 2;
    if (status.includes('Payment Verified')) return 1;
    return 0; // Order Received
  };

  const currentStageIndex = getCurrentStageIndex();

  const handleNotesSave = () => {
    onUpdateInternalNotes(order.id, internalNotes);
    triggerAlert('Internal admin notes updated successfully!');
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    const updatedTags = [...(order.tags || []), newTag.trim()];
    onUpdateTags(order.id, updatedTags);
    setNewTag('');
    triggerAlert(`Tag "${newTag}" added successfully!`);
  };

  const triggerAlert = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(''), 4000);
  };

  const handleCommunication = (channel) => {
    let msg = '';
    const phone = order.phone || '9876543210';
    const email = order.email || 'customer@infistyle.com';
    
    if (channel === 'whatsapp') {
      msg = `[WhatsApp Alert Sim]: Notification sent to +91 ${phone} for Order ${order.id}. Current Status: ${order.status}`;
    } else if (channel === 'email') {
      msg = `[Email Notification Sim]: Transactional confirmation details sent to ${email} for Order ${order.id}`;
    } else if (channel === 'call') {
      msg = `[Call Service Sim]: Dialing client phone +91 ${phone} directly via Web-RTC panel...`;
    }
    triggerAlert(msg);
    if (onSendNotification) {
      onSendNotification(order.id, channel, msg);
    }
  };

  const submitReplacement = (e) => {
    e.preventDefault();
    onRaiseReplacement(order.id, {
      reason: replacementReason,
      description: replacementDesc
    });
    setShowReplacementModal(false);
    setReplacementDesc('');
    triggerAlert('Your reprint/replacement request has been logged successfully. Admin will review!');
  };

  // Cost breakups
  const subtotal = order.subtotal || order.payable;
  const discount = order.discount || 0;
  const gst = order.tax_amount || Math.round((subtotal - discount) * 0.18);
  const total = order.payable_amount || order.payable;

  // Extract items
  const items = Array.isArray(order.items) 
    ? order.items 
    : [{ name: order.items, size: 'M', color: 'Custom Blue', quantity: 1, config: {} }];

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Alert Banner */}
      {alertMessage && (
        <div style={styles.alertBanner}>
          <span>{alertMessage}</span>
          <button style={styles.alertClose} onClick={() => setAlertMessage('')}>×</button>
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <button onClick={onGoBack} style={styles.backBtn}>
          ← Back to List
        </button>
        <div style={styles.headerInfo}>
          <div style={styles.titleRow}>
            <h1 style={styles.orderTitle}>Order details for #{order.id}</h1>
            <span style={{
              ...styles.statusBadge, 
              backgroundColor: order.payment_status === 'paid' ? '#e6f4ea' : '#fef7e0',
              color: order.payment_status === 'paid' ? '#137333' : '#b06000'
            }}>
              💳 {order.payment_status === 'paid' ? 'Paid (Verified)' : 'COD / Unverified'}
            </span>
          </div>
          <p style={styles.orderDate}>Placed on: {order.created_at ? order.created_at.split('T')[0] : new Date().toISOString().split('T')[0]}</p>
          {order.tags && order.tags.length > 0 && (
            <div style={styles.tagList}>
              {order.tags.map(tag => (
                <span key={tag} style={styles.tagItem}>🏷️ {tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={styles.sectionDivider}></div>

      {/* Split layout */}
      <div style={styles.layout}>
        {/* Left Side: Order details */}
        <div style={styles.detailsCol}>
          {/* Section: Workflow Timeline */}
          <div style={styles.card}>
            <h3 style={styles.cardHeader}>Fulfillment Operations Timeline</h3>
            <div style={styles.timeline}>
              {stages.map((stage, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <div key={idx} style={styles.timelineStep}>
                    <div style={{
                      ...styles.timelineBullet,
                      backgroundColor: isCurrent ? 'var(--color-secondary)' : isPassed ? '#4caf50' : '#e0e0e0',
                      color: isPassed ? '#ffffff' : '#888888',
                      fontWeight: isCurrent ? '700' : '400'
                    }}>
                      {stage.icon}
                    </div>
                    <div style={styles.timelineContent}>
                      <span style={{
                        ...styles.timelineLabel,
                        fontWeight: isCurrent ? '700' : '500',
                        color: isCurrent ? 'var(--color-secondary)' : isPassed ? '#111111' : '#888888'
                      }}>
                        {stage.label}
                      </span>
                      {isCurrent && <span style={styles.activeLabel}>Active Stage</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {userRole === 'admin' && (
              <div style={styles.adminWorkflowControls}>
                <h4 style={styles.subTitle}>Production Console Controls</h4>
                <div style={styles.btnRow}>
                  <button 
                    disabled={currentStageIndex === 0}
                    onClick={() => onUpdateStatus(order.id, stages[currentStageIndex - 1].label)}
                    style={{...styles.controlBtn, opacity: currentStageIndex === 0 ? 0.5 : 1}}
                  >
                    ⏮ Previous Stage
                  </button>
                  <button 
                    disabled={currentStageIndex === stages.length - 1}
                    onClick={() => onUpdateStatus(order.id, stages[currentStageIndex + 1].label)}
                    style={{
                      ...styles.controlBtn, 
                      backgroundColor: 'var(--color-secondary)', 
                      color: '#ffffff',
                      opacity: currentStageIndex === stages.length - 1 ? 0.5 : 1
                    }}
                  >
                    Advance Stage ⏭
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section: Products Details */}
          <div style={styles.card}>
            <h3 style={styles.cardHeader}>Items & Design Layouts</h3>
            {items.map((item, idx) => (
              <div key={idx} style={styles.productRow}>
                <div style={styles.productLeft}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={styles.productImg} />
                  ) : (
                    <div style={styles.productImgPlaceholder}>👕</div>
                  )}
                  <div style={styles.productMeta}>
                    <h4 style={styles.productName}>{item.name}</h4>
                    <p style={styles.productSpecs}>
                      Size: <strong>{item.config?.shirtSize || item.size || 'N/A'}</strong> | 
                      Quantity: <strong>{item.quantity}</strong> | 
                      Price: <strong>₹{item.price}</strong>
                    </p>
                    
                    {item.config && (
                      <div style={styles.customizerSpecs}>
                        <p style={styles.specLabel}>Customization Configuration Parameters:</p>
                        <ul style={styles.specList}>
                          {item.config.companyName && <li>Company: <strong>{item.config.companyName}</strong></li>}
                          {item.config.fullName && <li>Full Name: <strong>{item.config.fullName}</strong></li>}
                          {item.config.title && <li>Title: <strong>{item.config.title}</strong></li>}
                          {item.config.phone && <li>Phone: <strong>{item.config.phone}</strong></li>}
                          {item.config.email && <li>Email: <strong>{item.config.email}</strong></li>}
                          {item.config.fontFamily && <li>Font Family: <strong>{item.config.fontFamily}</strong></li>}
                          {item.config.corners && <li>Corners: <strong>{item.config.corners}</strong></li>}
                          {item.config.paperFinish && <li>Finish: <strong>{item.config.paperFinish}</strong></li>}
                          {item.config.frontPrint !== undefined && (
                            <li>Front Print: <strong>{item.config.frontPrint ? 'Yes (+₹100)' : 'No'}</strong></li>
                          )}
                          {item.config.backPrint !== undefined && (
                            <li>Back Print: <strong>{item.config.backPrint ? 'Yes (+₹100)' : 'No'}</strong></li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Design Preview Canvas (Level 4 CX) */}
                <div style={styles.previewCanvas}>
                  <div style={styles.previewCanvasBacking}>
                    {item.image ? (
                      <div style={styles.canvasMock}>
                        <img src={item.image} alt="Overlay preview" style={styles.mockOverlayImage} />
                        {item.config && (
                          <div style={{
                            ...styles.canvasTextOverlay,
                            color: item.config.themeColor || 'var(--color-secondary)',
                            fontFamily: item.config.fontFamily || 'Outfit'
                          }}>
                            {item.config.companyName || 'Logo Label'}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{fontSize: '11px', color: '#999'}}>No Vector Canvas Loaded</span>
                    )}
                  </div>
                  <span style={styles.previewCaption}>Live Vector Canvas Mockup</span>
                </div>
              </div>
            ))}
          </div>

          {/* Customer / Shiprocket tracking details */}
          <div style={styles.card}>
            <h3 style={styles.cardHeader}>Courier Tracking (Shiprocket Fulfillments)</h3>
            <div style={styles.courierBox}>
              <div style={styles.receiptRow}>
                <span>Carrier Partner:</span>
                <strong>{order.courier_partner || 'Pending Partner Assignment'}</strong>
              </div>
              <div style={styles.receiptRow}>
                <span>Tracking Waybill (AWB):</span>
                <strong>{order.tracking_number || 'Pending Dispatch'}</strong>
              </div>
              {order.tracking_number && (
                <div style={styles.trackingCheckpoints}>
                  <div style={styles.checkpoint}>
                    <span style={styles.checkBullet}>✓</span>
                    <div>
                      <strong>Shipment Dispatched</strong>
                      <p style={styles.checkDesc}>AWB #{order.tracking_number} registered via Shiprocket node</p>
                    </div>
                  </div>
                  <div style={styles.checkpoint}>
                    <span style={styles.checkBullet}>✓</span>
                    <div>
                      <strong>In-Transit</strong>
                      <p style={styles.checkDesc}>Dispatched from printing center, arriving at local hub</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Shipping & Financial Details */}
        <div style={styles.financeCol}>
          {/* Delivery Address Card */}
          <div style={styles.card}>
            <h3 style={styles.cardHeader}>Delivery & Shipping Coordinates</h3>
            <p style={{fontSize: '14px', margin: '0 0 12px 0'}}>
              <strong>{order.shipping_name}</strong><br />
              {order.shipping_address}<br />
              {order.shipping_city} - {order.shipping_pincode}
            </p>
            
            {/* Interactive map display pin (Level 1 Maps) */}
            <div style={styles.miniMap}>
              <div style={styles.miniMapCanvas}>
                <span style={{fontSize: '32px'}}>📍</span>
                <span style={{fontSize: '11px', fontWeight: 'bold', color: '#333'}}>Centered on {order.latitude ? `${order.latitude.toFixed(4)}, ${order.longitude.toFixed(4)}` : 'Main City'}</span>
              </div>
              <span style={styles.mapLabel}>Swiggy/Zepto Geolocation Coordinates Locked</span>
            </div>
          </div>

          {/* Pricing & GST breakdown */}
          <div style={styles.card}>
            <h3 style={styles.cardHeader}>Billing Invoice Details</h3>
            <div style={styles.costSheet}>
              <div style={styles.receiptRow}>
                <span>Items Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div style={{...styles.receiptRow, color: '#137333'}}>
                  <span>Coupon Discount Applied:</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div style={styles.receiptRow}>
                <span>18% GST (HSN: {order.hsn_code || '4911'}):</span>
                <span>₹{gst}</span>
              </div>
              <div style={styles.receiptRow}>
                <span>CGST (9%) / SGST (9%):</span>
                <span>₹{Math.round(gst/2)} / ₹{Math.round(gst/2)}</span>
              </div>
              <div style={styles.sectionDivider}></div>
              <div style={{...styles.receiptRow, fontSize: '18px', fontWeight: '800'}}>
                <span>Grand Total Paid:</span>
                <span>₹{total}</span>
              </div>
            </div>
            
            <button 
              onClick={() => onDownloadInvoice(order.id)}
              style={styles.invoiceBtn}
            >
              📥 Download GST Invoice PDF
            </button>
          </div>

          {/* Actions depending on user role */}
          {userRole === 'admin' ? (
            <div style={styles.card}>
              <h3 style={styles.cardHeader}>Administrative Controls</h3>
              
              {/* Internal Notes */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Internal Operator Notes</label>
                <textarea 
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  style={styles.textArea}
                  placeholder="Only visible to admins/managers..."
                />
                <button onClick={handleNotesSave} style={styles.saveBtn}>Save Internal Notes</button>
              </div>

              {/* Tags */}
              <form onSubmit={handleAddTag} style={styles.formGroup}>
                <label style={styles.label}>Add Order Tag (e.g. VIP, Urgent)</label>
                <div style={{display: 'flex', gap: '8px'}}>
                  <input 
                    type="text" 
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    style={styles.textInput}
                    placeholder="VIP"
                  />
                  <button type="submit" style={styles.addBtn}>Add</button>
                </div>
              </form>

              {/* Customer Communication Center */}
              <div style={{marginTop: '20px'}}>
                <label style={styles.label}>Customer Communication Center</label>
                <div style={styles.commGrid}>
                  <button onClick={() => handleCommunication('whatsapp')} style={{...styles.commBtn, backgroundColor: '#25d366', color: '#ffffff'}}>WhatsApp</button>
                  <button onClick={() => handleCommunication('email')} style={{...styles.commBtn, backgroundColor: '#0f62fe', color: '#ffffff'}}>Send Email</button>
                  <button onClick={() => handleCommunication('call')} style={{...styles.commBtn, backgroundColor: '#333333', color: '#ffffff'}}>Dial Call</button>
                </div>
              </div>
            </div>
          ) : (
            /* Customer Actions (Reprint / Replacement Request) */
            <div style={styles.card}>
              <h3 style={styles.cardHeader}>Need Assistance?</h3>
              <p style={{fontSize: '13px', color: '#555', lineHeight: '1.5'}}>
                If you received a damaged product, incorrect size, or a printing mismatch, you can open a replacement request within 48 hours of delivery.
              </p>
              
              <button 
                onClick={() => setShowReplacementModal(true)} 
                style={styles.reprintBtn}
              >
                🛠️ Request Reprint / Replacement
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Replacement Request Modal */}
      {showReplacementModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Request Reprint / Replacement</h3>
              <button style={styles.closeBtn} onClick={() => setShowReplacementModal(false)}>×</button>
            </div>
            <form onSubmit={submitReplacement} style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Choose Reason for Reprint</label>
                <select 
                  value={replacementReason}
                  onChange={(e) => setReplacementReason(e.target.value)}
                  style={styles.selectInput}
                >
                  <option value="Wrong Print">Wrong Print / Misalignment</option>
                  <option value="Damaged Product">Damaged Product / Torn Textile</option>
                  <option value="Wrong Size">Wrong Size Delivered</option>
                  <option value="Courier Damage">Damage Caused by Courier</option>
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Explain Issue Details</label>
                <textarea 
                  value={replacementDesc}
                  onChange={(e) => setReplacementDesc(e.target.value)}
                  style={styles.textArea}
                  placeholder="Please describe what is incorrect about the print..."
                  required
                />
              </div>

              <div style={styles.modalFooter}>
                <button type="button" onClick={() => setShowReplacementModal(false)} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.confirmBtn}>Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '0 20px',
    fontFamily: 'var(--font-primary)',
  },
  alertBanner: {
    backgroundColor: '#fff9e6',
    border: '1.5px solid var(--color-border)',
    color: '#b06000',
    padding: '12px 20px',
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '600'
  },
  alertClose: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#b06000'
  },
  header: {
    marginBottom: '20px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-secondary)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    padding: '0',
    marginBottom: '12px',
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  orderTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#111111',
    margin: '0',
  },
  orderDate: {
    fontSize: '13px',
    color: '#666666',
    margin: '0',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '700',
  },
  tagList: {
    display: 'flex',
    gap: '8px',
    marginTop: '6px',
  },
  tagItem: {
    fontSize: '11px',
    backgroundColor: '#f1f3f4',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: '600',
    color: '#5f6368',
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
  detailsCol: {
    flex: '1.5',
    minWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  financeCol: {
    flex: '1',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1.5px solid var(--color-border)',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 4px 10px rgba(255, 204, 0, 0.03)',
  },
  cardHeader: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#111111',
    marginTop: '0',
    marginBottom: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  subTitle: {
    fontSize: '14px',
    fontWeight: '700',
    margin: '20px 0 10px',
    color: '#333',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingLeft: '10px',
  },
  timelineStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  timelineBullet: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  timelineContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  timelineLabel: {
    fontSize: '14px',
  },
  activeLabel: {
    fontSize: '10px',
    backgroundColor: '#e8f0fe',
    color: 'var(--color-secondary)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: '700',
  },
  adminWorkflowControls: {
    borderTop: '1px solid var(--color-border)',
    marginTop: '20px',
    paddingTop: '20px',
  },
  btnRow: {
    display: 'flex',
    gap: '10px',
  },
  controlBtn: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '12px',
    fontWeight: '700',
    border: '1.5px solid var(--color-border)',
    backgroundColor: '#ffffff',
    color: '#333333',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  productRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: '1px solid var(--color-border)',
    gap: '20px',
    flexWrap: 'wrap',
  },
  productLeft: {
    display: 'flex',
    gap: '16px',
    flex: '1.5',
  },
  productImg: {
    width: '80px',
    height: '80px',
    objectFit: 'contain',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    padding: '4px',
    backgroundColor: '#fff',
  },
  productImgPlaceholder: {
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    border: '1.5px dashed var(--color-border)',
    borderRadius: '6px',
    backgroundColor: '#fffdf5',
  },
  productMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  productName: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#111111',
    margin: '0',
  },
  productSpecs: {
    fontSize: '13px',
    color: '#555555',
    margin: '0',
  },
  customizerSpecs: {
    marginTop: '6px',
    fontSize: '12px',
  },
  specLabel: {
    fontWeight: '700',
    color: '#666',
    margin: '0 0 4px 0',
  },
  specList: {
    margin: '0',
    paddingLeft: '16px',
    color: '#444',
  },
  previewCanvas: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  previewCanvasBacking: {
    width: '100px',
    height: '100px',
    backgroundColor: '#fffdf5',
    border: '1.5px solid var(--color-border)',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  canvasMock: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockOverlayImage: {
    width: '80%',
    height: '80%',
    objectFit: 'contain',
  },
  canvasTextOverlay: {
    position: 'absolute',
    bottom: '15%',
    fontSize: '8px',
    fontWeight: '800',
    textShadow: '0 1px 2px rgba(255,255,255,0.8)',
    textAlign: 'center',
    width: '100%',
  },
  previewCaption: {
    fontSize: '10px',
    color: '#888888',
    fontWeight: '600',
  },
  courierBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  trackingCheckpoints: {
    marginTop: '12px',
    borderTop: '1px dashed var(--color-border)',
    paddingTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  checkpoint: {
    display: 'flex',
    gap: '10px',
    fontSize: '13px',
  },
  checkBullet: {
    color: '#4caf50',
    fontWeight: '800',
  },
  checkDesc: {
    margin: '2px 0 0 0',
    fontSize: '11px',
    color: '#666',
  },
  miniMap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  miniMapCanvas: {
    width: '100%',
    height: '120px',
    backgroundColor: '#f5f5f5',
    border: '1.5px dashed var(--color-border)',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  },
  mapLabel: {
    fontSize: '10px',
    color: '#888888',
    fontWeight: '700',
  },
  costSheet: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  receiptRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
  },
  invoiceBtn: {
    width: '100%',
    padding: '12px 0',
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-secondary)',
    backgroundColor: '#ffffff',
    border: '1.5px solid var(--color-secondary)',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
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
  textArea: {
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    padding: '10px',
    fontSize: '13px',
    outline: 'none',
    minHeight: '80px',
    resize: 'vertical',
  },
  saveBtn: {
    marginTop: '8px',
    padding: '8px 12px',
    fontSize: '12px',
    backgroundColor: 'var(--color-primary)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '700',
    alignSelf: 'flex-start',
  },
  textInput: {
    flex: 1,
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '13px',
    outline: 'none',
  },
  addBtn: {
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '700',
    backgroundColor: '#ffffff',
    border: '1.5px solid var(--color-border)',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  commGrid: {
    display: 'flex',
    gap: '8px',
  },
  commBtn: {
    flex: 1,
    padding: '8px 4px',
    fontSize: '11px',
    fontWeight: '700',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  reprintBtn: {
    width: '100%',
    padding: '12px 0',
    fontSize: '13px',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: '#b06000',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '12px',
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
    maxWidth: '500px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  modalHeader: {
    padding: '20px',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '800',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  modalBody: {
    padding: '20px',
  },
  selectInput: {
    border: '1.5px solid var(--color-border)',
    borderRadius: '6px',
    padding: '10px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    outline: 'none',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px',
  },
  cancelBtn: {
    padding: '10px 16px',
    border: '1.5px solid var(--color-border)',
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  confirmBtn: {
    padding: '10px 16px',
    border: 'none',
    backgroundColor: '#b06000',
    color: '#ffffff',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '700',
  }
};

export default OrderDetail;
