import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './app/hooks/useAuth';
import { LandingPage } from './app/pages/LandingPage';
import { HomePage } from './app/pages/HomePage';
import { JobSearchPage } from './app/pages/JobSearchPage';
import { JobDetailPage } from './app/pages/JobDetailPage';
import { AppliedJobsPage } from './app/pages/AppliedJobsPage';
import { SavedJobsPage } from './app/pages/SavedJobsPage';
import { ProfilePage } from './app/pages/ProfilePage';
import { LoginPage } from './app/pages/LoginPage';
import { SignupPage } from './app/pages/SignupPage';
import { SettingsPage } from './app/pages/SettingsPage';
import { JobApplicationPage } from './app/pages/JobApplicationPage';
import { ResumeUploadSection } from './app/components/ResumeUploadSection';
import { SuccessPage } from './app/components/SuccessPage';
import { AdminDashboard } from './app/components/AdminDashboard';
import { HRDashboard } from './app/pages/HRDashboard';
import { JobSeekerDashboard } from './app/pages/JobSeekerDashboard';
import { PostJobPage } from './app/pages/PostJobPage';
import { ApplicantsPage } from './app/pages/ApplicantsPage';
import { EmployeesPage } from './app/pages/EmployeesPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected Routes */}
          <Route path="/jobs" element={
            <ProtectedRoute requiredRole="jobseeker">
              <JobSearchPage />
            </ProtectedRoute>
          } />
          <Route path="/jobs/:jobId" element={
            <ProtectedRoute requiredRole="jobseeker">
              <JobDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/applied" element={
            <ProtectedRoute requiredRole="jobseeker">
              <AppliedJobsPage />
            </ProtectedRoute>
          } />
          <Route path="/saved" element={
            <ProtectedRoute requiredRole="jobseeker">
              <SavedJobsPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/apply/:jobId" element={
            <ProtectedRoute requiredRole="jobseeker">
              <JobApplicationPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          
          {/* Job Seeker Dashboard */}
          <Route path="/job-seeker-dashboard" element={
            <ProtectedRoute requiredRole="jobseeker">
              <JobSeekerDashboard />
            </ProtectedRoute>
          } />
          
          {/* HR Dashboard and Management */}
          <Route path="/hr-dashboard" element={
            <ProtectedRoute requiredRole="employer">
              <HRDashboard />
            </ProtectedRoute>
          } />
          <Route path="/post-job" element={
            <ProtectedRoute requiredRole="employer">
              <PostJobPage />
            </ProtectedRoute>
          } />
          <Route path="/applicants" element={
            <ProtectedRoute requiredRole="employer">
              <ApplicantsPage />
            </ProtectedRoute>
          } />
          <Route path="/employees" element={
            <ProtectedRoute requiredRole="employer">
              <EmployeesPage />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Legacy Routes */}
          <Route path="/upload" element={<ResumeUploadSection />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
