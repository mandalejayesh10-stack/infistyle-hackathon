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
    backgroundColor: '#1d1d1d',
    color: '#ffffff',
    padding: '8px 16px',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '400',
    letterSpacing: '0.5px',
    zIndex: 1000,
  },
  promoText: {
    display: 'inline-block',
  },
  code: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: '700',
    marginLeft: '4px',
    color: '#6fd0f5',
  }
};

export default PromoBar;
