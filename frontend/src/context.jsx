import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const CartContext = createContext(null);
const ToastContext = createContext(null);

export const API_BASE = import.meta.env.VITE_API_URL 
  || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
      ? 'https://restaurant-management-backend.onrender.com/api'
      : 'http://localhost:5000/api');

// ─── Auth Context ──────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let storedToken = localStorage.getItem('hotel_token');
    let storedUser = localStorage.getItem('hotel_user');
    
    // Auto login guest user if not already set
    if (!storedToken || !storedUser) {
      const defaultUser = { id: 2, name: 'Guest Customer', email: 'user@hotel.com', role: 'CUSTOMER' };
      localStorage.setItem('hotel_token', 'mock_token_2');
      localStorage.setItem('hotel_user', JSON.stringify(defaultUser));
      storedToken = 'mock_token_2';
      storedUser = JSON.stringify(defaultUser);
    }
    
    setToken(storedToken);
    setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login = (token, user) => {
    localStorage.setItem('hotel_token', token);
    localStorage.setItem('hotel_user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('hotel_token');
    localStorage.removeItem('hotel_user');
    setToken(null);
    setUser(null);
  };

  const toggleRole = () => {
    if (!user) return;
    const nextRole = user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    const updatedUser = {
      ...user,
      name: nextRole === 'ADMIN' ? 'Admin User' : 'Guest Customer',
      role: nextRole
    };
    localStorage.setItem('hotel_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, toggleRole, loading, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// ─── Cart Context ──────────────────────────────────────────
export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hotel_cart') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('hotel_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

// ─── Toast Context ─────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span>{icons[t.type]}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
