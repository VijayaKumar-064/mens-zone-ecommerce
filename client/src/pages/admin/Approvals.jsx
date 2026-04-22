import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import './Admin.css';

const AdminApprovals = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cancellations');

  useEffect(() => { document.title = 'Approvals – Admin'; fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/orders');
      setOrders(data.orders);
    } catch {}
    setLoading(false);
  };

  const handleCancel = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/approve-cancel`, { status });
      toast.success(`Cancellation ${status}`);
      fetchOrders();
    } catch { toast.error('Action failed'); }
  };

  const handleReplace = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/approve-replace`, { status });
      toast.success(`Replacement ${status}`);
      fetchOrders();
    } catch { toast.error('Action failed'); }
  };

  const cancellationRequests = orders.filter(o => o.cancellationRequest?.requested);
  const replacementRequests = orders.filter(o => o.replacementRequest?.requested);

  const RequestCard = ({ order, type }) => {
    const req = type === 'cancel' ? order.cancellationRequest : order.replacementRequest;
    return (
      <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <code style={{ color: 'var(--accent)', fontWeight: 700 }}>{order.orderId}</code>
            <span className={`badge status-${order.status?.toLowerCase()}`} style={{ marginLeft: '10px' }}>{order.status}</span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '4px' }}>{new Date(req.requestedAt).toLocaleString()}</p>
          </div>
          <span className={`badge ${req.status === 'Pending' ? 'badge-gold' : req.status === 'Approved' ? 'badge-green' : 'badge-accent'}`}>
            {req.status}
          </span>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          <strong>Reason:</strong> {req.reason || 'No reason provided'}
        </p>
        {req.status === 'Pending' && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary btn-sm" onClick={() => type === 'cancel' ? handleCancel(order._id, 'Approved') : handleReplace(order._id, 'Approved')}>
              ✅ Approve
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => type === 'cancel' ? handleCancel(order._id, 'Rejected') : handleReplace(order._id, 'Rejected')}>
              ❌ Reject
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="container">
          <h1>Approvals Center</h1>
          <p>Manage cancellation & replacement requests</p>
        </div>
      </div>
      <div className="container admin-content">
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button className={`btn ${activeTab === 'cancellations' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('cancellations')}>
            Cancellations ({cancellationRequests.length})
          </button>
          <button className={`btn ${activeTab === 'replacements' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('replacements')}>
            Replacements ({replacementRequests.length})
          </button>
        </div>

        {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
          <>
            {activeTab === 'cancellations' && (
              cancellationRequests.length === 0
                ? <div className="empty-state"><div className="empty-state-icon">✅</div><h3>No cancellation requests</h3></div>
                : cancellationRequests.map(o => <RequestCard key={o._id} order={o} type="cancel" />)
            )}
            {activeTab === 'replacements' && (
              replacementRequests.length === 0
                ? <div className="empty-state"><div className="empty-state-icon">✅</div><h3>No replacement requests</h3></div>
                : replacementRequests.map(o => <RequestCard key={o._id} order={o} type="replace" />)
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminApprovals;
