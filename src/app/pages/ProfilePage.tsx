import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Camera, Edit2, Save, X, Eye, EyeOff, Shield, Download, Trash2 } from 'lucide-react';
import api from '../services/api';

export const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: '',
    experience: '',
    education: '',
    linkedin: '',
    github: '',
    portfolio: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.getProfile();
      
      if (response.success) {
        setUser(response.data);
        setFormData({
          fullName: response.data.fullName || '',
          email: response.data.email || '',
          phone: response.data.profile?.phone || '',
          location: response.data.profile?.location || '',
          bio: response.data.profile?.bio || '',
          skills: response.data.profile?.skills?.join(', ') || '',
          experience: response.data.profile?.experience || '',
          education: response.data.profile?.education || '',
          linkedin: response.data.profile?.linkedin || '',
          github: response.data.profile?.github || '',
          portfolio: response.data.profile?.portfolio || ''
        });
      }
    } catch (error) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      const profileData = {
        fullName: formData.fullName,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        experience: formData.experience,
        education: formData.education,
        linkedin: formData.linkedin,
        github: formData.github,
        portfolio: formData.portfolio
      };

      // Use direct POST method for immediate update
      const response = await api.updateProfileDirect(profileData);
      
      if (response.success) {
        setUser(response.data);
        setEditing(false);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await api.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setSuccess('Password changed successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to change password');
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await api.uploadProfilePicture(formData);
      
      if (response.success) {
        // Update user state with new profile picture
        if (user) {
          setUser({
            ...user,
            profile: {
              ...user.profile,
              profilePicture: response.data.profilePicture
            }
          });
        }
        setSuccess('Profile picture updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to upload profile picture');
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    const password = prompt('Please enter your password to confirm account deletion:');
    if (!password) return;

    try {
      setLoading(true);
      setError('');
      
      const response = await api.deleteAccount(password);
      
      if (response.success) {
        api.clearAuth();
        window.location.href = '/login';
      } else {
        setError(response.message || 'Failed to delete account');
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'DM Sans, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #111', 
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '16px', color: '#666' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'DM Sans, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <User size={48} style={{ color: '#999', marginBottom: '16px' }} />
          <h2 style={{ color: '#333', marginBottom: '8px' }}>Profile not found</h2>
          <p style={{ color: '#666' }}>Unable to load profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,600;0,700;1,600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .profile-root {
          font-family: 'DM Sans', sans-serif;
          background: #f9f9f7;
          min-height: 100vh;
        }

        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 24px;
        }

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          gap: 32px;
        }

        .profile-info {
          flex: 1;
        }

        .profile-avatar-section {
          text-align: center;
        }

        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #f0f0f0;
          border: 3px solid #e0e0e0;
          margin-bottom: 16px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s;
        }

        .profile-avatar:hover {
          border-color: #111;
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .profile-avatar-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0,0,0,0.7);
          color: #fff;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .profile-avatar:hover .profile-avatar-overlay {
          opacity: 1;
        }

        .profile-name {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          font-weight: 700;
          color: #111;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .profile-email {
          font-size: 16px;
          color: #666;
          margin-bottom: 4px;
        }

        .profile-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary {
          background: #111;
          color: #fff;
        }

        .btn-primary:hover { background: #333; }

        .btn-secondary {
          background: #f0f0f0;
          color: #111;
          border: 1.5px solid #e0e0e0;
        }

        .btn-secondary:hover { 
          background: #fff;
          border-color: #111;
        }

        .btn-danger {
          background: #dc2626;
          color: #fff;
        }

        .btn-danger:hover { background: #b91c1c; }

        .profile-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .profile-section {
          background: #fff;
          border: 1.5px solid #ebebeb;
          border-radius: 12px;
          padding: 32px;
        }

        .section-title {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          font-weight: 700;
          color: #111;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-title svg {
          color: #666;
          width: 20px;
          height: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group:last-child { margin-bottom: 0; }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #444;
          margin-bottom: 8px;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e4e4e4;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #111;
          background: #fafafa;
          transition: border-color 0.15s, background 0.15s;
          outline: none;
        }

        .form-input:focus, .form-textarea:focus {
          border-color: #111;
          background: #fff;
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .password-input-wrapper {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }

        .password-toggle:hover { color: #666; }

        .alert {
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 14px;
        }

        .alert-success {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
        }

        .alert-error {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .profile-container { padding: 40px 16px; }
          .profile-content { grid-template-columns: 1fr; gap: 24px; }
          .profile-header { flex-direction: column; align-items: center; }
          .profile-actions { justify-content: center; }
        }
      `}</style>

      <div className="profile-root">
        <div className="profile-container">
          {/* Header */}
          <div className="profile-header">
            <div className="profile-info">
              <h1 className="profile-name">{user.fullName}</h1>
              <p className="profile-email">{user.email}</p>
              <div className="profile-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => setEditing(!editing)}
                >
                  {editing ? <X size={16} /> : <Edit2 size={16} />}
                  {editing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            <div className="profile-avatar-section">
              <div className="profile-avatar" onClick={() => document.getElementById('profilePictureInput')?.click()}>
                {user.profile?.profilePicture ? (
                  <img src={`http://localhost:3001${user.profile.profilePicture}`} alt="Profile" />
                ) : (
                  <User size={48} style={{ color: '#999' }} />
                )}
                <div className="profile-avatar-overlay">
                  <Camera size={16} />
                </div>
              </div>
              <input
                id="profilePictureInput"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          {/* Content */}
          <div className="profile-content">
            {/* Personal Information */}
            <div className="profile-section">
              <h2 className="section-title">
                <User /> Personal Information
              </h2>
              
              {editing ? (
                <div>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.email}
                      disabled
                      style={{ background: '#f5f5f5' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-input"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-textarea"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <button className="btn btn-primary" onClick={handleSaveProfile}>
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              ) : (
                <div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                      {user.profile?.phone || 'Not provided'}
                    </p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                      {user.profile?.location || 'Not provided'}
                    </p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
                      {user.profile?.bio || 'No bio provided'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Professional Information */}
            <div className="profile-section">
              <h2 className="section-title">
                <Briefcase /> Professional Information
              </h2>
              
              {editing ? (
                <div>
                  <div className="form-group">
                    <label className="form-label">Skills (comma-separated)</label>
                    <input
                      type="text"
                      className="form-input"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder="React, Node.js, MongoDB..."
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Experience</label>
                    <textarea
                      className="form-textarea"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="Describe your work experience..."
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Education</label>
                    <input
                      type="text"
                      className="form-input"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="form-group">
                    <label className="form-label">Skills</label>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                      {user.profile?.skills?.join(', ') || 'No skills listed'}
                    </p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Experience</label>
                    <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
                      {user.profile?.experience || 'No experience provided'}
                    </p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Education</label>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                      {user.profile?.education || 'No education provided'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Links */}
            <div className="profile-section">
              <h2 className="section-title">
                <Mail /> Links & Portfolio
              </h2>
              
              {editing ? (
                <div>
                  <div className="form-group">
                    <label className="form-label">LinkedIn</label>
                    <input
                      type="url"
                      className="form-input"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">GitHub</label>
                    <input
                      type="url"
                      className="form-input"
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Portfolio</label>
                    <input
                      type="url"
                      className="form-input"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="form-group">
                    <label className="form-label">LinkedIn</label>
                    {user.profile?.linkedin ? (
                      <a href={user.profile.linkedin} target="_blank" style={{ color: '#111', fontSize: '14px' }}>
                        {user.profile.linkedin}
                      </a>
                    ) : (
                      <p style={{ color: '#999', fontSize: '14px' }}>Not provided</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">GitHub</label>
                    {user.profile?.github ? (
                      <a href={user.profile.github} target="_blank" style={{ color: '#111', fontSize: '14px' }}>
                        {user.profile.github}
                      </a>
                    ) : (
                      <p style={{ color: '#999', fontSize: '14px' }}>Not provided</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Portfolio</label>
                    {user.profile?.portfolio ? (
                      <a href={user.profile.portfolio} target="_blank" style={{ color: '#111', fontSize: '14px' }}>
                        {user.profile.portfolio}
                      </a>
                    ) : (
                      <p style={{ color: '#999', fontSize: '14px' }}>Not provided</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Account Settings */}
            <div className="profile-section">
              <h2 className="section-title">
                <Shield /> Account Settings
              </h2>
              
              <div>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      className="form-input"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                    />
                    <button 
                      type="button" 
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        className="form-input"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                      />
                      <button 
                        type="button" 
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        className="form-input"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                      />
                      <button 
                        type="button" 
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <button className="btn btn-primary" onClick={handlePasswordUpdate}>
                    <Shield size={16} /> Update Password
                  </button>
                </div>

                <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #ebebeb' }}>
                  <button className="btn btn-danger" onClick={handleDeleteAccount}>
                    <Trash2 size={16} /> Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
