import React from 'react';

const Categories = ({ onSelectCategory }) => {
  const items = [
    {
      id: 'visiting-cards',
      name: "Visiting Cards",
      image: "https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/NVHP/New%20Home%20Page/Explore%20all%20categories/Explore-all-categories_Business-Cards-01"
    },
    {
      id: 'polo-shirts',
      name: "Custom Polo T-shirts",
      image: "https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/NVHP/New%20Home%20Page/Explore%20all%20categories/Explore-all-categories_Polo-T-Shirts_01"
    },
    {
      id: 'dress-shirts',
      name: "Custom Dress Shirts",
      image: "https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/NVHP/New%20Home%20Page/NVHP%20Tiles%20-%20Blue%20Price%20Tag/Explore%20all%20categories/Explore-all-categories_Office-shirts01"
    },
    {
      id: 't-shirts',
      name: "Custom T-shirts",
      image: "https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/NVHP/New%20Home%20Page/Explore%20all%20categories/Explore-all-categories_Printed-T-Shirts_01"
    },
    {
      id: 'caps',
      name: "Custom Caps",
      image: "https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/NVHP/New%20Home%20Page/Explore%20all%20categories/Explore-all-categories_Custom-Caps_01"
    },
    {
      id: 'signs-posters',
      name: "Signs & Banners",
      image: "https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/NVHP/New%20Home%20Page/Explore%20all%20categories/Explore-all-categories_Banners_-Posters-and-Signs-01"
    },
    {
      id: 'stamps-ink',
      name: "Stamps and Ink",
      image: "https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/NVHP/New%20Home%20Page/Explore%20all%20categories/Explore-all-categories_Stamps-01"
    },
    {
      id: 'rainwear',
      name: "Umbrellas & Rainwear",
      image: "https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/vistaprint%20India%20media/Explore-all-categories_Umbrella-and-Raonwear"
    },
    {
      id: 'photo-gifts',
      name: "Photo Gifts",
      image: "https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/NVHP/New%20Home%20Page/Explore%20all%20categories/Explore-all-categories_Mugs_-Albums-and-Gifts-01"
    },
    {
      id: 'labels-packaging',
      name: "Labels & Stickers",
      image: "https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/NVHP/New%20Home%20Page/Explore%20all%20categories/Explore-all-categories_Labels-and-Stickers-01"
    },
    {
      id: 'stationery',
      name: "Custom Stationery",
      image: "https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/NVHP/New%20Home%20Page/Explore%20all%20categories/Explore-all-categories_Stationery_-letterheads-and-Stamps-01"
    },
    {
      id: 'bags',
      name: "Custom Bags",
      image: "https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_450/India%20LOB/NVHP/New%20Home%20Page/NVHP%20Tiles%20-%20Blue%20Price%20Tag/Explore%20all%20categories/Explore-all-categories_Custome-bags01"
    }
  ];

  return (
    <section style={styles.section} className="container animate-fade-in-up">
      <h2 style={styles.sectionTitle}>Explore all categories</h2>
      <div style={styles.grid}>
        {items.map(item => (
          <div 
            key={item.id} 
            style={styles.card} 
            onClick={() => onSelectCategory(item.id)}
            className="category-card"
          >
            <div style={styles.imgWrapper}>
              <img src={item.image} alt={item.name} style={styles.img} />
            </div>
            <span style={styles.name}>{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: '40px 0',
  },
  sectionTitle: {
    fontFamily: 'var(--font-primary)',
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    marginBottom: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '24px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    userSelect: 'none',
  },
  imgWrapper: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#f6f6f6',
    border: '1.5px solid var(--color-border)',
    transition: 'var(--transition-normal)',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-sm)',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'var(--transition-normal)',
  },
  name: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--color-text-dark)',
    lineHeight: '1.3',
    maxWidth: '120px',
  }
};

export default Categories;
