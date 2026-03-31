const mongoose = require('mongoose');



const jobSchema = new mongoose.Schema({

  // Basic Job Information

  title: {

    type: String,

    required: true,

    trim: true

  },

  company: {

    type: String,

    required: true,

    trim: true

  },

  location: {

    city: {

      type: String,

      required: true,

      trim: true

    },

    state: {

      type: String,

      required: true,

      trim: true

    },

    country: {

      type: String,

      required: true,

      trim: true

    }

  },

  type: {

    type: String,

    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],

    required: true

  },

  category: {

    type: String,

    enum: ['technology', 'design', 'marketing', 'sales', 'finance', 'healthcare', 'education', 'other'],

    required: true

  },

  

  // Job Details

  description: {

    type: String,

    required: true,

    trim: true

  },

  requirements: [{

    type: String,

    trim: true

  }],

  responsibilities: [{

    type: String,

    trim: true

  }],

  skills: [{

    type: String,

    trim: true

  }],

  

  // Compensation

  salary: {

    min: {

      type: Number,

      required: false

    },

    max: {

      type: Number,

      required: false

    },

    currency: {

      type: String,

      enum: ['USD', 'EUR', 'GBP', 'INR'],

      default: 'USD'

    }

  },

  

  // Application Details

  deadline: {

    type: Date,

    required: true

  },

  postedAt: {

    type: Date,

    default: Date.now

  },

  applicants: {

    type: Number,

    default: 0

  },

  status: {

    type: String,

    enum: ['active', 'closed', 'draft'],

    default: 'active'

  },

  

  // Company Information

  companyLogo: {

    type: String,

    required: false

  },

  companyWebsite: {

    type: String,

    required: false

  },

  companySize: {

    type: String,

    enum: ['1-10', '11-50', '51-200', '201-500', '500+', 'startup', 'enterprise'],

    required: false

  },

  

  // Additional Info

  tags: [{

    type: String,

    trim: true

  }],

  benefits: [{

    type: String,

    trim: true

  }],

  workMode: {

    type: String,

    enum: ['onsite', 'remote', 'hybrid'],

    default: 'onsite'

  },

  experienceLevel: {

    type: String,

    enum: ['entry', 'mid', 'senior', 'lead', 'executive'],

    required: true

  },

  

  // Metadata

  featured: {

    type: Boolean,

    default: false

  },

  urgent: {

    type: Boolean,

    default: false

  }

}, {

  timestamps: true

});



// Indexes for performance

jobSchema.index({ title: 'text', company: 'text', description: 'text' });

jobSchema.index({ 'location.geometry': '2dsphere' });

jobSchema.index({ category: 1, type: 1 });

jobSchema.index({ postedAt: -1 });

jobSchema.index({ status: 1, deadline: 1 });

jobSchema.index({ skills: 1 });



module.exports = mongoose.model('Job', jobSchema);

