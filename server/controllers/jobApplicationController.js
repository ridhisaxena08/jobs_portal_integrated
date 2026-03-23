const JobApplication = require('../models/JobApplication');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed'), false);
    }
  }
});

// Send Response Helper
const sendResponse = (res, statusCode, success, message, data = null) => {
  res.status(statusCode).json({
    success,
    message,
    data
  });
};

// @desc    Get smart application form for a job
// @route   GET /api/job-applications/form/:jobId
// @access  Private
const getApplicationForm = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    // Get user data for pre-filling
    const user = await User.findById(userId);
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // Check if user has already applied to this job
    const existingApplication = await JobApplication.findOne({ userId, jobId });
    
    const formData = {
      // Personal Information
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.profile?.phone || '',
      
      // Professional Information
      experience: user.profile?.experience || '',
      expectedSalary: user.profile?.expectedSalary || '',
      availability: user.profile?.availability || '',
      
      // Application Questions
      questions: [
        {
          id: 'coverLetter',
          type: 'textarea',
          question: 'Why are you interested in this position? (Cover Letter)',
          answer: '',
          required: true
        },
        {
          id: 'relevantExperience',
          type: 'textarea',
          question: 'What relevant experience do you have for this role?',
          answer: '',
          required: true
        },
        {
          id: 'availability',
          type: 'select',
          question: 'When can you start?',
          options: ['Immediate', '2 weeks notice', '1 month notice', 'More than 1 month'],
          answer: user.profile?.availability || '',
          required: true
        },
        {
          id: 'expectedSalary',
          type: 'text',
          question: 'Expected salary range',
          answer: user.profile?.expectedSalary || '',
          required: false
        },
        {
          id: 'noticePeriod',
          type: 'select',
          question: 'Current notice period',
          options: ['Immediate', '2 weeks', '1 month', '2 months', '3 months'],
          answer: '',
          required: true
        }
      ]
    };

    sendResponse(res, 200, true, 'Application form retrieved successfully', {
      jobInfo: {
        jobId,
        hasApplied: !!existingApplication
      },
      userData: {
        fullName: user.fullName,
        email: user.email,
        phone: user.profile?.phone,
        experience: user.profile?.experience,
        expectedSalary: user.profile?.expectedSalary,
        availability: user.profile?.availability
      },
      formData
    });

  } catch (error) {
    console.error('Get application form error:', error);
    sendResponse(res, 500, false, 'Server error while fetching application form');
  }
};

// @desc    Submit job application
// @route   POST /api/job-applications
// @access  Private
const submitApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      jobId,
      jobTitle,
      company,
      location,
      jobType,
      formData,
      resume
    } = req.body;

    // Parse formData if it's a string
    let parsedFormData = formData;
    if (typeof formData === 'string') {
      try {
        parsedFormData = JSON.parse(formData);
      } catch (e) {
        return sendResponse(res, 400, false, 'Invalid form data format');
      }
    }

    // Get user info
    const user = await User.findById(userId);
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // Check if already applied
    const existingApplication = await JobApplication.findOne({ userId, jobId });
    if (existingApplication) {
      return sendResponse(res, 409, false, 'You have already applied to this job');
    }

    // Create application object
    const applicationData = {
      userId,
      jobId,
      jobTitle,
      company,
      location,
      jobType,
      coverLetter: parsedFormData.questions?.find(q => q.id === 'coverLetter')?.answer || '',
      experience: parsedFormData.questions?.find(q => q.id === 'relevantExperience')?.answer || '',
      expectedSalary: parsedFormData.questions?.find(q => q.id === 'expectedSalary')?.answer || '',
      availability: parsedFormData.questions?.find(q => q.id === 'availability')?.answer || '',
      noticePeriod: parsedFormData.questions?.find(q => q.id === 'noticePeriod')?.answer || '',
      formData: parsedFormData,
      source: 'direct',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    // Handle resume upload if present
    if (req.file) {
      applicationData.resumeFilename = req.file.originalname;
      applicationData.resumePath = req.file.path;
    }

    const application = await JobApplication.create(applicationData);

    sendResponse(res, 201, true, 'Application submitted successfully', {
      applicationId: application._id,
      status: application.status
    });

  } catch (error) {
    console.error('Submit application error:', error);
    sendResponse(res, 500, false, 'Server error while submitting application');
  }
};

// @desc    Get user's applications
// @route   GET /api/job-applications/my-applications
// @access  Private
const getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { userId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const applications = await JobApplication.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('jobId', 'title company location');

    const total = await JobApplication.countDocuments(query);

    sendResponse(res, 200, true, 'Applications retrieved successfully', {
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get user applications error:', error);
    sendResponse(res, 500, false, 'Server error while fetching applications');
  }
};

// @desc    Get application by ID
// @route   GET /api/job-applications/:id
// @access  Private
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const application = await JobApplication.findOne({ _id: id, userId })
      .populate('jobId', 'title company location');

    if (!application) {
      return sendResponse(res, 404, false, 'Application not found');
    }

    sendResponse(res, 200, true, 'Application retrieved successfully', application);

  } catch (error) {
    console.error('Get application error:', error);
    sendResponse(res, 500, false, 'Server error while fetching application');
  }
};

// @desc    Update application
// @route   PUT /api/job-applications/:id
// @access  Private
const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { formData } = req.body;

    const application = await JobApplication.findOne({ _id: id, userId });
    if (!application) {
      return sendResponse(res, 404, false, 'Application not found');
    }

    // Parse formData
    let parsedFormData = formData;
    if (typeof formData === 'string') {
      try {
        parsedFormData = JSON.parse(formData);
      } catch (e) {
        return sendResponse(res, 400, false, 'Invalid form data format');
      }
    }

    application.formData = parsedFormData;
    application.updatedAt = new Date();
    await application.save();

    sendResponse(res, 200, true, 'Application updated successfully', application);

  } catch (error) {
    console.error('Update application error:', error);
    sendResponse(res, 500, false, 'Server error while updating application');
  }
};

// @desc    Delete application
// @route   DELETE /api/job-applications/:id
// @access  Private
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const application = await JobApplication.findOne({ _id: id, userId });
    if (!application) {
      return sendResponse(res, 404, false, 'Application not found');
    }

    await JobApplication.findByIdAndDelete(id);

    sendResponse(res, 200, true, 'Application deleted successfully');

  } catch (error) {
    console.error('Delete application error:', error);
    sendResponse(res, 500, false, 'Server error while deleting application');
  }
};

module.exports = {
  getApplicationForm,
  submitApplication,
  getUserApplications,
  getApplicationById,
  updateApplication,
  deleteApplication
};
