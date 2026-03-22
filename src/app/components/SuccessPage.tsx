import { CheckCircle2, ArrowLeft, Home, User, Mail, Phone, FileText, Linkedin, Globe } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SuccessPageProps {}

export function SuccessPage({}: SuccessPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, fileName } = location.state || { 
    formData: {
      fullName: '',
      email: '',
      phone: '',
      linkedin: '',
      portfolio: ''
    }, 
    fileName: 'resume.pdf' 
  };

  const handleBackToForm = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F9FF] via-[#F5F7FA] to-[#F0FDF4] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-6">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-[#4CAF50]" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-[#1E293B] mb-3">
            Application Submitted Successfully!
          </h1>
          <p className="text-lg text-[#64748B] mb-8">
            Thank you for your interest. We've received your application and will review it shortly.
          </p>

          {/* Submitted Information */}
          <div className="bg-[#F8FAFC] rounded-xl p-6 text-left mb-8">
            <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#3B82F6]" />
              Submitted Information
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-[#94A3B8]" />
                <span className="text-[#475569]">Name:</span>
                <span className="font-medium text-[#1E293B]">{formData.fullName}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#94A3B8]" />
                <span className="text-[#475569]">Email:</span>
                <span className="font-medium text-[#1E293B]">{formData.email}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#94A3B8]" />
                <span className="text-[#475569]">Phone:</span>
                <span className="font-medium text-[#1E293B]">{formData.phone}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#94A3B8]" />
                <span className="text-[#475569]">Resume:</span>
                <span className="font-medium text-[#1E293B]">{fileName}</span>
              </div>
              
              {formData.linkedin && (
                <div className="flex items-center gap-3">
                  <Linkedin className="w-4 h-4 text-[#94A3B8]" />
                  <span className="text-[#475569]">LinkedIn:</span>
                  <a 
                    href={formData.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-[#3B82F6] hover:text-[#2563EB] transition-colors"
                  >
                    View Profile
                  </a>
                </div>
              )}
              
              {formData.portfolio && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[#94A3B8]" />
                  <span className="text-[#475569]">Portfolio:</span>
                  <a 
                    href={formData.portfolio} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-[#3B82F6] hover:text-[#2563EB] transition-colors"
                  >
                    View Portfolio
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-xl p-4 mb-8">
            <h3 className="font-semibold text-[#92400E] mb-2">What's Next?</h3>
            <p className="text-sm text-[#78350F]">
              Our team will review your application within 3-5 business days. 
              You'll receive an email confirmation shortly.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleBackToForm}
              className="flex items-center gap-2 px-6 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] active:bg-[#1D4ED8] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Submit Another Application
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-6 py-3 bg-white text-[#475569] rounded-lg border-2 border-[#CBD5E1] hover:bg-[#F8FAFC] hover:border-[#94A3B8] transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-[#94A3B8]">
          <p>© 2024 Job Listing Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
