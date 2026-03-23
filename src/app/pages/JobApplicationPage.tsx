import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Briefcase, MapPin, Clock, DollarSign, FileText, Upload, Send, ArrowLeft } from 'lucide-react';
import api from '../services/api';

interface FormData {
  id: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'date' | 'file' | 'select' | 'textarea';
  question: string;
  answer: string;
  required: boolean;
  options?: string[];
}

interface JobInfo {
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  jobType: string;
  hasApplied: boolean;
}

interface UserData {
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  expectedSalary: string;
  availability: string;
}

export const JobApplicationPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [jobInfo, setJobInfo] = useState<JobInfo | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<FormData[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!jobId) {
      setError('No job ID provided. Please access this page from a job listing.');
      setLoading(false);
      return;
    }
    fetchApplicationForm();
  }, [jobId]);

  const fetchApplicationForm = async () => {
    try {
      setLoading(true);
      const response = await api.getApplicationForm(jobId);
      
      if (response.success) {
        setJobInfo(response.data.jobInfo);
        setUserData(response.data.userData);
        setFormData(response.data.formData.questions);
      } else {
        setError(response.message || 'Failed to load application form');
      }
    } catch (error) {
      setError('Failed to load application form');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (questionId: string, value: string) => {
    setFormData(prev => 
      prev.map(item => 
        item.id === questionId ? { ...item, answer: value } : item
      )
    );
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only PDF and Word documents are allowed');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setResumeFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobInfo || jobInfo.hasApplied) {
      setError('You have already applied to this job');
      return;
    }

    // Validate required fields
    const requiredFields = formData.filter(item => item.required && !item.answer.trim());
    if (requiredFields.length > 0) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const applicationData = {
        jobId: jobInfo.jobId,
        jobTitle: jobInfo.jobTitle,
        company: jobInfo.company,
        location: jobInfo.location,
        jobType: jobInfo.jobType,
        formData: {
          questions: formData
        }
      };

      const response = await api.submitJobApplication(applicationData);
      
      if (response.success) {
        setSuccess('Application submitted successfully!');
        setTimeout(() => {
          navigate('/applied-jobs');
        }, 2000);
      } else {
        setError(response.message || 'Failed to submit application');
      }
    } catch (error) {
      setError('Failed to submit application');
    } finally {
      setSubmitting(false);
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
          <p style={{ marginTop: '16px', color: '#666' }}>Loading application form...</p>
        </div>
      </div>
    );
  }

  if (!jobInfo) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'DM Sans, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Briefcase size={48} style={{ color: '#999', marginBottom: '16px' }} />
          <h2 style={{ color: '#333', marginBottom: '8px' }}>Job not found</h2>
          <p style={{ color: '#666' }}>Unable to load job information.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,600;0,700;1,600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .application-page {
          font-family: 'DM Sans', sans-serif;
          background: #f9f9f7;
          min-height: 100vh;
        }

        .application-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 80px 24px;
        }

        .job-header {
          background: #fff;
          border: 1.5px solid #ebebeb;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .job-title {
          font-family: 'Fraunces', serif;
          font-size: 24px;
          font-weight: 700;
          color: #111;
          margin-bottom: 12px;
        }

        .job-meta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }

        .job-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #666;
        }

        .job-meta-item svg {
          width: 16px;
          height: 16px;
        }

        .application-form {
          background: #fff;
          border: 1.5px solid #ebebeb;
          border-radius: 12px;
          padding: 32px;
        }

        .section-title {
          font-family: 'Fraunces', serif;
          font-size: 18px;
          font-weight: 700;
          color: #111;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f0f0f0;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .form-label .required {
          color: #dc2626;
        }

        .form-input, .form-textarea, .form-select {
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

        .form-input:focus, .form-textarea:focus, .form-select:focus {
          border-color: #111;
          background: #fff;
        }

        .form-textarea {
          min-height: 120px;
          resize: vertical;
        }

        .file-upload {
          border: 2px dashed #e4e4e4;
          border-radius: 8px;
          padding: 32px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .file-upload:hover {
          border-color: #111;
          background: #f8f8f8;
        }

        .file-upload.has-file {
          border-color: #111;
          background: #f0f0f0;
        }

        .file-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 16px;
          color: #666;
        }

        .file-text {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
        }

        .file-name {
          font-size: 12px;
          color: #111;
          font-weight: 600;
        }

        .button-group {
          display: flex;
          gap: 12px;
          margin-top: 32px;
        }

        .btn {
          padding: 12px 24px;
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

        .alert-warning {
          background: #fef3c7;
          border: 1px solid #fde68a;
          color: #92400e;
        }

        .user-info {
          background: #f8f8f8;
          border: 1.5px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .user-info-title {
          font-size: 12px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .user-info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
          font-size: 14px;
        }

        .user-info-label {
          color: #666;
        }

        .user-info-value {
          color: #111;
          font-weight: 500;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .application-container { padding: 40px 16px; }
          .job-meta { flex-direction: column; gap: 8px; }
          .button-group { flex-direction: column; }
        }
      `}</style>

      <div className="application-page">
        <div className="application-container">
          {/* Job Header */}
          <div className="job-header">
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate(-1)}
              style={{ marginBottom: '16px' }}
            >
              <ArrowLeft size={16} /> Back
            </button>
            
            <h1 className="job-title">{jobInfo.jobTitle}</h1>
            <div className="job-meta">
              <div className="job-meta-item">
                <Briefcase />
                {jobInfo.company}
              </div>
              <div className="job-meta-item">
                <MapPin />
                {jobInfo.location}
              </div>
              <div className="job-meta-item">
                <Clock />
                {jobInfo.jobType}
              </div>
            </div>
          </div>

          {/* User Info (Pre-filled) */}
          {userData && (
            <div className="user-info">
              <div className="user-info-title">Your Information</div>
              <div className="user-info-item">
                <span className="user-info-label">Name:</span>
                <span className="user-info-value">{userData.fullName}</span>
              </div>
              <div className="user-info-item">
                <span className="user-info-label">Email:</span>
                <span className="user-info-value">{userData.email}</span>
              </div>
              {userData.phone && (
                <div className="user-info-item">
                  <span className="user-info-label">Phone:</span>
                  <span className="user-info-value">{userData.phone}</span>
                </div>
              )}
            </div>
          )}

          {/* Application Status */}
          {jobInfo.hasApplied && (
            <div className="alert alert-warning">
              You have already applied to this job. You can view your application status in the "Applied Jobs" section.
            </div>
          )}

          {/* Application Form */}
          {!jobInfo.hasApplied && (
            <form onSubmit={handleSubmit} className="application-form">
              <h2 className="section-title">Application Details</h2>
              
              {formData.map((field) => (
                <div key={field.id} className="form-group">
                  <label className="form-label">
                    {field.question}
                    {field.required && <span className="required"> *</span>}
                  </label>
                  
                  {field.type === 'textarea' && (
                    <textarea
                      className="form-textarea"
                      value={field.answer}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      placeholder={`Enter ${field.question.toLowerCase()}`}
                      required={field.required}
                    />
                  )}
                  
                  {field.type === 'select' && (
                    <select
                      className="form-select"
                      value={field.answer}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={field.required}
                    >
                      <option value="">Select an option</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {field.type === 'text' && (
                    <input
                      type="text"
                      className="form-input"
                      value={field.answer}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      placeholder={`Enter ${field.question.toLowerCase()}`}
                      required={field.required}
                    />
                  )}
                  
                  {field.type === 'email' && (
                    <input
                      type="email"
                      className="form-input"
                      value={field.answer}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      placeholder="Enter your email"
                      required={field.required}
                    />
                  )}
                  
                  {field.type === 'phone' && (
                    <input
                      type="tel"
                      className="form-input"
                      value={field.answer}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      placeholder="Enter your phone number"
                      required={field.required}
                    />
                  )}
                </div>
              ))}

              {/* Resume Upload */}
              <div className="form-group">
                <label className="form-label">Resume (Optional)</label>
                <div 
                  className={`file-upload ${resumeFile ? 'has-file' : ''}`}
                  onClick={() => document.getElementById('resume-upload')?.click()}
                >
                  <Upload className="file-icon" />
                  <div className="file-text">
                    {resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}
                  </div>
                  {resumeFile && (
                    <div className="file-name">{resumeFile.name}</div>
                  )}
                </div>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  style={{ display: 'none' }}
                />
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

              {/* Submit Buttons */}
              <div className="button-group">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div style={{ 
                        width: '16px', 
                        height: '16px', 
                        border: '2px solid #fff', 
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
