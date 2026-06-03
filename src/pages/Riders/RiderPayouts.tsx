import { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import './RiderPayouts.css';

interface WithdrawalRequest {
  _id: string;
  driver: {
    _id: string;
    name: string;
    phone: string;
    riderId?: string;
    upi?: string;
    walletBalance?: number;
  };
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  processedAt?: string;
  createdAt: string;
}

const RiderPayouts = () => {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [processingStatus, setProcessingStatus] = useState<'approved' | 'rejected' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const endpoint = filter === 'all' ? '/admin/withdrawals' : `/admin/withdrawals?status=${filter}`;
      const data = await apiFetch(endpoint);
      setRequests(data.requests || []);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch payout requests');
    } finally {
      setLoading(false);
    }
  };

  const openProcessModal = (req: WithdrawalRequest) => {
    setSelectedRequest(req);
    setAdminNote('');
    setProcessingStatus(null);
    setIsModalOpen(true);
  };

  const handleProcessSubmit = async () => {
    if (!selectedRequest || !processingStatus) return;
    setIsProcessing(true);
    try {
      await apiFetch('/admin/withdrawals/process', {
        method: 'PATCH',
        body: JSON.stringify({
          requestId: selectedRequest._id,
          status: processingStatus,
          adminNote: adminNote.trim() || undefined,
        }),
      });
      setIsModalOpen(false);
      fetchRequests(); // refresh list
    } catch (err: any) {
      alert(err.message || 'Failed to process request');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payouts-container">
      <div className="payouts-header">
        <h1>Rider Payout Requests</h1>
        <div className="filter-controls">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Pending</button>
          <button className={filter === 'approved' ? 'active' : ''} onClick={() => setFilter('approved')}>Approved</button>
          <button className={filter === 'rejected' ? 'active' : ''} onClick={() => setFilter('rejected')}>Rejected</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="payouts-table-container glass-panel">
        {loading ? (
          <div className="loading-state">Loading payout requests...</div>
        ) : requests.length === 0 ? (
          <div className="empty-state">No requests found</div>
        ) : (
          <table className="payouts-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Rider Name</th>
                <th>Phone</th>
                <th>UPI ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req._id}>
                  <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td>{req.driver?.name || 'N/A'}</td>
                  <td>{req.driver?.phone || 'N/A'}</td>
                  <td>{req.driver?.upi || 'Not Set'}</td>
                  <td className="amount">₹{req.amount}</td>
                  <td>
                    <span className={`status-badge ${req.status}`}>{req.status.toUpperCase()}</span>
                  </td>
                  <td>
                    {req.status === 'pending' ? (
                      <button className="btn-process" onClick={() => openProcessModal(req)}>
                        Process
                      </button>
                    ) : (
                      <span className="text-muted">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Manual Payment Modal */}
      {isModalOpen && selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h2>Process Manual Payment</h2>
            
            <div className="rider-details">
              <p><strong>Rider Name:</strong> {selectedRequest.driver?.name || 'N/A'}</p>
              <p><strong>Phone:</strong> {selectedRequest.driver?.phone}</p>
              <div className="upi-highlight">
                <p><strong>UPI ID:</strong> {selectedRequest.driver?.upi || <span className="error-text">No UPI ID Provided by Rider</span>}</p>
              </div>
              <p style={{ margin: '10px 0', fontSize: '1.1rem' }}>
                <strong>Current Wallet Balance:</strong> ₹{selectedRequest.driver?.walletBalance?.toFixed(2) || '0.00'}
              </p>
              <div className="amount-highlight">
                <p><strong>Amount to Pay:</strong> ₹{selectedRequest.amount}</p>
              </div>
            </div>

            <div className="admin-actions">
              <label>Admin Note / Transaction ID (Optional):</label>
              <input 
                type="text" 
                placeholder="e.g. Paid via GPay Ref #1234..." 
                value={adminNote} 
                onChange={(e) => setAdminNote(e.target.value)} 
              />
            </div>

            <div className="modal-buttons">
              <button 
                className={`btn-decline ${processingStatus === 'rejected' ? 'selected' : ''}`}
                onClick={() => setProcessingStatus('rejected')}
              >
                Reject Request
              </button>
              <button 
                className={`btn-approve ${processingStatus === 'approved' ? 'selected' : ''}`}
                onClick={() => setProcessingStatus('approved')}
              >
                Mark as Paid (Approve)
              </button>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button 
                className="btn-submit" 
                disabled={!processingStatus || isProcessing} 
                onClick={handleProcessSubmit}
              >
                {isProcessing ? 'Processing...' : 'Confirm Action'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderPayouts;
