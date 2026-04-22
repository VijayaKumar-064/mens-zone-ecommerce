import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { alert('Passwords do not match'); return; }
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/');
    } catch {}
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-visual">
          <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80" alt="Mens Zone Fashion" />
          <div className="auth-visual-overlay">
            <div className="auth-visual-logo">
              <span className="logo-icon">MZ</span>
              <span>Mens Zone</span>
            </div>
            <h2>Join the Style Revolution</h2>
            <p>10% off on your first order with code WELCOME10</p>
          </div>
        </div>
        <div className="auth-form-side">
          <div className="auth-form-wrapper">
            <Link to="/" className="auth-logo-mobile">
              <span className="logo-icon">MZ</span> Mens Zone
            </Link>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join thousands of Mens Zone shoppers</p>

            <form onSubmit={handleSubmit} className="auth-form">
              {[
                { label: 'Full Name', icon: <FiUser />, key: 'name', type: 'text', placeholder: 'Your full name' },
                { label: 'Email Address', icon: <FiMail />, key: 'email', type: 'email', placeholder: 'your@email.com' },
                { label: 'Phone Number', icon: <FiPhone />, key: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
              ].map(({ label, icon, key, type, placeholder }) => (
                <div className="form-group" key={key}>
                  <label className="form-label">{label}</label>
                  <div className="input-icon-wrap">
                    <span className="input-icon">{icon}</span>
                    <input
                      type={type} className="form-control input-with-icon"
                      required={key !== 'phone'} placeholder={placeholder}
                      value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    />
                  </div>
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-icon-wrap">
                  <FiLock className="input-icon" />
                  <input
                    type={showPw ? 'text' : 'password'} className="form-control input-with-icon"
                    required minLength={6} placeholder="Minimum 6 characters"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-icon-wrap">
                  <FiLock className="input-icon" />
                  <input
                    type="password" className="form-control input-with-icon"
                    required placeholder="Repeat your password"
                    value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
