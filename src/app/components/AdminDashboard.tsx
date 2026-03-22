import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, FileText, Linkedin, Globe, Calendar, Trash2, Eye } from 'lucide-react';

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  linkedin?: string;
  portfolio?: string;
  resume_filename: string;
  resume_path: string;
  created_at: string;
  updated_at: string;
}

export function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/applications');
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data.data || []);
        setError(null);
      } else {
        setError('Backend server error. Please make sure the backend is running on port 3001.');
      }
    } catch (err) {
      setError('Cannot connect to backend server. Please run "npm run dev:full" to start the backend.');
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/applications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setApplications(applications.filter(app => app.id !== id));
      } else {
        alert('Failed to delete application');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6] mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-[#1E293B] mb-2">Connection Error</h2>
          <p className="text-[#64748B] mb-4">{error}</p>
          <button
            onClick={fetchApplications}
            className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors mr-2"
          >
            Retry
          </button>
          <Link
            to="/"
            className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors inline-block"
          >
            Go to Application Form
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1E293B]">Job Applications Dashboard</h1>
              <p className="text-[#64748B] mt-1">
                Total Applications: <span className="font-semibold text-[#3B82F6]">{applications.length}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/"
                className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                New Application
              </Link>
              <button
                onClick={fetchApplications}
                className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="max-w-7xl mx-auto">
        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="w-16 h-16 text-[#CBD5E1] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#1E293B] mb-2">No Applications Yet</h3>
            <p className="text-[#64748B]">
              When someone submits an application, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application: Application) => (
              <div key={application.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#1E293B] mb-1">
                      {application.full_name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-[#64748B]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(application.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        ID: {application.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-2 text-[#64748B] hover:text-[#3B82F6] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteApplication(application.id)}
                      className="p-2 text-[#64748B] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                      title="Delete Application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#64748B]" />
                    <span className="text-sm text-[#475569]">{application.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#64748B]" />
                    <span className="text-sm text-[#475569]">{application.phone}</span>
                  </div>
                  {application.linkedin && (
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-[#64748B]" />
                      <a 
                        href={application.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-[#3B82F6] hover:text-[#2563EB] transition-colors"
                      >
                        LinkedIn
                      </a>
                    </div>
                  )}
                  {application.portfolio && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#64748B]" />
                      <a 
                        href={application.portfolio} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-[#3B82F6] hover:text-[#2563EB] transition-colors"
                      >
                        Portfolio
                      </a>
                    </div>
                  )}
                </div>

                {/* Resume Information */}
                <div className="bg-[#F8FAFC] rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#64748B]" />
                    <span className="text-sm font-medium text-[#1E293B]">Resume:</span>
                    <span className="text-sm text-[#64748B]">{application.resume_filename}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
