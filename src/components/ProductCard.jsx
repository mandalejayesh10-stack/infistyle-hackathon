import React, { useState } from 'react';

const ProductCard = ({ product, onSelect, onToggleFav, isFav }) => {
  const [animateHeart, setAnimateHeart] = useState(false);

  const handleFavClick = (e) => {
    e.stopPropagation();
    setAnimateHeart(true);
    setTimeout(() => setAnimateHeart(false), 800);
    onToggleFav(product.id);
  };

  // Render Star Rating
  const renderStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} style={styles.star}>★</span>);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<span key={i} style={styles.star}>★</span>); // Simplified for rendering
      } else {
        stars.push(<span key={i} style={styles.starEmpty}>★</span>);
      }
    }
    return stars;
  };

  return (
    <div style={styles.card} className="product-card" onClick={() => onSelect(product.id)}>
      {/* Product Image and badges */}
      <div style={styles.imageWrapper}>
        <img src={product.image} alt={product.name} style={styles.image} />
        
        {/* Badges */}
        {product.tag && (
          <div style={styles.badgeContainer}>
            <span className={product.tag === 'NEW' ? 'new-badge' : 'promo-badge'}>
              {product.tag}
            </span>
          </div>
        )}

        {/* Favorite heart overlay */}
        <button 
          onClick={handleFavClick} 
          style={{
            ...styles.favBtn,
            color: isFav ? 'var(--color-error)' : 'rgba(0, 0, 0, 0.35)',
            transform: animateHeart ? 'scale(1.3)' : 'scale(1)'
          }}
          className={animateHeart ? 'animate-heartbeat' : ''}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Product details */}
      <div style={styles.details}>
        <span style={styles.categoryName}>{product.categoryName}</span>
        <h3 style={styles.productName}>{product.name}</h3>
        
        {/* Rating */}
        <div style={styles.ratingContainer}>
          <div style={styles.stars}>{renderStars(product.rating)}</div>
          <span style={styles.ratingText}>({product.reviewsCount || 24})</span>
        </div>

        {/* Callout offer details */}
        {product.offerText && (
          <div style={styles.offerBadge}>
            {product.offerText}
          </div>
        )}

        {/* Pricing & CTA */}
        <div style={styles.priceRow}>
          <div style={styles.priceContainer}>
            <span style={styles.priceLabel}>Starting from</span>
            <span style={styles.price}>₹{product.price}</span>
          </div>
          <button className="btn btn-primary" style={styles.cta}>
            Customize
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'var(--transition-normal)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    height: '100%',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    paddingTop: '92%', // 1:1 aspect ratio roughly
    backgroundColor: '#f8f8f8',
    overflow: 'hidden',
    borderBottom: '1px solid var(--color-border)',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'var(--transition-normal)',
  },
  badgeContainer: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    zIndex: 2,
  },
  favBtn: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 2,
    fontSize: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    boxShadow: 'var(--shadow-sm)',
    transition: 'transform 0.2s ease',
  },
  details: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  categoryName: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  productName: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-text-dark)',
    marginBottom: '8px',
    lineHeight: '1.3',
    minHeight: '40px', // Align titles
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '12px',
  },
  stars: {
    display: 'flex',
  },
  star: {
    color: '#ffc107',
    fontSize: '14px',
  },
  starEmpty: {
    color: '#e4e5e9',
    fontSize: '14px',
  },
  ratingText: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  },
  offerBadge: {
    backgroundColor: '#e5f5fd',
    color: '#0c72a9',
    fontSize: '11px',
    fontWeight: '700',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    alignSelf: 'flex-start',
    marginBottom: '16px',
    textTransform: 'uppercase',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 'auto', // Push to bottom
  },
  priceContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  priceLabel: {
    fontSize: '10px',
    color: 'var(--color-text-muted)',
  },
  price: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-text-dark)',
  },
  cta: {
    padding: '8px 16px',
    fontSize: '12px',
    borderRadius: 'var(--radius-full)',
  }
};

export default ProductCard;
