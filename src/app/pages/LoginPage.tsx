import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect based on user role
        const user = result.user;
        if (user.role === 'employer') {
          navigate('/hr-dashboard');
        } else {
          navigate('/job-seeker-dashboard');
        }
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,600;0,700;1,600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
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
        .login-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 28px;
          text-decoration: none;
        }
        .login-logo-icon {
          width: 34px;
          height: 34px;
          background: #111;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .login-logo-icon svg { color: #fff; width: 17px; height: 17px; }
        .login-logo-text {
          font-size: 16px;
          font-weight: 700;
          color: #111;
          letter-spacing: -0.3px;
        }

        /* Card */
        .login-card {
          background: #fff;
          border: 1.5px solid #ebebeb;
          border-radius: 16px;
          padding: 40px 40px 36px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }

        @media (max-width: 480px) {
          .login-card { padding: 28px 24px; }
        }

        .login-heading {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          font-weight: 700;
          color: #111;
          letter-spacing: -0.8px;
          margin-bottom: 6px;
        }
        .login-subheading {
          font-size: 14px;
          color: #888;
          line-height: 1.5;
          margin-bottom: 32px;
        }

        /* Form */
        .login-form { display: flex; flex-direction: column; gap: 18px; }

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

        .forgot-link {
          font-size: 13px;
          font-weight: 600;
          color: #555;
          text-decoration: none;
          transition: color 0.15s;
          white-space: nowrap;
        }
        .forgot-link:hover { color: #111; }

        /* Submit */
        .login-btn {
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
        .login-btn:hover { background: #333; transform: translateY(-1px); }
        .login-btn svg { width: 16px; height: 16px; }

        /* Divider */
        .login-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 24px 0;
        }
        .login-divider::before,
        .login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #ebebeb;
        }
        .login-divider span {
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
        .login-footer {
          text-align: center;
          margin-top: 28px;
        }
        .login-footer p {
          font-size: 13.5px;
          color: #888;
        }
        .login-footer a {
          color: #111;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .login-footer a:hover { opacity: 0.7; }
      `}</style>

      <div className="login-root">

        <div className="login-card">
          <h1 className="login-heading">Welcome back</h1>
          <p className="login-subheading">Sign in to continue your job search</p>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{ paddingRight: 40 }}
                  required
                />
                <button type="button" className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="form-row">
              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
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

            {/* Submit Button */}
            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'} <ArrowRight />
            </button>
          </form>

          <div className="login-divider"><span>OR</span></div>

          <div className="login-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};