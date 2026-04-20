import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth, useToast, API_BASE } from '../context';
import { PackageSearch, CircleDollarSign, Users, CheckCircle, Clock, UtensilsCrossed, Plus, Edit, Trash2, X, Upload } from 'lucide-react';

export default function AdminPage() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalCustomers: 0, pendingOrders: 0, menuCount: 0 });
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'menu'
  const toast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: 'Veg', image: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchStats();
      fetchOrders();
      fetchMenuItems();
    }
  }, [user]);

  const fetchStats = async () => {
    const res = await fetch(`${API_BASE}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setStats(await res.json());
  };

  const fetchOrders = async () => {
    const res = await fetch(`${API_BASE}/orders`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setOrders(await res.json());
  };

  const fetchMenuItems = async () => {
    const res = await fetch(`${API_BASE}/menu`); // Public endpoint is fine for listing
    if (res.ok) setMenuItems(await res.json());
  };

  const updateOrderStatus = async (id, status) => {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      toast.success(`Order #${id} marked as ${status}`);
      fetchOrders();
      fetchStats();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Max 5MB allowed.');
      return;
    }

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataUpload
      });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, image: data.url }));
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `${API_BASE}/menu/${editingItem.id}` : `${API_BASE}/menu`;
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to save menu item');
      toast.success(`Item ${editingItem ? 'updated' : 'added'} successfully!`);
      setIsModalOpen(false);
      fetchMenuItems();
      fetchStats();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`${API_BASE}/menu/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete item');
      toast.success('Item deleted');
      fetchMenuItems();
      fetchStats();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', category: 'Veg', image: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({ name: item.name, description: item.description || '', price: item.price, category: item.category, image: item.image || '' });
    setIsModalOpen(true);
  };

  if (user?.role !== 'ADMIN') return <div className="page"><div className="empty-state">Access Denied</div></div>;

  return (
    <div className="admin-layout fade-in">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-section-label">Management</div>
        <button 
          className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <PackageSearch size={18} /> Overview
        </button>
        <button 
          className={`admin-nav-item ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          <UtensilsCrossed size={18} /> Menu Items
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h1>{activeTab === 'overview' ? 'Admin Dashboard' : 'Menu Management'}</h1>
          {activeTab === 'menu' && (
            <button className="btn btn-primary" onClick={openAddModal}>
              <Plus size={18} /> Add New Item
            </button>
          )}
        </div>

        {/* Analytics Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 40 }}>
          <div className="card glass" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ margin: 0 }}>Revenue Growth</h3>
              <span className="badge badge-delivered">Live</span>
            </div>
            {/* Simple SVG Chart */}
            <div style={{ height: 200, width: '100%', position: 'relative' }}>
              <svg viewBox="0 0 400 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d="M0,80 L50,60 L100,75 L150,40 L200,55 L250,20 L300,45 L350,15 L400,30" 
                  fill="none" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
                />
                <path 
                  d="M0,80 L50,60 L100,75 L150,40 L200,55 L250,20 L300,45 L350,15 L400,30 L400,100 L0,100 Z" 
                  fill="url(#chartGradient)" 
                />
                {/* Horizontal Grid Lines */}
                {[20, 40, 60, 80].map(y => (
                  <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                ))}
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: 10 }}>
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>

          <div className="card glass" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 20 }}>Live Feed</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {orders.slice(0, 4).map((o, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: o.status === 'PENDING' ? 'var(--warning)' : 'var(--success)' }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Order #{o.id}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.user.name} — ₹{o.totalAmount}</div>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Just now</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid-4" style={{ marginBottom: 40 }}>
          <div className="stat-card">
            <div>
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value text-gold">₹{stats.totalRevenue.toFixed(0)}</div>
            </div>
            <div className="stat-icon"><CircleDollarSign className="text-gold" /></div>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Pending Orders</div>
              <div className="stat-value text-warning">{stats.pendingOrders}</div>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(251,191,36,0.1)' }}><Clock className="text-warning" /></div>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Total Items</div>
              <div className="stat-value">{stats.menuCount || menuItems.length}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--bg-hover)' }}><UtensilsCrossed size={20} /></div>
          </div>
          <div className="stat-card">
            <div>
              <div className="stat-label">Customers</div>
              <div className="stat-value">{stats.totalCustomers}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--bg-hover)' }}><Users /></div>
          </div>
        </div>

        {activeTab === 'overview' ? (
          /* Live Orders Table */
          <div className="table-wrap">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <h3 style={{ margin: 0 }}>Recent Orders</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>No orders yet.</td></tr>
                  ) : orders.map(o => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 600 }}>#{o.id}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>{o.user.name}</span>
                          <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: 'var(--bg-elevated)', borderRadius: '4px', border: '1px solid var(--border)' }}>Room {o.roomNumber}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{o.user.email}</div>
                        {o.specialInstructions && (
                          <div style={{ marginTop: 4, padding: '4px 8px', background: 'rgba(251, 191, 36, 0.1)', borderLeft: '2px solid var(--warning)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            <span style={{ fontWeight: 600, color: 'var(--warning)' }}>Request:</span> {o.specialInstructions}
                          </div>
                        )}
                      </td>
                      <td className="text-gold" style={{ fontWeight: 700 }}>₹{o.totalAmount.toFixed(0)}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{o.paymentMethod}</td>
                      <td>
                        <span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {o.status === 'PENDING' && (
                            <button className="btn btn-sm" style={{ background: 'rgba(249,115,22,0.15)', color: 'var(--status-cooking)', border: '1px solid currentColor' }} onClick={() => updateOrderStatus(o.id, 'COOKING')}>
                              Cook
                            </button>
                          )}
                          {o.status === 'COOKING' && (
                            <button className="btn btn-sm" style={{ background: 'rgba(52,211,153,0.15)', color: 'var(--status-delivered)', border: '1px solid currentColor' }} onClick={() => updateOrderStatus(o.id, 'DELIVERED')}>
                              Deliver
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Menu Management Table */
          <div className="table-wrap">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <h3 style={{ margin: 0 }}>All Menu Items</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>No menu items found.</td></tr>
                  ) : menuItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img 
                            src={item.image} 
                            alt="" 
                            style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} 
                            onError={(e) => {
                              e.target.onerror = null; 
                              e.target.src = 'https://placehold.co/40x40/1c1c28/f5c842?text=F';
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600 }}>{item.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>{item.category}</span>
                      </td>
                      <td className="text-gold" style={{ fontWeight: 700 }}>₹{item.price.toFixed(0)}</td>
                      <td>
                        <span className={`badge ${item.isAvailable ? 'badge-delivered' : 'badge-pending'}`}>
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(item)} style={{ padding: 8 }}>
                            <Edit size={16} />
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteItem(item.id)} style={{ padding: 8, color: 'var(--danger)' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h2 className="modal-title">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            <form onSubmit={handleSaveMenu} className="modal-form">
              <div className="form-group">
                <label className="form-label">Item Name</label>
                <input 
                  type="text" className="form-input" required 
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Butter Paneer"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input 
                    type="number" className="form-input" required 
                    value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                    placeholder="250"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-input" required 
                    value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Starters">Starters</option>
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Wine & Beer">Wine & Beer</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-input" rows={2}
                  value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell us about this dish..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL or Upload</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                  {formData.image && (
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }} 
                    />
                  )}
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      id="image-upload" 
                      style={{ display: 'none' }} 
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                    <label 
                      htmlFor="image-upload" 
                      className="btn btn-ghost" 
                      style={{ width: '100%', gap: 8, cursor: 'pointer', borderColor: 'var(--border)' }}
                    >
                      {uploading ? 'Uploading...' : <><Upload size={16} /> Choose Local Image</>}
                    </label>
                  </div>
                </div>
                <input 
                  type="url" className="form-input" 
                  value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Or paste external URL..."
                />
              </div>
              <div className="modal-actions" style={{ marginTop: 20 }}>
                <button type="button" className="btn btn-ghost btn-full" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-full">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
