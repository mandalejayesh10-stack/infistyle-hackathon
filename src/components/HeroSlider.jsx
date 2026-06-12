import React, { useState, useEffect } from 'react';

const HeroSlider = ({ onAction }) => {
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      title: "Visiting Cards",
      description: "100 Visiting Cards at Rs 200. First impressions that last.",
      cta: "Shop Now",
      target: "businessCards",
      image: "https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_960/India%20LOB/PhonePe%20Landing%20Page/IN_VC_IT_Marquee_02",
      bg: "#f3f4f6"
    },
    {
      title: "Custom Rainwear & Umbrellas",
      description: "Look professional even in the rain. Starting at Rs. 655.",
      cta: "Explore Umbrellas",
      target: "umbrellas",
      image: "https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_960/India%20LOB/NVHP/New%20Home%20Page/Production/Rainwear/NEW_Raincoat-_-Umbrellas_Marquee_01",
      bg: "#eef2f6"
    },
    {
      title: "Preserve Cherished Moments",
      description: "Personalised Photo Albums, Photo Mugs, & Canvas Prints. Starting at Rs. 280.",
      cta: "Create Album",
      target: "photoGifts",
      image: "https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_960/India%20LOB/NVHP/New%20Home%20Page/Production/14th%20Nov%202024/IN_Photo-Album_Wedding_Marquee_01",
      bg: "#f8f6f2"
    },
    {
      title: "Wear Your Brand with Pride",
      description: "Custom Printed & Embroidered Polo T-shirts. Starting at Rs. 320.",
      cta: "Shop Apparel",
      target: "poloTShirts",
      image: "https://cms.cloudinary.vpsvc.com/image/upload/c_scale,dpr_auto,f_auto,w_960/India%20LOB/NVHP/New%20Home%20Page/Production/3rd%20Feb%202025/IN_Polo_PrintedT-Shirts_Marquee_01_1",
      bg: "#f5f5f5"
    }
  ];

  // Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => {
    setCurrent(prev => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section style={styles.sliderSection}>
      <div style={styles.sliderContainer}>
        {slides.map((slide, idx) => (
          <div 
            key={idx} 
            style={{
              ...styles.slide, 
              backgroundColor: slide.bg,
              opacity: current === idx ? 1 : 0,
              visibility: current === idx ? 'visible' : 'hidden',
              zIndex: current === idx ? 1 : 0,
            }}
          >
            <div className="container" style={styles.slideContent}>
              {/* Text Area */}
              <div style={styles.textContent}>
                <h1 style={styles.title}>{slide.title}</h1>
                <p style={styles.description}>{slide.description}</p>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => onAction(slide.target)}
                  style={styles.ctaBtn}
                >
                  {slide.cta} →
                </button>
              </div>

              {/* Image Area */}
              <div style={styles.imageContent}>
                <img src={slide.image} alt={slide.title} style={styles.image} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nav Controls */}
      <button onClick={handlePrev} style={{...styles.navBtn, left: '20px'}}>❮</button>
      <button onClick={handleNext} style={{...styles.navBtn, right: '20px'}}>❯</button>

      {/* Slide Indicators */}
      <div style={styles.dotsContainer}>
        {slides.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrent(idx)}
            style={{
              ...styles.dot, 
              backgroundColor: current === idx ? 'var(--color-primary)' : 'rgba(0, 0, 0, 0.15)',
              transform: current === idx ? 'scale(1.25)' : 'scale(1)'
            }}
          />
        ))}
      </div>
    </section>
  );
};

const styles = {
  sliderSection: {
    position: 'relative',
    height: '420px',
    width: '100%',
    overflow: 'hidden',
    borderBottom: '1px solid var(--color-border)',
  },
  sliderContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  slide: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    transition: 'opacity 0.6s ease-in-out, visibility 0.6s ease-in-out',
  },
  slideContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    gap: '40px',
  },
  textContent: {
    flex: '1',
    maxWidth: '520px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    animation: 'fadeInUp 0.8s forwards',
  },
  title: {
    fontFamily: 'var(--font-editorial)',
    fontSize: '44px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    marginBottom: '16px',
    lineHeight: '1.2',
  },
  description: {
    fontSize: '18px',
    color: 'var(--color-text-muted)',
    marginBottom: '28px',
  },
  ctaBtn: {
    padding: '14px 32px',
    fontSize: '16px',
    fontWeight: '600',
  },
  imageContent: {
    flex: '1.2',
    height: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    maxHeight: '340px',
    maxWidth: '100%',
    objectFit: 'contain',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: 'var(--color-primary)',
    zIndex: 10,
    transition: 'var(--transition-fast)',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '12px',
    zIndex: 10,
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    transition: 'var(--transition-fast)',
  }
};

export default HeroSlider;
