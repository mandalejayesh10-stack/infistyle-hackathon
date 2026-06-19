import React, { useState } from 'react';

const Legal = ({ onGoBack }) => {
  const [activeTab, setActiveTab] = useState('terms'); // 'terms' | 'privacy' | 'refund' | 'shipping'

  const policies = {
    terms: {
      title: "Terms & Conditions",
      lastUpdated: "June 19, 2026",
      content: (
        <div>
          <p>Welcome to InfiStyle India. By accessing or using our website, design tools, or customizer platform, you agree to comply with and be bound by these Terms and Conditions.</p>
          
          <h4>1. Intellectual Property & User Content</h4>
          <p>Users retain ownership of any logos, images, or designs uploaded to our platform. However, by uploading content, you grant InfiStyle a non-exclusive, royalty-free license to print and manufacture products on your behalf. You guarantee that you own the rights to all uploaded intellectual property and that it does not infringe on any third-party trademarks.</p>
          
          <h4>2. Print Customization & Color Variance</h4>
          <p>Please note that screen mockups are digital previews. Slight variations in color shade, print alignment, and textile size (up to 5% tolerance) may occur during mechanical printing processes and are not considered manufacturing defects.</p>
          
          <h4>3. Account Responsibilities</h4>
          <p>You are responsible for maintaining the confidentiality of your credentials, including OTP access. Any transactions placed under your account will be considered authorized purchases.</p>
          
          <h4>4. Limit of Liability</h4>
          <p>InfiStyle is not liable for any indirect, incidental, or consequential damages resulting from product delays, transit damage by courier partners, or print file errors uploaded by the user.</p>
        </div>
      )
    },
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "June 19, 2026",
      content: (
        <div>
          <p>At InfiStyle, we respect your privacy. This policy outlines how we collect, store, and process your client profile, billing details, and customized designs.</p>
          
          <h4>1. Information We Collect</h4>
          <ul>
            <li>Personal details: Name, Email address, Phone number.</li>
            <li>Billing details: GST Number, company name, billing and shipping address.</li>
            <li>Coordinates data: Geolocation pins gathered from your maps selector.</li>
            <li>Design Assets: Logo images, font choices, text positioning parameters uploaded to our design locker.</li>
          </ul>
          
          <h4>2. How We Store Your Designs</h4>
          <p>Customizer vector and image files are stored securely in AWS S3 and Cloudinary storage buckets. Customer design history is cached in our PostgreSQL database for up to 12 months to facilitate re-ordering.</p>
          
          <h4>3. Sharing of Information</h4>
          <p>We do not sell your personal data. We only share shipping coordinates and phone details with integrated dispatch courier partners (e.g. Shiprocket) and relevant payment verification IDs with Razorpay.</p>
          
          <h4>4. Safety & Security</h4>
          <p>All database queries are guarded by Row Level Security (RLS) policies. Login access is verified securely via Google OAuth and two-factor SMS OTPs.</p>
        </div>
      )
    },
    refund: {
      title: "Refund & Cancellation Policy",
      lastUpdated: "June 19, 2026",
      content: (
        <div>
          <p>Due to the personalized nature of custom-printed products, refund and cancellation requests are subject to specific guidelines.</p>
          
          <h4>1. Cancellation Window</h4>
          <p>Orders can only be canceled within 1 hour of placement, before they enter the "Design Review" or "Printing Queue" stages. Once production begins, cancellation is not possible.</p>
          
          <h4>2. Reprinting & Replacements</h4>
          <p>We provide free replacements or reprints for orders matching the following conditions:</p>
          <ul>
            <li>Wrong Print: Customization parameters (text or logo alignment) deviate significantly from the approved template.</li>
            <li>Damaged Product: Goods received are torn, broken, or physically defective.</li>
            <li>Wrong Size: The apparel delivered does not match the size (e.g., M, L, XL) specified in your order receipt.</li>
            <li>Courier Damage: Visible damage caused during transit.</li>
          </ul>
          <p>Customers must file replacement requests via their account dashboard with photo evidence within 48 hours of delivery.</p>
          
          <h4>3. Refunds</h4>
          <p>If a replacement is not possible or stock is unavailable, refunds will be approved by the admin panel and processed back to the original payment method (Razorpay or wallet balance) within 5–7 working days.</p>
        </div>
      )
    },
    shipping: {
      title: "Shipping & Delivery Policy",
      lastUpdated: "June 19, 2026",
      content: (
        <div>
          <p>This policy details the shipping process and delivery timelines for custom orders placed on InfiStyle.</p>
          
          <h4>1. Production & Dispatch Timelines</h4>
          <p>All custom orders go through design checking, printing, and quality checks. Processing times vary by category:</p>
          <ul>
            <li>Polo Shirts & Apparel: 3–5 working days.</li>
            <li>Visiting Cards & Letterheads: 2–3 working days.</li>
            <li>Drinkware & Pens: 3–4 working days.</li>
          </ul>
          
          <h4>2. Shipping Partners & Tracking</h4>
          <p>We partner with leading couriers (Delhivery, BlueDart, DTDC) via Shiprocket fulfillment. Once dispatched, a tracking ID will be generated and updated in your customer dashboard alongside real-time WhatsApp and SMS tracking alerts.</p>
          
          <h4>3. Shipping Costs</h4>
          <p>Standard delivery charges are ₹80 per order. We provide free shipping for all orders with a cart subtotal exceeding ₹1,000.</p>
          
          <h4>4. Remote Delivery & Delays</h4>
          <p>Timelines may be extended for remote pin-codes or during national festivals. InfiStyle is not liable for weather-related courier delays.</p>
        </div>
      )
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <button onClick={onGoBack} style={styles.backBtn}>
        ← Back to Store
      </button>

      <h1 style={styles.title}>Legal Center</h1>
      <p style={styles.subtitle}>Required documentation for payment gateway verification and customer transparency.</p>
      
      <div style={styles.tabContainer}>
        {Object.keys(policies).map((key) => (
          <button 
            key={key} 
            onClick={() => setActiveTab(key)}
            style={{
              ...styles.tabBtn,
              borderColor: activeTab === key ? 'var(--color-secondary)' : 'var(--color-border)',
              backgroundColor: activeTab === key ? '#f0f9ff' : '#ffffff',
              color: activeTab === key ? 'var(--color-secondary)' : '#444444',
              fontWeight: activeTab === key ? '700' : '500'
            }}
          >
            {policies[key].title}
          </button>
        ))}
      </div>

      <div style={styles.contentCard}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>{policies[activeTab].title}</h2>
          <span style={styles.updated}>Last Updated: {policies[activeTab].lastUpdated}</span>
        </div>
        <div style={styles.sectionDivider}></div>
        <div style={styles.cardBody}>
          {policies[activeTab].content}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: 'var(--font-primary)',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-secondary)',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '20px',
    padding: '0',
    transition: 'color 0.2s',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#111111',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666666',
    marginBottom: '30px',
  },
  tabContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  tabBtn: {
    padding: '12px 20px',
    fontSize: '14px',
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
    boxShadow: '0 4px 12px rgba(255, 204, 0, 0.05)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
  },
  cardTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#111111',
    margin: '0',
  },
  updated: {
    fontSize: '13px',
    color: '#888888',
  },
  sectionDivider: {
    height: '1.5px',
    backgroundColor: 'var(--color-border)',
    margin: '20px 0',
  },
  cardBody: {
    fontSize: '15px',
    color: '#333333',
    lineHeight: '1.7',
  }
};

export default Legal;
