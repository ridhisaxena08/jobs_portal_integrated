import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Briefcase, Users, ArrowRight, TrendingUp, CheckCircle } from 'lucide-react';
import { Navbar } from '../components/shared/Navbar';
import { JobCard } from '../components/shared/JobCard';
import { Footer } from '../components/shared/Footer';
import api, { Job } from '../services/api';

export const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);

  // Fetch featured jobs from API
  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const response = await api.getJobs({ 
          page: 1, 
          limit: 6, 
          featured: true 
        });
        
        if (response.success) {
          setFeaturedJobs(response.data.jobs);
        } else {
          console.error('Failed to fetch featured jobs:', response.message);
        }
      } catch (error) {
        console.error('Error fetching featured jobs:', error);
      }
    };

    fetchFeaturedJobs();
  }, []);

  const categories = [
    { id: 'all', label: 'All Jobs', count: 12543 },
    { id: 'engineering', label: 'Engineering', count: 3421 },
  ];

  const stats = [
    { icon: Briefcase, label: 'Active Jobs', value: '12,543+', change: '+523 this week' },
    { icon: Users, label: 'Companies', value: '3,847+', change: '+127 this month' },
    { icon: TrendingUp, label: 'Hiring Rate', value: '89%', change: '+12% vs last month' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      company: 'TechCorp',
      content: 'I found my dream job through this platform. The process was smooth and the recommendations were spot on!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=48&h=48&fit=crop&crop=center',
    },
    {
      name: 'Michael Chen',
      role: 'Product Designer',
      company: 'DesignHub',
      content: "The best job search experience I've had. Clean interface, great filters, and amazing opportunities.",
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=center',
    },
  ];

  const steps = [
    { step: '01', title: 'Create Profile', description: 'Build your professional profile and upload your resume.' },
    { step: '02', title: 'Browse Jobs', description: 'Search through thousands of curated job opportunities.' },
    { step: '03', title: 'Apply Instantly', description: 'Apply with one click or a tailored application.' },
    { step: '04', title: 'Get Hired', description: 'Connect with employers and land your next role.' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/jobs?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f9f9f7', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,600;0,700;1,600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-root { font-family: 'DM Sans', sans-serif; background: #f9f9f7; color: #1a1a1a; }

        /* ── HERO ── */
        .lp-hero {
          background: #fff;
          padding: 72px 24px 80px;
          border-bottom: 1px solid #ebebeb;
        }
        .lp-hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .lp-hero-inner { grid-template-columns: 1fr; gap: 40px; }
          .lp-hero-img-col { order: -1; }
        }

        .lp-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f0faf0;
          color: #2a7a2a;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 100px;
          margin-bottom: 20px;
        }
        .lp-hero-eyebrow span { width: 6px; height: 6px; background: #3ab03a; border-radius: 50%; display: inline-block; }

        .lp-hero h1 {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(38px, 5vw, 58px);
          font-weight: 700;
          line-height: 1.1;
          color: #111;
          letter-spacing: -1.5px;
          margin-bottom: 20px;
        }
        .lp-hero h1 em {
          font-style: italic;
          color: #1a56db;
        }

        .lp-hero-sub {
          font-size: 17px;
          color: #666;
          line-height: 1.65;
          max-width: 460px;
          margin-bottom: 32px;
        }

        .lp-search-form {
          display: flex;
          background: #fff;
          border: 1.5px solid #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          margin-bottom: 32px;
        }
        .lp-search-form input {
          flex: 1;
          padding: 14px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px;
          color: #111;
          border: none;
          outline: none;
          background: transparent;
        }
        .lp-search-form input::placeholder { color: #bbb; }
        .lp-search-form button {
          padding: 10px 22px;
          margin: 5px;
          background: #111;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 7px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: background 0.15s;
          white-space: nowrap;
        }
        .lp-search-form button:hover { background: #333; }

        .lp-trust {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        .lp-trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          color: #555;
        }
        .lp-trust-item svg { color: #3ab03a; width: 16px; height: 16px; flex-shrink: 0; }

        /* Hero image */
        .lp-hero-img-col { position: relative; }
        .lp-hero-img {
          width: 100%;
          border-radius: 16px;
          display: block;
          aspect-ratio: 4/3;
          object-fit: cover;
        }
        .lp-hero-badge {
          position: absolute;
          bottom: -16px;
          right: -16px;
          background: #111;
          color: #fff;
          padding: 14px 18px;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.18);
        }
        .lp-hero-badge .num { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 700; line-height: 1; }
        .lp-hero-badge .lbl { font-size: 11px; color: #aaa; margin-top: 3px; letter-spacing: 0.3px; }

        /* ── STATS ── */
        .lp-stats {
          background: #111;
          padding: 40px 24px;
        }
        .lp-stats-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
        }
        @media (max-width: 600px) { .lp-stats-inner { grid-template-columns: 1fr; } }
        .lp-stat {
          padding: 16px 32px;
          border-right: 1px solid #2a2a2a;
          text-align: center;
        }
        .lp-stat:last-child { border-right: none; }
        .lp-stat-val {
          font-family: 'Fraunces', serif;
          font-size: 32px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
          margin-bottom: 4px;
        }
        .lp-stat-label { font-size: 13px; color: #999; margin-bottom: 4px; }
        .lp-stat-change { font-size: 12px; color: #5db85d; }

        /* ── SECTION SHARED ── */
        .lp-section { padding: 80px 24px; }
        .lp-section-alt { 
          background: #fff; 
          padding: 80px 24px;
        }
        .lp-section-inner { max-width: 1200px; margin: 0 auto; }
        .lp-section-header { margin-bottom: 48px; }
        .lp-section-header h2 {
          font-family: 'Fraunces', serif;
          font-size: clamp(28px, 3.5vw, 38px);
          font-weight: 700;
          color: #111;
          letter-spacing: -0.8px;
          margin-bottom: 8px;
        }
        .lp-section-header p { font-size: 16px; color: #777; }

        .lp-section-head-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }

        /* ── CATEGORIES ── */
        .lp-categories {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
        }
        @media (max-width: 900px) { .lp-categories { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 500px) { .lp-categories { grid-template-columns: repeat(2, 1fr); } }

        .lp-cat-btn {
          padding: 16px 12px;
          border: 1.5px solid #e8e8e8;
          border-radius: 10px;
          background: #fff;
          cursor: pointer;
          text-align: left;
          transition: border-color 0.15s, background 0.15s, transform 0.1s;
          font-family: 'DM Sans', sans-serif;
        }
        .lp-cat-btn:hover { border-color: #ccc; background: #fafafa; transform: translateY(-1px); }
        .lp-cat-btn.active { border-color: #111; background: #111; }

        .lp-cat-label {
          font-size: 14px;
          font-weight: 600;
          color: #222;
          margin-bottom: 4px;
          display: block;
        }
        .lp-cat-btn.active .lp-cat-label { color: #fff; }
        .lp-cat-count { font-size: 12px; color: #999; display: block; }
        .lp-cat-btn.active .lp-cat-count { color: #aaa; }

        /* ── JOBS GRID ── */
        .lp-jobs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) { .lp-jobs-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .lp-jobs-grid { grid-template-columns: 1fr; } }

        /* ── HOW IT WORKS ── */
        .lp-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }
        @media (max-width: 800px) { .lp-steps { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .lp-steps { grid-template-columns: 1fr; } }

        .lp-step { position: relative; }
        .lp-step-num {
          font-family: 'Fraunces', serif;
          font-size: 48px;
          font-weight: 700;
          color: #f0f0ee;
          line-height: 1;
          margin-bottom: 8px;
          letter-spacing: -2px;
        }
        .lp-step h3 {
          font-size: 15px;
          font-weight: 600;
          color: #111;
          margin-bottom: 6px;
        }
        .lp-step p { font-size: 13.5px; color: #777; line-height: 1.6; }

        /* ── TESTIMONIALS ── */
        .lp-testimonials {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (max-width: 640px) { .lp-testimonials { grid-template-columns: 1fr; } }

        .lp-testimonial {
          background: #fff;
          border: 1.5px solid #ebebeb;
          border-radius: 12px;
          padding: 28px;
        }
        .lp-testimonial-stars {
          display: flex;
          gap: 3px;
          margin-bottom: 14px;
        }
        .lp-testimonial-stars svg { width: 14px; height: 14px; fill: #f59e0b; color: #f59e0b; }
        .lp-testimonial-text {
          font-size: 15px;
          color: #333;
          line-height: 1.65;
          margin-bottom: 20px;
          font-style: italic;
        }
        .lp-testimonial-author { display: flex; align-items: center; gap: 12px; }
        .lp-testimonial-author img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
        .lp-testimonial-name { font-size: 14px; font-weight: 600; color: #111; }
        .lp-testimonial-role { font-size: 12.5px; color: #888; margin-top: 2px; }

        /* ── CTA ── */
        .lp-cta {
          background: #111;
          padding: 80px 24px;
          text-align: center;
        }
        .lp-cta-inner { max-width: 600px; margin: 0 auto; }
        .lp-cta h2 {
          font-family: 'Fraunces', serif;
          font-size: clamp(30px, 4vw, 44px);
          font-weight: 700;
          color: #fff;
          letter-spacing: -1px;
          margin-bottom: 14px;
          line-height: 1.1;
        }
        .lp-cta p {
          font-size: 16px;
          color: #888;
          margin-bottom: 36px;
          line-height: 1.6;
        }
        .lp-cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .lp-btn-primary {
          padding: 13px 28px;
          background: #fff;
          color: #111;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: background 0.15s, transform 0.1s;
        }
        .lp-btn-primary:hover { background: #f0f0f0; transform: translateY(-1px); }
        .lp-btn-outline {
          padding: 13px 28px;
          background: transparent;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          border: 1.5px solid #333;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: border-color 0.15s, background 0.15s;
        }
        .lp-btn-outline:hover { border-color: #666; background: #1a1a1a; }

        /* view-all link */
        .lp-view-all {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          font-weight: 600;
          color: #111;
          text-decoration: none;
          padding: 9px 16px;
          border: 1.5px solid #e0e0e0;
          border-radius: 8px;
          transition: border-color 0.15s, background 0.15s;
        }
        .lp-view-all:hover { border-color: #bbb; background: #fafafa; }
        .lp-view-all svg { width: 14px; height: 14px; }
      `}</style>

      <div className="lp-root">
        <Navbar />

        {/* ── HERO ── */}
        <section className="lp-hero">
          <div className="lp-hero-inner">
            <div>
              <div className="lp-hero-eyebrow">
                <span></span> Now hiring — 12,543 open roles
              </div>
              <h1>
                Find your <em>next great</em> opportunity
              </h1>
              <p className="lp-hero-sub">
                Connect with top companies and discover roles that match your skills. Thousands of verified jobs, updated daily.
              </p>
              <form className="lp-search-form" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Job title, company, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">
                  <Search size={15} /> Search
                </button>
              </form>
              <div className="lp-trust">
                <div className="lp-trust-item"><CheckCircle size={15} /> Verified companies only</div>
                <div className="lp-trust-item"><CheckCircle size={15} /> Free to apply</div>
                <div className="lp-trust-item"><CheckCircle size={15} /> 89% placement rate</div>
              </div>
            </div>

            <div className="lp-hero-img-col">
              <img
                src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=700&h=520&fit=crop&crop=center"
                alt="Professional working"
                className="lp-hero-img"
              />
              <div className="lp-hero-badge">
                <div className="num">3,847+</div>
                <div className="lbl">Verified Employers</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <div className="lp-stats">
          <div className="lp-stats-inner">
            {stats.map((s) => (
              <div className="lp-stat" key={s.label}>
                <div className="lp-stat-val">{s.value}</div>
                <div className="lp-stat-label">{s.label}</div>
                <div className="lp-stat-change">{s.change}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CATEGORIES ── */}
        <section className="lp-section lp-section-alt">
          <div className="lp-section-inner">
            <div className="lp-section-header">
              <h2>Explore by category</h2>
              <p>Find roles in your area of expertise</p>
            </div>
            <div className="lp-categories">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`lp-cat-btn${selectedCategory === cat.id ? ' active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span className="lp-cat-label">{cat.label}</span>
                  <span className="lp-cat-count">{cat.count.toLocaleString()} jobs</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED JOBS ── */}
        <section className="lp-section">
          <div className="lp-section-inner">
            <div className="lp-section-head-row">
              <div className="lp-section-header" style={{ marginBottom: 0 }}>
                <h2>Featured jobs</h2>
                <p>Hand-picked opportunities from top companies</p>
              </div>
              <Link to="/jobs" className="lp-view-all">
                View all <ArrowRight />
              </Link>
            </div>
            <div className="lp-jobs-grid">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="lp-section lp-section-alt">
          <div className="lp-section-inner">
            <div className="lp-section-header">
              <h2>How it works</h2>
              <p>Get hired in four simple steps</p>
            </div>
            <div className="lp-steps">
              {steps.map((s) => (
                <div className="lp-step" key={s.step}>
                  <div className="lp-step-num">{s.step}</div>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="lp-section">
          <div className="lp-section-inner">
            <div className="lp-section-header">
              <h2>Success stories</h2>
              <p>Hear from people who found their next role here</p>
            </div>
            <div className="lp-testimonials">
              {testimonials.map((t, i) => (
                <div className="lp-testimonial" key={i}>
                  <div className="lp-testimonial-stars">
                    {[...Array(t.rating)].map((_, j) => <Star key={`star-${i}-${j}`} />)}
                  </div>
                  <p className="lp-testimonial-text">"{t.content}"</p>
                  <div className="lp-testimonial-author">
                    <img src={t.avatar} alt={t.name} />
                    <div>
                      <div className="lp-testimonial-name">{t.name}</div>
                      <div className="lp-testimonial-role">{t.role} · {t.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="lp-cta">
          <div className="lp-cta-inner">
            <h2>Ready to find your next role?</h2>
            <p>Join thousands of professionals who've already taken the next step in their careers.</p>
            <div className="lp-cta-btns">
              <Link to="/jobs" className="lp-btn-primary">
                <Search size={15} /> Search Jobs
              </Link>
              <Link to="/profile" className="lp-btn-outline">
                Create Profile
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};