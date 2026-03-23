import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, SortAsc, Grid, List, Briefcase, MapPin, DollarSign, Clock, AlertTriangle, Building, ExternalLink } from 'lucide-react';
import { Navbar } from '../components/shared/Navbar';
import { JobCard } from '../components/shared/JobCard';
import { Footer } from '../components/shared/Footer';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Checkbox } from '../../components/ui/checkbox';

export const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const mockSavedJobs = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary: { min: 120000, max: 180000, currency: '$' },
      description: 'We are looking for an experienced frontend developer to join our growing team and help build amazing user experiences using React, TypeScript, and modern web technologies.',
      requirements: ['React', 'TypeScript', 'Node.js', 'CSS', 'Git'],
      benefits: ['Health insurance', '401k', 'Remote work', 'Flexible hours'],
      postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 45,
      category: 'engineering',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop&crop=center',
      savedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Great company culture and tech stack',
      isApplied: false,
    },
    {
      id: '2',
      title: 'Product Designer',
      company: 'DesignHub',
      location: 'New York, NY',
      type: 'full-time',
      salary: { min: 90000, max: 130000, currency: '$' },
      description: 'Join our design team to create beautiful and intuitive user interfaces for our flagship products. You\'ll work closely with product managers and engineers.',
      requirements: ['Figma', 'UI/UX', 'Prototyping', 'User Research'],
      benefits: ['Flexible hours', 'Creative freedom', 'Growth opportunities'],
      postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 23,
      category: 'design',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop&crop=center',
      savedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Perfect match for my design skills',
      isApplied: true,
    },
    {
      id: '3',
      title: 'Marketing Manager',
      company: 'GrowthCo',
      location: 'Austin, TX',
      type: 'full-time',
      salary: { min: 80000, max: 120000, currency: '$' },
      description: 'Lead our marketing efforts and help us reach new audiences with innovative campaigns. Experience with digital marketing and analytics required.',
      requirements: ['Digital Marketing', 'Analytics', 'Content Strategy', 'SEO'],
      benefits: ['Performance bonus', 'Team events', 'Professional development'],
      postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 67,
      category: 'marketing',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop&crop=center',
      savedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Interesting growth opportunities',
      isApplied: false,
    },
    {
      id: '4',
      title: 'Backend Engineer',
      company: 'DataTech',
      location: 'Seattle, WA',
      type: 'full-time',
      salary: { min: 130000, max: 170000, currency: '$' },
      description: 'Build scalable backend systems and APIs for our data processing platform. Experience with cloud services and microservices architecture.',
      requirements: ['Python', 'AWS', 'Docker', 'PostgreSQL', 'Redis'],
      benefits: ['Stock options', 'Remote work', 'Learning budget'],
      postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 34,
      category: 'engineering',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop&crop=center',
      savedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Great tech stack and remote options',
      isApplied: false,
    },
    {
      id: '5',
      title: 'UX Researcher',
      company: 'UserFirst',
      location: 'Boston, MA',
      type: 'part-time',
      salary: { min: 70000, max: 90000, currency: '$' },
      description: 'Conduct user research and usability testing to inform product design decisions. Help us create user-centered experiences.',
      requirements: ['User Research', 'Usability Testing', 'Data Analysis', 'Prototyping'],
      benefits: ['Flexible schedule', 'Remote options', 'Professional growth'],
      postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 18,
      category: 'design',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop&crop=center',
      savedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Good work-life balance',
      isApplied: false,
    },
    {
      id: '6',
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'full-time',
      salary: { min: 100000, max: 150000, currency: '$' },
      description: 'Join our remote-first team and build cutting-edge web applications with modern technologies.',
      requirements: ['React', 'Node.js', 'Python', 'AWS'],
      benefits: ['Fully remote', 'Flexible hours', 'Stock options'],
      postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 56,
      category: 'engineering',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop&crop=center',
      savedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Exciting startup with great potential',
      isApplied: false,
    },
  ];

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  useEffect(() => {
    filterAndSortJobs();
  }, [savedJobs, searchQuery, sortBy]);

  const fetchSavedJobs = async () => {
    setLoading(true);
    setTimeout(() => {
      setSavedJobs(mockSavedJobs);
      setLoading(false);
    }, 1000);
  };

  const filterAndSortJobs = () => {
    let filtered = savedJobs;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.requirements.some(req => req.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'salary_high':
          return b.salary.max - a.salary.max;
        case 'company':
          return a.company.localeCompare(b.company);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  };

  const handleUnsaveJob = (jobId: string) => {
    setSavedJobs(savedJobs.filter(job => job.id !== jobId));
    setSelectedJobs(selectedJobs.filter(id => id !== jobId));
  };

  const handleUnsaveSelected = () => {
    setSavedJobs(savedJobs.filter(job => !selectedJobs.includes(job.id)));
    setSelectedJobs([]);
    setShowDeleteDialog(false);
  };

  const handleApplyJob = (jobId: string) => {
    setSavedJobs(savedJobs.map(job => 
      job.id === jobId ? { ...job, isApplied: true } : job
    ));
  };

  const handleSelectJob = (jobId: string, checked: boolean) => {
    if (checked) {
      setSelectedJobs([...selectedJobs, jobId]);
    } else {
      setSelectedJobs(selectedJobs.filter(id => id !== jobId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedJobs(filteredJobs.map(job => job.id));
    } else {
      setSelectedJobs([]);
    }
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

  const sortOptions = [
    { value: 'recent', label: 'Recently Saved' },
    { value: 'deadline', label: 'Application Deadline' },
    { value: 'salary_high', label: 'Highest Salary' },
    { value: 'company', label: 'Company Name' },
  ];

  const expiredJobs = filteredJobs.filter(job => new Date(job.deadline) < new Date());
  const activeJobs = filteredJobs.filter(job => new Date(job.deadline) >= new Date());

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
              <p className="text-gray-600">
                {savedJobs.length} jobs saved • {activeJobs.length} active • {expiredJobs.length} expired
              </p>
            </div>
            
            {selectedJobs.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {selectedJobs.length} selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  Remove Selected
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search saved jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex border border-gray-200 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Expired Jobs Warning */}
        {expiredJobs.length > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-800">
                    {expiredJobs.length} saved {expiredJobs.length === 1 ? 'job has' : 'jobs have'} expired
                  </p>
                  <p className="text-sm text-orange-600">
                    Consider removing expired jobs or check if they've been reposted
                  </p>
                </div>
                <Button variant="outline" size="sm" className="border-orange-300 text-orange-800">
                  Review Expired
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Jobs List */}
        {loading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2' 
              : 'grid-cols-1'
          }`}>
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <>
            {/* Select All Checkbox */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-lg border border-gray-200">
              <Checkbox
                id="select-all"
                checked={selectedJobs.length === filteredJobs.length && filteredJobs.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium text-gray-700">
                Select all {filteredJobs.length} jobs
              </label>
            </div>

            {/* Jobs Grid/List */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2' 
                : 'grid-cols-1'
            }`}>
              {filteredJobs.map((job) => {
                const isExpired = new Date(job.deadline) < new Date();
                
                return (
                  <Card key={job.id} className={`hover:shadow-md transition-shadow ${
                    isExpired ? 'border-orange-200 bg-orange-50/50' : ''
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <Checkbox
                          checked={selectedJobs.includes(job.id)}
                          onCheckedChange={(checked) => handleSelectJob(job.id, checked as boolean)}
                          className="mt-1"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {job.logo ? (
                                <img src={job.logo} alt={job.company} className="w-10 h-10 rounded-lg" />
                              ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Building className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                                <p className="text-sm text-gray-600">{job.company}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {isExpired && (
                                <Badge variant="destructive" className="text-xs">
                                  Expired
                                </Badge>
                              )}
                              {job.isApplied && (
                                <Badge variant="secondary" className="text-xs">
                                  Applied
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>Saved {formatDate(job.savedAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              <span>{job.applicants} applicants</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                            {job.description}
                          </p>
                          
                          {job.notes && (
                            <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3">
                              <p className="text-sm text-blue-800">
                                <span className="font-medium">Note:</span> {job.notes}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-1 mb-4">
                            {job.requirements.slice(0, 3).map((req, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                            {job.requirements.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{job.requirements.length - 3}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!job.isApplied && !isExpired && (
                              <Button size="sm" onClick={() => handleApplyJob(job.id)}>
                                Apply Now
                              </Button>
                            )}
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/jobs/${job.id}`}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Job
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnsaveJob(job.id)}
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
                            >
                              <Heart className="h-4 w-4 mr-1 fill-current" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Start saving jobs to see them here'}
            </p>
            <Link to="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Saved Jobs</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove {selectedJobs.length} saved {selectedJobs.length === 1 ? 'job' : 'jobs'}? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleUnsaveSelected}>
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Footer />
    </div>
  );
};
