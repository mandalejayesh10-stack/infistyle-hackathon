import React from 'react';

const TrustBar = () => {
  const trustProps = [
    {
      icon: (
        <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M22 4L12 14.01l-3-3" />
        </svg>
      ),
      title: "100% Satisfaction Guarantee",
      desc: "Love it or we'll make it right. Guaranteed."
    },
    {
      icon: (
        <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
      title: "Free Pan-India Shipping",
      desc: "Delivered straight from our printing press."
    },
    {
      icon: (
        <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
          <line x1="7" y1="15" x2="7.01" y2="15" />
          <line x1="11" y1="15" x2="13" y2="15" />
        </svg>
      ),
      title: "Secure Payments & COD",
      desc: "UPI, Cards, NetBanking or Cash on Delivery."
    },
    {
      icon: (
        <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      title: "Free Expert Design Check",
      desc: "We verify file alignments before print."
    }
  ];

  return (
    <div style={styles.bar}>
      <div className="container" style={styles.container}>
        {trustProps.map((item, idx) => (
          <div key={idx} style={styles.item}>
            <div style={styles.iconWrapper}>{item.icon}</div>
            <div style={styles.textContainer}>
              <h4 style={styles.title}>{item.title}</h4>
              <p style={styles.desc}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  bar: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid var(--color-border)',
    borderBottom: '1px solid var(--color-border)',
    padding: '24px 0',
    width: '100%',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '24px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: '1',
    minWidth: '240px',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#f4f6fa',
    color: 'var(--color-secondary)',
  },
  icon: {
    width: '24px',
    height: '24px',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  title: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-text-dark)',
    marginBottom: '2px',
  },
  desc: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    margin: 0,
    lineHeight: '1.4',
  }
};

export default TrustBar;
