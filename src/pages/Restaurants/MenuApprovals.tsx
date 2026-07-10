import { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { CheckCircle, XCircle, Info, Image as ImageIcon } from 'lucide-react';
import './MenuApprovals.css';

interface PendingItem {
  restaurantId: string;
  restaurantName: string;
  _id: string;
  name: string;
  description: string;
  b2bPrice: number;
  image: string;
  foodType: string;
  approvalStatus: string;
}

const MenuApprovals = () => {
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<Record<string, string>>({}); // itemId -> price input

  const fetchPendingItems = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/restaurants/admin/menu/pending');
      if (res.success) {
        setPendingItems(res.pendingItems || []);
        // Initialize prices with b2bPrice (as a starting point for the input)
        const initialPrices: Record<string, string> = {};
        (res.pendingItems || []).forEach((item: PendingItem) => {
          initialPrices[item._id] = item.b2bPrice ? item.b2bPrice.toString() : '';
        });
        setPrices(initialPrices);
      }
    } catch (err: any) {
      console.error('Failed to fetch pending items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingItems();
  }, []);

  const handlePriceChange = (id: string, value: string) => {
    setPrices(prev => ({ ...prev, [id]: value }));
  };

  const handleApproval = async (item: PendingItem, status: 'approved' | 'rejected') => {
    const sellingPrice = prices[item._id];
    
    if (status === 'approved' && (!sellingPrice || isNaN(Number(sellingPrice)))) {
      alert('Please enter a valid selling price to approve this item.');
      return;
    }

    try {
      const payload = {
        approvalStatus: status,
        price: status === 'approved' ? Number(sellingPrice) : 0
      };

      const res = await apiFetch(`/restaurants/admin/menu/approve/${item.restaurantId}/${item._id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });

      if (res.success) {
        // Remove item from UI
        setPendingItems(prev => prev.filter(p => p._id !== item._id));
      } else {
        alert(res.message || 'Failed to update approval status');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred while updating');
    }
  };

  if (loading) {
    return <div className="loading-state">Loading pending approvals...</div>;
  }

  return (
    <div className="menu-approvals-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Menu Approvals</h1>
          <p className="page-subtitle">Review and approve menu items submitted by restaurants</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-value">{pendingItems.length}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      </div>

      {pendingItems.length === 0 ? (
        <div className="empty-state">
          <CheckCircle size={48} className="empty-icon" />
          <h3>All Caught Up!</h3>
          <p>There are no pending menu items to approve right now.</p>
        </div>
      ) : (
        <div className="approvals-grid">
          {pendingItems.map(item => (
            <div key={item._id} className="approval-card glass-panel">
              <div className="approval-card-header">
                <span className="restaurant-badge">{item.restaurantName}</span>
                <span className={`food-type-badge ${item.foodType}`}>{item.foodType.toUpperCase()}</span>
              </div>
              
              <div className="approval-card-body">
                <div className="item-image-wrapper">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="item-image" />
                  ) : (
                    <div className="item-image-placeholder">
                      <ImageIcon size={32} />
                    </div>
                  )}
                </div>
                
                <div className="item-details">
                  <h3 className="item-title">{item.name}</h3>
                  <p className="item-desc">{item.description || 'No description provided'}</p>
                  
                  <div className="price-info">
                    <div className="b2b-price">
                      <span>B2B Price:</span>
                      <strong>₹{item.b2bPrice}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="approval-card-footer">
                <div className="selling-price-input">
                  <label>Set Selling Price (₹)</label>
                  <input 
                    type="number" 
                    value={prices[item._id] || ''} 
                    onChange={(e) => handlePriceChange(item._id, e.target.value)}
                    placeholder="e.g. 150"
                  />
                </div>
                
                <div className="action-buttons">
                  <button 
                    className="btn btn-reject"
                    onClick={() => handleApproval(item, 'rejected')}
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                  <button 
                    className="btn btn-approve"
                    onClick={() => handleApproval(item, 'approved')}
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuApprovals;
