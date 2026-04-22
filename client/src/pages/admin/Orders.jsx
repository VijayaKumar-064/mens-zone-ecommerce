import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import './Admin.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => { document.title = 'Orders – Admin'; fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/orders');
      setOrders(data.orders);
    } catch {}
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await API.put(`/orders/${id}/status`, { status });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (err) { toast.error('Update failed'); }
    setUpdatingId(null);
  };

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="container">
          <h1>Order Management</h1>
          <p>View and update all customer orders</p>
        </div>
      </div>
      <div className="container admin-content">
        <div className="card admin-table-card">
          <div className="admin-table-header">
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                <button key={s} className={`tag ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
                  {s || 'All'}
                </button>
              ))}
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{filtered.length} orders</span>
          </div>

          {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Update Status</th></tr>
                </thead>
                <tbody>
                  {filtered.map(order => (
                    <tr key={order._id}>
                      <td><code style={{ color: 'var(--accent)' }}>{order.orderId}</code><br /><small style={{ color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</small></td>
                      <td>{order.user?.name || 'Unknown'}<br /><small style={{ color: 'var(--text-muted)' }}>{order.user?.email}</small></td>
                      <td>{order.items?.length} item(s)</td>
                      <td>₹{order.totalPrice?.toLocaleString()}</td>
                      <td><span className="badge badge-grey">{order.paymentMethod}</span></td>
                      <td><span className={`badge status-${order.status?.toLowerCase()}`}>{order.status}</span></td>
                      <td>
                        <select
                          className="form-control" style={{ minWidth: '140px', padding: '6px 10px', fontSize: '0.82rem' }}
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          disabled={updatingId === order._id || order.status === 'Cancelled'}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon">📦</div><h3>No orders found</h3></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
