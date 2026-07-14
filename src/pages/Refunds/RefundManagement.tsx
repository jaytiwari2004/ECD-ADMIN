import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { apiFetch } from '../../utils/api';
// Using common dashboard css or users list css since they have data-table
import '../Users/UsersList.css';

const RefundManagement = () => {
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/refunds/all');
      setRefunds(res.refunds || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const handleApprove = async (id: string) => {
    if (!window.confirm("Are you sure you want to mark this UPI refund as completed?")) return;
    try {
      await apiFetch(`/refunds/${id}/process`, { method: 'PATCH' });
      fetchRefunds(); // refresh list
    } catch (err) {
      console.error('Failed to process refund', err);
      alert('Failed to process refund');
    }
  };

  return (
    <div className="users-list">
      <div className="page-header">
        <div>
          <h1>Refund Management</h1>
          <p>Manage and process customer refunds</p>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center' }}>Loading refunds...</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Refund ID</th>
                  <th>Order #</th>
                  <th>Customer Name</th>
                  <th>Payment Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((refund) => (
                  <tr key={refund._id}>
                    <td>{String(refund._id).slice(-6)}</td>
                    <td>{refund.orderNumber}</td>
                    <td>{refund.customer?.name || 'N/A'}</td>
                    <td style={{ textTransform: 'uppercase', fontWeight: 600 }}>{refund.paymentMethod}</td>
                    <td style={{ fontWeight: 600, color: 'var(--primary-color)' }}>Rs. {refund.amount}</td>
                    <td>
                      <span className={`status-badge ${refund.status}`}>
                        {refund.status}
                      </span>
                    </td>
                    <td>
                      {(refund.status === 'pending' || refund.status === 'processing') ? (
                        refund.paymentMethod === 'upi' ? (
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                            onClick={() => handleApprove(refund._id)}
                          >
                            Approve Refund
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Auto via {refund.paymentMethod}</span>
                        )
                      ) : refund.status === 'completed' ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: '#10b981', fontWeight: 600 }}>
                          <CheckCircle size={16} /> Completed
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{refund.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
                {refunds.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No refunds found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RefundManagement;
