import React, { useState } from 'react';
import { Send, BellRing } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import './PushNotificationPage.css';

const PushNotificationPage = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; msg: string }>({ type: null, msg: '' });

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
    </div>
  );
};

export default PushNotificationPage;
