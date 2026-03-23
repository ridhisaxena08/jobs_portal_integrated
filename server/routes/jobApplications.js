const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
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

const {
  getApplicationForm,
  submitApplication,
  getUserApplications,
  getApplicationById,
  updateApplication,
  deleteApplication
} = require('../controllers/jobApplicationController');

// Get smart application form for a job
router.get('/form/:jobId', protect, getApplicationForm);

// Submit job application with file upload
router.post('/', protect, upload.single('resume'), submitApplication);

// Get user's applications
router.get('/my-applications', protect, getUserApplications);

// Get application by ID
router.get('/:id', protect, getApplicationById);

// Update application
router.put('/:id', protect, updateApplication);

// Delete application
router.delete('/:id', protect, deleteApplication);

module.exports = router;
