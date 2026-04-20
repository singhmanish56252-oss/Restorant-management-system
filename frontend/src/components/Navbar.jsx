import React, { useState } from 'react';
import { useAuth, useCart } from '../context';
import { ShoppingCart, LogOut, User, LayoutDashboard, UtensilsCrossed } from 'lucide-react';

export default function Navbar({ currentPage, setCurrentPage }) {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <button
          className="navbar-brand"
          onClick={() => setCurrentPage('home')}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          🍽️ Luxe<span>Eats</span>
        </button>

        {/* Links */}
        <div className="navbar-links">
          <button
            className={`navbar-link ${currentPage === 'home' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setCurrentPage('home')}
          >
            Home
          </button>
          <button
            className={`navbar-link ${currentPage === 'menu' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setCurrentPage('menu')}
          >
            Menu
          </button>
          {user && (
            <button
              className={`navbar-link ${currentPage === 'orders' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setCurrentPage('orders')}
            >
              My Orders
            </button>
          )}
          {user?.role === 'ADMIN' && (
            <button
              className={`navbar-link ${currentPage === 'admin' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)' }}
              onClick={() => setCurrentPage('admin')}
            >
              <LayoutDashboard size={14} style={{ display: 'inline', marginRight: 4 }} />
              Admin
            </button>
          )}
        </div>

        {/* Right actions */}
        <div className="navbar-user">
          {user && (
            <button className="btn btn-ghost btn-sm cart-btn" onClick={() => setCurrentPage('cart')}>
              <ShoppingCart size={18} />
              Cart
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </button>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Hi, {user.name?.split(' ')[0] || 'User'}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => setCurrentPage('auth')}>
              <User size={16} />
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
