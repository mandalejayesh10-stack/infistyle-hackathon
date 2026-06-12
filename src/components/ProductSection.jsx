import React from 'react';
import ProductCard from './ProductCard';

const ProductSection = ({ title, products, onSelectProduct, onToggleFav, favorites }) => {
  if (!products || products.length === 0) return null;

  return (
    <section style={styles.section} className="container animate-fade-in-up">
      <div style={styles.headerRow}>
        <h2 style={styles.title}>{title}</h2>
        <span style={styles.line}></span>
      </div>
      
      <div className="grid-4">
        {products.map(product => (
          <div key={product.id} style={styles.gridItem}>
            <ProductCard 
              product={product} 
              onSelect={onSelectProduct}
              onToggleFav={onToggleFav}
              isFav={favorites.includes(product.id)}
            />
          </div>
        ))}
      </div>

    </section>
  );
};

const styles = {
  section: {
    padding: '30px 0',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
    gap: '16px',
  },
  title: {
    fontFamily: 'var(--font-primary)',
    fontSize: '22px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    whiteSpace: 'nowrap',
  },
  line: {
    flex: 1,
    height: '1.5px',
    backgroundColor: 'var(--color-border)',
  },
  gridItem: {
    minHeight: '380px',
  }
};


export default ProductSection;
