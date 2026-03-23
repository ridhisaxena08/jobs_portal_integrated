import { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../components/ui/accordion';
import { Checkbox } from '../../../components/ui/checkbox';
import { Slider } from '../../../components/ui/slider';

interface JobFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export const JobFilters = ({ onFiltersChange }: JobFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    jobType: [] as string[],
    experience: [] as string[],
    salaryRange: [0, 200000] as [number, number],
    location: [] as string[],
    company: [] as string[],
    skills: [] as string[],
    postedWithin: 'all',
    remote: false,
  });

  const jobTypes = [
    { id: 'full-time', label: 'Full Time' },
    { id: 'part-time', label: 'Part Time' },
    { id: 'contract', label: 'Contract' },
    { id: 'internship', label: 'Internship' },
    { id: 'remote', label: 'Remote' },
  ];

  const experienceLevels = [
    { id: 'entry', label: 'Entry Level (0-2 years)' },
    { id: 'mid', label: 'Mid Level (2-5 years)' },
    { id: 'senior', label: 'Senior Level (5-10 years)' },
    { id: 'lead', label: 'Lead/Manager (10+ years)' },
  ];

  const locations = [
    'New York, NY',
    'San Francisco, CA',
    'Austin, TX',
    'Seattle, WA',
    'Boston, MA',
    'Chicago, IL',
    'Remote',
  ];

  const companies = [
    'Google',
    'Microsoft',
    'Apple',
    'Amazon',
    'Meta',
    'Netflix',
    'Tesla',
    'Spotify',
  ];

  const skills = [
    'JavaScript',
    'Python',
    'React',
    'Node.js',
    'TypeScript',
    'Java',
    'C++',
    'Go',
    'Rust',
    'SQL',
    'Docker',
    'AWS',
    'Kubernetes',
    'GraphQL',
    'MongoDB',
  ];

  const postedWithinOptions = [
    { value: 'all', label: 'All time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This week' },
    { value: 'month', label: 'This month' },
  ];

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange({ ...newFilters, searchQuery });
  };

  const handleCheckboxFilter = (key: string, value: string, checked: boolean) => {
    const currentValues = filters[key] as string[];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);
    handleFilterChange(key, newValues);
  };

  const clearAllFilters = () => {
    setFilters({
      jobType: [],
      experience: [],
      salaryRange: [0, 200000],
      location: [],
      company: [],
      skills: [],
      postedWithin: 'all',
      remote: false,
    });
    setSearchQuery('');
    onFiltersChange({ searchQuery: '', ...filters });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (filters.jobType.length > 0) count++;
    if (filters.experience.length > 0) count++;
    if (filters.salaryRange[0] > 0 || filters.salaryRange[1] < 200000) count++;
    if (filters.location.length > 0) count++;
    if (filters.company.length > 0) count++;
    if (filters.skills.length > 0) count++;
    if (filters.postedWithin !== 'all') count++;
    if (filters.remote) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search jobs, companies, or keywords..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleFilterChange('searchQuery', e.target.value);
            }}
            className="pl-10 pr-4"
          />
        </div>
      </div>

      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary">{getActiveFiltersCount()}</Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {getActiveFiltersCount() > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className={`space-y-6 ${isExpanded ? '' : 'max-h-96 overflow-y-auto'}`}>
        {/* Job Type */}
        <Accordion type="single" collapsible defaultValue="job-type">
          <AccordionItem value="job-type">
            <AccordionTrigger className="text-left">Job Type</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {jobTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.id}
                      checked={filters.jobType.includes(type.id)}
                      onCheckedChange={(checked) =>
                        handleCheckboxFilter('jobType', type.id, checked as boolean)
                      }
                    />
                    <label htmlFor={type.id} className="text-sm text-gray-700">
                      {type.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Experience Level */}
        <Accordion type="single" collapsible defaultValue="experience">
          <AccordionItem value="experience">
            <AccordionTrigger className="text-left">Experience Level</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {experienceLevels.map((level) => (
                  <div key={level.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={level.id}
                      checked={filters.experience.includes(level.id)}
                      onCheckedChange={(checked) =>
                        handleCheckboxFilter('experience', level.id, checked as boolean)
                      }
                    />
                    <label htmlFor={level.id} className="text-sm text-gray-700">
                      {level.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Salary Range */}
        <Accordion type="single" collapsible defaultValue="salary">
          <AccordionItem value="salary">
            <AccordionTrigger className="text-left">Salary Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="px-2">
                  <Slider
                    value={filters.salaryRange}
                    onValueChange={(value) =>
                      handleFilterChange('salaryRange', value as [number, number])
                    }
                    max={200000}
                    step={5000}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>${filters.salaryRange[0].toLocaleString()}</span>
                  <span>${filters.salaryRange[1].toLocaleString()}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Location */}
        <Accordion type="single" collapsible defaultValue="location">
          <AccordionItem value="location">
            <AccordionTrigger className="text-left">Location</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {locations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={location}
                      checked={filters.location.includes(location)}
                      onCheckedChange={(checked) =>
                        handleCheckboxFilter('location', location, checked as boolean)
                      }
                    />
                    <label htmlFor={location} className="text-sm text-gray-700">
                      {location}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Posted Within */}
        <div>
          <label className="text-sm font-medium text-gray-900 mb-2 block">
            Posted Within
          </label>
          <Select
            value={filters.postedWithin}
            onValueChange={(value) => handleFilterChange('postedWithin', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {postedWithinOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Remote Only */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remote"
            checked={filters.remote}
            onCheckedChange={(checked) =>
              handleFilterChange('remote', checked as boolean)
            }
          />
          <label htmlFor="remote" className="text-sm text-gray-700">
            Remote jobs only
          </label>
        </div>
      </div>
    </div>
  );
};
