import React, { useEffect, useState } from 'react';
import { FiUser, FiPackage, FiMapPin, FiX, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = ({ tab: defaultTab = 'profile' }) => {
  const { user, updateProfile } = useAuth();
  const [tab, setTab] = useState(defaultTab);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [cancelModal, setCancelModal] = useState(null);
  const [replaceModal, setReplaceModal] = useState(null);
  const [reason, setReason] = useState('');

  useEffect(() => { document.title = 'My Profile – Mens Zone'; }, []);
  useEffect(() => { if (tab === 'orders') fetchOrders(); }, [tab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/orders');
      setOrders(data.orders);
    } catch {}
    setLoading(false);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    await updateProfile(profile);
  };

  const handleCancel = async () => {
    try {
      await API.post(`/orders/${cancelModal}/cancel`, { reason });
      toast.success('Cancellation request submitted');
      setCancelModal(null); setReason('');
      fetchOrders();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleReplace = async () => {
    try {
      await API.post(`/orders/${replaceModal}/replace`, { reason });
      toast.success('Replacement request submitted');
      setReplaceModal(null); setReason('');
      fetchOrders();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const daysSince = (date) => Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));

  return (
    <div className="profile-page">
      <div className="container profile-layout">
        {/* Sidebar */}
        <aside className="profile-sidebar card">
          <div className="profile-avatar-big">{user?.name?.charAt(0)}</div>
          <h3 className="profile-name">{user?.name}</h3>
          <p className="profile-email">{user?.email}</p>
          <div className="profile-tabs">
            <button className={`profile-tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}><FiUser /> My Profile</button>
            <button className={`profile-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}><FiPackage /> My Orders</button>
          </div>
        </aside>

        {/* Main */}
        <main className="profile-main">
          {tab === 'profile' && (
            <div className="card profile-edit-card">
              <h2>Edit Profile</h2>
              <form onSubmit={handleProfileUpdate}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-control" value={user?.email} disabled style={{ opacity: 0.6 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </form>
            </div>
          )}

          {tab === 'orders' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: '24px' }}>My Orders</h2>
              {loading ? <div className="spinner-wrap"><div className="spinner" /></div>
                : orders.length === 0 ? (
                  <div className="empty-state"><div className="empty-state-icon"><FiPackage /></div><h3>No orders yet</h3></div>
                ) : orders.map(order => (
                  <div key={order._id} className="order-card card">
                    <div className="order-card-header">
                      <div>
                        <p className="order-id-label">Order ID</p>
                        <h3 className="order-id-num">{order.orderId}</h3>
                        <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div className="order-card-right">
                        <span className={`badge status-${order.status.toLowerCase()}`}>{order.status}</span>
                        <p className="order-total">₹{order.totalPrice?.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="order-items-preview">
                      {order.items?.slice(0,2).map((item, i) => (
                        <div key={i} className="order-item-row">
                          <span>{item.name} × {item.quantity}</span>
                          <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      {order.items?.length > 2 && <p className="more-items">+{order.items.length-2} more</p>}
                    </div>
                    <div className="order-card-actions">
                      {order.status === 'Processing' && !order.cancellationRequest?.requested && (
                        <button className="btn btn-outline btn-sm" onClick={() => setCancelModal(order._id)}>
                          <FiX /> Request Cancel
                        </button>
                      )}
                      {order.cancellationRequest?.requested && (
                        <span className="badge badge-gold">Cancel {order.cancellationRequest.status}</span>
                      )}
                      {order.status === 'Delivered' && daysSince(order.deliveredAt) <= 7 && !order.replacementRequest?.requested && (
                        <button className="btn btn-ghost btn-sm" onClick={() => setReplaceModal(order._id)}>
                          <FiAlertCircle /> Request Replace
                        </button>
                      )}
                      {order.replacementRequest?.requested && (
                        <span className="badge badge-gold">Replace {order.replacementRequest.status}</span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </main>
      </div>

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="modal-overlay" onClick={() => setCancelModal(null)}>
          <div className="modal-box card" onClick={e => e.stopPropagation()}>
            <h3>Request Cancellation</h3>
            <p>Please provide a reason for cancellation:</p>
            <textarea className="form-control" rows="3" value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason..." style={{ marginTop: '12px' }} />
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button className="btn btn-primary" onClick={handleCancel} disabled={!reason}>Submit</button>
              <button className="btn btn-ghost" onClick={() => setCancelModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Replace Modal */}
      {replaceModal && (
        <div className="modal-overlay" onClick={() => setReplaceModal(null)}>
          <div className="modal-box card" onClick={e => e.stopPropagation()}>
            <h3>Request Replacement</h3>
            <textarea className="form-control" rows="3" value={reason} onChange={e => setReason(e.target.value)} placeholder="Describe the issue..." style={{ marginTop: '12px' }} />
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button className="btn btn-primary" onClick={handleReplace} disabled={!reason}>Submit</button>
              <button className="btn btn-ghost" onClick={() => setReplaceModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
