import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import './RiderOrders.css';

interface RiderSummary {
  _id: string;
  name: string;
  phone: string;
  upi?: string;
  riderId?: string;
  completedOrders: number;
  totalEarnings: number;
}

interface OrderHistory {
  _id: string;
  orderNumber: string;
  createdAt: string;
  pickupLocation: string;
  dropLocation: string;
  driverEarnings: number;
  payableAmount: number;
}

const RiderOrders = () => {
  const [riders, setRiders] = useState<RiderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [selectedRider, setSelectedRider] = useState<RiderSummary | null>(null);
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/admin/riders/orders/summary');
      setRiders(data.riders || []);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch rider orders');
    } finally {
      setLoading(false);
    }
  };

  const openHistory = async (rider: RiderSummary) => {
    setSelectedRider(rider);
    setHistoryLoading(true);
    try {
      const data = await apiFetch(`/admin/riders/${rider._id}/order-history`);
      setHistory(data.orders || []);
    } catch (err: any) {
      alert(err.message || 'Failed to fetch history');
      setSelectedRider(null);
    } finally {
      setHistoryLoading(false);
    }
  };

  const closeHistory = () => {
    setSelectedRider(null);
    setHistory([]);
  };

  return (
    <div className="rider-orders-container">
      <div className="orders-header">
        <h1>Rider Orders</h1>
        <p>Track completed deliveries and total earnings for all riders.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-wrapper glass-panel">
        {loading ? (
          <div className="loading-state">Loading riders...</div>
        ) : riders.length === 0 ? (
          <div className="empty-state">No riders found.</div>
        ) : (
          <table className="riders-table">
            <thead>
              <tr>
                <th>Rider Details</th>
                <th>Phone</th>
                <th>UPI ID</th>
                <th>Total Orders</th>
                <th>Total Earnings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {riders.map(rider => (
                <tr key={rider._id}>
                  <td>
                    <div className="rider-name">{rider.name || 'Unknown'}</div>
                    <div className="rider-id">ID: {rider.riderId || 'N/A'}</div>
                  </td>
                  <td>{rider.phone}</td>
                  <td>{rider.upi || <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Not set</span>}</td>
                  <td>
                    <div className={`order-badge ${rider.completedOrders > 50 ? 'high-orders' : ''}`}>
                      {rider.completedOrders}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: '#10b981' }}>
                    ₹{rider.totalEarnings.toFixed(2)}
                  </td>
                  <td>
                    <button className="btn-view-history" onClick={() => openHistory(rider)}>
                      View History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* History Modal */}
      {selectedRider && (
        <div className="modal-overlay" onClick={closeHistory}>
          <div className="modal-content glass-panel large-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedRider.name}'s Order History</h2>
              <button className="close-btn" onClick={closeHistory}>×</button>
            </div>

            <div className="modal-body">
              <div className="stats-bar">
                <div className="stat-item">
                  <span className="stat-label">Total Completed Orders</span>
                  <span className="stat-value">{selectedRider.completedOrders}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Earnings</span>
                  <span className="stat-value earning">₹{selectedRider.totalEarnings.toFixed(2)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">UPI ID</span>
                  <span className="stat-value" style={{ fontSize: '1.2rem' }}>{selectedRider.upi || 'N/A'}</span>
                </div>
              </div>

              {historyLoading ? (
                <div className="loading-state" style={{ padding: '3rem' }}>Loading history...</div>
              ) : history.length === 0 ? (
                <div className="empty-history">No delivered orders found for this rider.</div>
              ) : (
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Order ID</th>
                      <th>Pickup Location</th>
                      <th>Drop Location</th>
                      <th>Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(order => (
                      <tr key={order._id}>
                        <td className="date-cell">
                          {new Date(order.createdAt).toLocaleDateString()}<br/>
                          <span style={{ fontSize: '0.8rem' }}>{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </td>
                        <td style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{order.orderNumber}</td>
                        <td className="location-cell" title={order.pickupLocation}>{order.pickupLocation}</td>
                        <td className="location-cell" title={order.dropLocation}>{order.dropLocation}</td>
                        <td className="amount-cell">+ ₹{order.driverEarnings.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderOrders;
