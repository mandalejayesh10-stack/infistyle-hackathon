import React from 'react';

const Footer = ({ onNavigate }) => {
  return (
    <footer style={styles.footer}>
      {/* Top Section - Columns */}
      <div className="container" style={styles.gridContainer}>
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Let Us Help</h4>
          <ul style={styles.list}>
            <li style={styles.listItem}><a href="https://www.vistaprint.in/customer-care/help-centre">Help Centre / FAQs</a></li>
            <li style={styles.listItem}><a href="https://www.vistaprint.in/customer-care/help-centre">Contact Customer Support</a></li>
            <li style={styles.listItem}><a href="https://www.vistaprint.in/my-account/design/projects">My Projects & Designs</a></li>
            <li style={styles.listItem}><a href="https://www.vistaprint.in/c">Shopping Cart</a></li>
            <li style={styles.listItem}><span style={{cursor: 'pointer'}} onClick={() => onNavigate('account')}>Sign In / My Account</span></li>
          </ul>
        </div>

        <div style={styles.col}>
          <h4 style={styles.colTitle}>Our Products</h4>
          <ul style={styles.list}>
            <li style={styles.listItem}><span style={{cursor: 'pointer'}} onClick={() => onNavigate('visiting-cards')}>Visiting Cards</span></li>
            <li style={styles.listItem}><span style={{cursor: 'pointer'}} onClick={() => onNavigate('stationery')}>Stationery & Letterheads</span></li>
            <li style={styles.listItem}><span style={{cursor: 'pointer'}} onClick={() => onNavigate('clothing-bags')}>Clothing, Caps & Bags</span></li>
            <li style={styles.listItem}><span style={{cursor: 'pointer'}} onClick={() => onNavigate('photo-gifts')}>Photo Gifts & Mugs</span></li>
            <li style={styles.listItem}><span style={{cursor: 'pointer'}} onClick={() => onNavigate('labels-packaging')}>Labels, Stickers & Packaging</span></li>
          </ul>
        </div>

        <div style={styles.col}>
          <h4 style={styles.colTitle}>About InfiStyle</h4>
          <ul style={styles.list}>
            <li style={styles.listItem}><a href="https://www.vistaprint.in/about-us">About Our Brand</a></li>
            <li style={styles.listItem}><a href="https://www.vistaprint.in/hub">Ideas, Tips & Advice Hub</a></li>
            <li style={styles.listItem}><a href="https://www.vistaprint.in/terms-and-conditions">Terms & Conditions</a></li>
            <li style={styles.listItem}><a href="https://www.vistaprint.in/privacy-policy">Privacy & Cookie Policy</a></li>
            <li style={styles.listItem}><a href="https://www.vistaprint.in/customer-care/help-centre">Feedback Form</a></li>
          </ul>
        </div>

        <div style={{...styles.col, flex: '1.2'}}>
          <h4 style={styles.colTitle}>100% Satisfaction Guarantee</h4>
          <p style={styles.guaranteeText}>
            We stand behind everything we sell, absolutely. If you are not satisfied with your custom prints or printed marketing materials, we will reprint your order or credit your account. 
            <br />
            <strong style={{color: 'var(--color-primary)'}}>Your satisfaction is our absolute goal.</strong>
          </p>
        </div>
      </div>

      <div style={styles.divider}></div>

      {/* Bottom Section - Local address and copyright */}
      <div className="container" style={styles.bottomRow}>
        <div style={styles.leftBottom}>
          <p style={styles.address}>
            Cimpress India Group • InfiStyle India Business Office, Mumbai, Maharashtra.
          </p>
          <p style={styles.copyright}>
            © 2026 InfiStyle Replica. All rights reserved. Powered by Cimpress.
          </p>
        </div>

        {/* Mock Socials */}
        <div style={styles.socials}>
          <a href="https://facebook.com" style={styles.socialIcon} aria-label="Facebook">📘</a>
          <a href="https://instagram.com" style={styles.socialIcon} aria-label="Instagram">📸</a>
          <a href="https://twitter.com" style={styles.socialIcon} aria-label="Twitter">🐦</a>
          <a href="https://linkedin.com" style={styles.socialIcon} aria-label="LinkedIn">💼</a>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#f6f6ec',
    borderTop: '1px solid var(--color-border)',
    padding: '60px 0 40px',
    marginTop: '60px',
  },
  gridContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '40px',
    flexWrap: 'wrap',
  },
  col: {
    flex: '1',
    minWidth: '220px',
  },
  colTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    marginBottom: '20px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    marginBottom: '10px',
    transition: 'var(--transition-fast)',
  },
  guaranteeText: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.5',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '40px 0 30px',
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  leftBottom: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  address: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  },
  copyright: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    opacity: 0.8,
  },
  socials: {
    display: 'flex',
    gap: '16px',
  },
  socialIcon: {
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  }
};

export default Footer;
