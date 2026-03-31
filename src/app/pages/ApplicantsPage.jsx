import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Eye,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Star,
  FileText,
  Building
} from 'lucide-react';
import api from '../services/api';

export const ApplicantsPage = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    jobId: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchApplicants();
  }, [filters, pagination.page]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await api.getApplicants({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });
      
      if (response.success) {
        setApplicants(response.data.applicants);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicantId, newStatus) => {
    try {
      const response = await api.updateApplicationStatus(applicantId, newStatus);
      if (response.success) {
        fetchApplicants();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleShortlist = async (applicantId) => {
    try {
      const response = await api.shortlistCandidate(applicantId);
      if (response.success) {
        fetchApplicants();
      }
    } catch (error) {
      console.error('Error shortlisting candidate:', error);
    }
  };

  const handleReject = async (applicantId) => {
    try {
      const response = await api.rejectCandidate(applicantId);
      if (response.success) {
        fetchApplicants();
      }
    } catch (error) {
      console.error('Error rejecting candidate:', error);
    }
  };

  const viewApplicantDetails = async (applicantId) => {
    try {
      const response = await api.getApplicantById(applicantId);
      if (response.success) {
        setSelectedApplicant(response.data);
        setShowDetails(true);
      }
    } catch (error) {
      console.error('Error fetching applicant details:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'reviewed': return '#3b82f6';
      case 'shortlisted': return '#10b981';
      case 'interview': return '#8b5cf6';
      case 'offered': return '#06b6d4';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'reviewed': return <Eye size={16} />;
      case 'shortlisted': return <Star size={16} />;
      case 'interview': return <Users size={16} />;
      case 'offered': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  if (showDetails && selectedApplicant) {
    return (
      <div style={{ fontFamily: 'DM Sans', backgroundColor: '#f9fafb', minHeight: '100vh', padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '32px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111', margin: 0 }}>
                Applicant Details
              </h1>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  padding: '8px 16px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Back to List
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
              {/* Left Column - Applicant Info */}
              <div>
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', margin: '0 0 20px 0' }}>
                    Basic Details
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Name</p>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: 0 }}>
                        {selectedApplicant?.application?.fullName || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Email</p>
                      <p style={{ fontSize: '14px', color: '#111', margin: 0 }}>
                        {selectedApplicant?.application?.email || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Phone</p>
                      <p style={{ fontSize: '14px', color: '#111', margin: 0 }}>
                        {selectedApplicant?.application?.phone || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Applied Date</p>
                      <p style={{ fontSize: '14px', color: '#111', margin: 0 }}>
                        {selectedApplicant?.application?.createdAt ? new Date(selectedApplicant.application.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', margin: '0 0 20px 0' }}>
                    Application Details
                  </h2>
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Cover Letter</p>
                    <p style={{ fontSize: '14px', color: '#111', lineHeight: '1.6', margin: 0 }}>
                      {selectedApplicant?.application?.coverLetter || 'No cover letter provided'}
                    </p>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Experience</p>
                    <p style={{ fontSize: '14px', color: '#111', margin: 0 }}>
                      {selectedApplicant?.application?.experience || 'No experience details provided'}
                    </p>
                  </div>
                  {selectedApplicant?.application?.expectedSalary && (
                    <div style={{ marginBottom: '16px' }}>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Expected Salary</p>
                      <p style={{ fontSize: '14px', color: '#111', margin: 0 }}>
                        {selectedApplicant.application.expectedSalary}
                      </p>
                    </div>
                  )}
                </div>

                {selectedApplicant?.userProfile && (
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', margin: '0 0 20px 0' }}>
                      Profile Information
                    </h2>
                    <div style={{ marginBottom: '16px' }}>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Skills</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {selectedApplicant.userProfile.profile?.skills?.map((skill, index) => (
                          <span key={index} style={{
                            fontSize: '12px',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            background: '#f3f4f6',
                            color: '#374151'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    {selectedApplicant.userProfile.profile?.resume && (
                      <div>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0' }}>Resume</p>
                        <button style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          background: '#f3f4f6',
                          color: '#374151',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}>
                          <Download size={16} /> Download Resume
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column - Actions */}
              <div>
                <div style={{
                  background: '#f9fafb',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111', margin: '0 0 20px 0' }}>
                    Quick Actions
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                      onClick={() => handleShortlist(selectedApplicant?.application?._id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px',
                        background: '#10b981',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      <UserCheck size={16} /> Shortlist
                    </button>
                    
                    <button
                      onClick={() => handleStatusUpdate(selectedApplicant?.application?._id, 'interview')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px',
                        background: '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      <Users size={16} /> Schedule Interview
                    </button>
                    
                    <button
                      onClick={() => handleReject(selectedApplicant?.application?._id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px',
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      <UserX size={16} /> Reject
                    </button>
                  </div>
                </div>

                <div style={{
                  background: '#f9fafb',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e5e7eb',
                  marginTop: '20px'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111', margin: '0 0 16px 0' }}>
                    Job Information
                  </h3>
                  <div style={{ fontSize: '14px', color: '#374151' }}>
                    <p style={{ margin: '0 0 8px 0' }}>
                      <strong>Position:</strong> {selectedApplicant?.application?.jobTitle || 'N/A'}
                    </p>
                    <p style={{ margin: '0 0 8px 0' }}>
                      <strong>Company:</strong> {selectedApplicant?.application?.company || 'N/A'}
                    </p>
                    <p style={{ margin: '0 0 8px 0' }}>
                      <strong>Location:</strong> {selectedApplicant?.application?.location || 'N/A'}
                    </p>
                    <p style={{ margin: '0 0 8px 0' }}>
                      <strong>Type:</strong> {selectedApplicant?.application?.jobType || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'DM Sans', backgroundColor: '#f9fafb', minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '32px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111', margin: 0 }}>
              Applicants Management
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={20} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search applicants..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                  style={{
                    paddingLeft: '40px',
                    paddingRight: '12px',
                    padding: '10px 12px 10px 40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    width: '250px'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Applicants Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #e5e7eb',
                borderTop: '4px solid #111',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }}></div>
              <p style={{ color: '#6b7280' }}>Loading applicants...</p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Applicant</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Position</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Applied Date</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((applicant) => (
                      <tr key={applicant._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '16px 12px' }}>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: '0 0 4px 0' }}>
                              {applicant.fullName}
                            </p>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                              {applicant.email}
                            </p>
                          </div>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: '0 0 4px 0' }}>
                              {applicant.jobId?.title || applicant.jobTitle || 'N/A'}
                            </p>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                              {applicant.jobId?.company || applicant.company || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>
                            {applicant.createdAt ? new Date(applicant.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            background: `${getStatusColor(applicant.status)}15`,
                            color: getStatusColor(applicant.status),
                            fontWeight: '600'
                          }}>
                            {getStatusIcon(applicant.status)}
                            {applicant.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => viewApplicantDetails(applicant._id)}
                              style={{
                                padding: '6px',
                                background: '#f3f4f6',
                                color: '#374151',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                              title="View Details"
                            >
                              <Eye size={14} />
                            </button>
                            {applicant.status !== 'shortlisted' && (
                              <button
                                onClick={() => handleShortlist(applicant._id)}
                                style={{
                                  padding: '6px',
                                  background: '#10b981',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                                title="Shortlist"
                              >
                                <Star size={14} />
                              </button>
                            )}
                            {applicant.status !== 'rejected' && (
                              <button
                                onClick={() => handleReject(applicant._id)}
                                style={{
                                  padding: '6px',
                                  background: '#ef4444',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                                title="Reject"
                              >
                                <XCircle size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
                  <button
                    onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                    disabled={pagination.page === 1}
                    style={{
                      padding: '8px 12px',
                      background: pagination.page === 1 ? '#f3f4f6' : '#fff',
                      color: pagination.page === 1 ? '#9ca3af' : '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  
                  <button
                    onClick={() => setPagination({ ...pagination, page: Math.min(pagination.pages, pagination.page + 1) })}
                    disabled={pagination.page === pagination.pages}
                    style={{
                      padding: '8px 12px',
                      background: pagination.page === pagination.pages ? '#f3f4f6' : '#fff',
                      color: pagination.page === pagination.pages ? '#9ca3af' : '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: pagination.page === pagination.pages ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
