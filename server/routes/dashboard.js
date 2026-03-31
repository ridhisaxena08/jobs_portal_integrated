const express = require('express');
const { protect } = require('../middleware/sqliteAuth');
const {
  getHRDashboard,
  getJobSeekerDashboard,
  getNotifications,
  markNotificationAsRead
} = require('../controllers/dashboardController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Dashboard routes
router.get('/hr', getHRDashboard);
router.get('/job-seeker', getJobSeekerDashboard);

// Notification routes
router.get('/notifications', getNotifications);
router.put('/notifications/:notificationId/read', markNotificationAsRead);

module.exports = router;
