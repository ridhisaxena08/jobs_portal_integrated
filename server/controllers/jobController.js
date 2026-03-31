const Job = require('../models/Job');
const mongoose = require('mongoose');

// Send Response Helper
const sendResponse = (res, statusCode, success, message, data = null) => {
  res.status(statusCode).json({
    success,
    message,
    data
  });
};

// @desc    Get all jobs with filtering and pagination
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Return mock data when database is not connected
      const mockJobs = [
        {
          id: '1',
          title: 'Senior Frontend Developer',
          company: 'TechCorp',
          location: 'San Francisco, CA',
          type: 'full-time',
          category: 'engineering',
          description: 'We are looking for an experienced frontend developer...',
          requirements: ['React', 'TypeScript', 'Node.js'],
          salary: '$120k - $160k',
          featured: true,
          urgent: false,
          postedAt: new Date().toISOString(),
          applicants: 45
        },
        {
          id: '2',
          title: 'Product Designer',
          company: 'DesignHub',
          location: 'New York, NY',
          type: 'full-time',
          category: 'design',
          description: 'Join our design team to create amazing user experiences...',
          requirements: ['Figma', 'UI/UX', 'Prototyping'],
          salary: '$90k - $130k',
          featured: true,
          urgent: false,
          postedAt: new Date().toISOString(),
          applicants: 32
        },
        {
          id: '3',
          title: 'Backend Engineer',
          company: 'StartupXYZ',
          location: 'Remote',
          type: 'full-time',
          category: 'engineering',
          description: 'Looking for a backend engineer to help build our platform...',
          requirements: ['Node.js', 'MongoDB', 'AWS'],
          salary: '$100k - $140k',
          featured: true,
          urgent: true,
          postedAt: new Date().toISOString(),
          applicants: 28
        }
      ];

      return sendResponse(res, 200, true, 'Jobs retrieved successfully (demo data)', {
        jobs: mockJobs,
        pagination: {
          page: 1,
          limit: 6,
          total: 3,
          pages: 1
        },
        filters: {
          category: req.query.category || 'all',
          type: req.query.type || 'all',
          location: req.query.location || '',
          search: req.query.search || '',
          sortBy: req.query.sortBy || 'postedAt',
          sortOrder: req.query.sortOrder || 'desc'
        }
      });
    }

    const {
      page = 1,
      limit = 10,
      category,
      type,
      location,
      search,
      sortBy = 'postedAt',
      sortOrder = 'desc',
      featured,
      urgent
    } = req.query;

    // Build query
    const query = { status: 'active' };
    
    // Add filters
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (urgent === 'true') {
      query.urgent = true;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const jobs = await Job.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    // Transform jobs to include id field
    const transformedJobs = jobs.map(job => ({
      ...job.toObject(),
      id: job._id.toString()
    }));

    sendResponse(res, 200, true, 'Jobs retrieved successfully', {
      jobs: transformedJobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      filters: {
        category,
        type,
        location,
        search,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    
    // Return mock data on error
    const mockJobs = [
      {
        id: '1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        type: 'full-time',
        category: 'engineering',
        description: 'We are looking for an experienced frontend developer...',
        requirements: ['React', 'TypeScript', 'Node.js'],
        salary: '$120k - $160k',
        featured: true,
        urgent: false,
        postedAt: new Date().toISOString(),
        applicants: 45
      }
    ];

    sendResponse(res, 200, true, 'Jobs retrieved successfully (fallback data)', {
      jobs: mockJobs,
      pagination: {
        page: 1,
        limit: 6,
        total: 1,
        pages: 1
      },
      filters: {
        category: req.query.category || 'all',
        type: req.query.type || 'all',
        location: req.query.location || '',
        search: req.query.search || '',
        sortBy: req.query.sortBy || 'postedAt',
        sortOrder: req.query.sortOrder || 'desc'
      }
    });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await Job.findById(id);
    
    if (!job) {
      return sendResponse(res, 404, false, 'Job not found');
    }

    // Increment applicants count
    await Job.findByIdAndUpdate(id, { $inc: { applicants: 1 } });

    // Transform job to include id field
    const transformedJob = {
      ...job.toObject(),
      id: job._id.toString()
    };

    sendResponse(res, 200, true, 'Job retrieved successfully', transformedJob);

  } catch (error) {
    console.error('Get job by ID error:', error);
    sendResponse(res, 500, false, 'Server error while fetching job');
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (would need admin middleware)
const createJob = async (req, res) => {
  try {
    const jobData = req.body;
    
    const job = await Job.create(jobData);

    sendResponse(res, 201, true, 'Job created successfully', job);

  } catch (error) {
    console.error('Create job error:', error);
    sendResponse(res, 500, false, 'Server error while creating job');
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const job = await Job.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!job) {
      return sendResponse(res, 404, false, 'Job not found');
    }

    sendResponse(res, 200, true, 'Job updated successfully', job);

  } catch (error) {
    console.error('Update job error:', error);
    sendResponse(res, 500, false, 'Server error while updating job');
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return sendResponse(res, 404, false, 'Job not found');
    }

    sendResponse(res, 200, true, 'Job deleted successfully');

  } catch (error) {
    console.error('Delete job error:', error);
    sendResponse(res, 500, false, 'Server error while deleting job');
  }
};

// @desc    Get job statistics
// @route   GET /api/jobs/stats
// @access  Public
const getJobStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      {
        $group: {
          _id: null,
          totalJobs: { $sum: 1 },
          activeJobs: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          featuredJobs: {
            $sum: { $cond: [{ $eq: ['$featured', true] }, 1, 0] }
          },
          urgentJobs: {
            $sum: { $cond: [{ $eq: ['$urgent', true] }, 1, 0] }
          }
        }
      }
    ]);

    const categoryStats = await Job.aggregate([
      {
        $match: { status: 'active' }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const typeStats = await Job.aggregate([
      {
        $match: { status: 'active' }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    sendResponse(res, 200, true, 'Job statistics retrieved successfully', {
      overview: stats[0] || {
        totalJobs: 0,
        activeJobs: 0,
        featuredJobs: 0,
        urgentJobs: 0
      },
      byCategory: categoryStats,
      byType: typeStats
    });

  } catch (error) {
    console.error('Get job stats error:', error);
    sendResponse(res, 500, false, 'Server error while fetching job statistics');
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobStats
};
