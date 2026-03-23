import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Twitter, Linkedin, Github, Instagram } from 'lucide-react';

export const Footer = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .jp-footer {
          font-family: 'DM Sans', sans-serif;
          background: #111;
          color: #fff;
          padding: 60px 0 0;
          margin-top: 0px;
        }

        .jp-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .jp-footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }

        .jp-footer-brand {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .jp-footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          width: fit-content;
        }

        .jp-footer-logo-icon {
          width: 32px;
          height: 32px;
          background: #fff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .jp-footer-logo-icon svg {
          color: #111;
          width: 16px;
          height: 16px;
        }

        .jp-footer-logo-text {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          letter-spacing: -0.3px;
        }

        .jp-footer-desc {
          font-size: 14px;
          line-height: 1.6;
          color: #aaa;
          max-width: 320px;
        }

        .jp-footer-socials {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .jp-footer-social {
          width: 36px;
          height: 36px;
          background: #222;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #aaa;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }

        .jp-footer-social:hover {
          background: #333;
          color: #fff;
        }

        .jp-footer-social svg {
          width: 16px;
          height: 16px;
        }

        .jp-footer-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .jp-footer-title {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .jp-footer-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .jp-footer-link {
          font-size: 14px;
          color: #aaa;
          text-decoration: none;
          transition: color 0.15s;
        }

        .jp-footer-link:hover {
          color: #fff;
        }

        .jp-footer-contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #aaa;
        }

        .jp-footer-contact-item svg {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }

        .jp-footer-bottom {
          border-top: 1px solid #222;
          padding: 24px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .jp-footer-copyright {
          font-size: 13px;
          color: #666;
        }

        .jp-footer-legal {
          display: flex;
          gap: 24px;
        }

        .jp-footer-legal-link {
          font-size: 13px;
          color: #666;
          text-decoration: none;
          transition: color 0.15s;
        }

        .jp-footer-legal-link:hover {
          color: #aaa;
        }

        @media (max-width: 768px) {
          .jp-footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .jp-footer-brand {
            order: 1;
          }

          .jp-footer-col:first-of-type {
            order: 2;
          }

          .jp-footer-col:nth-of-type(2) {
            order: 3;
          }

          .jp-footer-col:nth-of-type(3) {
            order: 4;
          }

          .jp-footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <footer className="jp-footer">
        <div className="jp-footer-inner">
          <div className="jp-footer-grid">
            {/* Brand Column */}
            <div className="jp-footer-brand">
              <Link to="/" className="jp-footer-logo">
                <div className="jp-footer-logo-icon">
                  <Briefcase />
                </div>
                <span className="jp-footer-logo-text">JobPortal</span>
              </Link>
              <p className="jp-footer-desc">
                Connecting talented professionals with their dream opportunities. Your career journey starts here.
              </p>
              <div className="jp-footer-socials">
                <a href="#" className="jp-footer-social" aria-label="Twitter">
                  <Twitter />
                </a>
                <a href="#" className="jp-footer-social" aria-label="LinkedIn">
                  <Linkedin />
                </a>
                <a href="#" className="jp-footer-social" aria-label="GitHub">
                  <Github />
                </a>
                <a href="#" className="jp-footer-social" aria-label="Instagram">
                  <Instagram />
                </a>
              </div>
            </div>

            {/* For Job Seekers */}
            <div className="jp-footer-col">
              <h3 className="jp-footer-title">For Job Seekers</h3>
              <div className="jp-footer-links">
                <Link to="/jobs" className="jp-footer-link">Browse Jobs</Link>
                <Link to="/companies" className="jp-footer-link">Companies</Link>
                <Link to="/career-advice" className="jp-footer-link">Career Advice</Link>
                <Link to="/resume-builder" className="jp-footer-link">Resume Builder</Link>
                <Link to="/salary-guide" className="jp-footer-link">Salary Guide</Link>
              </div>
            </div>

            {/* For Employers */}
            <div className="jp-footer-col">
              <h3 className="jp-footer-title">For Employers</h3>
              <div className="jp-footer-links">
                <Link to="/post-job" className="jp-footer-link">Post a Job</Link>
                <Link to="/pricing" className="jp-footer-link">Pricing</Link>
                <Link to="/talent-search" className="jp-footer-link">Talent Search</Link>
                <Link to="/employer-resources" className="jp-footer-link">Resources</Link>
                <Link to="/api" className="jp-footer-link">API Access</Link>
              </div>
            </div>

            {/* Contact */}
            <div className="jp-footer-col">
              <h3 className="jp-footer-title">Contact</h3>
              <div className="jp-footer-links">
                <div className="jp-footer-contact-item">
                  <Mail />
                  support@jobportal.com
                </div>
                <div className="jp-footer-contact-item">
                  <Phone />
                  1-800-JOBS
                </div>
                <div className="jp-footer-contact-item">
                  <MapPin />
                  San Francisco, CA
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="jp-footer-bottom">
            <div className="jp-footer-copyright">
              © 2024 JobPortal. All rights reserved.
            </div>
            <div className="jp-footer-legal">
              <Link to="/privacy" className="jp-footer-legal-link">Privacy Policy</Link>
              <Link to="/terms" className="jp-footer-legal-link">Terms of Service</Link>
              <Link to="/cookies" className="jp-footer-legal-link">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
