import React, { useState, useEffect } from 'react';
import { apiFetch, uploadFile } from '../../utils/api';
import './RiderDetails.css';

interface Rider {
  _id: string;
  name: string;
  phone: string;
  riderId?: string;
  isVerified: boolean;
  status: 'pending' | 'active' | 'suspended';
  documents?: {
    aadharFront?: string;
    aadharBack?: string;
    license?: string;
  };
  createdAt: string;
}

const RiderDetails = () => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination (Simple)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fullscreen Image Viewer
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    fetchRiders(page);
  }, [page]);

  const fetchRiders = async (p: number) => {
    setLoading(true);
    try {
      const data = await apiFetch(`/admin/users?role=driver&page=${p}&limit=20`);
      setRiders(data.users || []);
      setTotalPages(data.totalPages || 1);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch riders');
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (rider: Rider) => {
    setSelectedRider(rider);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRider(null);
  };

  // --- Actions ---

  const handleStatusChange = async (newStatus: 'pending' | 'active' | 'suspended', isVerified: boolean) => {
    if (!selectedRider) return;
    setIsUpdating(true);
    try {
      const data = await apiFetch(`/admin/users/${selectedRider._id}/details`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus, isVerified }),
      });
      // Update local state
      setSelectedRider({ ...selectedRider, status: newStatus, isVerified });
      setRiders(riders.map(r => r._id === selectedRider._id ? data.user : r));
    } catch (err: any) {
      alert(err.message || 'Failed to update rider status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDocumentUpload = async (docType: 'aadharFront' | 'aadharBack' | 'license', file: File) => {
    if (!selectedRider) return;
    setIsUpdating(true);
    try {
      const url = await uploadFile(file);
      const updatedDocs = {
        ...selectedRider.documents,
        [docType]: url,
      };

      const data = await apiFetch(`/admin/users/${selectedRider._id}/details`, {
        method: 'PATCH',
        body: JSON.stringify({ documents: updatedDocs }),
      });

      setSelectedRider({ ...selectedRider, documents: updatedDocs });
      setRiders(riders.map(r => r._id === selectedRider._id ? data.user : r));
      alert(`Document ${docType} updated successfully!`);
    } catch (err: any) {
      alert(err.message || 'Failed to upload document');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMessageRider = () => {
    if (!selectedRider?.phone) return;
    // Basic formatting for WA (assuming India +91 if not present)
    let phone = selectedRider.phone;
    if (!phone.startsWith('+')) {
      phone = '+91' + phone;
    }
    const msg = encodeURIComponent(`Hello ${selectedRider.name || 'Rider'}, regarding your ECD Driver account onboarding...`);
    window.open(`https://wa.me/${phone.replace('+', '')}?text=${msg}`, '_blank');
  };

  return (
    <div className="rider-details-container">
      <div className="header-row">
        <h1>Rider Verification & Details</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-wrapper glass-panel">
        {loading ? (
          <div className="loading-state">Loading riders...</div>
        ) : riders.length === 0 ? (
          <div className="empty-state">No riders found.</div>
        ) : (
          <>
            <table className="riders-table">
              <thead>
                <tr>
                  <th>Rider ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Verification</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {riders.map(rider => (
                  <tr key={rider._id}>
                    <td>{rider.riderId || 'N/A'}</td>
                    <td>{rider.name || 'Unknown'}</td>
                    <td>{rider.phone}</td>
                    <td>
                      <span className={`badge status-${rider.status}`}>{rider.status.toUpperCase()}</span>
                    </td>
                    <td>
                      <span className={`badge ${rider.isVerified ? 'verified' : 'unverified'}`}>
                        {rider.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                      </span>
                    </td>
                    <td>{new Date(rider.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn-view" onClick={() => openDetails(rider)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          </>
        )}
      </div>

      {/* Details Modal */}
      {isModalOpen && selectedRider && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel large-modal">
            <div className="modal-header">
              <h2>{selectedRider.name || 'Rider'} Details</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="info-section">
                <p><strong>Phone:</strong> {selectedRider.phone}</p>
                <p><strong>Rider ID:</strong> {selectedRider.riderId || 'Not Assigned'}</p>
                <p>
                  <strong>Account Status:</strong> 
                  <span className={`badge status-${selectedRider.status} ml-2`}>{selectedRider.status.toUpperCase()}</span>
                </p>
                <p>
                  <strong>Verification:</strong> 
                  <span className={`badge ${selectedRider.isVerified ? 'verified' : 'unverified'} ml-2`}>
                    {selectedRider.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                  </span>
                </p>
              </div>

              <div className="documents-section">
                <h3>Uploaded Documents</h3>
                <div className="docs-grid">
                  {/* Aadhar Front */}
                  <div className="doc-card">
                    <h4>Aadhar Front</h4>
                    {selectedRider.documents?.aadharFront ? (
                      <img 
                        src={selectedRider.documents.aadharFront} 
                        alt="Aadhar Front" 
                        onClick={() => setFullscreenImage(selectedRider.documents?.aadharFront || null)}
                      />
                    ) : (
                      <div className="no-doc">Not Uploaded</div>
                    )}
                    <label className="edit-doc-btn">
                      {isUpdating ? 'Uploading...' : 'Edit Image'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        hidden 
                        onChange={(e) => e.target.files?.[0] && handleDocumentUpload('aadharFront', e.target.files[0])}
                        disabled={isUpdating}
                      />
                    </label>
                  </div>

                  {/* Aadhar Back */}
                  <div className="doc-card">
                    <h4>Aadhar Back</h4>
                    {selectedRider.documents?.aadharBack ? (
                      <img 
                        src={selectedRider.documents.aadharBack} 
                        alt="Aadhar Back" 
                        onClick={() => setFullscreenImage(selectedRider.documents?.aadharBack || null)}
                      />
                    ) : (
                      <div className="no-doc">Not Uploaded</div>
                    )}
                    <label className="edit-doc-btn">
                      {isUpdating ? 'Uploading...' : 'Edit Image'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        hidden 
                        onChange={(e) => e.target.files?.[0] && handleDocumentUpload('aadharBack', e.target.files[0])}
                        disabled={isUpdating}
                      />
                    </label>
                  </div>

                  {/* License */}
                  <div className="doc-card">
                    <h4>Driving License</h4>
                    {selectedRider.documents?.license ? (
                      <img 
                        src={selectedRider.documents.license} 
                        alt="License" 
                        onClick={() => setFullscreenImage(selectedRider.documents?.license || null)}
                      />
                    ) : (
                      <div className="no-doc">Not Uploaded</div>
                    )}
                    <label className="edit-doc-btn">
                      {isUpdating ? 'Uploading...' : 'Edit Image'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        hidden 
                        onChange={(e) => e.target.files?.[0] && handleDocumentUpload('license', e.target.files[0])}
                        disabled={isUpdating}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="action-panel">
                <h3>Admin Actions</h3>
                <div className="action-buttons">
                  {!selectedRider.isVerified && (
                    <button 
                      className="btn-verify" 
                      onClick={() => handleStatusChange('active', true)}
                      disabled={isUpdating}
                    >
                      Verify & Activate
                    </button>
                  )}
                  {selectedRider.status !== 'suspended' && (
                    <button 
                      className="btn-block" 
                      onClick={() => handleStatusChange('suspended', false)}
                      disabled={isUpdating}
                    >
                      Block / Suspend
                    </button>
                  )}
                  {selectedRider.status === 'suspended' && (
                    <button 
                      className="btn-verify" 
                      onClick={() => handleStatusChange('active', true)}
                      disabled={isUpdating}
                    >
                      Unblock & Reactivate
                    </button>
                  )}
                  
                  <button className="btn-message" onClick={handleMessageRider}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    Message via WhatsApp
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={() => setFullscreenImage(null)}>
          <button className="close-fullscreen">×</button>
          <img src={fullscreenImage} alt="Fullscreen Document" onClick={e => e.stopPropagation()} />
        </div>
      )}

    </div>
  );
};

export default RiderDetails;
