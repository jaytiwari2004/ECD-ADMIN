import { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Bike, Activity, Store } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await apiFetch('/restaurants/list');
        // Get the last 3 restaurants
        setRestaurants(res.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurants();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back, here's what's happening today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper success">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Revenue</p>
            <h3 className="stat-value">$0</h3>
            <span className="stat-change text-muted">0% from last month</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper warning">
            <CreditCard size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Restaurant Payouts</p>
            <h3 className="stat-value">$0</h3>
            <span className="stat-change text-muted">0 Pending payment</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper info">
            <Bike size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Rider Payouts</p>
            <h3 className="stat-value">$0</h3>
            <span className="stat-change text-muted">0 Pending payment</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper accent">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Net Earnings</p>
            <h3 className="stat-value">$0</h3>
            <span className="stat-change text-muted">0% from last month</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="pending-tasks glass-panel">
          <div className="section-header">
            <h2>Recent Restaurants</h2>
            <button className="btn-text">View All</button>
          </div>
          
          <div className="task-list">
            {loading ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading restaurants...</p>
            ) : restaurants.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No restaurants found.</p>
            ) : (
              restaurants.map((rest: any) => (
                <div key={rest._id} className="task-item">
                  <div className="task-icon">
                    <Store size={20} />
                  </div>
                  <div className="task-info">
                    <h4>{rest.name}</h4>
                    <p>{rest.address}</p>
                  </div>
                  <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: rest.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: rest.isActive ? '#10b981' : '#ef4444', borderRadius: '4px' }}>
                    {rest.isActive ? 'Active' : 'Offline'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
