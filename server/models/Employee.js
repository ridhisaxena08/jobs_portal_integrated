const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  // Basic Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  
  // Employee Details
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
  position: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  
  // Employment Details
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'GBP', 'INR'],
    default: 'USD'
  },
  
  // Important Dates
  joiningDate: {
    type: Date,
    required: true
  },
  probationEndDate: Date,
  contractEndDate: Date,
  
  // Work Details
  workMode: {
    type: String,
    enum: ['onsite', 'remote', 'hybrid'],
    default: 'onsite'
  },
  workLocation: {
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  reportingManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'probation', 'notice', 'terminated', 'resigned'],
    default: 'active'
  },
  
  // Documents
  documents: [{
    name: String,
    type: {
      type: String,
      enum: ['resume', 'contract', 'id-proof', 'address-proof', 'other']
    },
    filename: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Emergency Contact
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  
  // Notes
  notes: String,
  
  // Metadata
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

// Indexes for performance
employeeSchema.index({ userId: 1 });
employeeSchema.index({ employerId: 1 });
employeeSchema.index({ jobId: 1 });
employeeSchema.index({ status: 1 });
employeeSchema.index({ joiningDate: -1 });
employeeSchema.index({ department: 1 });

module.exports = mongoose.model('Employee', employeeSchema);
