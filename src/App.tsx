import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ResumeUploadSection } from './app/components/ResumeUploadSection';
import { SuccessPage } from './app/components/SuccessPage';
import { AdminDashboard } from './app/components/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResumeUploadSection />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
