import { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Bike, Activity, Store } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiFetch('/admin/dashboard');
        setStats(res);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back, here's the business overview.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading dashboard stats...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card glass-panel">
              <div className="stat-icon-wrapper success">
                <DollarSign size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-title">Total Revenue</p>
                <h3 className="stat-value">₹{stats?.revenue?.toFixed(2) || '0.00'}</h3>
                <span className="stat-change text-muted">Customer Payments</span>
              </div>
            </div>

            <div className="stat-card glass-panel">
              <div className="stat-icon-wrapper warning">
                <Store size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-title">Restaurant Payouts</p>
                <h3 className="stat-value">₹{stats?.restaurantPayouts?.toFixed(2) || '0.00'}</h3>
                <span className="stat-change text-muted">To be paid / Paid</span>
              </div>
            </div>

            <div className="stat-card glass-panel">
              <div className="stat-icon-wrapper info">
                <Bike size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-title">Rider Payouts</p>
                <h3 className="stat-value">₹{stats?.riderPayouts?.toFixed(2) || '0.00'}</h3>
                <span className="stat-change text-muted">To be paid / Paid</span>
              </div>
            </div>

            <div className="stat-card glass-panel">
              <div className="stat-icon-wrapper accent">
                <Activity size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-title">Net Profit</p>
                <h3 className="stat-value" style={{ color: '#10b981' }}>₹{stats?.netProfit?.toFixed(2) || '0.00'}</h3>
                <span className="stat-change text-muted">Platform Earnings</span>
              </div>
            </div>
          </div>

          <div className="dashboard-content" style={{ marginTop: '2rem' }}>
            <div className="pending-tasks glass-panel" style={{ width: '100%' }}>
              <div className="section-header">
                <h2>Recent Delivered Orders</h2>
              </div>
              
              <div className="task-list">
                {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No recent orders found.</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '1rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '1rem' }}>Order #</th>
                        <th style={{ padding: '1rem' }}>Restaurant</th>
                        <th style={{ padding: '1rem' }}>Rider</th>
                        <th style={{ padding: '1rem' }}>Selling Price (Revenue)</th>
                        <th style={{ padding: '1rem' }}>B2B Price (Rest. Cut)</th>
                        <th style={{ padding: '1rem' }}>Delivery Fee (Rider Cut)</th>
                        <th style={{ padding: '1rem' }}>Net Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order: any) => {
                        const profit = (order.payableAmount || 0) - (order.restaurantEarnings || 0) - (order.driverEarnings || 0);
                        return (
                          <tr key={order._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '1rem', fontWeight: 600 }}>{order.orderNumber}</td>
                            <td style={{ padding: '1rem' }}>{order.store?.name || 'Unknown'}</td>
                            <td style={{ padding: '1rem' }}>{order.assignedDriver?.name || 'Unknown'}</td>
                            <td style={{ padding: '1rem', color: '#3b82f6' }}>₹{order.payableAmount?.toFixed(2)}</td>
                            <td style={{ padding: '1rem', color: '#ef4444' }}>₹{order.restaurantEarnings?.toFixed(2)}</td>
                            <td style={{ padding: '1rem', color: '#f59e0b' }}>₹{order.driverEarnings?.toFixed(2)}</td>
                            <td style={{ padding: '1rem', color: '#10b981', fontWeight: 'bold' }}>₹{profit.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
