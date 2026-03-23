import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Calendar, Briefcase, ArrowRight } from 'lucide-react';
import api from '../services/api';

export const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await api.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        dob: formData.dob,
        confirmPassword: formData.confirmPassword
      });

      if (response.success) {
        // Store user data
        api.setCurrentUser(response.data.user);
        
        // Navigate to login
        navigate('/login');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (error) {
      setError(error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,600;0,700;1,600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .signup-root {
          font-family: 'DM Sans', sans-serif;
          background: #f9f9f7;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        /* Logo above card */
        .signup-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 28px;
          text-decoration: none;
        }

        .signup-logo-icon {
          width: 34px;
          height: 34px;
          background: #111;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .signup-logo-icon svg { color: #fff; width: 17px; height: 17px; }

        .signup-logo-text {
          font-size: 16px;
          font-weight: 700;
          color: #111;
          letter-spacing: -0.3px;
        }

        /* Card */
        .signup-card {
          background: #fff;
          border: 1.5px solid #ebebeb;
          border-radius: 16px;
          padding: 40px 40px 36px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }

        @media (max-width: 480px) {
          .signup-card { padding: 28px 24px; }
        }

        .signup-heading {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          font-weight: 700;
          color: #111;
          letter-spacing: -0.8px;
          margin-bottom: 6px;
        }
        .signup-subheading {
          font-size: 14px;
          color: #888;
          line-height: 1.5;
          margin-bottom: 32px;
        }

        /* Form */
        .signup-form { display: flex; flex-direction: column; gap: 16px; }

        .form-group { display: flex; flex-direction: column; gap: 6px; }

        .form-label {
          font-size: 12.5px;
          font-weight: 600;
          color: #444;
          letter-spacing: 0.2px;
        }

        .form-input-wrapper { position: relative; }

        .form-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #bbb;
          width: 16px;
          height: 16px;
          pointer-events: none;
        }

        .form-input {
          width: 100%;
          padding: 11px 14px 11px 40px;
          border: 1.5px solid #e4e4e4;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #111;
          background: #fafafa;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .form-input::placeholder { color: #c0c0c0; }
        .form-input:focus { border-color: #111; background: #fff; }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #bbb;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }
        .password-toggle:hover { color: #666; }

        /* Remember + forgot row */
        .form-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .form-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        /* Custom checkbox */
        .form-checkbox input[type='checkbox'] {
          appearance: none;
          -webkit-appearance: none;
          width: 17px;
          height: 17px;
          border: 1.5px solid #d0d0d0;
          border-radius: 4px;
          background: #fafafa;
          cursor: pointer;
          flex-shrink: 0;
          transition: border-color 0.15s, background 0.15s;
          position: relative;
        }
        .form-checkbox input[type='checkbox']:checked {
          background: #111;
          border-color: #111;
        }
        .form-checkbox input[type='checkbox']:checked::after {
          content: '';
          position: absolute;
          left: 4px;
          top: 1px;
          width: 5px;
          height: 9px;
          border: 2px solid #fff;
          border-top: none;
          border-left: none;
          transform: rotate(45deg);
        }
        .form-checkbox label {
          font-size: 13px;
          color: #666;
          cursor: pointer;
          user-select: none;
        }

        /* Submit */
        .signup-btn {
          width: 100%;
          padding: 13px 20px;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.15s, transform 0.1s;
          margin-top: 4px;
        }
        .signup-btn:hover { background: #333; transform: translateY(-1px); }
        .signup-btn svg { width: 16px; height: 16px; }

        /* Divider */
        .signup-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 24px 0;
        }
        .signup-divider::before,
        .signup-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #ebebeb;
        }
        .signup-divider span {
          font-size: 11.5px;
          font-weight: 600;
          color: #bbb;
          letter-spacing: 0.5px;
        }

        /* Social */
        .social-btns { display: flex; flex-direction: column; gap: 10px; }

        .social-btn {
          width: 100%;
          padding: 11px 16px;
          background: #fff;
          color: #333;
          border: 1.5px solid #e4e4e4;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: border-color 0.15s, background 0.15s;
        }
        .social-btn:hover { border-color: #bbb; background: #fafafa; }

        .social-btn-icon {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        /* Footer */
        .signup-footer {
          text-align: center;
          margin-top: 28px;
        }
        .signup-footer p {
          font-size: 13.5px;
          color: #888;
        }
        .signup-footer a {
          color: #111;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .signup-footer a:hover { opacity: 0.7; }

        /* Error message */
        .error-message {
          font-size: 12px;
          color: #dc2626;
          margin-top: 4px;
          display: none;
        }
        .error-message.show { display: block; }
      `}</style>

      <div className="signup-root">

        <div className="signup-card">
          <h1 className="signup-heading">Create account</h1>
          <p className="signup-subheading">Join thousands of job seekers finding their dream careers</p>

          <form className="signup-form" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <div className="form-input-wrapper">
                <User className="form-input-icon" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-input"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="form-group">
              <label className="form-label" htmlFor="dob">Date of Birth</label>
              <div className="form-input-wrapper">
                <Calendar className="form-input-icon" />
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  className="form-input"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div className="form-input-wrapper">
                <Mail className="form-input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="form-input-wrapper">
                <Lock className="form-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{ paddingRight: 40 }}
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <div className="form-input-wrapper">
                <Lock className="form-input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  style={{ paddingRight: 40 }}
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="error-message" id="passwordError">Passwords do not match</div>
            </div>

            {/* Terms and Conditions */}
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="agreeToTerms">
                I agree to the <Link to="/terms" style={{ color: '#111', fontWeight: 600 }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: '#111', fontWeight: 600 }}>Privacy Policy</Link>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '14px',
                marginBottom: '16px',
                border: '1px solid #fecaca'
              }}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="signup-btn"
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'} <ArrowRight />
            </button>
          </form>

          <div className="signup-divider"><span>OR</span></div>

          <div className="signup-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
