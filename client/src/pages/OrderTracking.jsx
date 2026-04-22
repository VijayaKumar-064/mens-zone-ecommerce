import React, { useEffect, useState } from 'react';
import { FiSearch, FiPackage, FiMapPin, FiClock } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import './OrderTracking.css';

const STATUSES = ['Processing', 'Shipped', 'Delivered'];

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { document.title = 'Track Order – Mens Zone'; }, []);
  useEffect(() => { if (searchParams.get('id')) handleSearch(searchParams.get('id')); }, []);

  const handleSearch = async (id) => {
    const trackId = id || orderId;
    if (!trackId.trim()) return;
    setLoading(true); setError('');
    try {
      const { data } = await API.get(`/orders/track/${trackId.trim().toUpperCase()}`);
      setOrder(data.order);
    } catch {
      setError('Order not found. Please check your Order ID.');
      setOrder(null);
    }
    setLoading(false);
  };

  const currentStep = STATUSES.indexOf(order?.status) !== -1 ? STATUSES.indexOf(order?.status) : (order?.status === 'Cancelled' ? -1 : 0);

  return (
    <div className="tracking-page">
      <div className="page-header">
        <div className="container">
          <h1>Track Your Order</h1>
          <p>Enter your order ID to check live status</p>
        </div>
      </div>

      <div className="container tracking-content">
        <div className="tracking-search-card card">
          <h3><FiPackage /> Enter Order ID</h3>
          <div className="tracking-search-row">
            <input className="form-control" placeholder="e.g. MZ1A2B3C4D" value={orderId}
              onChange={(e) => setOrderId(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
            <button className="btn btn-primary" onClick={() => handleSearch()} disabled={loading}>
              <FiSearch /> {loading ? 'Searching...' : 'Track'}
            </button>
          </div>
          {error && <p className="tracking-error">{error}</p>}
        </div>

        {order && (
          <div className="tracking-result">
            <div className="tracking-header card">
              <div>
                <h3>Order #{order.orderId}</h3>
                <p className="track-date">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <span className={`badge badge-${
                order.status === 'Delivered' ? 'green' :
                order.status === 'Cancelled' ? 'accent' :
                order.status === 'Shipped' ? 'gold' : 'grey'
              } badge-lg`}>{order.status}</span>
            </div>

            {/* Progress Bar */}
            {order.status !== 'Cancelled' && (
              <div className="tracking-progress card">
                <div className="progress-steps">
                  {STATUSES.map((s, i) => (
                    <div key={s} className={`progress-step ${i <= currentStep ? 'completed' : ''} ${i === currentStep ? 'current' : ''}`}>
                      <div className="step-dot"><FiPackage /></div>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(currentStep / (STATUSES.length - 1)) * 100}%` }} />
                </div>
              </div>
            )}

            {/* Address */}
            <div className="tracking-info-grid">
              <div className="card tracking-addr">
                <h4><FiMapPin /> Shipping Address</h4>
                <p>{order.shippingAddress?.name}</p>
                <p>{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                <p>📞 {order.shippingAddress?.phone}</p>
              </div>
              <div className="card tracking-order-info">
                <h4><FiClock /> Order Details</h4>
                <div className="info-row"><span>Payment</span><span>{order.paymentMethod}</span></div>
                <div className="info-row"><span>Items</span><span>{order.items?.length}</span></div>
                <div className="info-row"><span>Total</span><span>₹{order.totalPrice?.toLocaleString()}</span></div>
                {order.deliveredAt && <div className="info-row"><span>Delivered</span><span>{new Date(order.deliveredAt).toLocaleDateString()}</span></div>}
              </div>
            </div>

            {/* Status History */}
            {order.statusHistory?.length > 0 && (
              <div className="card status-history">
                <h4>Status History</h4>
                <div className="history-list">
                  {order.statusHistory.map((h, i) => (
                    <div key={i} className="history-item">
                      <div className="history-dot" />
                      <div><p className="history-status">{h.status}</p>
                        {h.note && <p className="history-note">{h.note}</p>}
                        <p className="history-time">{new Date(h.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
