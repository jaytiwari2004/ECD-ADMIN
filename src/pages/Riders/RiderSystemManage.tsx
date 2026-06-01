import React, { useState, useEffect } from 'react';
import { Sun, Moon, Save, IndianRupee, Wallet, TrendingUp } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import './RiderSystemManage.css';

interface ShiftSettings {
    riderFeePerKm: number;
    adminCommissionPerKm: number;
}

const RiderSystemManage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [stats, setStats] = useState({
        adminProfit: 0,
        driverPayout: 0
    });
    
    const [morningShift, setMorningShift] = useState<ShiftSettings>({
        riderFeePerKm: 0,
        adminCommissionPerKm: 0
    });
    
    const [nightShift, setNightShift] = useState<ShiftSettings>({
        riderFeePerKm: 0,
        adminCommissionPerKm: 0
    });

    useEffect(() => {
        fetchSettingsAndStats();
    }, []);

    const fetchSettingsAndStats = async () => {
        try {
            setLoading(true);
            // Fetch system settings
            const settingsRes = await apiFetch('/admin/delivery-settings');
            if (settingsRes.settings) {
                if (settingsRes.settings.morningShift) {
                    setMorningShift(settingsRes.settings.morningShift);
                }
                if (settingsRes.settings.nightShift) {
                    setNightShift(settingsRes.settings.nightShift);
                }
            }

            // Fetch stats for the summary cards
            const statsRes = await apiFetch('/admin/dashboard');
            if (statsRes) {
                setStats({
                    adminProfit: statsRes.riderAdminCommission || 0,
                    driverPayout: statsRes.riderPayouts || 0
                });
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            alert('Error loading system manage data.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await apiFetch('/admin/delivery-settings', {
                method: 'PUT',
                body: JSON.stringify({
                    morningShift,
                    nightShift
                })
            });
            alert('Delivery settings updated successfully!');
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Error saving delivery settings.');
        } finally {
            setSaving(false);
        }
    };

    const handleMorningChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMorningShift(prev => ({
            ...prev,
            [e.target.name]: Number(e.target.value)
        }));
    };

    const handleNightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNightShift(prev => ({
            ...prev,
            [e.target.name]: Number(e.target.value)
        }));
    };

    if (loading) {
        return <div className="loading-state">Loading settings...</div>;
    }

    const morningTotal = morningShift.riderFeePerKm + morningShift.adminCommissionPerKm;
    const nightTotal = nightShift.riderFeePerKm + nightShift.adminCommissionPerKm;

    return (
        <div className="rider-system-manage">
            <div className="system-manage-header">
                <h1>Rider System Manage</h1>
                <p>Configure rider payouts and commission fees dynamically per km.</p>
            </div>

            <div className="stats-summary">
                <div className="stat-card">
                    <div className="stat-icon profit">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Admin Profit from Riders (Commission)</h3>
                        <div className="stat-value">₹{stats.adminProfit.toFixed(2)}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon payout">
                        <Wallet size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Driver Payouts</h3>
                        <div className="stat-value">₹{stats.driverPayout.toFixed(2)}</div>
                    </div>
                </div>
            </div>

            <div className="settings-grid">
                {/* Morning Shift */}
                <div className="shift-card">
                    <h2><Sun size={24} color="#f59e0b" /> Morning Shift (Day)</h2>
                    
                    <div className="form-group">
                        <label>Rider Base Fee per km (₹)</label>
                        <div className="input-with-icon">
                            <IndianRupee size={18} className="input-icon" />
                            <input 
                                type="number" 
                                name="riderFeePerKm"
                                value={morningShift.riderFeePerKm || ''} 
                                onChange={handleMorningChange}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Admin Commission per km (₹)</label>
                        <div className="input-with-icon">
                            <IndianRupee size={18} className="input-icon" />
                            <input 
                                type="number" 
                                name="adminCommissionPerKm"
                                value={morningShift.adminCommissionPerKm || ''} 
                                onChange={handleMorningChange}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-group total-fee-display">
                        <label>Total Delivery Fee Displayed to User (per km)</label>
                        <div className="input-with-icon">
                            <IndianRupee size={18} className="input-icon" />
                            <input 
                                type="number" 
                                value={morningTotal || ''} 
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                {/* Night Shift */}
                <div className="shift-card">
                    <h2><Moon size={24} color="#8b5cf6" /> Night Shift</h2>
                    
                    <div className="form-group">
                        <label>Rider Base Fee per km (₹)</label>
                        <div className="input-with-icon">
                            <IndianRupee size={18} className="input-icon" />
                            <input 
                                type="number" 
                                name="riderFeePerKm"
                                value={nightShift.riderFeePerKm || ''} 
                                onChange={handleNightChange}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Admin Commission per km (₹)</label>
                        <div className="input-with-icon">
                            <IndianRupee size={18} className="input-icon" />
                            <input 
                                type="number" 
                                name="adminCommissionPerKm"
                                value={nightShift.adminCommissionPerKm || ''} 
                                onChange={handleNightChange}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-group total-fee-display">
                        <label>Total Delivery Fee Displayed to User (per km)</label>
                        <div className="input-with-icon">
                            <IndianRupee size={18} className="input-icon" />
                            <input 
                                type="number" 
                                value={nightTotal || ''} 
                                readOnly
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="save-actions">
                <button 
                    className="btn-save" 
                    onClick={handleSave}
                    disabled={saving}
                >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </div>
    );
};

export default RiderSystemManage;
