import React from 'react';
import { Download, Printer, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Receipt({ order, onContinue }) {
  if (!order) return null;

  const date = new Date(order.createdAt).toLocaleString();
  const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05;

  return (
    <div className="page fade-in" style={{ padding: '40px 20px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="receipt-container"
      >
        <div className="receipt-header">
          <div className="receipt-logo">LUXEEATS</div>
          <div className="receipt-title">Official Guest Receipt</div>
        </div>

        <div className="receipt-info">
          <div>
            <strong>ORDER ID:</strong> #{order.id}<br />
            <strong>DATE:</strong> {date}
          </div>
          <div style={{ textAlign: 'right' }}>
            <strong>ROOM:</strong> {order.roomNumber}<br />
            <strong>METHOD:</strong> {order.paymentMethod}
          </div>
        </div>

        <table className="receipt-table">
          <thead>
            <tr>
              <th>Item</th>
              <th style={{ textAlign: 'center' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item, idx) => (
              <tr key={idx}>
                <td>{item.menu?.name || 'Item'}</td>
                <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>₹{(item.price * item.quantity).toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="receipt-total-section">
          <div className="receipt-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(0)}</span>
          </div>
          <div className="receipt-row">
            <span>GST (5%)</span>
            <span>₹{tax.toFixed(0)}</span>
          </div>
          <div className="receipt-row receipt-grand-total">
            <span>GRAND TOTAL</span>
            <span>₹{order.totalAmount.toFixed(0)}</span>
          </div>
        </div>

        <div className="receipt-footer">
          <p>Thank you for choosing LuxeEats.</p>
          <p>We hope you enjoy your meal!</p>
          <div className="receipt-cut-line"></div>
        </div>

        <div style={{ marginTop: 40, display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>
            <Printer size={16} /> Print
          </button>
          <button className="btn btn-ghost btn-sm">
            <Download size={16} /> Download
          </button>
          <button className="btn btn-primary btn-sm" onClick={onContinue}>
            Done
          </button>
        </div>
      </motion.div>

      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <CheckCircle size={48} color="var(--success)" style={{ marginBottom: 16 }} />
        <h3>Order Confirmed!</h3>
        <p style={{ color: 'var(--text-secondary)' }}>You can find this receipt in your Orders section.</p>
      </div>
    </div>
  );
}
