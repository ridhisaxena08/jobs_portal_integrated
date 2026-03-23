const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { fileURLToPath } = require('url');
const { dbOperations } = require('./database.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication middleware
const authenticateToken = (req: any, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp
    const timestamp = Date.now();
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    cb(null, `${timestamp}-${baseName}${extension}`);
  }
});

// File filter for allowed file types
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedDocumentTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const allowedTypes = [...allowedImageTypes, ...allowedDocumentTypes];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed types: Images (JPEG, PNG, GIF, WebP) and Documents (PDF, DOCX).'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
});

// API Routes

// Submit application
app.post('/api/applications', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    const { fullName, email, phone, linkedin, portfolio } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check for email duplication
    const emailExists = await dbOperations.checkEmailExists(email);
    if (emailExists) {
      return res.status(409).json({ error: 'An application with this email already exists' });
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Insert application into database
    const result = await dbOperations.insertApplication({
      full_name: fullName,
      email: email,
      phone: phone,
      linkedin: linkedin || null,
      portfolio: portfolio || null,
      resume_filename: req.file.originalname,
      resume_path: req.file.path
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: result.lastID
    });

  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all applications
app.get('/api/applications', async (req, res) => {
  try {
    const applications = await dbOperations.getAllApplications();
    res.json({ success: true, data: applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get application by ID
app.get('/api/applications/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid application ID' });
    }

    const application = await dbOperations.getApplicationById(id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ success: true, data: application });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update application
app.put('/api/applications/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid application ID' });
    }

    const { fullName, email, phone, linkedin, portfolio } = req.body;
    const updateData: any = {};

    if (fullName) updateData.full_name = fullName;
    if (email) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      
      // Check for email duplication (excluding current record)
      const currentApp = await dbOperations.getApplicationById(id);
      if (currentApp && currentApp.email !== email) {
        const emailExists = await dbOperations.checkEmailExists(email);
        if (emailExists) {
          return res.status(409).json({ error: 'An application with this email already exists' });
        }
      }
      
      updateData.email = email;
    }
    if (phone) {
      // Validate phone format
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
      }
      updateData.phone = phone;
    }
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (portfolio !== undefined) updateData.portfolio = portfolio;

    const result = await dbOperations.updateApplication(id, updateData);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ success: true, message: 'Application updated successfully' });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete application
