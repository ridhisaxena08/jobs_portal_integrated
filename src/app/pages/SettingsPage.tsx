import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Settings,
  Download,
  Trash2,
  Save,
} from 'lucide-react';
import { Navbar } from '../components/shared/Navbar';
import { Footer } from '../components/shared/Footer';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Senior Frontend Developer with 5+ years of experience in React, TypeScript, and modern web technologies.',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const tabs = [
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'account', label: 'Account', icon: Settings },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    console.log('Saving settings:', formData);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,600;0,700;1,600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .settings-root { font-family: 'DM Sans', sans-serif; background: #f9f9f7; min-height: 100vh; }

        .settings-container { max-width: 1200px; margin: 0 auto; padding: 60px 24px 80px; }

        .settings-header { margin-bottom: 40px; }
        .settings-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(28px, 3.5vw, 38px);
          font-weight: 700;
          color: #111;
          letter-spacing: -0.8px;
          margin-bottom: 6px;
        }
        .settings-subtitle { font-size: 15px; color: #777; }

        .settings-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 768px) { .settings-layout { grid-template-columns: 1fr; } }

        /* Sidebar */
        .settings-sidebar {
          background: #fff;
          border: 1.5px solid #ebebeb;
          border-radius: 12px;
          padding: 8px;
          position: sticky;
          top: 80px;
        }
        .settings-tabs { display: flex; flex-direction: column; gap: 2px; }
        .settings-tab {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border-radius: 8px;
          background: none;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          text-align: left;
          width: 100%;
        }
        .settings-tab:hover { background: #f4f4f4; color: #111; }
        .settings-tab.active { background: #111; color: #fff; }
        .settings-tab svg { width: 15px; height: 15px; flex-shrink: 0; }

        /* Content panel */
        .settings-content {
          background: #fff;
          border: 1.5px solid #ebebeb;
          border-radius: 12px;
          padding: 32px;
        }

        .settings-section { margin-bottom: 28px; }
        .settings-section:last-child { margin-bottom: 0; }

        .settings-section-title {
          font-size: 16px;
          font-weight: 600;
          color: #111;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .settings-section-title svg { color: #888; width: 17px; height: 17px; }

        /* Form */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }

        .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .form-group:last-child { margin-bottom: 0; }

        .form-label { font-size: 12.5px; font-weight: 600; color: #444; letter-spacing: 0.2px; }

        .form-input {
          padding: 11px 14px;
          border: 1.5px solid #e4e4e4;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #111;
          background: #fafafa;
          outline: none;
          width: 100%;
          transition: border-color 0.15s, background 0.15s;
        }
        .form-input::placeholder { color: #c0c0c0; }
        .form-input:focus { border-color: #111; background: #fff; }

        .form-textarea {
          padding: 11px 14px;
          border: 1.5px solid #e4e4e4;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #111;
          background: #fafafa;
          outline: none;
          width: 100%;
          resize: vertical;
          min-height: 96px;
          transition: border-color 0.15s, background 0.15s;
        }
        .form-textarea::placeholder { color: #c0c0c0; }
        .form-textarea:focus { border-color: #111; background: #fff; }

        .password-wrap { position: relative; }
        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #aaa;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.15s;
          display: flex;
          align-items: center;
        }
        .password-toggle:hover { color: #555; }

        /* Toggle */
        .settings-card {
          background: #f9f9f7;
          border: 1px solid #ebebeb;
          border-radius: 10px;
          padding: 18px 20px;
          margin-bottom: 12px;
        }
        .settings-card:last-child { margin-bottom: 0; }
        .settings-card-title { font-size: 14px; font-weight: 600; color: #111; margin-bottom: 4px; }
        .settings-card-text { font-size: 13px; color: #777; line-height: 1.5; margin-bottom: 14px; }

        .toggle-row { display: flex; align-items: center; justify-content: space-between; }
        .toggle-label { font-size: 13.5px; font-weight: 500; color: #333; }

        .toggle {
          position: relative;
          width: 40px;
          height: 22px;
          flex-shrink: 0;
        }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .toggle-slider {
          position: absolute;
          inset: 0;
          background: #ddd;
          border-radius: 22px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .toggle-slider::before {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          left: 3px;
          top: 3px;
          background: #fff;
          border-radius: 50%;
          transition: transform 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
        .toggle input:checked + .toggle-slider { background: #111; }
        .toggle input:checked + .toggle-slider::before { transform: translateX(18px); }

        /* Divider */
        .form-divider { height: 1px; background: #f0f0f0; margin: 24px 0; }

        /* Buttons */
        .button-group { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 24px; }

        .btn-primary {
          padding: 11px 22px;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: background 0.15s;
        }
        .btn-primary:hover { background: #333; }
        .btn-primary svg { width: 15px; height: 15px; }

        .btn-secondary {
          padding: 11px 22px;
          background: transparent;
          color: #555;
          border: 1.5px solid #e0e0e0;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: border-color 0.15s, color 0.15s;
        }
        .btn-secondary:hover { border-color: #aaa; color: #111; }
        .btn-secondary svg { width: 15px; height: 15px; }

        .btn-danger {
          padding: 11px 22px;
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: background 0.15s;
        }
        .btn-danger:hover { background: #b91c1c; }
        .btn-danger svg { width: 15px; height: 15px; }

        .danger-zone { margin-top: 28px; padding-top: 28px; border-top: 1.5px solid #fee2e2; }
        .danger-zone-title { font-size: 14px; font-weight: 600; color: #dc2626; margin-bottom: 14px; }
      `}</style>

      <div className="settings-root">
        <Navbar />

        <div className="settings-container">
          <div className="settings-header">
            <h1 className="settings-title">Settings</h1>
            <p className="settings-subtitle">Manage your account settings and preferences</p>
          </div>

          <div className="settings-layout">
            {/* Sidebar */}
            <div className="settings-sidebar">
              <div className="settings-tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      className={`settings-tab${activeTab === tab.id ? ' active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <Icon />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="settings-content">

              {/* ── SECURITY ── */}
              {activeTab === 'security' && (
                <div className="settings-section">
                  <h2 className="settings-section-title"><Shield /> Change Password</h2>

                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <div className="password-wrap">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        name="currentPassword"
                        className="form-input"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="Enter current password"
                        style={{ paddingRight: 42 }}
                      />
                      <button type="button" className="password-toggle"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-divider" />

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <div className="password-wrap">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          name="newPassword"
                          className="form-input"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          placeholder="Enter new password"
                          style={{ paddingRight: 42 }}
                        />
                        <button type="button" className="password-toggle"
                          onClick={() => setShowNewPassword(!showNewPassword)}>
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <div className="password-wrap">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          className="form-input"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm new password"
                          style={{ paddingRight: 42 }}
                        />
                        <button type="button" className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="button-group">
                    <button className="btn-primary" onClick={handleSave}><Save /> Update Password</button>
                  </div>
                </div>
              )}

              {/* ── NOTIFICATIONS ── */}
              {activeTab === 'notifications' && (
                <div className="settings-section">
                  <h2 className="settings-section-title"><Bell /> Notification Preferences</h2>

                  <div className="settings-card">
                    <div className="settings-card-title">Email Notifications</div>
                    <div className="settings-card-text">
                      Receive email updates about job applications, messages, and profile views.
                    </div>
                    <div className="toggle-row">
                      <span className="toggle-label">Email notifications</span>
                      <label className="toggle">
                        <input type="checkbox" checked={emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)} />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  </div>

                  <div className="settings-card">
                    <div className="settings-card-title">Push Notifications</div>
                    <div className="settings-card-text">
                      Get instant notifications about new job matches and application status updates.
                    </div>
                    <div className="toggle-row">
                      <span className="toggle-label">Push notifications</span>
                      <label className="toggle">
                        <input type="checkbox" checked={pushNotifications}
                          onChange={(e) => setPushNotifications(e.target.checked)} />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  </div>

                  <div className="button-group">
                    <button className="btn-primary" onClick={handleSave}><Save /> Save Preferences</button>
                  </div>
                </div>
              )}

              {/* ── PRIVACY ── */}
              {activeTab === 'privacy' && (
                <div className="settings-section">
                  <h2 className="settings-section-title"><Eye /> Privacy Settings</h2>

                  <div className="settings-card">
                    <div className="settings-card-title">Profile Visibility</div>
                    <div className="settings-card-text">
                      Control who can see your profile and contact information.
                    </div>
                    <div className="toggle-row">
                      <span className="toggle-label">Public profile</span>
                      <label className="toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  </div>

                  <div className="settings-card">
                    <div className="settings-card-title">Show Online Status</div>
                    <div className="settings-card-text">
                      Let others see when you're actively using the platform.
                    </div>
                    <div className="toggle-row">
                      <span className="toggle-label">Show online status</span>
                      <label className="toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  </div>

                  <div className="button-group">
                    <button className="btn-primary" onClick={handleSave}><Save /> Save Privacy Settings</button>
                  </div>
                </div>
              )}

              {/* ── ACCOUNT ── */}
              {activeTab === 'account' && (
                <div className="settings-section">
                  <h2 className="settings-section-title"><Settings /> Account Management</h2>

                  <div className="settings-card">
                    <div className="settings-card-title">Export Your Data</div>
                    <div className="settings-card-text">
                      Download a copy of your personal data, including profile information and application history.
                    </div>
                    <button className="btn-secondary"><Download /> Export Data</button>
                  </div>

                  <div className="danger-zone">
                    <div className="danger-zone-title">Danger Zone</div>
                    <div className="settings-card">
                      <div className="settings-card-title">Delete Account</div>
                      <div className="settings-card-text">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </div>
                      <button className="btn-danger"><Trash2 /> Delete Account</button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};