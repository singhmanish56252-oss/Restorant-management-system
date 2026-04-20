import React, { useState } from 'react';
import { X, Plus, Minus, CreditCard, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

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
    if (!roomNumber.trim()) return alert('Please enter room number');
    onConfirm({
      item,
      qty,
      roomNumber,
      paymentMethod,
      grandTotal
    });
  };

  return (
    <div className="modal-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="modal" 
        style={{ maxWidth: 450 }}
      >
        <div className="modal-header">
          <h2 className="modal-title">Quick Purchase</h2>
          <button className="close-btn" onClick={onClose}><X /></button>
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <img src={item.image} style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover' }} alt="" />
          <div>
            <h3 style={{ margin: 0 }}>{item.name}</h3>
            <p style={{ color: 'var(--gold)', fontWeight: 700, marginTop: 4 }}>₹{item.price}</p>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 20 }}>
          <label className="form-label">Select Quantity</label>
          <div className="cart-quantity" style={{ justifyContent: 'center', background: 'var(--bg-elevated)', padding: 12, borderRadius: 12 }}>
            <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={18} /></button>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, minWidth: 40, textAlign: 'center' }}>{qty}</span>
            <button className="qty-btn" onClick={() => setQty(qty + 1)}><Plus size={18} /></button>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 20 }}>
          <label className="form-label">Room Number</label>
          <input 
            type="text" className="form-input" placeholder="e.g. 302" 
            value={roomNumber} onChange={e => setRoomNumber(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 24 }}>
          <label className="form-label">Payment Method</label>
          <div className="payment-grid">
            {PAYMENT_OPTIONS.map(opt => (
              <div 
                key={opt.id} 
                className={`payment-option ${paymentMethod === opt.id ? 'active' : ''}`}
                onClick={() => setPaymentMethod(opt.id)}
              >
                <span>{opt.icon}</span>
                <span className="payment-label">{opt.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 12, marginBottom: 24 }}>
          <div className="summary-row" style={{ border: 'none', padding: '4px 0' }}>
            <span>Price ({qty} x ₹{item.price})</span>
            <span>₹{total}</span>
          </div>
          <div className="summary-row" style={{ border: 'none', padding: '4px 0' }}>
            <span>GST (5%)</span>
            <span>₹{tax.toFixed(0)}</span>
          </div>
          <div className="summary-row receipt-grand-total" style={{ border: 'none', padding: '10px 0 0', marginTop: 10, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 700 }}>Total Payable</span>
            <span style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>₹{grandTotal.toFixed(0)}</span>
          </div>
        </div>

        <button className="btn btn-primary btn-full btn-lg" onClick={handleProceed}>
          <CreditCard size={18} /> Proceed to Pay
        </button>
      </motion.div>
    </div>
  );
}
