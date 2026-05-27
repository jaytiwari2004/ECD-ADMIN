import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Store, PlusCircle, Menu, ShieldAlert, Settings, Users, Star } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <h2 className="logo-text">ECD <span className="highlight">Admin</span></h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/blocked-accounts" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <span style={{display: "flex", alignItems: "center", gap: "10px", color: "#ef4444"}}>
            <ShieldAlert size={20} />
            Blocked Accounts
          </span>
        </NavLink>

        <NavLink to="/users" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <span style={{display: "flex", alignItems: "center", gap: "10px"}}>
            <Users size={20} />
            Users Management
          </span>
        </NavLink>

        <div className="nav-group">
          <p className="nav-label">Restaurants</p>
          <NavLink to="/restaurants" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Store size={20} />
            <span>Overview</span>
          </NavLink>
          <NavLink to="/restaurants/menu" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Menu size={20} />
            <span>Menu</span>
          </NavLink>
          <NavLink to="/restaurants/onboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <PlusCircle size={20} />
            <span>Onboard</span>
          </NavLink>
          <NavLink to="/restaurants/payouts" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span style={{display: "flex", alignItems: "center", gap: "10px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
              Payouts
            </span>
          </NavLink>
          <NavLink to="/restaurants/special-dishes" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Star size={20} />
            <span>Special Dishes</span>
          </NavLink>
        </div>
        <div className="nav-group">
          <p className="nav-label">Riders</p>
          <NavLink to="/riders/details" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span style={{display: "flex", alignItems: "center", gap: "10px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Rider Details
            </span>
          </NavLink>
          <NavLink to="/riders/orders" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span style={{display: "flex", alignItems: "center", gap: "10px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Rider Orders
            </span>
          </NavLink>
          <NavLink to="/riders/payouts" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span style={{display: "flex", alignItems: "center", gap: "10px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
              Payouts
            </span>
          </NavLink>
        </div>
        
        <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} style={{ marginTop: 'auto' }}>
          <span style={{display: "flex", alignItems: "center", gap: "10px"}}>
            <Settings size={20} />
            Settings
          </span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
