import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form.email, form.password);
      navigate(data.user.role === 'manager' ? '/admin/dashboard' : from);
    } catch {}
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-visual">
          <img src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80" alt="Mens Zone Fashion" />
          <div className="auth-visual-overlay">
            <div className="auth-visual-logo">
              <span className="logo-icon">MZ</span>
              <span>Mens Zone</span>
            </div>
            <h2>Your Style, Your Story</h2>
            <p>Premium men's fashion delivered to your doorstep.</p>
          </div>
        </div>
        <div className="auth-form-side">
          <div className="auth-form-wrapper">
            <Link to="/" className="auth-logo-mobile">
              <span className="logo-icon">MZ</span> Mens Zone
            </Link>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to your account to continue shopping</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-icon-wrap">
                  <FiMail className="input-icon" />
                  <input
                    type="email" className="form-control input-with-icon" required
                    placeholder="your@email.com"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-icon-wrap">
                  <FiLock className="input-icon" />
                  <input
                    type={showPw ? 'text' : 'password'} className="form-control input-with-icon" required
                    placeholder="Enter your password"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="auth-divider"><span>or</span></div>
            <div className="auth-demo-creds">
              <h4>Demo Credentials</h4>
              <div className="demo-cred" onClick={() => setForm({ email: 'manager@menszone.com', password: 'Admin@1234' })}>
                <span className="badge badge-accent">Manager</span>
                <code>manager@menszone.com / Admin@1234</code>
              </div>
              <div className="demo-cred" onClick={() => setForm({ email: 'customer@menszone.com', password: 'Customer@123' })}>
                <span className="badge badge-green">Customer</span>
                <code>customer@menszone.com / Customer@123</code>
              </div>
            </div>
            <p className="auth-switch">
              Don't have an account? <Link to="/register">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
