import React from 'react';

const PromoBar = () => {
  return (
    <div style={styles.promoBar}>
      <span style={styles.promoText}>
        🎉 Buy More, Save More! Flat <strong>5% OFF</strong> on Orders ₹10,000+ | Code: <span style={styles.code}>SAVE5</span>
      </span>
    </div>
  );
};

const styles = {
  promoBar: {
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: '8px 16px',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.5px',
    zIndex: 1000,
  },
  promoText: {
    display: 'inline-block',
  },
  code: {
    backgroundColor: 'var(--color-accent)',
    color: '#000000',
    padding: '2px 8px',
    borderRadius: '4px',
    fontWeight: '700',
    marginLeft: '6px',
    display: 'inline-block',
  }
};

export default PromoBar;
