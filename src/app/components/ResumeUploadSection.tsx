import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, FileText, CheckCircle2, AlertCircle, Wifi, WifiOff } from 'lucide-react';

export function ResumeUploadSection() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: ''
  });

  // Check backend status on component mount
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/stats');
        if (response.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (err) {
        setBackendStatus('offline');
      }
    };

    checkBackendStatus();
    // Check status every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, file: 'Only PDF and DOCX files are allowed' }));
      return false;
    }

    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, file: 'File size must be less than 2MB' }));
      return false;
    }

    setErrors(prev => {
      const { file, ...rest } = prev;
      return rest;
    });
    return true;
  };

  const handleFileSelect = (selectedFile: File) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\//.test(formData.linkedin)) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL';
    }

    if (formData.portfolio && !/^https?:\/\/.+/.test(formData.portfolio)) {
      newErrors.portfolio = 'Please enter a valid URL';
    }

    if (!file) {
      newErrors.file = 'Please upload your resume';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Create FormData for file upload
        const submissionData = new FormData();
        submissionData.append('fullName', formData.fullName);
        submissionData.append('email', formData.email);
        submissionData.append('phone', formData.phone);
        submissionData.append('linkedin', formData.linkedin);
        submissionData.append('portfolio', formData.portfolio);
        submissionData.append('resume', file!);

        // Submit to API
        const response = await fetch('http://localhost:3001/api/applications', {
          method: 'POST',
          body: submissionData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Application submitted successfully:', result);
          
          // Navigate to success page with form data
          navigate('/success', { 
            state: { 
              formData, 
              fileName: file?.name || 'resume.pdf',
              applicationId: result.applicationId
            } 
          });
        } else {
          const error = await response.json();
          console.error('Submission error:', error);
          setErrors({ submit: error.error || 'Failed to submit application' });
        }
      } catch (error) {
        console.error('Network error:', error);
        setErrors({ submit: 'Network error. Please try again.' });
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      linkedin: '',
      portfolio: ''
    });
    setFile(null);
    setErrors({});
    setShowSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm p-8">
        {/* Backend Status Indicator */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1E293B]">Job Application Form</h2>
          <div className="flex items-center gap-2">
            {backendStatus === 'checking' && (
              <div className="flex items-center gap-2 text-sm text-[#64748B]">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3B82F6]"></div>
                Checking backend...
              </div>
            )}
            {backendStatus === 'online' && (
              <div className="flex items-center gap-2 text-sm text-[#059669]">
                <Wifi className="w-4 h-4" />
                Backend connected
              </div>
            )}
            {backendStatus === 'offline' && (
              <div className="flex items-center gap-2 text-sm text-[#DC2626]">
                <WifiOff className="w-4 h-4" />
                Backend offline - Run "npm run dev:full"
              </div>
            )}
          </div>
        </div>
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-[#E8F5E9] border border-[#4CAF50] rounded-lg p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#4CAF50] flex-shrink-0" />
            <p className="text-[#2E7D32]">Your information has been saved successfully!</p>
          </div>
        )}

        {/* Submission Error Message */}
        {errors.submit && (
          <div className="mb-6 bg-[#FEF2F2] border border-[#EF4444] rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
            <p className="text-[#DC2626]">{errors.submit}</p>
          </div>
        )}

        {/* Resume Upload Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-[#1E293B]">Resume Upload</h2>
          
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
              ${isDragging ? 'border-[#3B82F6] bg-[#EFF6FF]' : 'border-[#CBD5E1] bg-[#F8FAFC]'}
              ${errors.file ? 'border-[#EF4444]' : ''}
              hover:border-[#3B82F6] hover:bg-[#EFF6FF]
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            {!file ? (
              <>
                <Upload className="w-12 h-12 text-[#94A3B8] mx-auto mb-4" />
                <p className="text-[#475569] mb-2">
                  Drag & drop or click to upload
                </p>
                <p className="text-sm text-[#94A3B8]">
                  Only PDF, DOCX (Max 2MB)
                </p>
              </>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-[#3B82F6]" />
                <div className="flex-1 text-left">
                  <p className="text-[#1E293B]">{file.name}</p>
                  <p className="text-sm text-[#94A3B8]">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            )}
          </div>

          {file && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="mt-3 text-sm text-[#EF4444] hover:text-[#DC2626] flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Remove file
            </button>
          )}

          {errors.file && (
            <div className="mt-2 flex items-center gap-2 text-[#EF4444] text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.file}</span>
            </div>
          )}
        </div>

        {/* Contact Details Section */}
        <div className="mb-8">
          <h2 className="mb-6 text-[#1E293B]">Contact Details</h2>
          
          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block mb-2 text-[#475569]">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`
                  w-full px-4 py-3 bg-[#F8FAFC] border rounded-lg outline-none
                  transition-colors
                  ${errors.fullName ? 'border-[#EF4444]' : 'border-[#E2E8F0]'}
                  focus:border-[#3B82F6] focus:bg-white
                `}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-2 text-sm text-[#EF4444] flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-2 text-[#475569]">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`
                  w-full px-4 py-3 bg-[#F8FAFC] border rounded-lg outline-none
                  transition-colors
                  ${errors.email ? 'border-[#EF4444]' : 'border-[#E2E8F0]'}
                  focus:border-[#3B82F6] focus:bg-white
                `}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-[#EF4444] flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block mb-2 text-[#475569]">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`
                  w-full px-4 py-3 bg-[#F8FAFC] border rounded-lg outline-none
                  transition-colors
                  ${errors.phone ? 'border-[#EF4444]' : 'border-[#E2E8F0]'}
                  focus:border-[#3B82F6] focus:bg-white
                `}
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-[#EF4444] flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* LinkedIn */}
            <div>
              <label htmlFor="linkedin" className="block mb-2 text-[#475569]">
                LinkedIn URL <span className="text-[#94A3B8]">(optional)</span>
              </label>
              <input
                id="linkedin"
                type="url"
                value={formData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                className={`
                  w-full px-4 py-3 bg-[#F8FAFC] border rounded-lg outline-none
                  transition-colors
                  ${errors.linkedin ? 'border-[#EF4444]' : 'border-[#E2E8F0]'}
                  focus:border-[#3B82F6] focus:bg-white
                `}
                placeholder="https://linkedin.com/in/yourprofile"
              />
              {errors.linkedin && (
                <p className="mt-2 text-sm text-[#EF4444] flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.linkedin}
                </p>
              )}
            </div>

            {/* Portfolio */}
            <div>
              <label htmlFor="portfolio" className="block mb-2 text-[#475569]">
                Portfolio URL <span className="text-[#94A3B8]">(optional)</span>
              </label>
              <input
                id="portfolio"
                type="url"
                value={formData.portfolio}
                onChange={(e) => handleInputChange('portfolio', e.target.value)}
                className={`
                  w-full px-4 py-3 bg-[#F8FAFC] border rounded-lg outline-none
                  transition-colors
                  ${errors.portfolio ? 'border-[#EF4444]' : 'border-[#E2E8F0]'}
                  focus:border-[#3B82F6] focus:bg-white
                `}
                placeholder="https://yourportfolio.com"
              />
              {errors.portfolio && (
                <p className="mt-2 text-sm text-[#EF4444] flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.portfolio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={backendStatus !== 'online'}
            className="
              flex-1 px-6 py-3 bg-[#3B82F6] text-white rounded-lg
              hover:bg-[#2563EB] active:bg-[#1D4ED8]
              transition-colors
              disabled:bg-[#9CA3AF] disabled:cursor-not-allowed
            "
          >
            {backendStatus === 'online' ? 'Save & Continue' : 
             backendStatus === 'checking' ? 'Connecting...' : 'Backend Offline'}
          </button>
          <button
            onClick={handleCancel}
            className="
              px-6 py-3 bg-white text-[#475569] rounded-lg border-2 border-[#CBD5E1]
              hover:bg-[#F8FAFC] hover:border-[#94A3B8]
              transition-colors
            "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
