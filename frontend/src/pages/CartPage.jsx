import React, { useState } from 'react';
import { useCart, useAuth, useToast, API_BASE } from '../context';
import { Trash2, Plus, Minus, ShoppingCart, CheckCircle, CreditCard, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PaymentModal from '../components/PaymentModal';
import Receipt from '../components/Receipt';

export default function CartPage({ setCurrentPage }) {
  const { cart, removeFromCart, updateQuantity, clearCart, total, itemCount } = useCart();
  const { user, token } = useAuth();
  const toast = useToast();
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  const PAYMENT_OPTIONS = [
    { id: 'CASH', name: 'Cash on Delivery', icon: '💵' },
    { id: 'PHONEPE', name: 'PhonePe', icon: '📱' },
    { id: 'GPAY', name: 'Google Pay', icon: '💳' },
    { id: 'PAYTM', name: 'Paytm', icon: '🏧' },
  ];

  const handlePlaceOrder = async () => {
    if (!user) { toast.info('Please sign in first'); setCurrentPage('auth'); return; }
    if (cart.length === 0) { toast.error('Your cart is empty'); return; }
    if (!roomNumber.trim()) { toast.error('Please enter your Room Number'); return; }

    if (paymentMethod !== 'CASH') {
      setShowPaymentModal(true);
    } else {
      executeOrder();
    }
  };

  const executeOrder = async () => {
    setPlacing(true);
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          items: cart.map(i => ({ menuId: i.id, quantity: i.quantity })),
          specialInstructions: instructions,
          roomNumber: roomNumber.trim(),
          paymentMethod
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to place order');
      setLastOrder(data);
      clearCart();
      setPlaced(true);
      toast.success('Order placed successfully! 🎉');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacing(false);
      setShowPaymentModal(false);
    }
  };

  if (placed && lastOrder) {
    return <Receipt order={lastOrder} onContinue={() => setCurrentPage('orders')} />;
  }

  if (cart.length === 0) {
    return (
      <div className="page fade-in">
        <div className="page-title"><h1>🛒 Your Cart</h1></div>
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="empty-state-icon"><ShoppingCart size={64} strokeWidth={1} /></div>
          <h3>Your cart is empty</h3>
          <p>Add delicious items from our menu to get started.</p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setCurrentPage('menu')}>
            Browse Menu
          </button>
        </motion.div>
      </div>
    );
  }

  const tax = total * 0.05;
  const grandTotal = total + tax;

  return (
    <div className="page fade-in">
      <div className="page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🛒 Your Cart</h1>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {itemCount} {itemCount === 1 ? 'item' : 'items'} selected
        </span>
      </div>
      
      <div className="cart-layout">
        {/* Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AnimatePresence mode="popLayout">
              {cart.map(item => (
                <motion.div 
                  layout
                  key={item.id} 
                  className="cart-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ 
                    opacity: 0, 
                    x: -50, 
                    height: 0, 
                    marginBottom: 0, 
                    paddingTop: 0, 
                    paddingBottom: 0, 
                    border: 'none', 
                    overflow: 'hidden' 
                  }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  style={{ display: 'flex', gap: 16, alignItems: 'center' }}
                >
                  <img 
                    src={item.image} 
                    style={{ 
                      width: 64, 
                      height: 64, 
                      borderRadius: 'var(--radius-sm)', 
                      objectFit: 'cover',
                      border: '1px solid var(--border)'
                    }} 
                    alt={item.name} 
                  />
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      ₹{item.price.toFixed(0)} × {item.quantity}
                    </div>
                    <div style={{ marginTop: 2, fontWeight: 700, color: 'var(--gold)', fontSize: '0.95rem' }}>
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <motion.button
                      onClick={() => removeFromCart(item.id)}
                      whileHover={{ scale: 1.1, color: 'var(--danger)' }}
                      whileTap={{ scale: 0.9 }}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                    <div className="cart-quantity">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={12} /></button>
                      <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={12} /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <button className="btn btn-danger btn-sm" style={{ alignSelf: 'flex-start' }} onClick={clearCart}>
            <Trash2 size={14} /> Clear Cart
          </button>
        </div>

        {/* Order Summary & Settings */}
        <div className="order-summary glass" style={{ background: 'rgba(22, 22, 31, 0.8)' }}>
          <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} className="text-gold" /> Order Summary
          </h3>
          <div className="summary-row">
            <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
            <span>₹{total.toFixed(0)}</span>
          </div>
          <div className="summary-row">
            <span style={{ color: 'var(--text-secondary)' }}>GST (5%)</span>
            <span>₹{tax.toFixed(0)}</span>
          </div>
          <div className="summary-row">
            <span style={{ color: 'var(--text-secondary)' }}>Delivery Fee</span>
            <span style={{ color: 'var(--success)' }}>Free</span>
          </div>
          <div className="divider" />
          <div className="summary-row" style={{ paddingBottom: 0 }}>
            <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Total Amount</span>
            <span className="summary-total" style={{ fontSize: '1.3rem', fontWeight: 800 }}>₹{grandTotal.toFixed(0)}</span>
          </div>

          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Room Number Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Room Number <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 204"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                required
              />
            </div>

            {/* Payment Method Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Payment Method
              </label>
              <div className="payment-grid" style={{ gap: 8 }}>
                {PAYMENT_OPTIONS.map(opt => (
                  <motion.div 
                    key={opt.id} 
                    className={`payment-option ${paymentMethod === opt.id ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(opt.id)}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      padding: '12px 6px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      background: paymentMethod === opt.id ? 'var(--gold-glow)' : 'var(--bg-elevated)',
                      borderColor: paymentMethod === opt.id ? 'var(--gold)' : 'var(--border)'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{opt.icon}</span>
                    <span className="payment-label" style={{ fontSize: '0.72rem' }}>{opt.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Special Instructions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Special Instructions (Optional)
              </label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="e.g. Make it spicy, no onions..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                style={{ resize: 'none' }}
              />
            </div>
          </div>

          <motion.button
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop: 24 }}
            onClick={handlePlaceOrder}
            disabled={placing}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {placing
              ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Placing Order...</>
              : '🎉 Place Order'}
          </motion.button>

          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            🔒 {paymentMethod === 'CASH' ? 'Cash on Delivery Available' : `Pay via ${paymentMethod} on Delivery`}
          </div>
        </div>
      </div>
      
      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={executeOrder}
        amount={grandTotal}
        method={paymentMethod}
      />
    </div>
  );
}
