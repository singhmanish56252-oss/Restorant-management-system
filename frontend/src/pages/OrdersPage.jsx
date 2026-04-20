import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE } from '../context';
import { Package, Utensils, Clock, CheckCircle } from 'lucide-react';

export default function OrdersPage({ setCurrentPage }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  useEffect(() => {
    if (!token) {
      setCurrentPage('auth');
      return;
    }
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <span className="badge badge-pending"><Clock size={12}/> Pending</span>;
      case 'COOKING': return <span className="badge badge-cooking"><Utensils size={12}/> Cooking</span>;
      case 'DELIVERED': return <span className="badge badge-delivered"><CheckCircle size={12}/> Delivered</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  if (loading) {
    return <div className="page fade-in loading-center"><div className="spinner"/>Loading your orders...</div>;
  }

  return (
    <div className="page fade-in">
      <div className="page-title">
        <h1>📦 My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Package size={64} strokeWidth={1} /></div>
          <h3>No orders yet</h3>
          <p>You haven't placed any orders. Hungry?</p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setCurrentPage('menu')}>
            Order Now
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="order-id" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Order #{order.id.toString().padStart(4, '0')}</div>
                    <span style={{ fontSize: '0.8rem', padding: '2px 8px', background: 'var(--bg-elevated)', borderRadius: '4px', border: '1px solid var(--border)' }}>Room {order.roomNumber}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
                {getStatusBadge(order.status)}
              </div>
              <div className="order-items-list">
                {order.items.map(item => (
                  <div key={item.id} className="order-item-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="order-item-qty">{item.quantity}x</span>
                      <span className="order-item-name">{item.menu.name}</span>
                    </div>
                    <span className="order-item-price">₹{item.price.toFixed(0)}</span>
                  </div>
                ))}
              </div>
              {order.specialInstructions && (
                <div style={{ padding: '0 20px 14px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Instructions:</span> {order.specialInstructions}
                </div>
              )}
              <div className="order-footer">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Payment: {order.paymentMethod}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Paid</span>
                </div>
                <span className="order-total text-gold">₹{order.totalAmount.toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
