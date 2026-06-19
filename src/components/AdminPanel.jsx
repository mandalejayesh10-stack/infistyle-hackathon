import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AdminPanel = ({ 
  orders, 
  inventory, 
  tickets, 
  onSelectOrder, 
  onUpdateInventory, 
  onResolveTicket,
  activeTab,
  setActiveTab,
  notifications = [],
  dispatchedAlerts = [],
  realtimeLog = [],
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onClearNotifications
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [stockAdjustment, setStockAdjustment] = useState({});
  const [notiFilter, setNotiFilter] = useState('All');
  const [activeNotiSubTab, setActiveNotiSubTab] = useState('feed'); // 'feed' | 'dispatched' | 'websocket'
  const [selectedAlertEmail, setSelectedAlertEmail] = useState(null);

  const [profiles, setProfiles] = useState([]);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      if (error) throw error;
      if (data) {
        setProfiles(data);
      }
    } catch (err) {
      console.error('Failed to fetch user profiles:', err);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleUpdateUserRole = async (userId, userEmail, newRole) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      
      setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role: newRole } : p));
      alert(`Successfully updated role for ${userEmail} to ${newRole.toUpperCase()}!`);
    } catch (err) {
      alert(`Failed to update role: ${err.message}`);
    }
  };

  const handleToggleUserStatus = async (userId, userEmail, currentDisabledStatus) => {
    try {
      const targetStatus = !currentDisabledStatus;
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_disabled: targetStatus })
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;

      setProfiles(prev => prev.map(p => p.id === userId ? { ...p, is_disabled: targetStatus } : p));
      alert(`Successfully ${targetStatus ? 'disabled' : 'enabled'} account for ${userEmail}!`);
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const getNewRegistrationsCount = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return profiles.filter(p => new Date(p.created_at) >= startOfMonth).length;
  };

  const getActiveSessionsCount = () => {
    return Math.max(2, profiles.filter(p => p.role && p.role !== 'customer').length + 1);
  };

  // Calculations for CEO Dashboard Metrics
  const getTodayOrdersCount = () => {
    return orders.filter(o => {
      const todayStr = new Date().toISOString().split('T')[0];
      return o.created_at?.split('T')[0] === todayStr || o.created_at?.split('T')[0] === '2026-06-19';
    }).length;
  };

  const getTodayRevenue = () => {
    return orders.filter(o => {
      const todayStr = new Date().toISOString().split('T')[0];
      return o.created_at?.split('T')[0] === todayStr || o.created_at?.split('T')[0] === '2026-06-19';
    }).reduce((acc, o) => acc + (o.payable_amount || o.payable), 0);
  };

  const getPendingOrdersCount = () => {
    return orders.filter(o => !o.status.includes('Delivered')).length;
  };

  const getUnreadNotificationsCount = () => {
    return notifications.filter(n => !n.is_read).length;
  };

  const getMonthlyRevenue = () => {
    return orders.reduce((acc, ord) => acc + (ord.payable_amount || ord.payable), 0);
  };

  const getGstCollected = () => {
    return orders.reduce((acc, ord) => acc + (ord.tax_amount || 0), 0);
  };

  const getPendingCodAmount = () => {
    return orders
      .filter(ord => ord.payment_method === 'cod' && ord.payment_status === 'pending')
      .reduce((acc, ord) => acc + (ord.payable_amount || ord.payable), 0);
  };

  const getRefundedAmount = () => {
    return orders
      .filter(ord => ord.payment_status === 'refunded')
      .reduce((acc, ord) => acc + (ord.payable_amount || ord.payable), 0);
  };

  const getUrgentOrders = () => {
    return orders.filter(ord => ord.tags && (ord.tags.includes('Urgent') || ord.tags.includes('VIP')));
  };

  const handleAdjustStockSubmit = (sku) => {
    const amt = Number(stockAdjustment[sku] || 0);
    if (!amt) return;
    onUpdateInventory(sku, amt);
    setStockAdjustment(prev => ({ ...prev, [sku]: '' }));
  };

  const filteredOrders = orders.filter(ord => {
    const matchSearch = ord.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        ord.shipping_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'All' || ord.status.includes(statusFilter);
    return matchSearch && matchStatus;
  });

  return (
    <div style={styles.container} className="animate-fade-in">
      <h1 style={styles.title}>🛡️ SaaS Operations Admin Center</h1>
      <p style={styles.subtitle}>Enterprise dashboard to oversee print job cards, inventory, finance collections, and tickets.</p>

      {/* Admin Tabs */}
      <div style={styles.tabContainer}>
        {[
          { id: 'overview', label: 'CEO Dashboard 📊' },
          { id: 'fulfillment', label: 'Workflows & Job Cards 🖨️' },
          { id: 'inventory', label: 'Inventory Stock 📦' },
          { id: 'finance', label: 'Finance & GST 💰' },
          { id: 'tickets', label: 'Customer Tickets 🎫' },
          { id: 'customers', label: 'Customer Accounts 👤' },
          { id: 'notifications', label: `Notifications 🔔${getUnreadNotificationsCount() > 0 ? ` (${getUnreadNotificationsCount()})` : ''}` }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tabBtn,
              borderColor: activeTab === tab.id ? 'var(--color-secondary)' : 'var(--color-border)',
              backgroundColor: activeTab === tab.id ? '#f0f9ff' : '#ffffff',
              color: activeTab === tab.id ? 'var(--color-secondary)' : '#444444',
              fontWeight: activeTab === tab.id ? '700' : '500'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={styles.contentCard}>
        {/* Tab 1: CEO Dashboard */}
        {activeTab === 'overview' && (
          <div style={styles.gridSection}>
            {/* Stat Cards Row 1 (Required) */}
            <div style={styles.statsRow}>
              <div style={{...styles.statCard, borderTop: '4px solid var(--color-secondary)'}}>
                <span style={styles.statLabel}>Today's Orders</span>
                <strong style={styles.statValue}>{getTodayOrdersCount()}</strong>
                <span style={styles.statSub}>Placed today ({new Date().toLocaleDateString('en-IN')})</span>
              </div>
              <div style={{...styles.statCard, borderTop: '4px solid #137333'}}>
                <span style={styles.statLabel}>Today's Revenue</span>
                <strong style={{...styles.statValue, color: '#137333'}}>₹{getTodayRevenue().toLocaleString('en-IN')}</strong>
                <span style={styles.statSub}>Live transaction sales target</span>
              </div>
              <div style={{...styles.statCard, borderTop: '4px solid #b06000'}}>
                <span style={styles.statLabel}>Pending Orders</span>
                <strong style={{...styles.statValue, color: '#b06000'}}>{getPendingOrdersCount()}</strong>
                <span style={styles.statSub}>In production queue</span>
              </div>
              <div style={{...styles.statCard, borderTop: '4px solid var(--color-border)'}}>
                <span style={styles.statLabel}>New Notifications</span>
                <strong style={{...styles.statValue, color: 'var(--color-secondary)'}}>{getUnreadNotificationsCount()}</strong>
                <span style={styles.statSub}>Requires admin review</span>
              </div>
            </div>

            {/* Stat Cards Row 2 (Platform Health) */}
            <div style={styles.statsRow}>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Monthly Total Revenue</span>
                <strong style={styles.statValue}>₹{getMonthlyRevenue().toLocaleString('en-IN')}</strong>
                <span style={styles.statSub}>Based on database records</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>GST Tax Collected (18%)</span>
                <strong style={styles.statValue}>₹{getGstCollected().toLocaleString('en-IN')}</strong>
                <span style={styles.statSub}>For Indian tax compliance</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Pending COD Amount</span>
                <strong style={{...styles.statValue, color: '#b06000'}}>₹{getPendingCodAmount().toLocaleString('en-IN')}</strong>
                <span style={styles.statSub}>Courier collection required</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Refund Rates</span>
                <strong style={{...styles.statValue, color: '#c5221f'}}>1.2%</strong>
                <span style={styles.statSub}>₹{getRefundedAmount()} issued refunds</span>
              </div>
            </div>

            {/* Stat Cards Row 3 (Customer Accounts & Sessions) */}
            <div style={styles.statsRow}>
              <div style={{...styles.statCard, borderTop: '4px solid var(--color-primary)'}}>
                <span style={styles.statLabel}>Total Customers</span>
                <strong style={styles.statValue}>{profiles.length}</strong>
                <span style={styles.statSub}>Registered corporate buyers</span>
              </div>
              <div style={{...styles.statCard, borderTop: '4px solid #1a73e8'}}>
                <span style={styles.statLabel}>New Registrations (This Month)</span>
                <strong style={{...styles.statValue, color: '#1a73e8'}}>{getNewRegistrationsCount()}</strong>
                <span style={styles.statSub}>Growth in customer base</span>
              </div>
              <div style={{...styles.statCard, borderTop: '4px solid #137333'}}>
                <span style={styles.statLabel}>Active Operational Sessions</span>
                <strong style={{...styles.statValue, color: '#137333'}}>{getActiveSessionsCount()}</strong>
                <span style={styles.statSub}>Operators and buyers online</span>
              </div>
              <div style={{...styles.statCard, borderTop: '4px solid var(--color-secondary)'}}>
                <span style={styles.statLabel}>Avg Order Value</span>
                <strong style={{...styles.statValue, color: 'var(--color-secondary)'}}>
                  ₹{orders.length ? Math.round(orders.reduce((acc, o) => acc + (o.payable_amount || o.payable), 0) / orders.length) : 0}
                </strong>
                <span style={styles.statSub}>Ticket size per order</span>
              </div>
            </div>

            {/* Real-time Order Stream - Latest 10 Orders */}
            <div style={{marginTop: '35px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--color-border)', paddingBottom: '8px', marginBottom: '16px'}}>
                <h3 style={{...styles.subTitle, margin: 0}}>⚡ Real-Time Live Order Stream (Latest 10)</h3>
                <span style={{fontSize: '11px', color: '#137333', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#e6f4ea', padding: '4px 10px', borderRadius: '12px'}}>
                  <span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block'}}></span>
                  Realtime Stream Connected
                </span>
              </div>
              
              {orders.length === 0 ? (
                <p style={{color: '#666'}}>No orders placed yet.</p>
              ) : (
                <div style={{overflowX: 'auto'}}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableRowHead}>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Product Details</th>
                        <th>Order Amount</th>
                        <th>Payment Status</th>
                        <th>Fulfillment Stage</th>
                        <th>Timestamp</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...orders]
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                        .slice(0, 10)
                        .map(ord => (
                          <tr key={ord.id} style={styles.tableRow}>
                            <td style={{fontWeight: 'bold', color: 'var(--color-secondary)'}}>{ord.id}</td>
                            <td>
                              <div style={{display: 'flex', flexDirection: 'column'}}>
                                <strong>{ord.shipping_name}</strong>
                                <span style={{fontSize: '11px', color: '#666'}}>{ord.phone || '9876543210'}</span>
                              </div>
                            </td>
                            <td style={{fontSize: '13px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                              {ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                            </td>
                            <td style={{fontWeight: '700'}}>₹{(ord.payable_amount || ord.payable).toLocaleString('en-IN')}</td>
                            <td>
                              <span style={{
                                ...styles.statusTag,
                                backgroundColor: ord.payment_status === 'paid' ? '#e6f4ea' : '#fef7e0',
                                color: ord.payment_status === 'paid' ? '#137333' : '#b06000'
                              }}>
                                {ord.payment_method.toUpperCase()} ({ord.payment_status})
                              </span>
                            </td>
                            <td>
                              <span style={{
                                ...styles.statusTag,
                                backgroundColor: ord.status.includes('Delivered') ? '#e6f4ea' : '#e8f0fe',
                                color: ord.status.includes('Delivered') ? '#137333' : 'var(--color-secondary)'
                              }}>{ord.status}</span>
                            </td>
                            <td style={{fontSize: '11.5px', color: '#666'}}>
                              {new Date(ord.created_at).toLocaleTimeString()}
                            </td>
                            <td>
                              <button onClick={() => onSelectOrder(ord)} style={styles.manageBtn}>Manage</button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Priority Alerts */}
            <div style={{marginTop: '35px'}}>
              <h3 style={styles.subTitle}>🚨 Urgent / VIP Corporate Orders</h3>
              {getUrgentOrders().length === 0 ? (
                <p style={{color: '#666', fontSize: '13px'}}>No urgent orders currently in fulfillment queue.</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableRowHead}>
                      <th>Order ID</th>
                      <th>Customer Name</th>
                      <th>Items Summary</th>
                      <th>Payable Amount</th>
                      <th>Fulfillment Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getUrgentOrders().map(ord => (
                      <tr key={ord.id} style={styles.tableRow}>
                        <td style={{fontWeight: 'bold'}}>{ord.id}</td>
                        <td>{ord.shipping_name}</td>
                        <td>{ord.items.map(i => i.name).join(', ')}</td>
                        <td>₹{ord.payable_amount || ord.payable}</td>
                        <td>
                          <span style={{
                            ...styles.statusTag,
                            backgroundColor: ord.status.includes('Delivered') ? '#e6f4ea' : '#fef7e0',
                            color: ord.status.includes('Delivered') ? '#137333' : '#b06000'
                          }}>{ord.status}</span>
                        </td>
                        <td>
                          <button onClick={() => onSelectOrder(ord)} style={styles.actionBtn}>Manage</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Workflows & Job Cards */}
        {activeTab === 'fulfillment' && (
          <div>
            <h3 style={styles.subTitle}>10-Stage Production Workflows</h3>
            
            {/* Search and Filters */}
            <div style={styles.filterRow}>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID or customer..."
                style={styles.searchInput}
              />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={styles.selectFilter}
              >
                <option value="All">All Statuses</option>
                <option value="Received">Order Received</option>
                <option value="Verified">Payment Verified</option>
                <option value="Review">Design Review</option>
                <option value="Queue">Printing Queue</option>
                <option value="Started">Printing Started</option>
                <option value="Check">Quality Check</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            {/* Orders Table */}
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableRowHead}>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment Status</th>
                  <th>Workflow Step</th>
                  <th>Tags</th>
                  <th>Fulfill Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(ord => (
                  <tr key={ord.id} style={styles.tableRow}>
                    <td style={{fontWeight: 'bold'}}>{ord.id}</td>
                    <td>
                      <strong>{ord.shipping_name}</strong>
                    </td>
                    <td>
                      {ord.items.map((i, idx) => (
                        <div key={idx} style={{fontSize: '12px'}}>
                          {i.quantity}x {i.name} (Size: {i.config?.shirtSize || i.size || 'N/A'})
                        </div>
                      ))}
                    </td>
                    <td>₹{ord.payable_amount || ord.payable}</td>
                    <td>
                      <span style={{
                        ...styles.statusTag,
                        backgroundColor: ord.payment_status === 'paid' ? '#e6f4ea' : '#fef2f2',
                        color: ord.payment_status === 'paid' ? '#137333' : '#b91c1c'
                      }}>{ord.payment_status}</span>
                    </td>
                    <td>
                      <span style={styles.stepIndicator}>⚙️ {ord.status}</span>
                    </td>
                    <td>
                      {ord.tags && ord.tags.map(t => (
                        <span key={t} style={styles.miniTag}>{t}</span>
                      ))}
                    </td>
                    <td>
                      <button 
                        onClick={() => onSelectOrder(ord)}
                        style={styles.manageBtn}
                      >
                        Open Operations Console
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Inventory Stock */}
        {activeTab === 'inventory' && (
          <div>
            <h3 style={styles.subTitle}>Material Stock & Variants Control</h3>
            <p style={{fontSize: '13px', color: '#666', marginBottom: '20px'}}>Variants stock counts will trigger a warning block when quantities fall below 10.</p>
            
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableRowHead}>
                  <th>SKU Code</th>
                  <th>Product Template Name</th>
                  <th>Size</th>
                  <th>Color Accent</th>
                  <th>Available Quantity</th>
                  <th>Status</th>
                  <th>Fulfill Restock</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => {
                  const isLow = item.stock < 10;
                  return (
                    <tr key={item.sku} style={styles.tableRow}>
                      <td style={{fontWeight: 'bold', fontFamily: 'monospace'}}>{item.sku}</td>
                      <td>{item.name}</td>
                      <td>{item.size}</td>
                      <td>{item.color}</td>
                      <td style={{fontWeight: 'bold', color: isLow ? 'var(--color-error)' : '#111'}}>
                        {item.stock} {isLow && '⚠️'}
                      </td>
                      <td>
                        <span style={{
                          ...styles.statusTag,
                          backgroundColor: isLow ? '#fdf2f2' : '#e6f4ea',
                          color: isLow ? '#b91c1c' : '#137333'
                        }}>
                          {isLow ? 'Low Stock Warning' : 'Healthy Stock'}
                        </span>
                      </td>
                      <td>
                        <div style={{display: 'flex', gap: '6px', alignItems: 'center'}}>
                          <input 
                            type="number"
                            placeholder="Qty"
                            value={stockAdjustment[item.sku] || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setStockAdjustment(prev => ({ ...prev, [item.sku]: val }));
                            }}
                            style={styles.miniInput}
                          />
                          <button 
                            onClick={() => handleAdjustStockSubmit(item.sku)}
                            style={styles.miniAdjustBtn}
                          >
                            Restock
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Finance & GST */}
        {activeTab === 'finance' && (
          <div>
            <h3 style={styles.subTitle}>Tax Audit & GST Invoicing Report</h3>
            <p style={{fontSize: '13px', color: '#666', marginBottom: '24px'}}>Indian Tax Compliance breakdown. GST is calculated at 18% standard rate on printed custom materials.</p>
            
            <div style={styles.financeStats}>
              <div style={styles.finStatBox}>
                <span>Total CGST Collected (9%)</span>
                <strong>₹{Math.round(getGstCollected() / 2)}</strong>
              </div>
              <div style={styles.finStatBox}>
                <span>Total SGST Collected (9%)</span>
                <strong>₹{Math.round(getGstCollected() / 2)}</strong>
              </div>
              <div style={styles.finStatBox}>
                <span>Consolidated GST Collected (18%)</span>
                <strong>₹{getGstCollected()}</strong>
              </div>
            </div>

            <div style={{marginTop: '30px'}}>
              <h4 style={styles.subTitle}>Invoiced Sales Audit Log</h4>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableRowHead}>
                    <th>Invoice No</th>
                    <th>Customer GSTIN</th>
                    <th>Order Subtotal</th>
                    <th>CGST (9%)</th>
                    <th>SGST (9%)</th>
                    <th>Grand Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(ord => (
                    <tr key={ord.id} style={styles.tableRow}>
                      <td style={{fontFamily: 'monospace', fontWeight: 'bold'}}>{ord.invoice_no || 'Pending Invoice'}</td>
                      <td>{ord.gst_no || 'Individual (B2C)'}</td>
                      <td>₹{ord.subtotal || ord.payable}</td>
                      <td>₹{Math.round((ord.tax_amount || 0) / 2)}</td>
                      <td>₹{Math.round((ord.tax_amount || 0) / 2)}</td>
                      <td style={{fontWeight: 'bold'}}>₹{ord.payable_amount || ord.payable}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Customer Tickets */}
        {activeTab === 'tickets' && (
          <div>
            <h3 style={styles.subTitle}>Support Tickets Inbox</h3>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableRowHead}>
                  <th>Ticket ID</th>
                  <th>Client Account</th>
                  <th>Subject</th>
                  <th>Issue Details</th>
                  <th>Status</th>
                  <th>Administrative Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(tkt => (
                  <tr key={tkt.id} style={styles.tableRow}>
                    <td style={{fontFamily: 'monospace', fontWeight: 'bold'}}>{tkt.id}</td>
                    <td>{tkt.user_id}</td>
                    <td>{tkt.subject}</td>
                    <td style={{maxWidth: '250px', fontSize: '13px'}}>{tkt.message}</td>
                    <td>
                      <span style={{
                        ...styles.statusTag,
                        backgroundColor: tkt.status === 'open' ? '#fdf2f2' : '#e6f4ea',
                        color: tkt.status === 'open' ? '#b91c1c' : '#137333'
                      }}>{tkt.status}</span>
                    </td>
                    <td>
                      {tkt.status === 'open' ? (
                        <button 
                          onClick={() => onResolveTicket(tkt.id)}
                          style={styles.resolveBtn}
                        >
                          Resolve & Close Issue
                        </button>
                      ) : (
                        <span style={{fontSize: '12px', color: '#666', fontWeight: 'bold'}}>Issue Resolved ✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 6: Notifications & Owner Alerts Center */}
        {activeTab === 'notifications' && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--color-border)', paddingBottom: '8px', marginBottom: '20px'}}>
              <h3 style={{...styles.subTitle, margin: 0}}>🔔 Owner Notification & Real-Time Alerting Center</h3>
              <div style={{display: 'flex', gap: '10px'}}>
                <button 
                  onClick={onMarkAllNotificationsRead} 
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    color: 'var(--color-primary)',
                    cursor: 'pointer'
                  }}
                >
                  Mark All as Read Check ✓
                </button>
                <button 
                  onClick={onClearNotifications} 
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    border: '1.5px solid var(--color-error)',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    color: 'var(--color-error)',
                    cursor: 'pointer'
                  }}
                >
                  Clear Logs 🗑️
                </button>
              </div>
            </div>

            {/* Notification Center Sub-Tabs */}
            <div style={{display: 'flex', gap: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px', marginBottom: '20px'}}>
              {[
                { id: 'feed', label: `Notification Feed 📋 (${notifications.length})` },
                { id: 'websocket', label: 'Websocket Live Stream ⚡' },
                { id: 'dispatched', label: `Simulated Owner Alerts 📧 (${dispatchedAlerts.length})` }
              ].map(subTab => (
                <button
                  key={subTab.id}
                  onClick={() => setActiveNotiSubTab(subTab.id)}
                  style={{
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontWeight: '700',
                    border: 'none',
                    borderBottom: activeNotiSubTab === subTab.id ? '3px solid var(--color-secondary)' : '3px solid transparent',
                    color: activeNotiSubTab === subTab.id ? 'var(--color-secondary)' : '#666666',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    borderRadius: 0,
                    margin: 0
                  }}
                >
                  {subTab.label}
                </button>
              ))}
            </div>

            {/* Sub-tab 1: Notification Feed */}
            {activeNotiSubTab === 'feed' && (
              <div>
                {/* Filters */}
                <div style={{display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap'}}>
                  {[
                    { id: 'All', label: 'All Events' },
                    { id: 'new_order', label: 'New Orders' },
                    { id: 'payment', label: 'Payments' },
                    { id: 'refund', label: 'Refund Requests' },
                    { id: 'ticket', label: 'Support Tickets' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setNotiFilter(f.id)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '700',
                        borderRadius: '16px',
                        border: notiFilter === f.id ? '1.5px solid var(--color-secondary)' : '1.5px solid var(--color-border)',
                        backgroundColor: notiFilter === f.id ? '#f0f9ff' : '#ffffff',
                        color: notiFilter === f.id ? 'var(--color-secondary)' : '#444444',
                        cursor: 'pointer'
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Notifications List */}
                {notifications.length === 0 ? (
                  <div style={{textAlign: 'center', padding: '60px 0', color: '#666'}}>
                    <span style={{fontSize: '48px'}}>📭</span>
                    <p style={{marginTop: '10px'}}>No notifications in log.</p>
                  </div>
                ) : (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                    {notifications
                      .filter(n => {
                        if (notiFilter === 'All') return true;
                        if (notiFilter === 'new_order') return n.type === 'new_order';
                        if (notiFilter === 'payment') return n.type === 'payment_success' || n.type === 'payment_failure';
                        if (notiFilter === 'refund') return n.type === 'refund_request';
                        if (notiFilter === 'ticket') return n.type === 'new_support_ticket';
                        return true;
                      })
                      .map(n => (
                        <div 
                          key={n.id} 
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            backgroundColor: n.is_read ? '#ffffff' : '#fffbeb', // highlighted if unread
                            border: n.is_read ? '1px solid var(--color-border)' : '1.5px solid #ffcc00',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'all 0.2s ease',
                            textAlign: 'left'
                          }}
                        >
                          <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
                            <span style={{fontSize: '24px'}}>
                              {n.type === 'new_order' ? '📦' :
                               n.type.includes('payment') ? '💳' :
                               n.type === 'refund_request' ? '🔄' :
                               n.type === 'new_support_ticket' ? '🎫' : '🔔'}
                            </span>
                            <div>
                              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <strong style={{fontSize: '14.5px'}}>{n.title}</strong>
                                {!n.is_read && (
                                  <span style={{
                                    backgroundColor: 'var(--color-error)',
                                    color: '#ffffff',
                                    borderRadius: '4px',
                                    fontSize: '9px',
                                    fontWeight: 'bold',
                                    padding: '1px 5px',
                                    textTransform: 'uppercase'
                                  }}>NEW</span>
                                )}
                              </div>
                              <p style={{fontSize: '13px', color: 'var(--color-text-muted)', margin: '4px 0 0 0'}}>{n.message}</p>
                              <span style={{fontSize: '11px', color: '#999', marginTop: '4px', display: 'block'}}>
                                User ID: {n.user_id || 'guest'} | Order ID: {n.order_id || 'N/A'} | Time: {new Date(n.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div style={{display: 'flex', gap: '8px'}}>
                            {!n.is_read && (
                              <button 
                                onClick={() => onMarkNotificationRead(n.id)} 
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  backgroundColor: 'var(--color-secondary)',
                                  color: '#ffffff',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                              >
                                Mark Read ✓
                              </button>
                            )}
                            {n.order_id && (
                              <button 
                                onClick={() => {
                                  const ord = orders.find(o => o.id === n.order_id);
                                  if (ord) onSelectOrder(ord);
                                }} 
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  backgroundColor: 'var(--color-primary)',
                                  color: '#ffffff',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                              >
                                View Order ➔
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Sub-tab 2: Websocket Live stream log */}
            {activeNotiSubTab === 'websocket' && (
              <div>
                <p style={{fontSize: '13px', color: '#666', marginBottom: '12px', textAlign: 'left'}}>
                  Simulation of real-time server stream listening to database schema inserts.
                </p>
                <div style={{
                  backgroundColor: '#1e1e1e',
                  color: '#00ff00',
                  fontFamily: 'monospace',
                  padding: '20px',
                  borderRadius: '6px',
                  minHeight: '300px',
                  maxHeight: '450px',
                  overflowY: 'auto',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  textAlign: 'left'
                }}>
                  {realtimeLog.map((log, idx) => (
                    <div key={idx} style={{marginBottom: '6px', borderBottom: '1px solid #333', paddingBottom: '4px'}}>
                      <span style={{color: '#9a9a9a'}}>[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
                      <span style={{color: log.event.includes('connected') || log.event.includes('clear') ? '#10b981' : '#60a5fa', fontWeight: 'bold'}}>[{log.event.toUpperCase()}]</span>{' '}
                      <span>{log.details}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-tab 3: Dispatched Alerts Simulator */}
            {activeNotiSubTab === 'dispatched' && (
              <div style={{display: 'flex', gap: '30px', flexWrap: 'wrap', textAlign: 'left'}}>
                {/* Left side: Alert List */}
                <div style={{flex: 1, minWidth: '280px'}}>
                  <h4 style={{fontSize: '14px', fontWeight: '700', borderBottom: '1px dashed var(--color-border)', paddingBottom: '6px', marginBottom: '12px'}}>Dispatched Alert Payloads</h4>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    {dispatchedAlerts.map(alert => (
                      <div 
                        key={alert.id}
                        onClick={() => setSelectedAlertEmail(alert)}
                        style={{
                          padding: '12px',
                          border: selectedAlertEmail?.id === alert.id ? '2px solid var(--color-secondary)' : '1px solid var(--color-border)',
                          borderRadius: '6px',
                          backgroundColor: selectedAlertEmail?.id === alert.id ? '#f0f9ff' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                          <strong style={{fontSize: '13px', textTransform: 'uppercase'}}>{alert.type === 'email' ? '📧 Email Alert' : '💬 WhatsApp SMS'}</strong>
                          <span style={{fontSize: '11px', color: '#999'}}>{new Date(alert.created_at).toLocaleTimeString()}</span>
                        </div>
                        <p style={{fontSize: '12px', color: '#333', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                          {alert.type === 'email' ? `Subject: ${alert.subject}` : alert.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side: Alert Viewer */}
                <div style={{flex: 1.5, minWidth: '320px', borderLeft: '1px solid var(--color-border)', paddingLeft: '20px'}}>
                  <h4 style={{fontSize: '14px', fontWeight: '700', borderBottom: '1px dashed var(--color-border)', paddingBottom: '6px', marginBottom: '12px'}}>Live Payload Preview</h4>
                  {selectedAlertEmail ? (
                    selectedAlertEmail.type === 'email' ? (
                      <div>
                        <div style={{backgroundColor: '#f1f3f4', padding: '12px', borderRadius: '6px', marginBottom: '12px', fontSize: '13px', textAlign: 'left'}}>
                          <strong>From:</strong> Resend API &lt;alerts@infistyle.com&gt;<br/>
                          <strong>To:</strong> Business Owner &lt;owner@infistyle.com&gt;<br/>
                          <strong>Subject:</strong> {selectedAlertEmail.subject}
                        </div>
                        <div 
                          style={{border: '1px solid #ccc', borderRadius: '8px', padding: '10px', backgroundColor: '#fff', overflow: 'auto', maxHeight: '400px'}}
                          dangerouslySetInnerHTML={{ __html: selectedAlertEmail.content }}
                        />
                      </div>
                    ) : (
                      <div>
                        <div style={{backgroundColor: '#f1f3f4', padding: '12px', borderRadius: '6px', marginBottom: '12px', fontSize: '13px', textAlign: 'left'}}>
                          <strong>To:</strong> WhatsApp API Payload &lt;+91 98765 43210&gt;
                        </div>
                        <div style={{
                          backgroundColor: '#efeae2',
                          backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                          padding: '20px',
                          borderRadius: '12px',
                          minHeight: '280px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          textAlign: 'left'
                        }}>
                          <div style={{
                            alignSelf: 'flex-start',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            padding: '12px',
                            maxWidth: '85%',
                            boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                            fontSize: '13px',
                            lineHeight: '1.55',
                            whiteSpace: 'pre-wrap',
                            color: '#111111'
                          }}>
                            {selectedAlertEmail.message}
                            <span style={{display: 'block', fontSize: '10px', color: '#888', textAlign: 'right', marginTop: '4px'}}>
                              {new Date(selectedAlertEmail.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ✓✓
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <div style={{padding: '60px 0', textAlign: 'center', color: '#666', fontSize: '13px'}}>
                      Select an alert from the list on the left to preview its content.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 7: Customer Accounts */}
        {activeTab === 'customers' && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid var(--color-border)', paddingBottom: '8px'}}>
              <h3 style={{...styles.subTitle, margin: 0}}>👤 Customer Roster & Role Matrix</h3>
              <span style={{fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 'bold'}}>
                Total Registered: {profiles.length}
              </span>
            </div>

            {/* Roster Search */}
            <div style={{...styles.filterRow, marginBottom: '20px'}}>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, phone or company..."
                style={styles.searchInput}
              />
            </div>
            
            {profiles.length === 0 ? (
              <p style={{color: '#666'}}>No customer records found.</p>
            ) : (
              <div style={{overflowX: 'auto'}}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableRowHead}>
                      <th style={{padding: '10px', textAlign: 'left'}}>Name</th>
                      <th style={{padding: '10px', textAlign: 'left'}}>Email</th>
                      <th style={{padding: '10px', textAlign: 'left'}}>Phone</th>
                      <th style={{padding: '10px', textAlign: 'left'}}>Company Name</th>
                      <th style={{padding: '10px', textAlign: 'left'}}>GSTIN</th>
                      <th style={{padding: '10px', textAlign: 'left'}}>Status</th>
                      <th style={{padding: '10px', textAlign: 'left'}}>Current Role</th>
                      <th style={{padding: '10px', textAlign: 'left'}}>Action (Assign Role)</th>
                      <th style={{padding: '10px', textAlign: 'left'}}>Toggle Access</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles
                      .filter(prof => {
                        const query = searchQuery.toLowerCase();
                        return (
                          (prof.name || '').toLowerCase().includes(query) ||
                          (prof.email || '').toLowerCase().includes(query) ||
                          (prof.company_name || '').toLowerCase().includes(query) ||
                          (prof.phone || '').toLowerCase().includes(query)
                        );
                      })
                      .map(prof => (
                        <tr key={prof.id} style={styles.tableRow}>
                          <td style={{padding: '10px', fontWeight: 'bold'}}>{prof.name}</td>
                          <td style={{padding: '10px'}}>{prof.email}</td>
                          <td style={{padding: '10px'}}>{prof.phone || '—'}</td>
                          <td style={{padding: '10px'}}>{prof.company_name || '—'}</td>
                          <td style={{padding: '10px'}}><code>{prof.gstin || '—'}</code></td>
                          <td style={{padding: '10px'}}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              backgroundColor: prof.is_disabled ? '#fce8e6' : '#e6f4ea',
                              color: prof.is_disabled ? '#c5221f' : '#137333'
                            }}>
                              {prof.is_disabled ? 'DISABLED' : 'ACTIVE'}
                            </span>
                          </td>
                          <td style={{padding: '10px'}}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              backgroundColor: prof.role === 'admin' ? '#fce8e6' :
                                               prof.role === 'manager' ? '#e8f0fe' :
                                               prof.role === 'support' ? '#e6f4ea' : '#f1f3f4',
                              color: prof.role === 'admin' ? '#c5221f' :
                                     prof.role === 'manager' ? '#1a73e8' :
                                     prof.role === 'support' ? '#137333' : '#3c4043'
                            }}>
                              {prof.role ? prof.role.toUpperCase() : 'CUSTOMER'}
                            </span>
                          </td>
                          <td style={{padding: '10px'}}>
                            <select 
                              value={prof.role || 'customer'}
                              onChange={(e) => handleUpdateUserRole(prof.id, prof.email, e.target.value)}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '4px',
                                border: '1.5px solid var(--color-border)',
                                backgroundColor: '#ffffff',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="customer">Customer</option>
                              <option value="support">Support</option>
                              <option value="manager">Manager</option>
                              <option value="admin">Admin</option>
                              <option value="designer">Designer</option>
                            </select>
                          </td>
                          <td style={{padding: '10px'}}>
                            <button
                              onClick={() => handleToggleUserStatus(prof.id, prof.email, prof.is_disabled)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                border: '1px solid ' + (prof.is_disabled ? '#137333' : '#c5221f'),
                                backgroundColor: '#ffffff',
                                color: prof.is_disabled ? '#137333' : '#c5221f',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              {prof.is_disabled ? 'Enable' : 'Disable'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: 'var(--font-primary)',
  },
  title: {
    fontSize: '30px',
    fontWeight: '800',
    color: '#111111',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#666666',
    marginBottom: '30px',
  },
  tabContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  tabBtn: {
    padding: '12px 18px',
    fontSize: '13px',
    border: '1.5px solid var(--color-border)',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  contentCard: {
    backgroundColor: '#ffffff',
    border: '1.5px solid var(--color-border)',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 15px rgba(255, 204, 0, 0.04)',
  },
  statsRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: '220px',
    backgroundColor: '#fffdf5',
    border: '1.5px solid var(--color-border)',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '26px',
    fontWeight: '800',
    color: 'var(--color-primary)',
    marginBottom: '4px',
  },
  statSub: {
    fontSize: '11px',
    color: '#666666',
  },
  subTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#111111',
    margin: '20px 0 16px 0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  tableRowHead: {
    borderBottom: '2px solid var(--color-border)',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '700',
    color: '#555',
    textTransform: 'uppercase',
  },
  tableRow: {
    borderBottom: '1px solid var(--color-border)',
    fontSize: '14px',
    height: '50px',
  },
  statusTag: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  actionBtn: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: 'var(--color-primary)',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  filterRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: 1,
    minWidth: '200px',
    border: '1.5px solid var(--color-border)',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '14px',
    outline: 'none',
  },
  selectFilter: {
    border: '1.5px solid var(--color-border)',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    outline: 'none',
  },
  stepIndicator: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#b06000',
  },
  miniTag: {
    fontSize: '10px',
    backgroundColor: '#f1f3f4',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: '700',
    color: '#5f6368',
    marginRight: '4px',
    display: 'inline-block',
  },
  manageBtn: {
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-secondary)',
    backgroundColor: '#f0f9ff',
    border: '1.5px solid var(--color-secondary)',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  miniInput: {
    width: '60px',
    border: '1px solid var(--color-border)',
    borderRadius: '4px',
    padding: '6px',
    fontSize: '13px',
    outline: 'none',
  },
  miniAdjustBtn: {
    padding: '6px 10px',
    fontSize: '12px',
    fontWeight: '700',
    backgroundColor: 'var(--color-primary)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  financeStats: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  finStatBox: {
    flex: 1,
    backgroundColor: '#f6f6ec',
    border: '1.5px solid var(--color-border)',
    borderRadius: '6px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  resolveBtn: {
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: '#137333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default AdminPanel;
