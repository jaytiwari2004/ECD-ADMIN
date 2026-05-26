import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';

// Layout Components
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import RestaurantOverview from './pages/Restaurants/RestaurantOverview';
import RestaurantOnboard from './pages/Restaurants/RestaurantOnboard';
import MenuManagement from './pages/Restaurants/MenuManagement';
import AdminLogin from './pages/Auth/AdminLogin';
import RiderPayouts from './pages/Riders/RiderPayouts';
import RiderDetails from './pages/Riders/RiderDetails';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="app-container">
              <Sidebar />
              <div className="main-content">
                <Topbar />
                <div className="page-content animate-fade-in">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/restaurants" element={<RestaurantOverview />} />
                    <Route path="/restaurants/onboard" element={<RestaurantOnboard />} />
                    <Route path="/restaurants/menu" element={<MenuManagement />} />
                    <Route path="/restaurants/:id/menu" element={<MenuManagement />} />
                    <Route path="/riders/details" element={<RiderDetails />} />
                    <Route path="/riders/payouts" element={<RiderPayouts />} />
                  </Routes>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
