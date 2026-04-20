import React, { useState } from 'react';
import { useCart, useAuth, useToast, API_BASE } from '../context';
import { Trash2, Plus, Minus, ShoppingCart, CheckCircle } from 'lucide-react';
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
        <div className="empty-state">
          <div className="empty-state-icon"><ShoppingCart size={64} strokeWidth={1} /></div>
          <h3>Your cart is empty</h3>
          <p>Add delicious items from our menu to get started.</p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setCurrentPage('menu')}>
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  const tax = total * 0.05;
  const grandTotal = total + tax;

  return (
    <div className="page fade-in">
      <div className="page-title"><h1>🛒 Your Cart</h1></div>
      <div className="cart-layout">
        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>🍽️</div>
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">₹{item.price.toFixed(0)} each</div>
                <div style={{ marginTop: 4, fontWeight: 700, color: 'var(--gold)' }}>
                  ₹{(item.price * item.quantity).toFixed(0)}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={16} />
                </button>
                <div className="cart-quantity">
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={12} /></button>
                  <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={12} /></button>
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-danger btn-sm" style={{ alignSelf: 'flex-start' }} onClick={clearCart}>
            <Trash2 size={14} /> Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3 style={{ marginBottom: 20 }}>Order Summary</h3>
          <div className="summary-row">
            <span style={{ color: 'var(--text-secondary)' }}>Subtotal ({itemCount} items)</span>
            <span>₹{total.toFixed(0)}</span>
          </div>
          <div className="summary-row">
            <span style={{ color: 'var(--text-secondary)' }}>GST (5%)</span>
            <span>₹{tax.toFixed(0)}</span>
          </div>
          <div className="summary-row">
            <span style={{ color: 'var(--text-secondary)' }}>Delivery</span>
            <span style={{ color: 'var(--success)' }}>Free</span>
          </div>
          <div className="divider" />
          <div className="summary-row">
            <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Total</span>
            <span className="summary-total">₹{grandTotal.toFixed(0)}</span>
          </div>

          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Payment Method
              </label>
              <div className="payment-grid">
                {PAYMENT_OPTIONS.map(opt => (
                  <div 
                    key={opt.id} 
                    className={`payment-option ${paymentMethod === opt.id ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(opt.id)}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{opt.icon}</span>
                    <span className="payment-label">{opt.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
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

          <button
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop: 24 }}
            onClick={handlePlaceOrder}
            disabled={placing}
          >
            {placing
              ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Placing Order...</>
              : '🎉 Place Order'}
          </button>

          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
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
