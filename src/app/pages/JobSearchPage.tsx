import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SortAsc, Grid, List, MapPin, DollarSign } from 'lucide-react';
import { Navbar } from '../components/shared/Navbar';
import { JobCard } from '../components/shared/JobCard';
import { JobFilters } from '../components/shared/JobFilters';
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/pagination';
import api from '../services/api';

export const JobSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState({
    searchQuery: searchParams.get('q') || '',
    jobType: [],
    experience: [],
    salaryRange: [0, 200000],
    location: [],
    company: [],
    skills: [],
    postedWithin: 'all',
    remote: false,
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      // Build API parameters from filters
      const params: any = {
        page: currentPage,
        limit: 6
      };

      // Only add parameters that have actual values
      if (filters.searchQuery && filters.searchQuery.trim()) {
        params.search = filters.searchQuery;
      }
      if (filters.jobType?.[0]) {
        params.category = filters.jobType[0];
      }
      if (filters.experience?.[0]) {
        params.type = filters.experience[0];
      }
      if (filters.location?.[0]) {
        params.location = filters.location[0];
      }
      
      params.sortBy = sortBy === 'relevance' ? 'postedAt' : sortBy;
      params.sortOrder = 'desc';

      const response = await api.getJobs(params);
      
      if (response.success) {
        setJobs(response.data.jobs);
        setTotalResults(response.data.pagination.total);
        setTotalPages(response.data.pagination.pages);
      } else {
        console.error('Failed to fetch jobs:', response.message);
        setJobs([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters, currentPage, sortBy]);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSaveJob = (jobId: string) => {
    console.log('Saving job:', jobId);
    // Implement save job logic
  };

  const handleApplyJob = (jobId: string) => {
    console.log('Applying to job:', jobId);
    // Implement apply job logic
  };

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'salary-high', label: 'Highest Salary' },
    { value: 'salary-low', label: 'Lowest Salary' },
    { value: 'applicants', label: 'Fewest Applicants' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {filters.searchQuery ? `Results for "${filters.searchQuery}"` : 'All Jobs'}
              </h1>
              <p className="text-gray-600 mt-1">
                {totalResults} jobs found
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Quick search..."
                  value={filters.searchQuery}
                  onChange={(e) => handleFiltersChange({ ...filters, searchQuery: e.target.value })}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <JobFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Job Results */}
          <div className="flex-1">
            {/* Active Filters */}
            {Object.values(filters).some((value) => 
              Array.isArray(value) ? value.length > 0 : value !== '' && value !== 'all' && value !== false
            ) && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    {filters.jobType.map((type) => (
                      <Badge key={type} variant="secondary" className="cursor-pointer">
                        {type}
                      </Badge>
                    ))}
                    {filters.location.map((location) => (
                      <Badge key={location} variant="secondary" className="cursor-pointer">
                        <MapPin className="h-3 w-3 mr-1" />
                        {location}
                      </Badge>
                    ))}
                    {filters.company.map((company) => (
                      <Badge key={company} variant="secondary" className="cursor-pointer">
                        {company}
                      </Badge>
                    ))}
                    {filters.remote && (
                      <Badge variant="secondary" className="cursor-pointer">
                        Remote only
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            ) : (
              <>
                {/* Job Results */}
                {jobs.length > 0 ? (
                  <>
                    <div className={`grid gap-6 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 md:grid-cols-2' 
                        : 'grid-cols-1'
                    }`}>
                      {jobs.map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          onSave={handleSaveJob}
                          onApply={handleApplyJob}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-8">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                              />
                            </PaginationItem>
                            
                            {[...Array(Math.min(5, totalPages))].map((_, index) => {
                              const pageNumber = index + 1;
                              return (
                                <PaginationItem key={pageNumber}>
                                  <PaginationLink
                                    onClick={() => setCurrentPage(pageNumber)}
                                    isActive={currentPage === pageNumber}
                                    className="cursor-pointer"
                                  >
                                    {pageNumber}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            })}
                            
                            {totalPages > 5 && (
                              <>
                                <PaginationItem>
                                  <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem>
                                  <PaginationLink
                                    onClick={() => setCurrentPage(totalPages)}
                                    isActive={currentPage === totalPages}
                                    className="cursor-pointer"
                                  >
                                    {totalPages}
                                  </PaginationLink>
                                </PaginationItem>
                              </>
                            )}
                            
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Search className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-600">Try adjusting your filters or search terms</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