app.delete('/api/applications/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid application ID' });
    }

    // Get application to find resume file
    const application = await dbOperations.getApplicationById(id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Delete resume file if it exists
    if (application.resume_path && fs.existsSync(application.resume_path)) {
      fs.unlinkSync(application.resume_path);
    }

    // Delete application from database
    const result = await dbOperations.deleteApplication(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get applications statistics
app.get('/api/stats', async (req, res) => {
  try {
    const count = await dbOperations.getApplicationsCount();
    res.json({ 
      success: true, 
      data: { 
        totalApplications: count.count,
        serverTime: new Date().toISOString()
      } 
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve uploaded files
app.get('/api/resume/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Authentication Routes

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Validate required fields
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Email, password, and full name are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await dbOperations.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await dbOperations.createUser({
      email,
      password: hashedPassword,
      full_name: fullName
    });

    // Create empty profile for the user
    await dbOperations.createProfile({ user_id: result.lastID });

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.lastID, email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: result.lastID,
          email,
          fullName
        }
      }
    });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await dbOperations.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name
        }
      }
    });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
  try {
    const profile = await dbOperations.getProfileByUserId(req.user.userId);
    
    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Format the response
    const formattedProfile = {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      profile: profile.user_id ? {
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
        skills: profile.skills ? profile.skills.split(',').map((s: string) => s.trim()) : [],
        experience: profile.experience,
        education: profile.education,
        linkedin: profile.linkedin,
        github: profile.github,
        portfolio: profile.portfolio,
        profilePicture: profile.profile_picture,
        resumeFilename: profile.resume_filename,
        resumePath: profile.resume_path
      } : null
    };

    res.json({
      success: true,
      data: formattedProfile
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/auth/me', authenticateToken, async (req: any, res) => {
  try {
    const { fullName, phone, location, bio, skills, experience, education, linkedin, github, portfolio } = req.body;
    const userId = req.user.userId;

    // Update user basic info if provided
    if (fullName) {
      await dbOperations.updateUser(userId, { full_name: fullName });
    }

    // Update profile information
    const profileData: any = {};
    if (phone !== undefined) profileData.phone = phone;
    if (location !== undefined) profileData.location = location;
    if (bio !== undefined) profileData.bio = bio;
    if (skills !== undefined) profileData.skills = skills;
    if (experience !== undefined) profileData.experience = experience;
    if (education !== undefined) profileData.education = education;
    if (linkedin !== undefined) profileData.linkedin = linkedin;
    if (github !== undefined) profileData.github = github;
    if (portfolio !== undefined) profileData.portfolio = portfolio;

    await dbOperations.upsertProfile(userId, profileData);

    // Get updated profile
    const updatedProfile = await dbOperations.getProfileByUserId(userId);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedProfile.id,
        email: updatedProfile.email,
        fullName: updatedProfile.full_name,
        profile: {
          phone: updatedProfile.phone,
          location: updatedProfile.location,
          bio: updatedProfile.bio,
          skills: updatedProfile.skills ? updatedProfile.skills.split(',').map((s: string) => s.trim()) : [],
          experience: updatedProfile.experience,
          education: updatedProfile.education,
          linkedin: updatedProfile.linkedin,
          github: updatedProfile.github,
          portfolio: updatedProfile.portfolio,
          profilePicture: updatedProfile.profile_picture,
          resumeFilename: updatedProfile.resume_filename,
          resumePath: updatedProfile.resume_path
        }
      }
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload profile picture
app.post('/api/auth/upload-profile-picture', authenticateToken, upload.single('profilePicture'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Profile picture file is required' });
    }

    const userId = req.user.userId;
    const profilePicturePath = `/uploads/${req.file.filename}`;

    // Update profile with new picture
    await dbOperations.upsertProfile(userId, {
      profile_picture: profilePicturePath
    });

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        profilePicture: profilePicturePath
      }
    });

  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload resume to profile
app.post('/api/auth/upload-resume', authenticateToken, upload.single('resume'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    const userId = req.user.userId;
    const resumePath = `/uploads/${req.file.filename}`;

    // Update profile with new resume
    await dbOperations.upsertProfile(userId, {
      resume_filename: req.file.originalname,
      resume_path: resumePath
    });

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        resumeFilename: req.file.originalname,
        resumePath: resumePath
      }
    });

  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password
app.put('/api/auth/change-password', authenticateToken, async (req: any, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    // Get current user
    const user = await dbOperations.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await dbOperations.updateUser(userId, { password: hashedNewPassword });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete account
app.delete('/api/auth/me', authenticateToken, async (req: any, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.userId;

    if (!password) {
      return res.status(400).json({ error: 'Password is required to delete account' });
    }

    // Get current user
    const user = await dbOperations.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Get profile to find resume file
    const profile = await dbOperations.getProfileByUserId(userId);
    
    // Delete resume file if it exists
    if (profile?.resume_path) {
      const resumeFilePath = path.join(__dirname, profile.resume_path);
      if (fs.existsSync(resumeFilePath)) {
        fs.unlinkSync(resumeFilePath);
      }
    }

    // Delete profile picture if it exists
    if (profile?.profile_picture) {
      const profilePicturePath = path.join(__dirname, profile.profile_picture);
      if (fs.existsSync(profilePicturePath)) {
        fs.unlinkSync(profilePicturePath);
      }
    }

    // Delete profile (cascade will handle user and applications)
    await dbOperations.deleteProfile(userId);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve uploaded files (including profile pictures and resumes)
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 2MB.' });
    }
    return res.status(400).json({ error: error.message });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
});

module.exports = app;
