import { useState, useEffect, useMemo } from 'react';
import { apiFetch } from '../../utils/api';
import './RiderStatus.css';

interface RiderStatusInfo {
  _id: string;
  name: string;
  phone: string;
  riderId?: string;
  isOnline: boolean;
  status: 'Online' | 'Offline' | 'Busy' | 'Suspended';
  completedOrders: number;
  totalEarnings: number;
  lastActive?: string;
}

const formatLastActive = (dateStr?: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const diff = Math.floor((new Date().getTime() - date.getTime()) / 60000); // in minutes
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff}m ago`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours}h ${diff % 60}m ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const RiderStatus = () => {
  const [riders, setRiders] = useState<RiderStatusInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRiderStatuses();
    // Poll every 30 seconds for live status
    const interval = setInterval(fetchRiderStatuses, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRiderStatuses = async () => {
    try {
      const data = await apiFetch('/admin/riders/orders/summary');
      setRiders(data.riders || []);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch rider status');
    } finally {
      setLoading(false);
    }
  };

  const sortedRiders = useMemo(() => {
    const statusOrder: Record<string, number> = {
      'Online': 1,
      'Busy': 2,
      'Offline': 3,
      'Suspended': 4
    };

    return [...riders].sort((a, b) => {
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [riders]);

  return (
    <div className="rider-status-container">
      <div className="page-header">
        <h2>Rider Live Status</h2>
        <button onClick={fetchRiderStatuses} className="btn-primary" disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Now'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="status-cards">
        <div className="status-card online">
          <h3>{riders.filter(r => r.status === 'Online').length}</h3>
          <p>Online</p>
        </div>
        <div className="status-card busy">
          <h3>{riders.filter(r => r.status === 'Busy').length}</h3>
          <p>Busy</p>
        </div>
        <div className="status-card offline">
          <h3>{riders.filter(r => r.status === 'Offline').length}</h3>
          <p>Offline</p>
        </div>
        <div className="status-card" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <h3 style={{ margin: 0, fontSize: '2rem' }}>{riders.filter(r => r.status === 'Suspended').length}</h3>
          <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.8 }}>Suspended</p>
        </div>
      </div>

      <div className="table-wrapper glass-panel mt-4">
        <table className="riders-table">
          <thead>
            <tr>
              <th>Rider ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Total Orders</th>
              <th>Total Earnings (₹)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && riders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading rider statuses...</td>
              </tr>
            ) : sortedRiders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No riders found.</td>
              </tr>
            ) : (
              sortedRiders.map((rider) => (
                <tr key={rider._id}>
                  <td><strong>{rider.riderId || 'N/A'}</strong></td>
                  <td>{rider.name || 'Unknown'}</td>
                  <td>{rider.phone}</td>
                  <td>{rider.completedOrders}</td>
                  <td>₹{rider.totalEarnings}</td>
                  <td>
                    <span className={`status-badge status-${rider.status.toLowerCase()}`}>
                      {rider.status.toUpperCase()}
                    </span>
                    {rider.status === 'Offline' && rider.lastActive && (
                      <div style={{ fontSize: '12px', color: 'gray', marginTop: '4px' }}>
                        {formatLastActive(rider.lastActive)}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiderStatus;
