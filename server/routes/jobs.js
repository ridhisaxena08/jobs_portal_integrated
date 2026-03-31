const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/sqliteAuth');
const {
  getJobs,
  getJobById,
  getMyJobs,
  createJob,
  updateJob,
  deleteJob,
  getJobStats
} = require('../controllers/jobController');

// Public routes
router.get('/', getJobs);
router.get('/stats', getJobStats);
router.get('/my-jobs', protect, getMyJobs);
router.get('/:id', getJobById);

// Protected routes (would need auth middleware for production)
router.post('/', protect, createJob);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

module.exports = router;
