import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiUsers, FiDollarSign, FiPackage, FiAlertCircle } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import API from '../../api/axios';
import './Admin.css';

const COLORS = ['#e94560', '#4f46e5', '#10b981', '#f5a623', '#7c3aed'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Admin Dashboard – Mens Zone';
    API.get('/analytics/summary').then(({ data }) => { setStats(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;
  if (!stats) return <div className="empty-state"><h3>Failed to load analytics</h3></div>;

  const { summary, ordersByStatus, revenueByDay, topProducts, categoryBreakdown } = stats;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's your business overview.</p>
        </div>
      </div>

      <div className="container admin-content">
        {/* Alert for pending approvals */}
        {(summary.pendingCancellations > 0 || summary.pendingReplacements > 0) && (
          <div className="alert-banner">
            <FiAlertCircle />
            <span>
              {summary.pendingCancellations > 0 && `${summary.pendingCancellations} cancellation request(s) `}
              {summary.pendingReplacements > 0 && `${summary.pendingReplacements} replacement request(s) `}
              pending approval.
            </span>
            <Link to="/admin/approvals" className="btn btn-sm btn-primary">Review Now</Link>
          </div>
        )}

        {/* Stats Cards */}
        <div className="stats-grid">
          {[
            { icon: <FiDollarSign />, label: 'Total Revenue', value: `₹${summary.totalRevenue?.toLocaleString()}`, color: '#10b981' },
            { icon: <FiPackage />, label: 'Total Orders', value: summary.totalOrders, color: '#4f46e5' },
            { icon: <FiShoppingBag />, label: 'Products', value: summary.totalProducts, color: '#e94560' },
            { icon: <FiUsers />, label: 'Customers', value: summary.totalCustomers, color: '#f5a623' },
          ].map(s => (
            <div key={s.label} className="stat-card card">
              <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>{s.icon}</div>
              <div>
                <p className="stat-label">{s.label}</p>
                <h3 className="stat-value">{s.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="charts-grid">
          <div className="card chart-card">
            <h3>Revenue – Last 7 Days</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueByDay}>
                <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#e94560" stopOpacity={0.3} /><stop offset="95%" stopColor="#e94560" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `₹${v}`} />
                <Area type="monotone" dataKey="revenue" stroke="#e94560" fill="url(#colorRev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card chart-card">
            <h3>Orders by Status</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={ordersByStatus} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} label={({ _id, count }) => `${_id}: ${count}`}>
                  {ordersByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products & Recent Orders */}
        <div className="bottom-grid">
          <div className="card top-products-card">
            <h3>Top Products by Revenue</h3>
            <div className="top-product-list">
              {topProducts?.map((item, i) => (
                <div key={i} className="top-product-row">
                  <span className="rank">#{i + 1}</span>
                  <img src={item.product?.images?.[0] || 'https://placehold.co/40x50/1a1a2e/white?text=MZ'} alt={item.product?.name} />
                  <div className="top-prod-info">
                    <p>{item.product?.name}</p>
                    <p className="top-prod-meta">{item.totalSold} sold</p>
                  </div>
                  <span className="top-prod-rev">₹{item.revenue?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card recent-orders-card">
            <h3>Recent Orders</h3>
            {stats.recentOrders?.map(o => (
              <div key={o._id} className="recent-order-row">
                <div>
                  <p className="order-id-small">{o.orderId}</p>
                  <p className="order-user">{o.user?.name || 'Unknown'}</p>
                </div>
                <div className="recent-order-right">
                  <span className={`badge status-${o.status?.toLowerCase()}`}>{o.status}</span>
                  <span className="order-price">₹{o.totalPrice?.toLocaleString()}</span>
                </div>
              </div>
            ))}
            <Link to="/admin/orders" className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: '12px' }}>View All Orders</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
