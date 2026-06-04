import React from 'react';
import { ChefHat, Clock, Star, Truck, ShieldCheck, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage({ setCurrentPage }) {
  const features = [
    { icon: <Utensils size={24} />, title: 'Curated Menu', desc: 'Fresh ingredients, expertly crafted dishes across all categories.' },
    { icon: <Clock size={24} />, title: 'Live Order Tracking', desc: 'Watch your order go from kitchen to your table in real time.' },
    { icon: <ShieldCheck size={24} />, title: 'Secure Payments', desc: 'Your data is safe with encrypted, reliable transactions.' },
    { icon: <Truck size={24} />, title: 'Fast Delivery', desc: 'Hot food delivered to your room within minutes.' },
  ];

  const categories = [
    { emoji: '🥗', label: 'Veg', color: '#34d399', value: 'Veg' },
    { emoji: '🍗', label: 'Non-Veg', color: '#f87171', value: 'Non-Veg' },
    { emoji: '🍹', label: 'Drinks', color: '#60a5fa', value: 'Drinks' },
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.3 } 
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="hero-text">
            <motion.div className="hero-badge" variants={itemVariants}>
              <span />
              Now Taking Orders
            </motion.div>

            <motion.h1 variants={itemVariants}>
              Fine Dining,<br />
              <em>Delivered to You</em>
            </motion.h1>

            <motion.p variants={itemVariants}>
              Experience the best of hotel cuisine — order from our premium menu
              and track your food in real time, all from one elegant platform.
            </motion.p>

            <motion.div className="hero-actions" variants={itemVariants}>
              <button className="btn btn-primary btn-lg" onClick={() => setCurrentPage('menu')}>
                🍽️ Explore Menu
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => setCurrentPage('auth')}>
                Sign In / Register
              </button>
            </motion.div>

            <motion.div className="hero-stats" variants={itemVariants}>
              {[
                { value: '50+', label: 'Menu Items' },
                { value: '3', label: 'Categories' },
                { value: '< 30 min', label: 'Delivery Time' },
                { value: '4.9 ⭐', label: 'Average Rating' },
              ].map(s => (
                <div key={s.label}>
                  <div className="hero-stat-value">{s.value}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div 
            className="hero-image-container"
            variants={imageVariants}
          >
            <div className="hero-image-wrapper">
              <div className="hero-image-ring" />
              <div className="hero-image-glow" />
              <img 
                src="/hero-dish.png" 
                alt="Luxury Gourmet Dining" 
                className="hero-dish-img"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories */}
      <section style={{ padding: '80px 20px', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 12 }}
          >
            Browse by Category
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 48 }}
          >
            Something for every craving
          </motion.p>
          <motion.div 
            className="grid-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {categories.map(cat => (
              <motion.button
                key={cat.value}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                onClick={() => setCurrentPage('menu')}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)', padding: '40px 32px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                  cursor: 'pointer', transition: 'border-color 0.2s, background-color 0.2s', textAlign: 'center',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <span style={{ fontSize: '3.5rem' }}>{cat.emoji}</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 700 }}>{cat.label}</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>View all {cat.label} items →</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 20px' }}>
        <div className="container">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 12 }}
          >
            Why LuxeEats?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 48 }}
          >
            Premium dining experience, simplified
          </motion.p>
          <motion.div 
            className="grid-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {features.map(f => (
              <motion.div 
                key={f.title} 
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
                whileHover={{ y: -4, borderColor: 'var(--border-gold)' }}
                className="card card-body" 
                style={{ display: 'flex', gap: 20, alignItems: 'flex-start', transition: 'border-color 0.2s' }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 'var(--radius-md)',
                  background: 'var(--gold-glow)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: 'var(--gold)', flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <div>
                  <h3 style={{ marginBottom: 6 }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 20px', background: 'var(--bg-secondary)' }}>
        <motion.div 
          className="container" 
          style={{ textAlign: 'center' }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 style={{ marginBottom: 16 }}>Ready to <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Order?</em></h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '1.1rem' }}>
            Browse our full menu and get food delivered to your room in minutes.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => setCurrentPage('menu')}>
            View Full Menu 🍽️
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px 20px', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--gold)', marginBottom: 8 }}>🍽️ LuxeEats</div>
        <p>© 2026 LuxeEats Hotel Management System. All rights reserved.</p>
      </footer>
    </>
  );
}
