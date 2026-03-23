const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobStats
} = require('../controllers/jobController');

// Public routes
router.get('/', getJobs);
router.get('/stats', getJobStats);
router.get('/:id', getJobById);

// Protected routes (would need auth middleware for production)
router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

module.exports = router;
