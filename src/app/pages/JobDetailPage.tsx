import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Briefcase, Users, Calendar, ArrowLeft, Share2, Heart } from 'lucide-react';
import { Navbar } from '../components/shared/Navbar';
import { Footer } from '../components/shared/Footer';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import api from '../services/api';

export const JobDetailPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await api.getJobById(jobId);
        
        if (response.success) {
          setJob(response.data);
        } else {
          console.error('Failed to fetch job:', response.message);
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const handleSaveJob = () => {
    setSaved(!saved);
    // TODO: Implement save job API call
  };

  const handleShareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: job?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Job link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '4px solid #e5e7eb', 
            borderTop: '4px solid #111',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#666', fontFamily: 'DM Sans' }}>Loading job details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            border: '3px solid #e5e7eb', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999'
          }}>
            <Briefcase size={40} />
          </div>
          <h2 style={{ color: '#333', fontFamily: 'DM Sans', margin: 0 }}>Job Not Found</h2>
          <p style={{ color: '#666', fontFamily: 'DM Sans', textAlign: 'center', maxWidth: '400px' }}>
            The job you're looking for might have been removed or the link is incorrect.
          </p>
          <Link to="/jobs">
            <Button style={{ fontFamily: 'DM Sans' }}>
              <ArrowLeft size={16} style={{ marginRight: '8px' }} />
              Back to Jobs
            </Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,600;700&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .job-detail-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .job-detail-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 0;
          margin-bottom: 40px;
        }

        .job-detail-content {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 40px;
          margin-bottom: 60px;
        }

        .job-main-content {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .job-sidebar {
          position: sticky;
          top: 100px;
          height: fit-content;
        }

        .job-company-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .job-company-logo {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          object-fit: cover;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .job-company-info h1 {
          font-family: 'Fraunces', serif;
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 8px 0;
          line-height: 1.2;
        }

        .job-company-info h2 {
          font-size: 20px;
          font-weight: 500;
          margin: 0 0 12px 0;
          opacity: 0.9;
        }

        .job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }

        .job-meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
        }

        .job-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 30px;
        }

        .job-description h3 {
          font-family: 'Fraunces', serif;
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 20px 0;
          color: #333;
        }

        .job-description p {
          line-height: 1.6;
          color: #666;
          margin-bottom: 16px;
        }

        .job-requirements {
          margin-top: 40px;
        }

        .job-requirements ul {
          list-style: none;
          padding: 0;
        }

        .job-requirements li {
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
          color: #666;
          position: relative;
          padding-left: 24px;
        }

        .job-requirements li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }

        .job-action-buttons {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .job-action-btn {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
        }

        .job-action-btn.primary {
          background: #111;
          color: white;
        }

        .job-action-btn.primary:hover {
          background: #333;
        }

        .job-action-btn.secondary {
          background: #f3f4f6;
          color: #333;
        }

        .job-action-btn.secondary:hover {
          background: #e5e7eb;
        }

        .job-action-btn.saved {
          background: #10b981;
          color: white;
        }

        .job-info-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .job-info-card h4 {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: #333;
        }

        .job-info-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
          color: #666;
          font-size: 14px;
        }

        .job-info-item:last-child {
          border-bottom: none;
        }

        .job-info-icon {
          flex-shrink: 0;
          color: #9ca3af;
        }

        .chat-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }

        .chat-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #111;
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s;
        }

        .chat-button:hover {
          background: #333;
          transform: translateY(-2px);
        }

        @media (max-width: 1024px) {
          .job-detail-content {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .job-sidebar {
            position: static;
            order: -1;
          }
        }

        @media (max-width: 768px) {
          .job-detail-container {
            padding: 0 16px;
          }

          .job-main-content {
            padding: 24px;
          }

          .job-company-header {
            flex-direction: column;
            text-align: center;
          }

          .job-company-info h1 {
            font-size: 24px;
          }

          .job-action-buttons {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="job-detail-container">
        <Navbar />
        
        {/* Job Header */}
        <div className="job-detail-header">
          <div className="job-detail-container">
            <div className="job-company-header">
              <img 
                src={job.logo || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop&crop=center'} 
                alt={job.company} 
                className="job-company-logo"
              />
              <div className="job-company-info">
                <h1>{job.title}</h1>
                <h2>{job.company}</h2>
                <div className="job-meta">
                  <div className="job-meta-item">
                    <MapPin size={16} />
                    {job.location ? `${job.location.city}, ${job.location.state}` : 'Location not specified'}
                  </div>
                  <div className="job-meta-item">
                    <Briefcase size={16} />
                    {job.type}
                  </div>
                  <div className="job-meta-item">
                    <DollarSign size={16} />
                    {job.salary ? `${job.salary.currency}${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}` : 'Competitive'}
                  </div>
                  <div className="job-meta-item">
                    <Calendar size={16} />
                    Posted {new Date(job.postedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="job-detail-container">
          <div className="job-detail-content">
            {/* Left Column - Job Details */}
            <div className="job-main-content">
              <div className="job-tags">
                <Badge variant="secondary">{job.category}</Badge>
                <Badge variant="outline">{job.experience}</Badge>
                {job.remote && <Badge variant="outline">Remote</Badge>}
              </div>

              <div className="job-description">
                <h3>Job Description</h3>
                <p>{job.description}</p>
              </div>

              <div className="job-requirements">
                <h3>Requirements</h3>
                <ul>
                  {job.requirements?.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              {job.benefits && job.benefits.length > 0 && (
                <div className="job-requirements">
                  <h3>Benefits</h3>
                  <ul>
                    {job.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="job-sidebar">
              <div className="job-info-card">
                <div className="job-action-buttons">
                  <Link to={`/apply/${job.id}`}>
                    <button className="job-action-btn primary">
                      Apply Now
                    </button>
                  </Link>
                  <button 
                    className={`job-action-btn ${saved ? 'saved' : 'secondary'}`}
                    onClick={handleSaveJob}
                  >
                    <Heart size={16} />
                    {saved ? 'Saved' : 'Save'}
                  </button>
                </div>
                <button className="job-action-btn secondary" onClick={handleShareJob}>
                  <Share2 size={16} />
                  Share
                </button>
              </div>

              <div className="job-info-card">
                <h4>Job Information</h4>
                <div className="job-info-item">
                  <Users className="job-info-icon" size={16} />
                  <span>{job.applicants || 0} applicants</span>
                </div>
                <div className="job-info-item">
                  <Clock className="job-info-icon" size={16} />
                  <span>Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No deadline'}</span>
                </div>
                <div className="job-info-item">
                  <Briefcase className="job-info-icon" size={16} />
                  <span>{job.experience} experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />

        {/* Chat Widget */}
        <div className="chat-widget">
          <button className="chat-button" title="Need help?">
            💬
          </button>
        </div>
      </div>
    </>
  );
};
