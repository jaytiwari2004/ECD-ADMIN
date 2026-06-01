import { useState } from 'react';
import { Shield, CreditCard, FileText, LogOut, ChevronRight } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  const renderDocument = () => {
    switch(activeDoc) {
      case 'privacy':
        return (
          <>
            <h3>Privacy Policy</h3>
            <p>Your privacy is important to us. It is ECD Kart's policy to respect your privacy regarding any information we may collect from you across our website and app.</p>
            <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it will be used.</p>
            <h3>Information Collection</h3>
            <p>We collect information to provide better services to our users. The data collected depends on how you interact with ECD Kart.</p>
          </>
        );
      case 'payment':
        return (
          <>
            <h3>Payment Policy</h3>
            <p>All payments made through the ECD Kart platform are subject to our secure payment gateway conditions.</p>
            <p>Restaurants will receive their payouts directly to their provided UPI ID or bank account. Riders receive earnings based on their delivery completion.</p>
            <h3>Refunds and Cancellations</h3>
            <p>Refunds are processed in accordance with our cancellation terms. Any disputed payments will be resolved by the ECD Kart admin team.</p>
          </>
        );
      case 'rights':
        return (
          <>
            <h3>ECD Rights (Terms of Service)</h3>
            <p>By using ECD Kart, users, riders, and restaurants agree to comply with our platform regulations.</p>
            <p>ECD Kart reserves the right to suspend or terminate any account (restaurant, rider, or user) without prior notice if they are found violating platform rules, engaging in fraudulent activity, or providing poor service quality.</p>
            <h3>Platform Authority</h3>
            <p>ECD Kart holds the ultimate authority in dispute resolution between users, restaurants, and riders.</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your platform policies and account settings.</p>
      </div>

      <div className="settings-menu">
        <div className="setting-item" onClick={() => setActiveDoc('privacy')}>
          <div className="setting-info">
            <div className="setting-icon"><Shield size={24} /></div>
            <div className="setting-text">
              <h3>Privacy Policy</h3>
              <p>Review the data protection and privacy terms</p>
            </div>
          </div>
          <ChevronRight className="chevron-icon" />
        </div>

        <div className="setting-item" onClick={() => setActiveDoc('payment')}>
          <div className="setting-info">
            <div className="setting-icon"><CreditCard size={24} /></div>
            <div className="setting-text">
              <h3>Payment Policy</h3>
              <p>Guidelines for platform transactions and payouts</p>
            </div>
          </div>
          <ChevronRight className="chevron-icon" />
        </div>

        <div className="setting-item" onClick={() => setActiveDoc('rights')}>
          <div className="setting-info">
            <div className="setting-icon"><FileText size={24} /></div>
            <div className="setting-text">
              <h3>ECD Rights (Terms)</h3>
              <p>Platform rules, rights, and regulatory terms</p>
            </div>
          </div>
          <ChevronRight className="chevron-icon" />
        </div>

        <div className="setting-item logout-item" onClick={handleLogout}>
          <div className="setting-info">
            <div className="setting-icon logout-icon"><LogOut size={24} /></div>
            <div className="setting-text logout-text">
              <h3>Logout</h3>
              <p>Securely log out of the admin panel</p>
            </div>
          </div>
        </div>
      </div>

      {activeDoc && (
        <div className="doc-modal-overlay" onClick={() => setActiveDoc(null)}>
          <div className="doc-modal-content" onClick={e => e.stopPropagation()}>
            <div className="doc-modal-header">
              <h2>
                {activeDoc === 'privacy' && <><Shield size={24} /> Privacy Policy</>}
                {activeDoc === 'payment' && <><CreditCard size={24} /> Payment Policy</>}
                {activeDoc === 'rights' && <><FileText size={24} /> ECD Rights</>}
              </h2>
              <button className="doc-modal-close" onClick={() => setActiveDoc(null)}>&times;</button>
            </div>
            <div className="doc-modal-body">
              {renderDocument()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
