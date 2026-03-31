import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
// @ts-ignore
import { dbOperations } from './database.js';
// @ts-ignore
import mongoose from 'mongoose';

// Import auth routes
// @ts-ignore
import authRoutes from './routes/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    // Create unique filename with timestamp
    const timestamp = Date.now();
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    cb(null, `${timestamp}-${baseName}${extension}`);
  }
});

// File filter for allowed file types
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
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

// Authentication routes
app.use('/api/auth', authRoutes);

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
app.get('/api/applications', async (_req, res) => {
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
app.get('/api/stats', async (_req, res) => {
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

// Error handling middleware
app.use((error: any, _req: express.Request, res: express.Response) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 2MB.' });
    }
    return res.status(400).json({ error: error.message });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, async () => {
  // Connect to MongoDB
  try {
    // @ts-ignore
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal');
    console.log('🗄️  Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('⚠️  Continuing without MongoDB - auth features will not work');
  }
  
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
});

export default app;
