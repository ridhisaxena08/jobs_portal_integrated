const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const User = require('../models/User');
const Employee = require('../models/Employee');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const db = require('../database');

const getMongoUserId = (req) => {
  const userId = String(req.user?.id || '');
  return mongoose.Types.ObjectId.isValid(userId) ? userId : null;
};

// HR Dashboard Data
const getHRDashboard = async (req, res) => {
  try {
    const employerId = getMongoUserId(req);
    if (!employerId) {
      const postedBy = req.user?.id ?? null;
      const { jobs, pagination } = await db.getJobsSqlite({ page: 1, limit: 5, postedBy });
      const { jobs: allJobs } = await db.getJobsSqlite({ page: 1, limit: 200, postedBy });

      const now = new Date();
      const upcomingDeadlines = allJobs
        .map((j) => {
          const d = j.deadline ? new Date(j.deadline) : null;
          if (!d || Number.isNaN(d.getTime())) return null;
          const daysLeft = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (daysLeft < 0) return null;
          return {
            jobTitle: j.title,
            date: d.toISOString(),
            daysLeft,
            applicants: j.applicants || 0
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.daysLeft - b.daysLeft)
        .slice(0, 5);

      return res.json({
        success: true,
        data: {
          totalJobs: pagination.total,
          totalEmployees: 0,
          totalApplications: 0,
          shortlistedCandidates: 0,
          recentApplications: [],
          upcomingDeadlines,
          recentJobs: jobs
        }
      });
    }
    
    // Get all jobs posted by this employer
    const myJobs = await Job.find({ postedBy: employerId });
    
    // Get total employees hired
    const totalEmployees = await Employee.countDocuments({ employerId });
    
    // Get all applications for employer's jobs
    const jobIds = myJobs.map(job => job._id);
    const applications = await JobApplication.find({ jobId: { $in: jobIds } })
      .populate('userId', 'fullName email')
      .populate('jobId', 'title company')
      .sort({ createdAt: -1 });
    
    // Calculate stats
    const stats = {
      totalJobs: myJobs.length,
      totalEmployees,
      totalApplications: applications.length,
      shortlistedCandidates: applications.filter(app => app.status === 'shortlisted').length,
      recentApplications: applications.slice(0, 5).map(app => ({
        id: app._id,
        fullName: app.fullName,
        email: app.email,
        jobTitle: app.jobId?.title || 'N/A',
        company: app.jobId?.company || 'N/A',
        status: app.status,
        appliedAt: app.createdAt
      })),
      upcomingDeadlines: myJobs
        .filter(job => job.deadline && job.deadline > new Date())
        .map(job => ({
          id: job._id,
          title: job.title,
          deadline: job.deadline,
          daysLeft: Math.ceil((job.deadline - new Date()) / (1000 * 60 * 60 * 24)),
          applicants: job.applicants || 0
        }))
        .sort((a, b) => a.daysLeft - b.daysLeft)
        .slice(0, 5)
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('HR Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch HR dashboard data'
    });
  }
};

// Job Seeker Dashboard Data
const getJobSeekerDashboard = async (req, res) => {
  try {
    const userId = getMongoUserId(req);
    if (!userId) {
      return res.json({
        success: true,
        data: {
          totalApplications: 0,
          shortlistedApplications: 0,
          savedJobs: 0,
          profileViews: 0,
          recentApplications: [],
          recommendedJobs: []
        }
      });
    }
    
    // Get user's applications
    const applications = await JobApplication.find({ userId })
      .populate('jobId', 'title company location salary type')
      .sort({ createdAt: -1 });
    
    // Get recommended jobs (simple recommendation based on skills)
    const user = await User.findById(userId);
    const userSkills = user.profile?.skills || [];
    
    const recommendedJobs = await Job.find({
      status: 'active',
      deadline: { $gt: new Date() },
      $or: [
        { skills: { $in: userSkills } },
        { category: { $in: userSkills } }
      ]
    })
    .populate('postedBy', 'company.name')
    .sort({ postedAt: -1 })
    .limit(10)
    .map(job => ({
      ...job.toObject(),
      matchScore: Math.floor(Math.random() * 30) + 70 // Simple mock scoring
    }));
    
    // Calculate stats
    const stats = {
      totalApplications: applications.length,
      shortlistedApplications: applications.filter(app => app.status === 'shortlisted').length,
      savedJobs: 0, // TODO: Implement saved jobs functionality
      profileViews: Math.floor(Math.random() * 50) + 10, // Mock data
      recentApplications: applications.slice(0, 5).map(app => ({
        id: app._id,
        jobTitle: app.jobId?.title || 'N/A',
        company: app.jobId?.company || 'N/A',
        status: app.status,
        appliedAt: app.createdAt
      })),
      recommendedJobs: recommendedJobs.slice(0, 3)
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Job Seeker Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job seeker dashboard data'
    });
  }
};

// Get Notifications
const getNotifications = async (req, res) => {
  try {
    const userId = getMongoUserId(req);
    if (!userId) {
      return res.json({
        success: true,
        data: []
      });
    }
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
};

// Mark Notification as Read
const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = getMongoUserId(req);
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
};

// Create Notification (helper function)
const createNotification = async (userId, notificationData) => {
  try {
    const notification = new Notification({
      userId,
      ...notificationData
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

module.exports = {
  getHRDashboard,
  getJobSeekerDashboard,
  getNotifications,
  markNotificationAsRead,
  createNotification
};
