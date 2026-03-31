import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  UserPlus,
  Building,
  Bell,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

export const HRDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalEmployees: 0,
    totalApplications: 0,
    shortlistedCandidates: 0,
    recentApplications: [],
    upcomingDeadlines: [],
    recentJobs: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [myJobsLoading, setMyJobsLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchMyJobs();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.getHRDashboard();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyJobs = async () => {
    try {
      setMyJobsLoading(true);
      const response = await api.getMyJobs({ page: 1, limit: 5 });
      if (response.success) {
        setStats((prev) => ({
          ...prev,
          recentJobs: response.data.jobs,
          totalJobs: response.data.pagination?.total ?? prev.totalJobs
        }));
      }
    } catch (error) {
      console.error('Error fetching my jobs:', error);
    } finally {
      setMyJobsLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color = '#111', subtitle }) => (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
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
              HR Dashboard
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
              }}>3</span>
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
              <UserPlus size={20} color="#6b7280" />
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
            icon={Briefcase}
            title="Total Jobs Posted"
            value={stats.totalJobs}
            color="#3b82f6"
            subtitle="Active positions"
          />
          <StatCard
            icon={Users}
            title="Total Employees"
            value={stats.totalEmployees}
            color="#10b981"
            subtitle="Current workforce"
          />
          <StatCard
            icon={FileText}
            title="Total Applications"
            value={stats.totalApplications}
            color="#f59e0b"
            subtitle="This month"
          />
          <StatCard
            icon={TrendingUp}
            title="Shortlisted"
            value={stats.shortlistedCandidates}
            color="#8b5cf6"
            subtitle="Ready for interview"
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
            <Link to="/post-job">
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
                <Plus size={16} />
                Post New Job
              </button>
            </Link>
            <Link to="/applicants">
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
                <Users size={16} />
                View Applicants
              </button>
            </Link>
            <Link to="/employees">
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
                <Building size={16} />
                Manage Employees
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Applications */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px'
        }}>
          {/* Recent Jobs */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', margin: 0 }}>
                Recently Posted Jobs
              </h2>
              <Link to="/my-jobs" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px' }}>
                View All
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myJobsLoading ? (
                <div style={{ padding: '14px', borderRadius: '8px', background: '#fafafa', color: '#6b7280', fontSize: '13px' }}>
                  Loading jobs...
                </div>
              ) : (
                (stats.recentJobs || []).slice(0, 5).map((job, index) => (
                <div key={job.id ?? index} style={{
                  padding: '14px',
                  border: '1px solid #f3f4f6',
                  borderRadius: '8px',
                  background: '#fafafa'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: '0 0 4px 0' }}>
                        {job.title}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                        {job.company} {job.type ? `• ${job.type}` : ''}
                      </p>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: '#e0f2fe',
                      color: '#0369a1'
                    }}>
                      {job.status || 'active'}
                    </span>
                  </div>
                </div>
              ))
              )}

              {!myJobsLoading && (!stats.recentJobs || stats.recentJobs.length === 0) && (
                <div style={{ padding: '14px', borderRadius: '8px', background: '#fafafa', color: '#6b7280', fontSize: '13px' }}>
                  No jobs posted yet. Click “Post New Job” to create one.
                </div>
              )}
            </div>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', margin: 0 }}>
                Recent Applications
              </h2>
              <Link to="/applicants" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px' }}>
                View All
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {stats.recentApplications.slice(0, 5).map((app, index) => (
                <div key={index} style={{
                  padding: '16px',
                  border: '1px solid #f3f4f6',
                  borderRadius: '8px',
                  background: '#fafafa'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: '0 0 4px 0' }}>
                        {app.fullName}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0' }}>
                        Applied for {app.jobTitle}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: app.status === 'pending' ? '#fef3c7' : '#d1fae5',
                          color: app.status === 'pending' ? '#92400e' : '#065f46'
                        }}>
                          {app.status}
                        </span>
                        <span style={{ fontSize: '11px', color: '#6b7280' }}>
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Eye size={16} color="#6b7280" style={{ cursor: 'pointer' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', margin: 0 }}>
                Upcoming Deadlines
              </h2>
              <Calendar size={16} color="#6b7280" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stats.upcomingDeadlines.slice(0, 5).map((deadline, index) => (
                <div key={index} style={{
                  padding: '12px',
                  border: '1px solid #f3f4f6',
                  borderRadius: '8px',
                  background: '#fafafa'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: '0 0 4px 0' }}>
                        {deadline.jobTitle}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                        {deadline.applicants} applicants
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '12px', color: '#ef4444', margin: 0, fontWeight: '600' }}>
                        {new Date(deadline.date).toLocaleDateString()}
                      </p>
                      <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>
                        {deadline.daysLeft} days left
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
