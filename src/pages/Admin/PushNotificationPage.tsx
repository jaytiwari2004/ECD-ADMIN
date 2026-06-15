import React, { useState, useEffect } from 'react';
import { Send, BellRing, History, Clock } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import './PushNotificationPage.css';

interface NotificationHistory {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
}

const PushNotificationPage = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; msg: string }>({ type: null, msg: '' });
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const fetchHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await apiFetch('/notifications/admin/history');
      if (response.success && response.notifications) {
        setHistory(response.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notification history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsLoading(true);
    setStatus({ type: null, msg: '' });

    try {
      const response = await apiFetch('/notifications/admin/send', {
        method: 'POST',
        body: JSON.stringify({ title, message }),
      });

      if (response.success) {
        setStatus({ type: 'success', msg: `Successfully sent notification to ${response.sent} users!` });
        setTitle('');
        setMessage('');
        fetchHistory(); // Refresh history
      } else {
        setStatus({ type: 'error', msg: response.message || 'Failed to send notification.' });
      }
    } catch (error: any) {
      console.error(error);
      setStatus({ type: 'error', msg: error.message || 'An error occurred while sending the notification.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="push-notification-page">
      <div className="page-header">
        <div className="header-title">
          <BellRing size={28} className="header-icon" />
          <h1>Push Notifications</h1>
        </div>
        <p className="subtitle">Broadcast a message to all users of the ECD App.</p>
      </div>

      <div className="notification-card glass-panel">
        <form onSubmit={handleSendNotification} className="notification-form">
          
          <div className="form-group">
            <label htmlFor="title">Notification Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Special Discount Inside!"
              maxLength={60}
              required
            />
            <span className="char-count">{title.length}/60</span>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message Subtitle</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Get 50% off on all grocery orders today. Hurry up!"
              rows={4}
              maxLength={200}
              required
            />
            <span className="char-count">{message.length}/200</span>
          </div>

          {status.type && (
            <div className={`status-message ${status.type}`}>
              {status.msg}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-send" 
            disabled={isLoading || !title.trim() || !message.trim()}
          >
            {isLoading ? (
              <span className="loader-text">Sending...</span>
            ) : (
              <>
                <Send size={18} />
                Send Notification
              </>
            )}
          </button>
        </form>
      </div>

      <div className="notification-history-container">
        <div className="history-header">
          <History size={20} className="history-icon" />
          <h2>Past Notifications</h2>
        </div>
        
        {isLoadingHistory ? (
          <div className="history-loading">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="history-empty">No notifications sent yet.</div>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div key={item._id} className="history-card glass-panel">
                <div className="history-card-header">
                  <h3 className="history-title">{item.title}</h3>
                  <div className="history-date">
                    <Clock size={14} />
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
                <p className="history-body">{item.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PushNotificationPage;
