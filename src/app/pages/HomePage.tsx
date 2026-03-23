import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Briefcase, Heart, Eye, Clock, MapPin, DollarSign, Star, ArrowRight, Users, Building } from 'lucide-react';
import { Navbar } from '../components/shared/Navbar';
import { JobCard } from '../components/shared/JobCard';
import { Footer } from '../components/shared/Footer';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';

export const HomePage = () => {
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    title: 'Senior Frontend Developer',
    location: 'San Francisco, CA',
    experience: '5 years',
    skills: ['React', 'TypeScript', 'Node.js', 'CSS'],
    resumeUploaded: true,
    profileComplete: 85,
  });

  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [bestJobs, setBestJobs] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    appliedJobs: 12,
    savedJobs: 8,
    profileViews: 45,
    interviews: 3,
  });

  const mockRecommendedJobs = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary: { min: 120000, max: 180000, currency: '$' },
      description: 'We are looking for an experienced frontend developer to join our growing team and help build amazing user experiences.',
      requirements: ['React', 'TypeScript', 'Node.js'],
      benefits: ['Health insurance', '401k', 'Remote work'],
      postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 45,
      category: 'engineering',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop&crop=center',
      matchScore: 95,
    },
    {
      id: '2',
      title: 'React Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'full-time',
      salary: { min: 100000, max: 150000, currency: '$' },
      description: 'Join our remote-first team and build cutting-edge web applications with React and modern technologies.',
      requirements: ['React', 'TypeScript', 'GraphQL'],
      benefits: ['Fully remote', 'Flexible hours', 'Stock options'],
      postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 28,
      category: 'engineering',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop&crop=center',
      matchScore: 92,
    },
    {
      id: '3',
      title: 'Full Stack Engineer',
      company: 'InnovateCo',
      location: 'New York, NY',
      type: 'full-time',
      salary: { min: 110000, max: 160000, currency: '$' },
      description: 'Build scalable full-stack applications and work with a talented team of engineers.',
      requirements: ['React', 'Node.js', 'Python', 'AWS'],
      benefits: ['Great benefits', 'Career growth', 'Team events'],
      postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 56,
      category: 'engineering',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop&crop=center',
      matchScore: 88,
    },
  ];

  const mockBestJobs = [
    {
      id: '4',
      title: 'Principal Software Engineer',
      company: 'TechGiant',
      location: 'Seattle, WA',
      type: 'full-time',
      salary: { min: 180000, max: 250000, currency: '$' },
      description: 'Lead engineering teams and architect complex systems for millions of users.',
      requirements: ['10+ years experience', 'System Design', 'Leadership'],
      benefits: ['Top salary', 'Stock options', 'Premium benefits'],
      postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 89,
      category: 'engineering',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop&crop=center',
      rating: 4.8,
    },
    {
      id: '5',
      title: 'Staff Frontend Engineer',
      company: 'FinTech Startup',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary: { min: 150000, max: 200000, currency: '$' },
      description: 'Build revolutionary financial products with modern frontend technologies.',
      requirements: ['React', 'TypeScript', 'Financial domain'],
      benefits: ['High salary', 'Equity', 'Remote options'],
      postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 67,
      category: 'engineering',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop&crop=center',
      rating: 4.7,
    },
    {
      id: '6',
      title: 'Senior UX Designer',
      company: 'Design Studio',
      location: 'Remote',
      type: 'full-time',
      salary: { min: 110000, max: 140000, currency: '$' },
      description: 'Create beautiful and intuitive user experiences for our clients.',
      requirements: ['UX Design', 'Figma', 'User Research'],
      benefits: ['Creative freedom', 'Remote work', 'Great culture'],
      postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 34,
      category: 'design',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop&crop=center',
      rating: 4.6,
    },
  ];

  const mockRecentActivity = [
    {
      id: '1',
      type: 'applied',
      jobTitle: 'Frontend Developer',
      company: 'TechCorp',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
    },
    {
      id: '2',
      type: 'saved',
      jobTitle: 'React Developer',
      company: 'StartupXYZ',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      type: 'viewed',
      jobTitle: 'Full Stack Engineer',
      company: 'InnovateCo',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      type: 'interview',
      jobTitle: 'Senior Developer',
      company: 'FinanceCo',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled',
    },
  ];

  useEffect(() => {
    setRecommendedJobs(mockRecommendedJobs);
    setBestJobs(mockBestJobs);
    setRecentActivity(mockRecentActivity);
  }, []);

  const handleSaveJob = (jobId: string) => {
    console.log('Saving job:', jobId);
  };

  const handleApplyJob = (jobId: string) => {
    console.log('Applying to job:', jobId);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'applied':
        return <Briefcase className="h-4 w-4 text-blue-600" />;
      case 'saved':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'viewed':
        return <Eye className="h-4 w-4 text-gray-500" />;
      case 'interview':
        return <Star className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {userProfile.name}!</h1>
                <p className="text-blue-100 mb-4">
                  {userProfile.title} • {userProfile.location} • {userProfile.experience} experience
                </p>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="text-center">
                  <div className="text-2xl font-bold">{userProfile.profileComplete}%</div>
                  <div className="text-sm text-blue-100 mb-2">Profile Complete</div>
                  <Progress value={userProfile.profileComplete} className="w-32 bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Applied Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.appliedJobs}</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Saved Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.savedJobs}</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profile Views</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.profileViews}</p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.interviews}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="recommended" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="recommended">Recommended for You</TabsTrigger>
                <TabsTrigger value="best">Best Jobs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recommended" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Recommended Jobs</h2>
                    <p className="text-gray-600">Based on your profile and preferences</p>
                  </div>
                  <Link to="/jobs">
                    <Button variant="outline" size="sm">
                      View All
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {recommendedJobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            {job.logo ? (
                              <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-lg" />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Building className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-gray-900">{job.title}</h3>
                              <p className="text-sm text-gray-600">{job.company}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-green-100 text-green-800">
                              {job.matchScore}% Match
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{job.salary.currency}{job.salary.min.toLocaleString()} - {job.salary.currency}{job.salary.max.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                          {job.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {job.requirements.slice(0, 3).map((req, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" onClick={() => handleApplyJob(job.id)}>
                              Apply Now
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleSaveJob(job.id)}>
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="best" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Best Jobs This Week</h2>
                    <p className="text-gray-600">Top-rated opportunities with great benefits</p>
                  </div>
                  <Link to="/jobs">
                    <Button variant="outline" size="sm">
                      View All
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
                
                <div className="grid gap-4">
                  {bestJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onSave={handleSaveJob}
                      onApply={handleApplyJob}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.type === 'applied' && 'Applied to '}
                        {activity.type === 'saved' && 'Saved '}
                        {activity.type === 'viewed' && 'Viewed '}
                        {activity.type === 'interview' && 'Interview with '}
                        {activity.jobTitle}
                      </p>
                      <p className="text-sm text-gray-600">{activity.company}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                        {activity.status && (
                          <Badge variant="outline" className="text-xs">
                            {activity.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <Link to="/activity">
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Activity
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            {!userProfile.resumeUploaded && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Complete Your Profile</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload your resume to get better job recommendations
                  </p>
                  <Link to="/profile">
                    <Button size="sm" className="w-full">
                      Upload Resume
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/jobs">
                  <Button variant="outline" className="w-full justify-start">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Browse Jobs
                  </Button>
                </Link>
                <Link to="/saved">
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    Saved Jobs
                  </Button>
                </Link>
                <Link to="/applied">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Applied Jobs
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
