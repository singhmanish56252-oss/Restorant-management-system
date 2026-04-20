import React, { useState, useEffect } from 'react';
import { useCart, useAuth, useToast, API_BASE } from '../context';
import { ShoppingCart, Plus, Minus, Search, CreditCard } from 'lucide-react';
import QuickBuyModal from '../components/QuickBuyModal';
import PaymentModal from '../components/PaymentModal';
import Receipt from '../components/Receipt';
const CATEGORIES = ['All', 'Starters', 'Veg', 'Non-Veg', 'Drinks', 'Wine & Beer', 'Desserts'];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

export default function MenuPage({ setCurrentPage }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { cart, addToCart, updateQuantity } = useCart();
  const { user, token } = useAuth();
  const toast = useToast();

  // Direct Buy State
  const [quickBuyItem, setQuickBuyItem] = useState(null);
  const [showQuickBuy, setShowQuickBuy] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/menu`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = items.filter(item => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const getCartQty = (id) => cart.find(i => i.id === id)?.quantity || 0;

  const handleAdd = (item) => {
    if (!user) { toast.info('Please sign in to add items to cart'); setCurrentPage('auth'); return; }
    addToCart(item);
    toast.success(`${item.name} added to cart! 🛒`);
  };

  const startQuickBuy = (item) => {
    if (!user) { toast.info('Please sign in first'); setCurrentPage('auth'); return; }
    setQuickBuyItem(item);
    setShowQuickBuy(true);
  };

  const handleQuickBuyConfirm = (data) => {
    setPaymentData(data);
    setShowQuickBuy(false);
    if (data.paymentMethod === 'CASH') {
      executeQuickOrder(data);
    } else {
      setShowPayment(true);
    }
  };

  const executeQuickOrder = async (data = paymentData) => {
    setPlacing(true);
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          items: [{ menuId: data.item.id, quantity: data.qty }],
          roomNumber: data.roomNumber,
          paymentMethod: data.paymentMethod
        }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error || 'Order failed');
      setLastOrder(order);
      setShowReceipt(true);
      toast.success('Quick Order Placed! 🍽️');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacing(false);
      setShowPayment(false);
    }
  };

  const categoryBadgeClass = (cat) => {
    if (cat === 'Veg') return 'badge badge-veg';
    if (cat === 'Non-Veg') return 'badge badge-nonveg';
    return 'badge badge-drinks';
  };

  return (
    <div className="page fade-in">
      <div className="page-title">
        <h1>🍽️ Our Menu</h1>
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-input"
            style={{ paddingLeft: 40 }}
            placeholder="Search dishes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'Starters' && '🥟 '}
            {cat === 'Veg' && '🥗 '}
            {cat === 'Non-Veg' && '🍗 '}
            {cat === 'Drinks' && '🍹 '}
            {cat === 'Wine & Beer' && '🍷 '}
            {cat === 'Desserts' && '🍰 '}
            {cat === 'All' && '🍽️ '}
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-center">
          <div className="spinner" />
          Loading menu...
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🍽️</div>
          <h3>No items found</h3>
          <p>{search ? 'Try a different search term.' : 'No items in this category yet.'}</p>
        </div>
      ) : (
        showReceipt && lastOrder ? (
          <Receipt order={lastOrder} onContinue={() => setShowReceipt(false)} />
        ) : (
          <div className="grid-3">
            {filtered.map(item => {
              const qty = getCartQty(item.id);
              return (
                <div key={item.id} className="menu-card">
                  <img 
                    src={item.image || FALLBACK_IMAGE} 
                    alt={item.name} 
                    className="menu-card-img" 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                  <div className="menu-card-body">
                    <div className="menu-card-header">
                      <span className="menu-card-name">{item.name}</span>
                      <span className="menu-card-price">₹{item.price.toFixed(0)}</span>
                    </div>
                    {item.description && (
                      <p className="menu-card-desc">{item.description}</p>
                    )}
                    <div className="menu-card-footer">
                      <span className={categoryBadgeClass(item.category)}>{item.category}</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => startQuickBuy(item)}>
                          Buy
                        </button>
                        {qty === 0 ? (
                          <button className="btn btn-primary btn-sm" onClick={() => handleAdd(item)}>
                            <Plus size={14} /> Add
                          </button>
                        ) : (
                          <div className="cart-quantity">
                            <button className="qty-btn" onClick={() => updateQuantity(item.id, qty - 1)}>
                              <Minus size={12} />
                            </button>
                            <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{qty}</span>
                            <button className="qty-btn" onClick={() => updateQuantity(item.id, qty + 1)}>
                              <Plus size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      <QuickBuyModal 
        isOpen={showQuickBuy} 
        item={quickBuyItem} 
        onClose={() => setShowQuickBuy(false)}
        onConfirm={handleQuickBuyConfirm}
      />

      {paymentData && (
        <PaymentModal 
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          onPaymentSuccess={executeQuickOrder}
          amount={paymentData.grandTotal}
          method={paymentData.paymentMethod}
        />
      )}
    </div>
  );
}
