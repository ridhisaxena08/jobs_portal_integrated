const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const User = require('../models/User');
const Employee = require('../models/Employee');
const { createNotification } = require('./dashboardController');

// Get Applicants for HR
const getApplicants = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { status, jobId, page = 1, limit = 10 } = req.query;
    
    // Get all jobs posted by this employer
    const myJobs = await Job.find({ postedBy: employerId });
    const jobIds = myJobs.map(job => job._id);
    
    // Build filter
    const filter = { jobId: { $in: jobIds } };
    if (status) filter.status = status;
    if (jobId) filter.jobId = jobId;
    
    const applicants = await JobApplication.find(filter)
      .populate('userId', 'fullName email phone')
      .populate('jobId', 'title company location salary type')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await JobApplication.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        applicants,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get applicants error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applicants'
    });
  }
};

// Get Applicant Details
const getApplicantById = async (req, res) => {
  try {
    const { applicantId } = req.params;
    const employerId = req.user.id;
    
    // Verify this application is for employer's job
    const application = await JobApplication.findById(applicantId)
      .populate('userId', 'fullName email phone')
      .populate('jobId', 'title company location salary type postedBy');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    if (application.jobId.postedBy.toString() !== employerId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Get user profile details
    const user = await User.findById(application.userId);
    
    res.json({
      success: true,
      data: {
        application,
        userProfile: user
      }
    });
  } catch (error) {
    console.error('Get applicant details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applicant details'
    });
  }
};

// Update Application Status
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const employerId = req.user.id;
    
    const application = await JobApplication.findById(applicationId)
      .populate('jobId', 'title postedBy')
      .populate('userId', 'fullName email');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    if (application.jobId.postedBy.toString() !== employerId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const oldStatus = application.status;
    application.status = status;
    await application.save();
    
    // Create notification for applicant
    await createNotification(application.userId, {
      title: `Application Status Updated`,
      message: `Your application for ${application.jobId.title} has been ${status}`,
      type: 'application_status',
      category: status === 'shortlisted' ? 'success' : 'info',
      relatedEntity: {
        entityType: 'application',
        entityId: application._id
      }
    });
    
    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status'
    });
  }
};

// Shortlist Candidate
const shortlistCandidate = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const employerId = req.user.id;
    
    const application = await JobApplication.findById(applicationId)
      .populate('jobId', 'title postedBy')
      .populate('userId', 'fullName email');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    if (application.jobId.postedBy.toString() !== employerId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    application.status = 'shortlisted';
    await application.save();
    
    // Create notification for applicant
    await createNotification(application.userId, {
      title: 'Congratulations! You have been shortlisted',
      message: `Your application for ${application.jobId.title} has been shortlisted for further consideration.`,
      type: 'candidate_shortlisted',
      category: 'success',
      relatedEntity: {
        entityType: 'application',
        entityId: application._id
      }
    });
    
    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Shortlist candidate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to shortlist candidate'
    });
  }
};

// Reject Candidate
const rejectCandidate = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const employerId = req.user.id;
    
    const application = await JobApplication.findById(applicationId)
      .populate('jobId', 'title postedBy')
      .populate('userId', 'fullName email');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    if (application.jobId.postedBy.toString() !== employerId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    application.status = 'rejected';
    await application.save();
    
    // Create notification for applicant
    await createNotification(application.userId, {
      title: 'Application Update',
      message: `Your application for ${application.jobId.title} was not selected at this time.`,
      type: 'application_status',
      category: 'info',
      relatedEntity: {
        entityType: 'application',
        entityId: application._id
      }
    });
    
    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Reject candidate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject candidate'
    });
  }
};

// Get Employees
const getEmployees = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { page = 1, limit = 10, status, department } = req.query;
    
    // Build filter
    const filter = { employerId };
    if (status) filter.status = status;
    if (department) filter.department = department;
    
    const employees = await Employee.find(filter)
      .populate('userId', 'fullName email phone')
      .populate('jobId', 'title department')
      .sort({ joiningDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Employee.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        employees,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees'
    });
  }
};

// Hire Candidate (Convert application to employee)
const hireCandidate = async (req, res) => {
  try {
    const { applicationId, position, department, salary, currency, joiningDate, employmentType } = req.body;
    const employerId = req.user.id;
    
    const application = await JobApplication.findById(applicationId)
      .populate('jobId', 'title postedBy')
      .populate('userId', 'fullName email phone');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    if (application.jobId.postedBy.toString() !== employerId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Check if already hired
    const existingEmployee = await Employee.findOne({ 
      userId: application.userId, 
      employerId 
    });
    
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Candidate is already an employee'
      });
    }
    
    // Create employee record
    const employee = new Employee({
      userId: application.userId,
      employerId,
      jobId: application.jobId._id,
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      position,
      department,
      employmentType,
      salary,
      currency: currency || 'USD',
      joiningDate: new Date(joiningDate),
      status: 'active'
    });
    
    await employee.save();
    
    // Update application status
    application.status = 'offered';
    await application.save();
    
    // Create notification for user
    await createNotification(application.userId, {
      title: 'Congratulations! You have been hired!',
      message: `You have been hired for the ${position} position. Welcome to the team!`,
      type: 'offer_extended',
      category: 'success',
      relatedEntity: {
        entityType: 'employee',
        entityId: employee._id
      }
    });
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Hire candidate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to hire candidate'
    });
  }
};

// Update Employee
const updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employerId = req.user.id;
    const updateData = req.body;
    
    const employee = await Employee.findOne({ _id: employeeId, employerId });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    Object.assign(employee, updateData);
    await employee.save();
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee'
    });
  }
};

// Terminate Employee
const terminateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employerId = req.user.id;
    
    const employee = await Employee.findOne({ _id: employeeId, employerId });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    employee.status = 'terminated';
    await employee.save();
    
    // Create notification for employee
    await createNotification(employee.userId, {
      title: 'Employment Status Update',
      message: 'Your employment status has been updated.',
      type: 'system',
      category: 'warning',
      relatedEntity: {
        entityType: 'employee',
        entityId: employee._id
      }
    });
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Terminate employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to terminate employee'
    });
  }
};

module.exports = {
  getApplicants,
  getApplicantById,
  updateApplicationStatus,
  shortlistCandidate,
  rejectCandidate,
  getEmployees,
  hireCandidate,
  updateEmployee,
  terminateEmployee
};
