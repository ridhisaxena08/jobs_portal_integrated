import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, CheckCircle, XCircle, AlertCircle, Calendar, Building, ExternalLink, Filter, Search } from 'lucide-react';
import { Navbar } from '../components/shared/Navbar';
import { JobCard } from '../components/shared/JobCard';
import { Footer } from '../components/shared/Footer';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

export const AppliedJobsPage = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(false);

  const mockAppliedJobs = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary: { min: 120000, max: 180000, currency: '$' },
      description: 'We are looking for an experienced frontend developer to join our growing team.',
      requirements: ['React', 'TypeScript', 'Node.js'],
      benefits: ['Health insurance', '401k', 'Remote work'],
      postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 45,
      category: 'engineering',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop&crop=center',
      applicationStatus: 'under_review',
      appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Great match for React experience',
    },
    {
      id: '2',
      title: 'Product Designer',
      company: 'DesignHub',
      location: 'New York, NY',
      type: 'full-time',
      salary: { min: 90000, max: 130000, currency: '$' },
      description: 'Join our design team to create beautiful and intuitive user interfaces.',
      requirements: ['Figma', 'UI/UX', 'Prototyping'],
      benefits: ['Flexible hours', 'Creative freedom'],
      postedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 23,
      category: 'design',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop&crop=center',
      applicationStatus: 'interview_scheduled',
      appliedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      interviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      interviewType: 'video',
      notes: 'First round with design team lead',
    },
    {
      id: '3',
      title: 'Marketing Manager',
      company: 'GrowthCo',
      location: 'Austin, TX',
      type: 'full-time',
      salary: { min: 80000, max: 120000, currency: '$' },
      description: 'Lead our marketing efforts and help us reach new audiences.',
      requirements: ['Digital Marketing', 'Analytics', 'Content Strategy'],
      benefits: ['Performance bonus', 'Team events'],
      postedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 67,
      category: 'marketing',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop&crop=center',
      applicationStatus: 'rejected',
      appliedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      rejectionReason: 'Position filled with internal candidate',
      notes: 'Good experience, but not selected',
    },
    {
      id: '4',
      title: 'Backend Engineer',
      company: 'DataTech',
      location: 'Seattle, WA',
      type: 'full-time',
      salary: { min: 130000, max: 170000, currency: '$' },
      description: 'Build scalable backend systems and APIs for our data processing platform.',
      requirements: ['Python', 'AWS', 'Docker'],
      benefits: ['Stock options', 'Remote work'],
      postedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 34,
      category: 'engineering',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop&crop=center',
      applicationStatus: 'offer_received',
      appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      offerDetails: {
        salary: 145000,
        start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        response_deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      notes: 'Great offer with good benefits',
    },
    {
      id: '5',
      title: 'UX Researcher',
      company: 'UserFirst',
      location: 'Boston, MA',
      type: 'part-time',
      salary: { min: 70000, max: 90000, currency: '$' },
      description: 'Conduct user research and usability testing to inform product design.',
      requirements: ['User Research', 'Usability Testing'],
      benefits: ['Flexible schedule', 'Remote options'],
      postedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: 18,
      category: 'design',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=48&h=48&fit=crop&crop=center',
      applicationStatus: 'withdrawn',
      appliedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Withdrew - accepted another offer',
    },
  ];

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  useEffect(() => {
    filterAndSortJobs();
  }, [appliedJobs, searchQuery, statusFilter, sortBy]);

  const fetchAppliedJobs = async () => {
    setLoading(true);
    setTimeout(() => {
      setAppliedJobs(mockAppliedJobs);
      setLoading(false);
    }, 1000);
  };

  const filterAndSortJobs = () => {
    let filtered = appliedJobs;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.applicationStatus === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
        case 'company':
          return a.company.localeCompare(b.company);
        case 'salary_high':
          return b.salary.max - a.salary.max;
        case 'status':
          return a.applicationStatus.localeCompare(b.applicationStatus);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'under_review':
        return { icon: Clock, color: 'bg-blue-100 text-blue-800', label: 'Under Review' };
      case 'interview_scheduled':
        return { icon: Calendar, color: 'bg-yellow-100 text-yellow-800', label: 'Interview Scheduled' };
      case 'offer_received':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Offer Received' };
      case 'rejected':
        return { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Rejected' };
      case 'withdrawn':
        return { icon: AlertCircle, color: 'bg-gray-100 text-gray-800', label: 'Withdrawn' };
      default:
        return { icon: Clock, color: 'bg-gray-100 text-gray-800', label: 'Unknown' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusCount = (status: string) => {
    return appliedJobs.filter(job => job.applicationStatus === status).length;
  };

  const handleWithdrawApplication = (jobId: string) => {
    console.log('Withdrawing application:', jobId);
    // Implement withdrawal logic
  };

  const handleAcceptOffer = (jobId: string) => {
    console.log('Accepting offer:', jobId);
    // Implement offer acceptance logic
  };

  const handleDeclineOffer = (jobId: string) => {
    console.log('Declining offer:', jobId);
    // Implement offer decline logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Applied Jobs</h1>
          <p className="text-gray-600">Track and manage your job applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applied</p>
                  <p className="text-2xl font-bold text-gray-900">{appliedJobs.length}</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Under Review</p>
                  <p className="text-2xl font-bold text-gray-900">{getStatusCount('under_review')}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interviews</p>
                  <p className="text-2xl font-bold text-gray-900">{getStatusCount('interview_scheduled')}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Offers</p>
                  <p className="text-2xl font-bold text-gray-900">{getStatusCount('offer_received')}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search applied jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="offer_received">Offer Received</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="salary_high">Highest Salary</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
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
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const statusInfo = getStatusInfo(job.applicationStatus);
              const StatusIcon = statusInfo.icon;
              
              return (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {job.logo ? (
                            <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-lg" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Building className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                                <p className="text-gray-600">{job.company} • {job.location}</p>
                              </div>
                              <Badge className={statusInfo.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Applied:</span> {formatDate(job.appliedAt)}
                              </div>
                              <div>
                                <span className="font-medium">Updated:</span> {formatDate(job.lastUpdated)}
                              </div>
                              <div>
                                <span className="font-medium">Salary:</span> ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                              </div>
                            </div>
                            
                            {/* Status-specific content */}
                            {job.applicationStatus === 'interview_scheduled' && job.interviewDate && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="h-4 w-4 text-yellow-600" />
                                  <span className="font-medium text-yellow-800">
                                    Interview scheduled for {formatDate(job.interviewDate)}
                                  </span>
                                  {job.interviewType && (
                                    <Badge variant="outline" className="ml-2">
                                      {job.interviewType}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {job.applicationStatus === 'offer_received' && job.offerDetails && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                                <div className="text-sm text-green-800">
                                  <div className="font-medium mb-1">Offer Details:</div>
                                  <div>Salary: ${job.offerDetails.salary.toLocaleString()}/year</div>
                                  <div>Start Date: {formatDate(job.offerDetails.start_date)}</div>
                                  <div>Respond by: {formatDate(job.offerDetails.response_deadline)}</div>
                                </div>
                              </div>
                            )}
                            
                            {job.applicationStatus === 'rejected' && job.rejectionReason && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                <div className="text-sm text-red-800">
                                  <span className="font-medium">Reason:</span> {job.rejectionReason}
                                </div>
                              </div>
                            )}
                            
                            {job.notes && (
                              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <div className="text-sm text-gray-700">
                                  <span className="font-medium">Notes:</span> {job.notes}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex flex-wrap gap-2">
                              {job.requirements.slice(0, 3).map((req, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 lg:ml-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/jobs/${job.id}`}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Job
                          </Link>
                        </Button>
                        
                        {job.applicationStatus === 'under_review' && (
                          <Button variant="outline" size="sm" onClick={() => handleWithdrawApplication(job.id)}>
                            Withdraw
                          </Button>
                        )}
                        
                        {job.applicationStatus === 'offer_received' && (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleAcceptOffer(job.id)}>
                              Accept Offer
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeclineOffer(job.id)}>
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applied jobs found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your filters or search terms' 
                : 'Start applying to jobs to see them here'}
            </p>
            <Link to="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
