import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiHome } from 'react-icons/fi';
import './Checkout.css';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    document.title = 'Order Confirmed – Mens Zone';
    if (!order) navigate('/');
  }, []);

  if (!order) return null;

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="confirmation-icon"><FiCheckCircle /></div>
        <h1 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display, serif', marginBottom: '8px' }}>Order Confirmed! 🎉</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Thank you for shopping with Mens Zone. Your order has been placed successfully.</p>

        <div className="order-id-box">
          <p>Your Order ID</p>
          <div className="order-id-value">{order.orderId}</div>
          <p style={{ marginTop: '6px', fontSize: '0.78rem' }}>Save this for tracking your order</p>
        </div>

        <div className="confirmation-details">
          <div className="detail-row"><span>Payment Method</span><span>{order.paymentMethod}</span></div>
          <div className="detail-row"><span>Payment Status</span><span style={{ color: order.paymentStatus === 'Paid' ? '#10b981' : 'var(--gold)' }}>{order.paymentStatus}</span></div>
          <div className="detail-row"><span>Items</span><span>{order.items?.length} item(s)</span></div>
          <div className="detail-row"><span>Total Paid</span><span style={{ fontWeight: 700 }}>₹{order.totalPrice?.toLocaleString()}</span></div>
          <div className="detail-row"><span>Ship to</span><span>{order.shippingAddress?.name}, {order.shippingAddress?.city}</span></div>
          <div className="detail-row"><span>Estimated Delivery</span><span>5-7 Business Days</span></div>
        </div>

        <div className="confirmation-actions">
          <Link to="/profile/orders" className="btn btn-primary"><FiPackage /> My Orders</Link>
          <Link to={`/track?id=${order.orderId}`} className="btn btn-outline">Track Order</Link>
          <Link to="/" className="btn btn-ghost"><FiHome /> Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
