import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiUser, FiPhone, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Checkout.css';

const CheckoutAddress = () => {
  const { user } = useAuth();
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    document.title = 'Shipping Address – Mens Zone';
    if (!cart.items?.length) navigate('/cart');
    // Auto-fill last address if exists
    const lastAddr = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];
    if (lastAddr) setForm({ name: lastAddr.name || user.name, street: lastAddr.street || '', city: lastAddr.city || '', state: lastAddr.state || '', pincode: lastAddr.pincode || '', phone: lastAddr.phone || user.phone || '' });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('mz_address', JSON.stringify(form));
    navigate('/checkout/payment');
  };

  return (
    <div className="checkout-page">
      <div className="container checkout-layout">
        <div className="checkout-form-side">
          <div className="checkout-steps">
            <div className="step active"><span>1</span> Address</div>
            <div className="step"><span>2</span> Payment</div>
            <div className="step"><span>3</span> Confirm</div>
          </div>

          <div className="checkout-card card">
            <h2><FiMapPin /> Shipping Address</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label"><FiUser /> Full Name</label>
                  <input className="form-control" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Recipient name" />
                </div>
                <div className="form-group">
                  <label className="form-label"><FiPhone /> Phone</label>
                  <input className="form-control" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="10-digit mobile" pattern="[0-9]{10}" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input className="form-control" required value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} placeholder="House no, Street, Area" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-control" required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input className="form-control" required value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input className="form-control" required value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} pattern="[0-9]{6}" placeholder="6-digit" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                Continue to Payment <FiChevronRight />
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-summary card">
          <h3>Order Summary</h3>
          {cart.items?.slice(0, 3).map(item => {
            const p = item.product;
            if (!p) return null;
            const price = p.discountPrice > 0 ? p.discountPrice : p.price;
            return (
              <div key={item._id} className="summary-item">
                <img src={p.images?.[0] || 'https://placehold.co/50x60/1a1a2e/white?text=MZ'} alt={p.name} />
                <div>
                  <p>{p.name}</p>
                  <p className="summary-item-meta">Qty: {item.quantity} · {item.size}</p>
                </div>
                <span>₹{(price * item.quantity).toLocaleString()}</span>
              </div>
            );
          })}
          {cart.items?.length > 3 && <p className="more-items">+ {cart.items.length - 3} more items</p>}
          <div className="divider" />
          <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
          <div className="summary-row total-row"><span>Total</span><span>₹{(cartTotal + (cartTotal > 999 ? 0 : 99)).toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutAddress;
