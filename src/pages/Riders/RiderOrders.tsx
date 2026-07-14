import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { apiFetch } from '../../utils/api';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

  const generateAllRidersInvoice = async () => {
    if (riders.length === 0) return;
    
    const doc = new jsPDF();
    
    // Add Logo
    try {
      const img = new Image();
      img.src = '/logo.png';
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve; 
      });
      doc.addImage(img, 'PNG', 14, 10, 25, 25);
    } catch (e) {
      console.log('Error loading logo');
    }
    
    // Header
    doc.setFontSize(26);
    doc.setFont("times", "bolditalic");
    doc.setTextColor(22, 101, 52); 
    doc.text('ECD KART', 45, 20);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text('All Riders Earnings Invoice', 45, 28);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 45, 34);
    doc.text(`Total Riders: ${riders.length}`, 14, 42);
    
    const totalEarningsSum = riders.reduce((sum, r) => sum + r.totalEarnings, 0);
    const totalOrdersSum = riders.reduce((sum, r) => sum + r.completedOrders, 0);
    
    // Boxes for Totals
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(248, 250, 252);
    doc.rect(14, 46, 60, 15, "FD");
    doc.setFontSize(9);
    doc.text("TOTAL ORDERS", 18, 51);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 101, 52);
    doc.text(`${totalOrdersSum}`, 18, 57);

    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(248, 250, 252);
    doc.rect(80, 46, 70, 15, "FD");
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("TOTAL EARNINGS", 84, 51);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 101, 52);
    doc.text(`Rs. ${totalEarningsSum.toFixed(2)}`, 84, 57);

    const tableData = riders.map((r) => [
      r.name || 'Unknown',
      r.riderId || 'N/A',
      r.phone,
      r.upi || 'N/A',
      r.completedOrders,
      `Rs. ${r.totalEarnings.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['Rider Name', 'ID', 'Phone', 'UPI', 'Orders', 'Earnings']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [22, 101, 52] }
    });

    doc.save(`ECD_All_Riders_Invoice.pdf`);
  };

  const generateRiderHistoryInvoice = async () => {
    if (!selectedRider || history.length === 0) return;
    
    const doc = new jsPDF();
    
    // Add Logo
    try {
      const img = new Image();
      img.src = '/logo.png';
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve; 
      });
      doc.addImage(img, 'PNG', 14, 10, 25, 25);
    } catch (e) {
      console.log('Error loading logo');
    }

    doc.setFontSize(26);
    doc.setFont("times", "bolditalic");
    doc.setTextColor(22, 101, 52); 
    doc.text('ECD KART', 45, 20);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Rider Invoice: ${selectedRider.name}`, 45, 28);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 45, 34);
    doc.text(`Rider ID: ${selectedRider.riderId || 'N/A'}`, 14, 42);
    doc.text(`Phone: ${selectedRider.phone}`, 14, 48);
    doc.text(`UPI: ${selectedRider.upi || 'N/A'}`, 14, 54);
    
    // Boxes for Totals
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(248, 250, 252);
    doc.rect(90, 42, 50, 15, "FD");
    doc.setFontSize(9);
    doc.text("TOTAL ORDERS", 94, 47);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 101, 52);
    doc.text(`${selectedRider.completedOrders}`, 94, 53);

    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(248, 250, 252);
    doc.rect(145, 42, 55, 15, "FD");
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("TOTAL EARNINGS", 149, 47);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 101, 52);
    doc.text(`Rs. ${selectedRider.totalEarnings.toFixed(2)}`, 149, 53);

    const tableData = history.map((order) => [
      new Date(order.createdAt).toLocaleDateString(),
      order.orderNumber,
      order.pickupLocation,
      order.dropLocation,
      `Rs. ${order.driverEarnings.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['Date', 'Order #', 'Pickup', 'Drop', 'Earned']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [22, 101, 52] },
      columnStyles: {
        2: { cellWidth: 50 },
        3: { cellWidth: 50 }
      }
    });

    doc.save(`ECD_Rider_${selectedRider.name.replace(/\s+/g, '_')}_Invoice.pdf`);
  };

  return (
    <div className="rider-orders-container">
      <div className="orders-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Rider Orders</h1>
          <p>Track completed deliveries and total earnings for all riders.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={generateAllRidersInvoice}
          disabled={riders.length === 0 || loading}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Download size={18} />
          Download Invoice
        </button>
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
      {selectedRider && createPortal(
        <div className="modal-overlay" onClick={closeHistory}>
          <div className="modal-content glass-panel large-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedRider.name}'s Order History</h2>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button 
                  className="btn btn-primary btn-sm" 
                  onClick={generateRiderHistoryInvoice}
                  disabled={history.length === 0 || historyLoading}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Download size={16} />
                  Download Invoice
                </button>
                <button className="close-btn" onClick={closeHistory}>×</button>
              </div>
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
        </div>,
        document.body
      )}
    </div>
  );
};

export default RiderOrders;
