export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedAt: string;
  deadline: string;
  featured?: boolean;
}

export interface JobsResponse {
  success: boolean;
  data: {
    jobs: Job[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profile?: {
    firstName: string;
    lastName: string;
    phone: string;
    location: string;
    bio: string;
    resume: string;
    skills: string[];
    experience: string;
    education: string;
  };
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status: string;
  appliedAt: string;
  formData: any;
}

export interface JobApplicationsResponse {
  success: boolean;
  data: {
    applications: JobApplication[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message?: string;
}

export default class ApiService {
  constructor();
  
  // Authentication
  register(userData: any): Promise<AuthResponse>;
  login(credentials: { email: string; password: string }): Promise<AuthResponse>;
  logout(): Promise<void>;
  getProfile(): Promise<ApiResponse<User>>;
  updateProfile(profileData: any): Promise<ApiResponse<User>>;
  changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<ApiResponse>;
  uploadProfilePicture(formData: FormData): Promise<ApiResponse>;
  deleteAccount(password: string): Promise<ApiResponse>;
  
  // Jobs
  getJobs(params?: { page?: number; limit?: number; featured?: boolean; category?: string; search?: string }): Promise<JobsResponse>;
  getJobById(jobId: string): Promise<ApiResponse<Job>>;
  getJobStats(): Promise<ApiResponse>;
  
  // Job Applications
  getApplicationForm(jobId: string): Promise<ApiResponse>;
  submitJobApplication(applicationData: any): Promise<ApiResponse<JobApplication>>;
  getUserApplications(params?: { page?: number; limit?: number; status?: string }): Promise<JobApplicationsResponse>;
  getApplicationById(id: string): Promise<ApiResponse<JobApplication>>;
  updateApplication(id: string, formData: any): Promise<ApiResponse<JobApplication>>;
  deleteApplication(id: string): Promise<ApiResponse>;
  
  // Admin
  getAllUsers(params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<{ users: User[]; pagination: any }>>;
  getUserById(userId: string): Promise<ApiResponse<User>>;
  
  // Utility
  setToken(token: string | null): void;
  isAuthenticated(): boolean;
  getCurrentUser(): User | null;
  setCurrentUser(userData: User | null): void;
  clearAuth(): void;
}
