import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => { document.title = 'Contact Us – Mens Zone'; }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => { setSent(true); toast.success('Message sent! We\'ll get back to you soon.'); setForm({ name: '', email: '', subject: '', message: '' }); }, 800);
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Reach out anytime!</p>
        </div>
      </div>

      <div className="container contact-layout">
        <div className="contact-info-panel">
          <h2 className="section-title">Get In Touch</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Our team is available Mon–Sat, 9AM to 6PM IST</p>
          {[
            { icon: <FiMapPin />, title: 'Visit Us', info: '42, Fashion Street, Mumbai, MH 400001' },
            { icon: <FiPhone />, title: 'Call Us', info: '+91 98765 43210' },
            { icon: <FiMail />, title: 'Email Us', info: 'support@menszone.in' },
          ].map(c => (
            <div key={c.title} className="contact-info-item">
              <div className="contact-icon">{c.icon}</div>
              <div><h4>{c.title}</h4><p>{c.info}</p></div>
            </div>
          ))}
        </div>

        <div className="card contact-form-card">
          <h2>Send a Message</h2>
          {sent && <div className="success-msg">✅ Thank you! We'll respond within 24 hours.</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Your Name</label>
                <input className="form-control" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Email Address</label>
                <input type="email" className="form-control" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            <div className="form-group"><label className="form-label">Subject</label>
              <input className="form-control" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Message</label>
              <textarea className="form-control" rows="5" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></div>
            <button type="submit" className="btn btn-primary btn-lg"><FiSend /> Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
