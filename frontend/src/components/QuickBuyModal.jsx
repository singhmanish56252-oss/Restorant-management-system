import React, { useState } from 'react';
import { X, Plus, Minus, CreditCard, ShoppingBag, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuickBuyModal({ item, isOpen, onClose, onConfirm }) {
  const [qty, setQty] = useState(1);
  const [roomNumber, setRoomNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PHONEPE');

  const PAYMENT_OPTIONS = [
    { id: 'PHONEPE', name: 'PhonePe', icon: '📱' },
    { id: 'GPAY', name: 'Google Pay', icon: '💳' },
    { id: 'PAYTM', name: 'Paytm', icon: '🏧' },
    { id: 'CASH', name: 'Cash', icon: '💵' },
  ];

  if (!isOpen || !item) return null;

  const total = item.price * qty;
  const tax = total * 0.05;
  const grandTotal = total + tax;

  const handleProceed = () => {
    if (!roomNumber.trim()) {
      alert('Please enter your Room Number');
      return;
    }
    onConfirm({
      item,
      qty,
      roomNumber,
      paymentMethod,
      grandTotal
    });
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 5, 8, 0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}
      >
        <motion.div 
          className="modal glass" 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          style={{ 
            maxWidth: 460, 
            width: '100%',
            background: 'rgba(22, 22, 31, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px',
            boxShadow: 'var(--shadow-lg), 0 0 40px rgba(0, 0, 0, 0.6)'
          }}
        >
          {/* Header */}
          <div className="modal-header" style={{ marginBottom: 20 }}>
            <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShoppingBag size={20} className="text-gold" /> Quick Purchase
            </h2>
            <button className="close-btn" onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
          </div>

          {/* Item details */}
          <div style={{ 
            display: 'flex', 
            gap: 16, 
            marginBottom: 24, 
            padding: 16, 
            background: 'var(--bg-elevated)', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border)' 
          }}>
            <img 
              src={item.image} 
              style={{ 
                width: 72, 
                height: 72, 
                borderRadius: 'var(--radius-sm)', 
                objectFit: 'cover',
                border: '1px solid var(--border)' 
              }} 
              alt={item.name} 
            />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>{item.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>
                {item.category} Category
              </p>
              <p style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.1rem', marginTop: 6 }}>
                ₹{item.price.toFixed(0)}
              </p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Quantity</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>₹{item.price.toFixed(0)} / each</span>
            </label>
            <div className="cart-quantity" style={{ 
              justifyContent: 'space-between', 
              background: 'var(--bg-elevated)', 
              padding: '10px 16px', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}>
              <button 
                className="qty-btn" 
                onClick={() => setQty(Math.max(1, qty - 1))}
                style={{ width: 34, height: 34 }}
              >
                <Minus size={16} />
              </button>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, minWidth: 40, textAlign: 'center', color: 'var(--text-primary)' }}>
                {qty}
              </span>
              <button 
                className="qty-btn" 
                onClick={() => setQty(qty + 1)}
                style={{ width: 34, height: 34 }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Room Number */}
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Hash size={14} /> Room Number <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. 305" 
              value={roomNumber} 
              onChange={e => setRoomNumber(e.target.value)}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* Payment Method */}
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label">Payment Method</label>
            <div className="payment-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {PAYMENT_OPTIONS.map(opt => (
                <motion.div 
                  key={opt.id} 
                  className={`payment-option ${paymentMethod === opt.id ? 'active' : ''}`}
                  onClick={() => setPaymentMethod(opt.id)}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: paymentMethod === opt.id ? 'var(--gold-glow)' : 'var(--bg-elevated)',
                    borderColor: paymentMethod === opt.id ? 'var(--gold)' : 'var(--border)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{opt.icon}</span>
                  <span className="payment-label" style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: 600,
                    color: paymentMethod === opt.id ? 'var(--gold)' : 'var(--text-secondary)'
                  }}>
                    {opt.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cost Breakdown */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.02)', 
            padding: 18, 
            borderRadius: 'var(--radius-md)', 
            border: '1px dashed var(--border)',
            marginBottom: 24 
          }}>
            <div className="summary-row" style={{ border: 'none', padding: '4px 0', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Price ({qty} × ₹{item.price})</span>
              <span style={{ fontWeight: 500 }}>₹{total}</span>
            </div>
            <div className="summary-row" style={{ border: 'none', padding: '4px 0', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>GST (5%)</span>
              <span style={{ fontWeight: 500 }}>₹{tax.toFixed(0)}</span>
            </div>
            <div className="divider" style={{ margin: '12px 0', height: 1, background: 'var(--border)' }} />
            <div className="summary-row" style={{ border: 'none', padding: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Total Payable</span>
              <span style={{ color: 'var(--gold)', fontSize: '1.3rem', fontWeight: 800 }}>₹{grandTotal.toFixed(0)}</span>
            </div>
          </div>

          {/* Action Button */}
          <motion.button 
            className="btn btn-primary btn-full btn-lg" 
            onClick={handleProceed}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ display: 'flex', gap: 8, justifyContent: 'center' }}
          >
            <CreditCard size={18} /> Proceed to Pay
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
