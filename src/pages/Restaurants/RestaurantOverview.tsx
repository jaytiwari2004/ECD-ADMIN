import { useState, useEffect } from 'react';
import { Search, Plus, Store, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import './RestaurantOverview.css';

interface Restaurant {
  _id: string;
  name: string;
  slug?: string;
  isActive: boolean;
  orderCount: number;
  walletBalance: number;
  logo?: string;
}

const RestaurantOverview = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        const data = await apiFetch('/restaurants/list');
        if (isMounted) setRestaurants(data.restaurants || []);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadRestaurants();
    return () => { isMounted = false; };
  }, []);

  const toggleStatus = async (e: React.MouseEvent, id: string, currentStatus: boolean) => {
    e.stopPropagation(); // Prevent navigating to menu
    try {
      await apiFetch(`/restaurants/${id}/toggle-active`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !currentStatus })
      });
      setRestaurants(restaurants.map(r => r._id === id ? { ...r, isActive: !currentStatus } : r));
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const deleteRestaurant = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to completely delete "${name}"? This action cannot be undone.`)) {
      try {
        await apiFetch(`/admin/restaurants/${id}`, {
          method: 'DELETE'
        });
        setRestaurants(restaurants.filter(r => r._id !== id));
        alert("Restaurant successfully deleted");
      } catch (error: any) {
        alert(error.message || "Failed to delete restaurant");
      }
    }
  };

  const handleCardClick = (restaurant: Restaurant) => {
    navigate(`/restaurants/${restaurant._id}/menu`);
  };

  const filteredRestaurants = restaurants.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="restaurant-overview">
      <div className="page-header">
        <div>
          <h1>Restaurants</h1>
          <p>Manage and monitor all registered restaurants</p>
        </div>
        <Link to="/restaurants/onboard" className="btn-primary">
          <Plus size={20} />
          <span>Onboard Restaurant</span>
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div className="search-bar" style={{ maxWidth: '400px' }}>
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search restaurants..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading restaurants...</div>
      ) : (
        <div className="restaurant-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredRestaurants.map((restaurant) => (
            <div 
              key={restaurant._id} 
              className="glass-panel restaurant-card" 
              onClick={() => handleCardClick(restaurant)}
              style={{ padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {restaurant.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{restaurant.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Click to manage menu</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={(e) => toggleStatus(e, restaurant._id, restaurant.isActive)}
                    style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '20px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      background: restaurant.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: restaurant.isActive ? '#10b981' : '#ef4444'
                    }}
                  >
                    {restaurant.isActive ? 'Online' : 'Offline'}
                  </button>
                  <button
                    onClick={(e) => deleteRestaurant(e, restaurant._id, restaurant.name)}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: '1px solid #ef4444',
                      cursor: 'pointer',
                      background: 'transparent',
                      color: '#ef4444'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Store size={14} /> Total Orders
                  </span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{restaurant.orderCount || 0}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} /> Amount Paid
                  </span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent-primary)' }}>₹{restaurant.walletBalance || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantOverview;
