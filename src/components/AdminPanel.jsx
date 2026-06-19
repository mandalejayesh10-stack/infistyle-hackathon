import React, { useState } from 'react';

const AdminPanel = ({ 
  orders, 
  inventory, 
  tickets, 
  onSelectOrder, 
  onUpdateInventory, 
  onResolveTicket,
  activeTab,
  setActiveTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [stockAdjustment, setStockAdjustment] = useState({});

  // Calculations for CEO Dashboard Metrics
  const getTodayRevenue = () => {
    // Return mock today total or compute from orders created today
    return 48450; 
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
          { id: 'tickets', label: 'Customer Tickets 🎫' }
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
            {/* Stat Cards */}
            <div style={styles.statsRow}>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Today's Target Sales</span>
                <strong style={styles.statValue}>₹{getTodayRevenue().toLocaleString('en-IN')}</strong>
                <span style={styles.statSub}>12 orders received today</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Monthly Total Revenue</span>
                <strong style={styles.statValue}>₹{getMonthlyRevenue().toLocaleString('en-IN')}</strong>
                <span style={styles.statSub}>Based on database records</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Average Order Value (AOV)</span>
                <strong style={styles.statValue}>₹1,550</strong>
                <span style={styles.statSub}>Across custom merchandise</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Estimated Profit Margin</span>
                <strong style={{...styles.statValue, color: '#137333'}}>68%</strong>
                <span style={styles.statSub}>Net markup estimate</span>
              </div>
            </div>

            <div style={styles.statsRow}>
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

            {/* Priority Alerts */}
            <div style={{marginTop: '30px'}}>
              <h3 style={styles.subTitle}>🚨 Urgent / VIP Corporate Orders</h3>
              {getUrgentOrders().length === 0 ? (
                <p>No urgent orders currently in fulfillment queue.</p>
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
