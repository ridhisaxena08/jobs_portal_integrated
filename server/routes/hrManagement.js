const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getApplicants,
  getApplicantById,
  updateApplicationStatus,
  shortlistCandidate,
  rejectCandidate,
  getEmployees,
  hireCandidate,
  updateEmployee,
  terminateEmployee
} = require('../controllers/hrManagementController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Applicant management routes
router.get('/applicants', getApplicants);
router.get('/applicants/:applicantId', getApplicantById);
router.put('/job-applications/:applicationId/status', updateApplicationStatus);
router.put('/job-applications/:applicationId/shortlist', shortlistCandidate);
router.put('/job-applications/:applicationId/reject', rejectCandidate);

// Employee management routes
router.get('/employees', getEmployees);
router.post('/employees', hireCandidate);
router.put('/employees/:employeeId', updateEmployee);
router.delete('/employees/:employeeId', terminateEmployee);

module.exports = router;
