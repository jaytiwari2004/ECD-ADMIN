import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import './UsersList.css';

interface CustomerSummary {
  _id: string;
  name?: string;
  phone: string;
  orderCount: number;
  addresses?: any[];
}

interface OrderHistory {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  store: { name: string };
  assignedDriver?: { name: string };
  payableAmount: number;
}

const UsersList = () => {
  const [users, setUsers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [selectedUser, setSelectedUser] = useState<CustomerSummary | null>(null);
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/admin/customers/summary');
      setUsers(data.customers || []);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const openHistory = async (user: CustomerSummary) => {
    setSelectedUser(user);
    setHistoryLoading(true);
    try {
      const data = await apiFetch(`/admin/customers/${user._id}/order-history`);
      setHistory(data.orders || []);
    } catch (err: any) {
      alert(err.message || 'Failed to fetch history');
      setSelectedUser(null);
    } finally {
      setHistoryLoading(false);
    }
  };

  const closeHistory = () => {
    setSelectedUser(null);
    setHistory([]);
  };

  const completedOrdersCount = history.filter(o => o.status === 'delivered').length;
  const cancelledOrdersCount = history.filter(o => o.status === 'cancelled').length;

  return (
    <div className="users-list-container">
      <div className="users-header">
        <h1>Users Management</h1>
        <p>View registered customers and their order history.</p>
      </div>

      <div className="stats-bar" style={{ marginBottom: '2rem' }}>
        <div className="stat-item">
          <span className="stat-label">Total Registered Users</span>
          <span className="stat-value" style={{ color: 'var(--primary-color)' }}>{users.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active Users (With Orders)</span>
          <span className="stat-value">{users.filter(u => u.orderCount > 0).length}</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-wrapper glass-panel">
        {loading ? (
          <div className="loading-state">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="empty-state">No users found.</div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Phone Number</th>
                <th>Primary Address</th>
                <th>Total Orders</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const primaryAddress = user.addresses && user.addresses.length > 0 ? user.addresses[0].address : 'No address provided';
                return (
                  <tr key={user._id}>
                    <td>
                      <div className="user-name">{user.name || 'Unknown'}</div>
                    </td>
                    <td>{user.phone}</td>
                    <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={primaryAddress}>
                      {primaryAddress}
                    </td>
                    <td>
                      <div className={`order-badge ${user.orderCount > 10 ? 'high-orders' : ''}`}>
                        {user.orderCount}
                      </div>
                    </td>
                    <td>
                      <button className="btn-view-history" onClick={() => openHistory(user)}>
                        View History
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* History Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={closeHistory}>
          <div className="modal-content glass-panel large-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{(selectedUser.name || 'Unknown')}'s Order History</h2>
              <button className="close-btn" onClick={closeHistory}>&times;</button>
            </div>

            <div className="modal-body">
              <div className="stats-bar">
                <div className="stat-item">
                  <span className="stat-label">Total Orders Made</span>
                  <span className="stat-value">{history.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Completed Orders</span>
                  <span className="stat-value" style={{ color: '#10b981' }}>{completedOrdersCount}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Cancelled Orders</span>
                  <span className="stat-value" style={{ color: '#ef4444' }}>{cancelledOrdersCount}</span>
                </div>
              </div>

              {historyLoading ? (
                <div className="loading-state" style={{ padding: '3rem' }}>Loading history...</div>
              ) : history.length === 0 ? (
                <div className="empty-history">No orders found for this user.</div>
              ) : (
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Order ID</th>
                      <th>Restaurant</th>
                      <th>Rider</th>
                      <th>Amount</th>
                      <th>Status</th>
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
                        <td>{order.store?.name || 'Unknown'}</td>
                        <td>{order.assignedDriver?.name || '-'}</td>
                        <td style={{ fontWeight: 600 }}>₹{order.payableAmount?.toFixed(2)}</td>
                        <td>
                          <span className={`status-badge status-${order.status === 'delivered' ? 'delivered' : order.status === 'cancelled' ? 'cancelled' : 'pending'}`}>
                            {order.status}
                          </span>
                        </td>
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

export default UsersList;
