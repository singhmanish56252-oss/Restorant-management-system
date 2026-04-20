import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Loader2, QrCode, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PaymentModal({ isOpen, onClose, onPaymentSuccess, amount, method }) {
  const [status, setStatus] = useState('qr'); // 'qr' | 'processing' | 'success'

  useEffect(() => {
    if (!isOpen) setStatus('qr');
  }, [isOpen]);

  const handlePay = () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onPaymentSuccess();
      }, 1500);
    }, 3000);
  };

  const getMethodName = () => {
    switch (method) {
      case 'PHONEPE': return 'PhonePe';
      case 'GPAY': return 'Google Pay';
      case 'PAYTM': return 'Paytm';
      default: return 'Online Payment';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="modal glass" 
        style={{ maxWidth: 400, textAlign: 'center' }}
      >
        <div className="modal-header">
          <h2 className="modal-title">Secure Checkout</h2>
          <button className="close-btn" onClick={onClose}><X /></button>
        </div>

        <AnimatePresence mode="wait">
          {status === 'qr' && (
            <motion.div 
              key="qr"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div style={{ background: 'white', padding: 20, borderRadius: 12, display: 'inline-block', marginBottom: 20 }}>
                <QrCode size={200} color="#000" />
              </div>
              <h3>Scan to Pay ₹{amount.toFixed(0)}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 8 }}>
                Pay using your preferred app: <strong>{getMethodName()}</strong>
              </p>
              
              <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button className="btn btn-primary btn-full btn-lg pulse-gold" onClick={handlePay}>
                  Simulate Payment Success
                </button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--success)', fontSize: '0.8rem' }}>
                  <ShieldCheck size={14} /> 256-bit Secure Encryption
                </div>
              </div>
            </motion.div>
          )}

          {status === 'processing' && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              style={{ padding: '40px 0' }}
            >
              <Loader2 size={64} className="spinner" style={{ marginBottom: 20, color: 'var(--gold)' }} />
              <h3>Processing Payment...</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Please do not close this window or refresh the page.</p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ padding: '40px 0' }}
            >
              <CheckCircle size={80} color="var(--success)" style={{ marginBottom: 20 }} />
              <h2 style={{ color: 'var(--success)' }}>Payment Successful!</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Your order is being finalized...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
