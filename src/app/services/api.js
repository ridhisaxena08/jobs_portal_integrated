// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API Service Class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Set authorization token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Get authorization headers
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Authentication endpoints
  async register(userData) {
    const response = await this.post('/auth/register', userData);
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async login(credentials) {
    const response = await this.post('/auth/login', credentials);
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async logout() {
    try {
      await this.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setToken(null);
    }
  }

  async getProfile() {
    return this.get('/auth/me');
  }

  async updateProfile(profileData) {
    return this.put('/auth/me', profileData);
  }

  async changePassword(passwordData) {
    return this.put('/auth/change-password', passwordData);
  }

  async uploadProfilePicture(formData) {
    const headers = this.getAuthHeaders();
    // Remove Content-Type to let browser set it automatically for FormData
    delete headers['Content-Type'];
    
    try {
      const response = await fetch(`${this.baseURL}/auth/upload-profile-picture`, {
        method: 'POST',
        headers,
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async deleteAccount(password) {
    return this.delete('/auth/me', { 
      headers: { 
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password }) 
    });
  }

  // Job Application methods
  async getApplicationForm(jobId) {
    return this.get(`/job-applications/form/${jobId}`);
  }

  async submitJobApplication(applicationData) {
    return this.post('/job-applications', applicationData);
  }

  async getUserApplications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/job-applications/my-applications?${queryString}`);
  }

  async getApplicationById(id) {
    return this.get(`/job-applications/${id}`);
  }

  async updateApplication(id, formData) {
    return this.put(`/job-applications/${id}`, { formData });
  }

  async deleteApplication(id) {
    return this.delete(`/job-applications/${id}`);
  }

  // Job methods
  async getJobs(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await this.get(`/jobs?${queryString}`);
      return response;
    } catch (error) {
      console.error('Get jobs error:', error);
      throw error;
    }
  }

  async getJobById(jobId) {
    try {
      const response = await this.get(`/jobs/${jobId}`);
      return response;
    } catch (error) {
      console.error('Get job by ID error:', error);
      throw error;
    }
  }

  async getJobStats() {
    try {
      const response = await this.get('/jobs/stats');
      return response;
    } catch (error) {
      console.error('Get job stats error:', error);
      throw error;
    }
  }

  // Admin methods
  async getAllUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/auth/users?${queryString}`);
  }

  async getUserById(userId) {
    return this.get(`/auth/users/${userId}`);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Get current user data
  getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  // Set current user data
  setCurrentUser(userData) {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  }

  // Clear all auth data
  clearAuth() {
    this.setToken(null);
    this.setCurrentUser(null);
  }
}

// Create singleton instance
const api = new ApiService();

export default api;
