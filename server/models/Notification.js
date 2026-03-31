const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Recipient
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Notification Content
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  
  // Type and Category
  type: {
    type: String,
    enum: [
      'job_application',
      'application_status',
      'job_posted',
      'candidate_shortlisted',
      'interview_scheduled',
      'offer_extended',
      'system',
      'reminder'
    ],
    required: true
  },
  category: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  
  // Related Entities
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['job', 'application', 'user', 'employee']
    },
    entityId: mongoose.Schema.Types.ObjectId
  },
  
  // Action Links
  actionUrl: String,
  actionText: String,
  
  // Status
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  
  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Delivery
  channels: {
    inApp: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    push: { type: Boolean, default: false }
  },
  
  // Metadata
  metadata: {
    type: Map,
    of: String
  },
  
  // Expiration
  expiresAt: Date,
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Auto-mark as expired notifications
notificationSchema.pre(/^find/, function(next) {
  this.find({
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  });
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);
