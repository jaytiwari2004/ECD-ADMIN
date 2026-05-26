import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Store, PlusCircle, Menu } from 'lucide-react';
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
        </div>
        <div className="nav-group">
          <p className="nav-label">Riders</p>
          <NavLink to="/riders/details" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span style={{display: "flex", alignItems: "center", gap: "10px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Rider Details
            </span>
          </NavLink>
          <NavLink to="/riders/payouts" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <span style={{display: "flex", alignItems: "center", gap: "10px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
              Payouts
            </span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
