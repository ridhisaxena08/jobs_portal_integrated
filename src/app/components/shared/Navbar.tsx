import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Briefcase, Heart, Home, LogOut, Menu, X, Settings, ChevronDown } from 'lucide-react';
import api from '../../services/api';

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const authenticated = api.isAuthenticated();
    const user = api.getCurrentUser();
    setIsAuthenticated(authenticated);
    setCurrentUser(user);
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setIsUserMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/jobs', label: 'Find Jobs', icon: Search },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .jp-nav {
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
          border-bottom: 1px solid #e8e8e8;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .jp-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 60px;
          display: flex;
          align-items: center;
          gap: 32px;
        }

        /* Logo */
        .jp-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .jp-logo-icon {
          width: 32px;
          height: 32px;
          background: #111;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .jp-logo-icon svg {
          color: #fff;
          width: 16px;
          height: 16px;
        }

        .jp-logo-text {
          font-size: 15px;
          font-weight: 600;
          color: #111;
          letter-spacing: -0.3px;
        }

        /* Search */
        .jp-search-wrap {
          flex: 1;
          max-width: 380px;
          position: relative;
        }

        .jp-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #aaa;
          width: 15px;
          height: 15px;
          pointer-events: none;
        }

        .jp-search-input {
          width: 100%;
          height: 38px;
          padding: 0 14px 0 36px;
          border: 1.5px solid #e8e8e8;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          color: #111;
          background: #fafafa;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
          box-sizing: border-box;
        }

        .jp-search-input::placeholder { color: #bbb; }

        .jp-search-input:focus {
          border-color: #111;
          background: #fff;
        }

        /* Nav links */
        .jp-nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
          margin-left: auto;
        }

        .jp-nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border-radius: 7px;
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 500;
          color: #666;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
        }

        .jp-nav-link svg { width: 15px; height: 15px; flex-shrink: 0; }

        .jp-nav-link:hover {
          color: #111;
          background: #f4f4f4;
        }

        .jp-nav-link.active {
          color: #111;
          background: #f0f0f0;
        }

        /* Divider */
        .jp-divider {
          width: 1px;
          height: 22px;
          background: #e8e8e8;
          margin: 0 4px;
        }

        /* User menu */
        .jp-user-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .jp-user-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border: 1.5px solid #e8e8e8;
          border-radius: 8px;
          background: #fff;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          color: #333;
          transition: border-color 0.15s, background 0.15s;
        }

        .jp-user-btn:hover {
          border-color: #ccc;
          background: #fafafa;
        }

        .jp-user-avatar {
          width: 26px;
          height: 26px;
          background: #111;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .jp-user-avatar svg { color: #fff; width: 13px; height: 13px; }

        .jp-login-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1.5px solid #111;
          border-radius: 8px;
          background: #111;
          color: #fff;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }

        .jp-login-btn:hover {
          background: #333;
          border-color: #333;
          transform: translateY(-1px);
        }

        .jp-user-btn .chevron { color: #999; width: 14px; height: 14px; transition: transform 0.15s; }
        .jp-user-btn .chevron.open { transform: rotate(180deg); }

        .jp-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          background: #fff;
          border: 1.5px solid #e8e8e8;
          border-radius: 10px;
          padding: 6px;
          min-width: 180px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          animation: dropIn 0.15s ease;
        }

        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .jp-dropdown-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 10px;
          border-radius: 7px;
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 500;
          color: #444;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.12s, color 0.12s;
        }

        .jp-dropdown-item svg { width: 14px; height: 14px; }

        .jp-dropdown-item:hover { background: #f4f4f4; color: #111; }

        .jp-dropdown-sep {
          height: 1px;
          background: #f0f0f0;
          margin: 4px 0;
        }

        .jp-dropdown-item.danger { color: #d44; }
        .jp-dropdown-item.danger:hover { background: #fff5f5; color: #c00; }

        /* Mobile toggle */
        .jp-mobile-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          color: #444;
          margin-left: auto;
        }

        /* Mobile menu */
        .jp-mobile-menu {
          border-top: 1px solid #f0f0f0;
          background: #fff;
          padding: 16px;
          animation: slideDown 0.18s ease;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .jp-mobile-search {
          position: relative;
          margin-bottom: 16px;
        }

        .jp-mobile-search svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #aaa;
          width: 15px;
          height: 15px;
        }

        .jp-mobile-nav { display: flex; flex-direction: column; gap: 2px; }

        .jp-mobile-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          color: #555;
          transition: background 0.12s, color 0.12s;
        }

        .jp-mobile-link svg { width: 16px; height: 16px; }
        .jp-mobile-link:hover { background: #f4f4f4; color: #111; }
        .jp-mobile-link.active { background: #f0f0f0; color: #111; }

        .jp-mobile-sep { height: 1px; background: #f0f0f0; margin: 12px 0; }

        .jp-mobile-action {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          color: #555;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
        }

        .jp-mobile-action:hover { background: #f4f4f4; color: #111; }
        .jp-mobile-action.danger { color: #d44; }
        .jp-mobile-action.danger:hover { background: #fff5f5; color: #c00; }

        .jp-mobile-login {
          background: #111;
          color: #fff;
          border: 1.5px solid #111;
        }

        .jp-mobile-login:hover { 
          background: #333;
          border-color: #333;
        }

        @media (max-width: 768px) {
          .jp-search-wrap,
          .jp-nav-links,
          .jp-divider,
          .jp-user-wrap { display: none; }
          .jp-mobile-btn { display: flex; }
        }
      `}</style>

      <nav className="jp-nav">
        <div className="jp-nav-inner">
          {/* Logo */}
          <Link to="/" className="jp-logo">
            <div className="jp-logo-icon">
              <Briefcase />
            </div>
            <span className="jp-logo-text">JobPortal</span>
          </Link>

          {/* Search — Desktop */}
          <div className="jp-search-wrap">
            <Search className="jp-search-icon" />
            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="jp-search-input"
            />
          </div>

          {/* Nav Links — Desktop */}
          <div className="jp-nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`jp-nav-link${isActive ? ' active' : ''}`}
                >
                  <Icon />
                  {item.label}
                </Link>
              );
            })}

            <div className="jp-divider" />

            {/* User Dropdown */}
            <div className="jp-user-wrap">
              {isAuthenticated ? (
                <>
                  <button
                    className="jp-user-btn"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <div className="jp-user-avatar"><User /></div>
                    <span>{currentUser?.fullName || 'Account'}</span>
                    <ChevronDown className={`chevron${isUserMenuOpen ? ' open' : ''}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="jp-dropdown">
                      <Link
                        to="/profile"
                        className="jp-dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User /> Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="jp-dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings /> Settings
                      </Link>
                      <div className="jp-dropdown-sep" />
                      <button 
                        className="jp-dropdown-item danger"
                        onClick={handleLogout}
                      >
                        <LogOut /> Log out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login" className="jp-login-btn">
                  <User size={16} />
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            className="jp-mobile-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="jp-mobile-menu">
            <div className="jp-mobile-search">
              <Search />
              <input
                type="text"
                placeholder="Search jobs or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="jp-search-input"
                style={{ paddingLeft: 36 }}
              />
            </div>

            <div className="jp-mobile-nav">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`jp-mobile-link${isActive ? ' active' : ''}`}
                  >
                    <Icon />
                    {item.label}
                  </Link>
                );
              })}

              <div className="jp-mobile-sep" />

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="jp-mobile-link"
                  >
                    <User /> Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="jp-mobile-link"
                  >
                    <Settings /> Settings
                  </Link>
                  <button 
                    className="jp-mobile-action danger"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="jp-mobile-link jp-mobile-login"
                >
                  <User size={16} /> Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};