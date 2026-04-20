import React from 'react';
import { ChefHat, Clock, Star, Truck, ShieldCheck, Utensils } from 'lucide-react';

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

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-badge">
            <span />
            Now Taking Orders
          </div>

          <h1>
            Fine Dining,<br />
            <em>Delivered to You</em>
          </h1>

          <p>
            Experience the best of hotel cuisine — order from our premium menu
            and track your food in real time, all from one elegant platform.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => setCurrentPage('menu')}>
              🍽️ Explore Menu
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => setCurrentPage('auth')}>
              Sign In / Register
            </button>
          </div>

          <div className="hero-stats">
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
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '80px 20px', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Browse by Category</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 48 }}>
            Something for every craving
          </p>
          <div className="grid-3">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCurrentPage('menu')}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)', padding: '40px 32px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <span style={{ fontSize: '3.5rem' }}>{cat.emoji}</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 700 }}>{cat.label}</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>View all {cat.label} items →</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 20px' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Why LuxeEats?</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 48 }}>
            Premium dining experience, simplified
          </p>
          <div className="grid-2">
            {features.map(f => (
              <div key={f.title} className="card card-body" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 20px', background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: 16 }}>Ready to <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Order?</em></h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '1.1rem' }}>
            Browse our full menu and get food delivered to your room in minutes.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => setCurrentPage('menu')}>
            View Full Menu 🍽️
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px 20px', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--gold)', marginBottom: 8 }}>🍽️ LuxeEats</div>
        <p>© 2026 LuxeEats Hotel Management System. All rights reserved.</p>
      </footer>
    </>
  );
}
