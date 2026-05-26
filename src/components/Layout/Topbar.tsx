import { useState, useEffect } from 'react';
import { Bell, Search, UserCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Topbar.css';

const Topbar = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Admin');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('adminUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.name) setAdminName(user.name);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    window.location.href = '/login';
  };

  return (
    <header className="topbar glass-panel" style={{ position: 'relative', zIndex: 50 }}>
      <div className="search-bar">
        <Search className="search-icon" size={18} />
        <input type="text" placeholder="Search..." className="search-input" />
      </div>

      <div className="topbar-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge"></span>
        </button>
        <div style={{ position: 'relative' }}>
          <div className="profile-btn" onClick={() => setShowDropdown(!showDropdown)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <UserCircle size={32} className="avatar-icon" />
            <div className="profile-info">
              <span className="profile-name">Admin {adminName}</span>
              <span className="profile-role">Super Admin</span>
            </div>
          </div>
          
          {showDropdown && (
            <div className="glass-panel" style={{ position: 'absolute', top: '120%', right: 0, padding: '0.5rem', display: 'flex', flexDirection: 'column', minWidth: '150px', zIndex: 9999, pointerEvents: 'auto' }}>
              <button 
                onClick={handleLogout} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--error)', border: 'none', cursor: 'pointer', padding: '0.75rem', width: '100%', textAlign: 'left', borderRadius: '4px', pointerEvents: 'all' }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
