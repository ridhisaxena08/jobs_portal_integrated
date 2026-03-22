# Job Listing Portal

A complete job application portal with resume upload, contact details form, and full backend integration with SQLite database.

## Features

- Resume upload with drag-and-drop support
- File validation (PDF and DOCX, max 2MB)
- Contact details form with validation
- Real-time form validation
- **Email duplication prevention**
- **Backend status indicator**
- Success page with submitted data
- **Admin dashboard** with real database integration
- **File storage** in server uploads directory
- **Complete CRUD operations** for applications
- **Email and phone validation**

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React Icons
- React Router

### Backend
- Node.js
- Express.js
- SQLite Database
- Multer (file uploads)
- CORS support
- Email duplication validation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

**Run both frontend and backend simultaneously:**
```bash
npm run dev:full
```

The application will be available at:
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3001](http://localhost:3001)
- Admin Dashboard: [http://localhost:5173/admin](http://localhost:5173/admin)

**Run separately:**
```bash
# Start backend
npm run server

# Start frontend (in another terminal)
npm run dev
```

### Build

Build for production:
```bash
npm run build
```

## API Endpoints

### Applications
- `POST /api/applications` - Submit new application
- `GET /api/applications` - Get all applications
- `GET /api/applications/:id` - Get specific application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application

### File Serving
- `GET /api/resume/:filename` - Serve uploaded resume files

### Statistics
- `GET /api/stats` - Get application statistics

## Database

The application uses SQLite for data persistence. The database file (`job_applications.db`) is automatically created in `server/` directory when the server starts.

### Database Schema
```sql
CREATE TABLE applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  linkedin TEXT,
  portfolio TEXT,
  resume_filename TEXT NOT NULL,
  resume_path TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Features
- **Email uniqueness constraint** - Prevents duplicate applications
- **Automatic timestamps** - Tracks creation and updates
- **File management** - Resumes stored with unique filenames
- **Validation** - Email and phone format validation
- **Error handling** - Comprehensive error responses

## Project Structure

```
├── src/
│   ├── app/
│   │   └── components/
│   │       ├── ResumeUploadSection.tsx
│   │       ├── SuccessPage.tsx
│   │       └── AdminDashboard.tsx
│   ├── App.tsx
│   └── main.tsx
├── server/
│   ├── index.ts (Express server)
│   ├── database.ts (SQLite setup)
│   └── uploads/ (Resume files)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## File Upload

- Supported formats: PDF, DOCX
- Maximum file size: 2MB
- Files are stored in `server/uploads/` directory
- Each file gets a unique timestamp-based filename
- Automatic file cleanup on application deletion

## Validations

### Email
- Format validation (basic email regex)
- **Duplication prevention** - Checks existing emails in database
- Required field validation

### Phone
- Format validation (numbers, spaces, dashes, parentheses)
- Required field validation

### Resume
- File type validation (PDF, DOCX only)
- File size validation (2MB maximum)
- Required file validation

## Admin Dashboard Features

- **Real-time data fetching** from backend
- **Application management** (view, delete)
- **Status indicators** (loading, error states)
- **Responsive design** for mobile devices
- **Navigation** back to application form

## Error Handling

- **Backend status indicator** in frontend
- **Connection retry** functionality
- **Comprehensive error messages**
- **Graceful degradation** when backend offline
- **Form validation** with user-friendly messages

## Contributing

1. Fork repository
2. Create your feature branch
3. Commit your changes
4. Push to branch
5. Open a pull request

## License

MIT License - feel free to use this project for your own purposes.