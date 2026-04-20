import React, { useState } from 'react';
import { useAuth, useToast, API_BASE } from '../context';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AuthPage({ onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CUSTOMER' });

  const { login } = useAuth();
  const toast = useToast();

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, role: form.role };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      login(data.token, data.user);
      toast.success(isLogin ? `Welcome back, ${data.user.name || 'User'}! 🎉` : 'Account created! Welcome! 🎉');
      onSuccess(data.user.role === 'ADMIN' ? 'admin' : 'menu');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card slide-up">
        <div className="auth-logo">🍽️ LuxeEats</div>
        <p className="auth-subtitle">
          {isLogin ? 'Welcome back! Sign in to your account.' : 'Create an account to start ordering.'}
        </p>

        {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  name="name" value={form.name} onChange={handleChange}
                  placeholder="John Doe" required={!isLogin}
                  className="form-input" style={{ paddingLeft: 40 }}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" required
                className="form-input" style={{ paddingLeft: 40 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                name="password" type={showPass ? 'text' : 'password'} value={form.password}
                onChange={handleChange} placeholder="••••••••" required
                className="form-input" style={{ paddingLeft: 40, paddingRight: 40 }}
              />
              <button
                type="button" onClick={() => setShowPass(s => !s)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Account Type</label>
              <div style={{ position: 'relative' }}>
                <ShieldCheck size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <select name="role" value={form.role} onChange={handleChange} className="form-input" style={{ paddingLeft: 40 }}>
                  <option value="CUSTOMER">Customer</option>
                  <option value="ADMIN">Admin (Staff)</option>
                </select>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Processing...</> : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
