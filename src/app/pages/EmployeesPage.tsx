import { useState, useEffect } from 'react';
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
  Building,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Settings,
  Trash2,
  Edit
} from 'lucide-react';
import api from '../services/api';

export const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchEmployees();
  }, [filters, pagination.page]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.getEmployees({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });
      
      if (response.success) {
        setEmployees(response.data.employees);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateEmployee = async (employeeId) => {
    if (!window.confirm('Are you sure you want to terminate this employee?')) {
      return;
    }

    try {
      const response = await api.terminateEmployee(employeeId);
      if (response.success) {
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error terminating employee:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'probation': return '#f59e0b';
      case 'notice': return '#ef4444';
      case 'terminated': return '#6b7280';
      case 'resigned': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Users size={16} />;
      case 'probation': return <Calendar size={16} />;
      case 'notice': return <Phone size={16} />;
      case 'terminated': return <Trash2 size={16} />;
      case 'resigned': return <Phone size={16} />;
      default: return <Users size={16} />;
    }
  };

  if (showDetails && selectedEmployee) {
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
                Employee Details
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
              {/* Left Column - Employee Info */}
              <div>
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', margin: '0 0 20px 0' }}>
                    Personal Information
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Full Name</p>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: 0 }}>
                        {selectedEmployee.fullName}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Email</p>
                      <p style={{ fontSize: '14px', color: '#111', margin: 0 }}>
                        {selectedEmployee.email}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Phone</p>
                      <p style={{ fontSize: '14px', color: '#111', margin: 0 }}>
                        {selectedEmployee.phone}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Status</p>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        background: `${getStatusColor(selectedEmployee.status)}15`,
                        color: getStatusColor(selectedEmployee.status),
                        fontWeight: '600'
                      }}>
                        {getStatusIcon(selectedEmployee.status)}
                        {selectedEmployee.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', margin: '0 0 20px 0' }}>
                    Employment Details
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Position</p>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: 0 }}>
                        {selectedEmployee.position}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Department</p>
                      <p style={{ fontSize: '14px', color: '#111', margin: 0 }}>
                        {selectedEmployee.department}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Employment Type</p>
                      <p style={{ fontSize: '14px', color: '#111', margin: 0 }}>
                        {selectedEmployee.employmentType}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Joining Date</p>
                      <p style={{ fontSize: '14px', color: '#111', margin: 0 }}>
                        {new Date(selectedEmployee.joiningDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Salary</p>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: 0 }}>
                        {selectedEmployee.currency}{selectedEmployee.salary.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Work Mode</p>
                      <p style={{ fontSize: '14px', color: '#111', margin: 0 }}>
                        {selectedEmployee.workMode}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedEmployee.workLocation && (
                  <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', margin: '0 0 20px 0' }}>
                      Work Location
                    </h2>
                    <div style={{ fontSize: '14px', color: '#374151' }}>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>Address:</strong> {selectedEmployee.workLocation.address}
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>City:</strong> {selectedEmployee.workLocation.city}
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>State:</strong> {selectedEmployee.workLocation.state}
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>Country:</strong> {selectedEmployee.workLocation.country}
                      </p>
                    </div>
                  </div>
                )}

                {selectedEmployee.documents && selectedEmployee.documents.length > 0 && (
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', margin: '0 0 20px 0' }}>
                      Documents
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      {selectedEmployee.documents.map((doc, index) => (
                        <div key={index} style={{
                          padding: '12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          background: '#f9fafb'
                        }}>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: '0 0 4px 0' }}>
                            {doc.name}
                          </p>
                          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0' }}>
                            Type: {doc.type}
                          </p>
                          <button style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 10px',
                            background: '#3b82f6',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}>
                            <Download size={12} /> Download
                          </button>
                        </div>
                      ))}
                    </div>
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
                    <button style={{
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
                    }}>
                      <Edit size={16} /> Edit Employee
                    </button>
                    
                    <button style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px',
                      background: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      <Mail size={16} /> Send Message
                    </button>
                    
                    {selectedEmployee.status !== 'terminated' && (
                      <button
                        onClick={() => handleTerminateEmployee(selectedEmployee._id)}
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
                        <Trash2 size={16} /> Terminate Employee
                      </button>
                    )}
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
                    Emergency Contact
                  </h3>
                  {selectedEmployee.emergencyContact ? (
                    <div style={{ fontSize: '14px', color: '#374151' }}>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>Name:</strong> {selectedEmployee.emergencyContact.name}
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>Relationship:</strong> {selectedEmployee.emergencyContact.relationship}
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>Phone:</strong> {selectedEmployee.emergencyContact.phone}
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        <strong>Email:</strong> {selectedEmployee.emergencyContact.email}
                      </p>
                    </div>
                  ) : (
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>
                      No emergency contact information available
                    </p>
                  )}
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
              Employees Management
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={20} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search employees..."
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
              <option value="active">Active</option>
              <option value="probation">Probation</option>
              <option value="notice">Notice Period</option>
              <option value="terminated">Terminated</option>
              <option value="resigned">Resigned</option>
            </select>
            
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value, page: 1 })}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          {/* Employees Table */}
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
              <p style={{ color: '#6b7280' }}>Loading employees...</p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Employee</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Position</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Department</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Joining Date</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '16px 12px' }}>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: '0 0 4px 0' }}>
                              {employee.fullName}
                            </p>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                              {employee.email}
                            </p>
                          </div>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: '0 0 4px 0' }}>
                              {employee.position}
                            </p>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                              {employee.employmentType}
                            </p>
                          </div>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>
                            {employee.department}
                          </p>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>
                            {new Date(employee.joiningDate).toLocaleDateString()}
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
                            background: `${getStatusColor(employee.status)}15`,
                            color: getStatusColor(employee.status),
                            fontWeight: '600'
                          }}>
                            {getStatusIcon(employee.status)}
                            {employee.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setShowDetails(true);
                              }}
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
                            <button
                              onClick={() => handleTerminateEmployee(employee._id)}
                              style={{
                                padding: '6px',
                                background: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                              title="Terminate"
                              disabled={employee.status === 'terminated'}
                            >
                              <Trash2 size={14} />
                            </button>
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
