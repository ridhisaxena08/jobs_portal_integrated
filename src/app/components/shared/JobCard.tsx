import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  Clock,
  Building,
  Heart,
  ExternalLink,
  Calendar,
  Users,
} from 'lucide-react';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: {
      city: string;
      state: string;
      country: string;
    };
    type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
    salary: {
      min: number;
      max: number;
      currency: string;
    };
    description: string;
    requirements: string[];
    benefits: string[];
    postedAt: string;
    deadline: string;
    applicants: number;
    category: string;
    logo?: string;
    isSaved?: boolean;
    isApplied?: boolean;
  };
  onSave?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  showSaveButton?: boolean;
  showApplyButton?: boolean;
}

export const JobCard = ({
  job,
  onSave,
  onApply,
  showSaveButton = true,
  showApplyButton = true,
}: JobCardProps) => {
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [isApplied, setIsApplied] = useState(job.isApplied || false);
  const navigate = useNavigate();

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (onSave) {
      onSave(job.id);
    }
  };

  const handleApply = () => {
    setIsApplied(true);
    navigate(`/apply/${job.id}`);
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time':
        return '#10b981';
      case 'part-time':
        return '#3b82f6';
      case 'contract':
        return '#8b5cf6';
      case 'internship':
        return '#f59e0b';
      case 'remote':
        return '#f97316';
      default:
        return '#6b7280';
    }
  };

  const formatSalary = (min: number, max: number, currency: string) => {
    if (min === max) {
      return `${currency}${min.toLocaleString()}`;
    }
    return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: '#fff',
      border: '1.5px solid #ebebeb',
      borderRadius: '12px',
      padding: '20px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'border-color 0.15s, box-shadow 0.15s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = '#ccc';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = '#ebebeb';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
        {job.logo ? (
          <img
            src={job.logo}
            alt={job.company}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              objectFit: 'cover',
              flexShrink: 0
            }}
          />
        ) : (
          <div style={{
            width: '48px',
            height: '48px',
            background: '#f0f0f0',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Building size={20} color="#888" />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#111',
            margin: '0 0 4px 0',
            lineHeight: '1.3',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {job.title}
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#666',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {job.company}
          </p>
        </div>
        {showSaveButton && (
          <button
            onClick={handleSave}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              color: isSaved ? '#ef4444' : '#999',
              transition: 'color 0.15s, background 0.15s',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
            }}
          >
            <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {/* Location and Type */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#666' }}>
            <MapPin size={14} />
            <span>{`${job.location.city}, ${job.location.state}`}</span>
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: getJobTypeColor(job.type),
            background: `${getJobTypeColor(job.type)}15`,
            padding: '4px 8px',
            borderRadius: '100px',
            textTransform: 'uppercase',
            letterSpacing: '0.3px'
          }}>
            {job.type.replace('-', ' ')}
          </span>
        </div>

        {/* Salary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#111', fontWeight: '500' }}>
          <span style={{ color: '#666', marginRight: '2px' }}>₹</span>
          <span>{formatSalary(job.salary.min, job.salary.max, job.salary.currency)}</span>
        </div>

        {/* Description */}
        <p style={{
          fontSize: '13px',
          color: '#555',
          lineHeight: '1.6',
          margin: 0,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {job.description}
        </p>

        {/* Requirements */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {job.requirements.slice(0, 3).map((req, index) => (
            <span key={index} style={{
              fontSize: '11px',
              fontWeight: '500',
              color: '#666',
              background: '#f8f8f8',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid #e8e8e8'
            }}>
              {req}
            </span>
          ))}
          {job.requirements.length > 3 && (
            <span style={{
              fontSize: '11px',
              fontWeight: '500',
              color: '#999',
              background: '#f8f8f8',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid #e8e8e8'
            }}>
              +{job.requirements.length - 3} more
            </span>
          )}
        </div>

        {/* Meta Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#999',
          paddingTop: '8px',
          borderTop: '1px solid #f0f0f0',
          marginTop: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              <span>{formatDate(job.postedAt)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={12} />
              <span>{job.applicants}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} />
            <span>{new Date(job.deadline).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
        {showApplyButton && (
          <button
            onClick={handleApply}
            disabled={isApplied}
            style={{
              flex: 1,
              padding: '10px 16px',
              background: isApplied ? '#10b981' : '#111',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isApplied ? 'default' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'background 0.15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              if (!isApplied) {
                e.currentTarget.style.background = '#333';
              }
            }}
            onMouseLeave={(e) => {
              if (!isApplied) {
                e.currentTarget.style.background = '#111';
              }
            }}
          >
            {isApplied && <span style={{ fontSize: '10px' }}>✓</span>}
            {isApplied ? 'Applied' : 'Apply Now'}
          </button>
        )}
        <Link
          to={`/jobs/${job.id}`}
          style={{
            padding: '10px 12px',
            background: 'transparent',
            color: '#666',
            border: '1.5px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'border-color 0.15s, color 0.15s',
            fontFamily: "'DM Sans', sans-serif"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#bbb';
            e.currentTarget.style.color = '#111';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e0e0e0';
            e.currentTarget.style.color = '#666';
          }}
        >
          <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
};
