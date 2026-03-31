const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'job_applications.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Create applications table
  const createApplicationsTable = `
    CREATE TABLE IF NOT EXISTS applications (
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
    )
  `;

  // Create users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'jobseeker',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create jobs table (SQLite-backed jobs for dashboards/APIs)
  const createJobsTable = `
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      posted_by INTEGER,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      type TEXT,
      category TEXT,
      experience_level TEXT,
      work_mode TEXT,
      deadline TEXT,
      status TEXT DEFAULT 'active',
      data_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createApplicationsTable, (err) => {
    if (err) {
      console.error('Error creating applications table:', err.message);
    } else {
      console.log('Applications table created successfully');
    }
  });

  db.run(createUsersTable, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table created successfully');
    }
  });

  db.run(createJobsTable, (err) => {
    if (err) {
      console.error('Error creating jobs table:', err.message);
    }
  });
}

// Database operations
module.exports = {
  // Insert new application
  insertApplication: (application) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO applications (full_name, email, phone, linkedin, portfolio, resume_filename, resume_path)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.run(sql, [
        application.full_name,
        application.email,
        application.phone,
        application.linkedin || null,
        application.portfolio || null,
        application.resume_filename,
        application.resume_path
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  },

  // Check if email already exists
  checkEmailExists: (email) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id FROM applications WHERE email = ?';
      db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(!!row);
        }
      });
    });
  },

  // Get all applications
  getAllApplications: () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM applications ORDER BY created_at DESC';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // Get application by ID
  getApplicationById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM applications WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Update application
  updateApplication: (id, updates) => {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];
      
      if (updates.full_name) {
        fields.push('full_name = ?');
        values.push(updates.full_name);
      }
      if (updates.email) {
        fields.push('email = ?');
        values.push(updates.email);
      }
      if (updates.phone) {
        fields.push('phone = ?');
        values.push(updates.phone);
      }
      if (updates.linkedin !== undefined) {
        fields.push('linkedin = ?');
        values.push(updates.linkedin);
      }
      if (updates.portfolio !== undefined) {
        fields.push('portfolio = ?');
        values.push(updates.portfolio);
      }
      
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);
      
      const sql = `UPDATE applications SET ${fields.join(', ')} WHERE id = ?`;
      
      db.run(sql, values, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  },

  // Delete application
  deleteApplication: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM applications WHERE id = ?';
      db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  },

  // Get applications count
  getApplicationsCount: () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) as count FROM applications';
      db.get(sql, [], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // User operations
  // Create new user
  createUser: (user) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO users (full_name, email, password, role)
        VALUES (?, ?, ?, ?)
      `;
      
      db.run(sql, [
        user.full_name,
        user.email,
        user.password,
        user.role || 'jobseeker'
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...user });
        }
      });
    });
  },

  // Get user by email
  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';
      db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Get user by ID
  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Jobs operations (SQLite)
  createJobSqlite: (jobData, postedBy = null) => {
    return new Promise((resolve, reject) => {
      const payload = { ...jobData };
      const title = payload.title || '';
      const company = payload.company || '';
      const type = payload.type || null;
      const category = payload.category || null;
      const experienceLevel = payload.experienceLevel || payload.experience_level || null;
      const workMode = payload.workMode || payload.work_mode || null;
      const deadline = payload.deadline || null;
      const status = payload.status || 'active';

      const sql = `
        INSERT INTO jobs (posted_by, title, company, type, category, experience_level, work_mode, deadline, status, data_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(
        sql,
        [
          postedBy,
          title,
          company,
          type,
          category,
          experienceLevel,
          workMode,
          deadline,
          status,
          JSON.stringify(payload)
        ],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, ...payload, postedBy });
        }
      );
    });
  },

  getJobsSqlite: ({ page = 1, limit = 10, postedBy = null } = {}) => {
    return new Promise((resolve, reject) => {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offset = (pageNum - 1) * limitNum;

      const where = [];
      const params = [];
      if (postedBy !== null && postedBy !== undefined) {
        where.push('posted_by = ?');
        params.push(postedBy);
      }
      const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

      const sql = `
        SELECT * FROM jobs
        ${whereSql}
        ORDER BY datetime(created_at) DESC
        LIMIT ? OFFSET ?
      `;
      const countSql = `SELECT COUNT(*) as count FROM jobs ${whereSql}`;

      db.get(countSql, params, (cerr, crow) => {
        if (cerr) return reject(cerr);
        db.all(sql, [...params, limitNum, offset], (err, rows) => {
          if (err) return reject(err);
          const jobs = rows.map((r) => {
            let data = {};
            try { data = JSON.parse(r.data_json || '{}'); } catch {}
            return {
              ...data,
              id: r.id,
              postedBy: r.posted_by,
              createdAt: r.created_at,
              updatedAt: r.updated_at
            };
          });
          resolve({
            jobs,
            pagination: {
              page: pageNum,
              limit: limitNum,
              total: crow?.count || 0,
              pages: Math.ceil((crow?.count || 0) / limitNum)
            }
          });
        });
      });
    });
  },

  getJobByIdSqlite: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM jobs WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        let data = {};
        try { data = JSON.parse(row.data_json || '{}'); } catch {}
        resolve({
          ...data,
          id: row.id,
          postedBy: row.posted_by,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        });
      });
    });
  }
};

// Close database connection
const closeDatabase = () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
  });
};

// Handle process termination
process.on('SIGINT', closeDatabase);
process.on('SIGTERM', closeDatabase);

module.exports.closeDatabase = closeDatabase;
