const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  // User Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  
  // Job Information
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true
  },
  
  // Application Details
  coverLetter: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  expectedSalary: {
    type: String,
    required: false
  },
  availability: {
    type: String,
    required: true
  },
  noticePeriod: {
    type: String,
    required: true
  },
  
  // Resume
  resumeFilename: {
    type: String,
    required: false
  },
  resumePath: {
    type: String,
    required: false
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'interview', 'rejected', 'offered', 'withdrawn'],
    default: 'pending'
  },
  
  // Smart Form Data (what user was asked)
  formData: {
    type: Map,
    of: [{
      question: String,
      answer: String,
      type: {
        type: String,
        enum: ['text', 'email', 'phone', 'number', 'date', 'file', 'select']
      }
    }]
  },
  
  // Metadata
  source: {
    type: String,
    enum: ['direct', 'linkedin', 'indeed', 'monster', 'company-website'],
    default: 'direct'
  },
  ipAddress: String,
  userAgent: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for performance
jobApplicationSchema.index({ userId: 1, status: 1 });
jobApplicationSchema.index({ jobId: 1, status: 1 });
jobApplicationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
