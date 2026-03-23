import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/jobs" element={<JobSearchPage />} />
        <Route path="/jobs/:jobId" element={<JobDetailPage />} />
        <Route path="/applied" element={<AppliedJobsPage />} />
        <Route path="/saved" element={<SavedJobsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/apply/:jobId" element={<JobApplicationPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/upload" element={<ResumeUploadSection />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
