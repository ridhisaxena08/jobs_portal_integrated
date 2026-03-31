import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Search,
  FileText,
  TrendingUp,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Heart,
  Eye,
  Building,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Star,
  Target,
  Award
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

export const JobSeekerDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalApplications: 0,
    shortlistedApplications: 0,
    savedJobs: 0,
    profileViews: 0,
    recentApplications: [],
    recommendedJobs: [],
    appliedJobs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.getJobSeekerDashboard();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color = '#111', subtitle, link }) => (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      cursor: link ? 'pointer' : 'default'
    }}>
      <Link to={link} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0' }}>{title}</p>
            <h3 style={{ color, fontSize: '32px', fontWeight: '700', margin: '0 0 4px 0' }}>{value}</h3>
            {subtitle && <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>{subtitle}</p>}
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={24} color={color} />
          </div>
        </div>
      </Link>
    </div>
  );

  const JobCard = ({ job, isRecommended = false }) => (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              background: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building size={20} color="#6b7280" />
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111', margin: '0 0 4px 0' }}>
                {job.title}
              </h4>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{job.company}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6b7280' }}>
              <MapPin size={14} />
              {job.location.city}, {job.location.state}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6b7280' }}>
              <DollarSign size={14} />
              {job.salary.currency}{job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6b7280' }}>
              <Clock size={14} />
              {job.type}
            </div>
          </div>
          
          {isRecommended && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
              <Star size={14} color="#f59e0b" fill="#f59e0b" />
              <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '600' }}>
                {job.matchScore}% match
              </span>
            </div>
          )}
          
          <p style={{
            fontSize: '13px',
            color: '#555',
            lineHeight: '1.6',
            margin: '0 0 16px 0',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {job.description}
          </p>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {job.skills.slice(0, 3).map((skill, index) => (
              <span key={index} style={{
                fontSize: '11px',
                padding: '4px 8px',
                borderRadius: '6px',
                background: '#f3f4f6',
                color: '#374151',
                border: '1px solid #e5e7eb'
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '16px' }}>
          <Link to={`/jobs/${job.id}`}>
            <button style={{
              padding: '8px 12px',
              background: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'DM Sans'
            }}>
              <Eye size={14} />
            </button>
          </Link>
          <button style={{
            padding: '8px 12px',
            background: '#f3f4f6',
            color: '#111',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'DM Sans'
          }}>
            <Heart size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #111',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#666', fontFamily: 'DM Sans' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'DM Sans', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111', margin: 0 }}>
              Job Seeker Dashboard
            </h1>
            <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>
              Welcome back, {user?.fullName}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Bell size={20} color="#6b7280" style={{ cursor: 'pointer' }} />
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: '#fff',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>2</span>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={20} color="#6b7280" />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <StatCard
            icon={FileText}
            title="Total Applications"
            value={stats.totalApplications}
            color="#3b82f6"
            subtitle="Jobs applied to"
            link="/applied"
          />
          <StatCard
            icon={TrendingUp}
            title="Shortlisted"
            value={stats.shortlistedApplications}
            color="#10b981"
            subtitle="In consideration"
            link="/applied"
          />
          <StatCard
            icon={Heart}
            title="Saved Jobs"
            value={stats.savedJobs}
            color="#f59e0b"
            subtitle="Bookmarked positions"
            link="/saved"
          />
          <StatCard
            icon={Eye}
            title="Profile Views"
            value={stats.profileViews}
            color="#8b5cf6"
            subtitle="Recruiter views"
            link="/profile"
          />
        </div>

        {/* Quick Actions */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          marginBottom: '32px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', margin: '0 0 20px 0' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/jobs">
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: '#111',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'none',
                fontFamily: 'DM Sans'
              }}>
                <Search size={16} />
                Find Jobs
              </button>
            </Link>
            <Link to="/profile">
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: '#f3f4f6',
                color: '#111',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'none',
                fontFamily: 'DM Sans'
              }}>
                <User size={16} />
                Update Profile
              </button>
            </Link>
            <Link to="/applied">
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: '#f3f4f6',
                color: '#111',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'none',
                fontFamily: 'DM Sans'
              }}>
                <FileText size={16} />
                Track Applications
              </button>
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '32px'
        }}>
          {/* Recommended Jobs */}
          <div>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', margin: 0 }}>
                  Recommended Jobs
                </h2>
                <Link to="/jobs" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px' }}>
                  View All
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {stats.recommendedJobs.slice(0, 3).map((job, index) => (
                  <JobCard key={index} job={job} isRecommended={true} />
                ))}
              </div>
            </div>

            {/* Recent Applications */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e5e7eb',
              marginTop: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', margin: 0 }}>
                  Recent Applications
                </h2>
                <Link to="/applied" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px' }}>
                  View All
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {stats.appliedJobs.slice(0, 3).map((app, index) => (
                  <div key={index} style={{
                    padding: '16px',
                    border: '1px solid #f3f4f6',
                    borderRadius: '8px',
                    background: '#fafafa'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: '0 0 4px 0' }}>
                          {app.jobTitle}
                        </h4>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0' }}>
                          {app.company}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: app.status === 'pending' ? '#fef3c7' : 
                                      app.status === 'shortlisted' ? '#d1fae5' : '#fee2e2',
                            color: app.status === 'pending' ? '#92400e' : 
                                   app.status === 'shortlisted' ? '#065f46' : '#991b1b'
                          }}>
                            {app.status}
                          </span>
                          <span style={{ fontSize: '11px', color: '#6b7280' }}>
                            Applied {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} color="#6b7280" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Completion */}
          <div>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e5e7eb'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', margin: '0 0 20px 0' }}>
                Profile Strength
              </h2>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  border: '8px solid #e5e7eb',
                  borderTop: '8px solid #10b981',
                  position: 'relative',
                  margin: '0 auto 16px'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#111'
                  }}>
                    75%
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Your profile is almost complete!
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: '#fff', fontSize: '10px' }}>✓</span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#374151' }}>Basic Information</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: '#fff', fontSize: '10px' }}>✓</span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#374151' }}>Skills & Experience</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: '#fff', fontSize: '10px' }}>!</span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#374151' }}>Resume Upload</span>
                </div>
              </div>
              <Link to="/profile">
                <button style={{
                  width: '100%',
                  padding: '12px',
                  background: '#111',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '20px',
                  fontFamily: 'DM Sans'
                }}>
                  Complete Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
