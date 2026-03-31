import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

export const ProfileUpdateForm = ({ initialData, onSave, onCancel }) => {
  const { updateProfile, loading } = useProfile();
  const [formData, setFormData] = useState(initialData || {});
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Process skills array
    const processedData = {
      ...formData,
      skills: formData.skills ? formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : []
    };

    const result = await updateProfile(processedData);
    
    if (result.success) {
      onSave(result.data);
    } else {
      setError(result.message);
    }
  };

  return (
    <>
      <style>{`
        .profile-update-form {
          background: #fff;
          border: 1.5px solid #ebebeb;
          border-radius: 12px;
          padding: 24px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #444;
          margin-bottom: 6px;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 10px 14px;
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
          min-height: 80px;
          resize: vertical;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
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

        .alert-error {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
        }
      `}</style>

      <div className="profile-update-form">
        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              name="fullName"
              value={formData.fullName || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-input"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-input"
              name="location"
              value={formData.location || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea
              className="form-textarea"
              name="bio"
              value={formData.bio || ''}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Skills (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              name="skills"
              value={formData.skills || ''}
              onChange={handleInputChange}
              placeholder="React, Node.js, MongoDB..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Experience</label>
            <textarea
              className="form-textarea"
              name="experience"
              value={formData.experience || ''}
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
              value={formData.education || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">LinkedIn</label>
            <input
              type="url"
              className="form-input"
              name="linkedin"
              value={formData.linkedin || ''}
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
              value={formData.github || ''}
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
              value={formData.portfolio || ''}
              onChange={handleInputChange}
              placeholder="https://yourportfolio.com"
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={14} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
