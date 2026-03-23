const mongoose = require('mongoose');
const Job = require('./models/Job');
require('dotenv').config();

// Sample job data
const sampleJobs = [
  {
    title: 'Senior Frontend Developer',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    type: 'full-time',
    category: 'technology',
    description: 'We are looking for an experienced Frontend Developer to join our growing team. You will work on cutting-edge web applications using React, TypeScript, and modern frontend technologies.',
    requirements: [
      '5+ years of React development experience',
      'Strong proficiency in TypeScript',
      'Experience with state management (Redux, Zustand)',
      'Knowledge of modern CSS frameworks',
      'Bachelor\'s degree in Computer Science or related field'
    ],
    responsibilities: [
      'Develop and maintain responsive web applications',
      'Collaborate with cross-functional teams',
      'Write clean, maintainable code',
      'Participate in code reviews',
      'Optimize applications for performance'
    ],
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Redux', 'Git'],
    salary: {
      min: 120000,
      max: 180000,
      currency: 'USD'
    },
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    companyLogo: 'https://via.placeholder.com/150x150.png?text=TC',
    companyWebsite: 'https://techcorp.com',
    companySize: '51-200',
    tags: ['React', 'TypeScript', 'Frontend', 'Remote'],
    benefits: ['Health insurance', '401(k)', 'Unlimited PTO', 'Remote work'],
    workMode: 'hybrid',
    experienceLevel: 'senior',
    featured: true,
    urgent: false
  },
  {
    title: 'UX/UI Designer',
    company: 'Creative Studio',
    location: 'New York, NY',
    type: 'full-time',
    category: 'design',
    description: 'Join our creative team as a UX/UI Designer. You will be responsible for creating beautiful, intuitive user interfaces and exceptional user experiences for our clients.',
    requirements: [
      '3+ years of UX/UI design experience',
      'Proficiency in Figma, Sketch, or Adobe Creative Suite',
      'Strong portfolio demonstrating design process',
      'Understanding of user-centered design principles',
      'Experience with responsive design'
    ],
    responsibilities: [
      'Create wireframes, mockups, and prototypes',
      'Conduct user research and usability testing',
      'Collaborate with developers to implement designs',
      'Maintain design system and brand guidelines',
      'Present design concepts to stakeholders'
    ],
    skills: ['Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'User Research'],
    salary: {
      min: 90000,
      max: 130000,
      currency: 'USD'
    },
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    companyLogo: 'https://via.placeholder.com/150x150.png?text=CS',
    companyWebsite: 'https://creativestudio.com',
    companySize: '11-50',
    tags: ['UX', 'UI', 'Figma', 'Design'],
    benefits: ['Flexible hours', 'Health insurance', 'Creative environment', 'Professional development'],
    workMode: 'remote',
    experienceLevel: 'mid',
    featured: false,
    urgent: true
  },
  {
    title: 'Marketing Manager',
    company: 'Growth Marketing Inc',
    location: 'Austin, TX',
    type: 'full-time',
    category: 'marketing',
    description: 'We are seeking a dynamic Marketing Manager to lead our marketing initiatives and drive growth. You will develop and execute marketing strategies across multiple channels.',
    requirements: [
      '5+ years of marketing experience',
      'Proven track record of successful campaigns',
      'Experience with digital marketing tools',
      'Strong analytical and strategic thinking',
      'Bachelor\'s degree in Marketing or related field'
    ],
    responsibilities: [
      'Develop comprehensive marketing strategies',
      'Manage marketing budget and ROI',
      'Lead cross-functional marketing team',
      'Analyze campaign performance and optimize',
      'Collaborate with sales and product teams',
      'Manage social media and content marketing'
    ],
    skills: ['Digital Marketing', 'SEO', 'SEM', 'Social Media', 'Analytics', 'Content Strategy'],
    salary: {
      min: 80000,
      max: 120000,
      currency: 'USD'
    },
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    companyLogo: 'https://via.placeholder.com/150x150.png?text=GM',
    companyWebsite: 'https://growthmarketing.com',
    companySize: '51-200',
    tags: ['Marketing', 'Digital', 'Strategy'],
    benefits: ['Performance bonuses', 'Health insurance', '401(k)', 'Company car'],
    workMode: 'hybrid',
    experienceLevel: 'senior',
    featured: false,
    urgent: false
  },
  {
    title: 'Junior Backend Developer',
    company: 'StartupHub',
    location: 'Seattle, WA',
    type: 'full-time',
    category: 'technology',
    description: 'Looking for a passionate Junior Backend Developer to join our fast-paced startup. You will work on building scalable APIs and backend systems.',
    requirements: [
      '1-2 years of backend development experience',
      'Experience with Node.js or Python',
      'Understanding of databases (SQL/NoSQL)',
      'Knowledge of RESTful APIs',
      'Experience with cloud platforms (AWS/Azure)',
      'Bachelor\'s degree in Computer Science'
    ],
    responsibilities: [
      'Design and implement RESTful APIs',
      'Write clean, efficient code',
      'Collaborate with frontend developers',
      'Troubleshoot and debug applications',
      'Participate in code reviews and testing'
    ],
    skills: ['Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'REST APIs'],
    salary: {
      min: 70000,
      max: 95000,
      currency: 'USD'
    },
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    companyLogo: 'https://via.placeholder.com/150x150.png?text=SH',
    companyWebsite: 'https://startuphub.io',
    companySize: 'startup',
    tags: ['Backend', 'Node.js', 'Python', 'Startup'],
    benefits: ['Equity options', 'Unlimited PTO', 'Flexible schedule', 'Learning budget'],
    workMode: 'remote',
    experienceLevel: 'entry',
    featured: true,
    urgent: false
  },
  {
    title: 'Data Analyst',
    company: 'Data Insights Co',
    location: 'Chicago, IL',
    type: 'contract',
    category: 'technology',
    description: 'We need a skilled Data Analyst to help us make sense of complex datasets and provide actionable insights to drive business decisions.',
    requirements: [
      '3+ years of data analysis experience',
      'Strong SQL and Python skills',
      'Experience with data visualization tools',
      'Statistical analysis background',
      'Bachelor\'s degree in Data Science, Statistics, or related field'
    ],
    responsibilities: [
      'Analyze large datasets to identify trends',
      'Create data visualizations and reports',
      'Develop predictive models',
      'Collaborate with business stakeholders',
      'Present findings to executive team',
      'Maintain data quality and integrity'
    ],
    skills: ['SQL', 'Python', 'R', 'Tableau', 'Power BI', 'Excel', 'Statistics'],
    salary: {
      min: 85000,
      max: 115000,
      currency: 'USD'
    },
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    companyLogo: 'https://via.placeholder.com/150x150.png?text=DI',
    companyWebsite: 'https://datainsights.com',
    companySize: '201-500',
    tags: ['Data Analysis', 'SQL', 'Python', 'Analytics'],
    benefits: ['Health insurance', '401(k)', 'Flexible hours', 'Remote work'],
    workMode: 'remote',
    experienceLevel: 'mid',
    featured: false,
    urgent: true
  },
  {
    title: 'Product Manager',
    company: 'InnovateTech',
    location: 'Boston, MA',
    type: 'full-time',
    category: 'technology',
    description: 'Seeking an experienced Product Manager to lead product development and strategy for our innovative tech solutions.',
    requirements: [
      '5+ years of product management experience',
      'Experience with agile development methodologies',
      'Strong analytical and problem-solving skills',
      'Experience with product management tools',
      'Technical background or experience',
      'MBA or equivalent experience preferred'
    ],
    responsibilities: [
      'Define product vision and strategy',
      'Manage product roadmap and prioritization',
      'Collaborate with engineering and design teams',
      'Conduct market research and competitive analysis',
      'Define and track product metrics',
      'Present to stakeholders and executives'
    ],
    skills: ['Product Management', 'Agile', 'Scrum', 'Analytics', 'Roadmapping', 'User Research'],
    salary: {
      min: 110000,
      max: 160000,
      currency: 'USD'
    },
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    companyLogo: 'https://via.placeholder.com/150x150.png?text=IT',
    companyWebsite: 'https://innovatetech.com',
    companySize: '500+',
    tags: ['Product Management', 'Strategy', 'Leadership'],
    benefits: ['Stock options', 'Executive health plan', 'Car allowance', 'Executive bonus'],
    workMode: 'hybrid',
    experienceLevel: 'lead',
    featured: true,
    urgent: false
  },
  {
    title: 'Content Writer Intern',
    company: 'Content Creators Ltd',
    location: 'Los Angeles, CA',
    type: 'internship',
    category: 'other',
    description: 'Looking for a creative Content Writer intern to help create engaging content for our clients across various industries.',
    requirements: [
      'Currently pursuing or recent graduate in Journalism, English, or related field',
      'Strong writing and editing skills',
      'Experience with content management systems',
      'Creative thinking and attention to detail',
      'Basic SEO knowledge',
      'Portfolio of written work'
    ],
    responsibilities: [
      'Write blog posts, articles, and web content',
      'Edit and proofread content for accuracy',
      'Research topics and gather information',
      'Optimize content for SEO',
      'Collaborate with marketing team',
      'Meet deadlines and manage multiple projects'
    ],
    skills: ['Content Writing', 'SEO', 'Editing', 'Research', 'WordPress', 'Social Media'],
    salary: {
      min: 25000,
      max: 35000,
      currency: 'USD'
    },
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    companyLogo: 'https://via.placeholder.com/150x150.png?text=CC',
    companyWebsite: 'https://contentcreators.com',
    companySize: '1-10',
    tags: ['Content', 'Writing', 'Internship'],
    benefits: ['Flexible schedule', 'Remote work', 'Mentorship program', 'Potential full-time offer'],
    workMode: 'remote',
    experienceLevel: 'entry',
    featured: false,
    urgent: false
  }
];

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Seed jobs function
const seedJobs = async () => {
  try {
    await connectDB();
    
    // Clear existing jobs
    await Job.deleteMany({});
    console.log('🗑️ Cleared existing jobs');
    
    // Shuffle and insert random jobs
    const shuffledJobs = [...sampleJobs].sort(() => 0.5 - Math.random());
    
    // Insert random subset (5-8 jobs)
    const numberOfJobs = Math.floor(Math.random() * 4) + 5; // 5-8 jobs
    const selectedJobs = shuffledJobs.slice(0, numberOfJobs);
    
    await Job.insertMany(selectedJobs);
    
    console.log(`✅ Successfully seeded ${numberOfJobs} random jobs:`);
    selectedJobs.forEach((job, index) => {
      console.log(`   ${index + 1}. ${job.title} at ${job.company}`);
    });
    
    console.log('\n🎯 Total jobs in database:', await Job.countDocuments());
    
  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the seeding
seedJobs();
