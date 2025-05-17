import { Filter, Calendar, ChevronDown, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  bedsRange: number;
  setBedsRange: (range: number) => void;
  bathsRange: number;
  setBathsRange: (range: number) => void;
  selectedPropertyTypes: string[];
  setSelectedPropertyTypes: (types: string[]) => void;
  formatPrice: (price: number) => string;
  searchProperties: () => void;
  loading: boolean;
}

export function FilterPanel({
  showFilters,
  setShowFilters,
  activeFilter,
  setActiveFilter,
  priceRange,
  setPriceRange,
  bedsRange,
  setBedsRange,
  bathsRange,
  setBathsRange,
  selectedPropertyTypes,
  setSelectedPropertyTypes,
  formatPrice,
  searchProperties,
  loading,
}: FilterPanelProps) {
  // Time filter options
  const timeFilters = [
    { id: 'all', label: 'All Listings' },
    { id: 'new', label: 'New (24h)' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];

  // Property type options
  const propertyTypes = [
    'All Properties',
    'Single-family',
    'Condo',
    'Townhouse',
    'Multi-family',
    'Land',
    'Apartment',
    'Mobile',
    'Farm/Ranch',
  ];

  return (
    <div
      className={cn(
        'fixed md:absolute bottom-0 md:top-4 left-0 md:left-auto right-0 md:right-4',
        'w-full md:w-64 bg-white/60 dark:bg-background/40 backdrop-blur-xl shadow-lg z-20',
        'border border-black/5 dark:border-white/10 rounded-t-lg md:rounded-lg',
        'transition-all duration-300 ease-in-out',
        showFilters
          ? 'h-[calc(100vh-300px)] md:h-fit translate-y-[140px] md:translate-y-0'
          : 'h-14 translate-y-[calc(100vh-60px)] md:translate-y-0',
      )}
    >
      {/* Header - Always visible */}
      <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-background/60 backdrop-blur-xl border-b border-black/5 dark:border-white/10">
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2 text-gray-800 dark:text-white/80" />
          <h3 className="font-medium text-gray-800 dark:text-white/80">Filter Properties</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-gray-700 hover:text-gray-900 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide' : 'Show'}
        </Button>
      </div>

      {/* Filter Content */}
      <div
        className={cn(
          'transition-all duration-300',
          showFilters ? 'h-[calc(100%-56px)] overflow-y-auto' : 'h-0 overflow-hidden',
        )}
      >
        <div className="p-4 space-y-4">
          {/* When Filter */}
          <div>
            <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-white/80">
              When Listed?
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {timeFilters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? 'default' : 'outline'}
                  className={cn(
                    'backdrop-blur-sm border-black/5 dark:border-white/10',
                    activeFilter === filter.id
                      ? 'bg-gray-900/10 dark:bg-white/20 text-gray-900 dark:text-white'
                      : 'bg-white/50 hover:bg-gray-900/5 dark:bg-white/5 text-gray-700 hover:text-gray-900 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white',
                  )}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
            {/* <Button
              variant="outline"
              className="w-full mt-2 justify-between bg-white/50 hover:bg-gray-900/5 dark:bg-white/5 backdrop-blur-sm border-black/5 dark:border-white/10 text-gray-700 hover:text-gray-900 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Custom Date Range
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button> */}
          </div>

          {/* Price Range Filter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-medium text-gray-800 dark:text-white/80">Price Range</h4>
              <Button
                variant="link"
                size="sm"
                className="h-6 px-2 text-gray-600 hover:text-gray-900 dark:text-white/60 dark:hover:text-white"
                onClick={() => setPriceRange([500000, 1500000])}
              >
                Reset
              </Button>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1 text-gray-700 dark:text-white/80">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
              <div className="px-2">
                <Slider
                  defaultValue={[500000, 1500000]}
                  min={100000}
                  max={3000000}
                  step={50000}
                  value={priceRange}
                  onValueChange={(value: number[]) => setPriceRange(value as [number, number])}
                  className="[&_[role=slider]]:bg-gray-900 dark:[&_[role=slider]]:bg-white [&_[role=slider]]:border-none"
                />
              </div>
            </div>
          </div>

          {/* Beds & Baths Filters */}
          <div>
            <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-white/80">
              Beds & Baths
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm text-gray-700 dark:text-white/80">Beds (min)</label>
                <select
                  className="w-full p-2 rounded mt-1 bg-white dark:bg-gray-800 backdrop-blur-sm text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={bedsRange}
                  onChange={(e) => setBedsRange(parseInt(e.target.value))}
                >
                  <option value="0">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-white/80">Baths (min)</label>
                <select
                  className="w-full p-2 rounded mt-1 bg-white dark:bg-gray-800 backdrop-blur-sm text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={bathsRange}
                  onChange={(e) => setBathsRange(parseInt(e.target.value))}
                >
                  <option value="0">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Types Filter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-medium text-gray-800 dark:text-white/80">
                Property Types
              </h4>
              <Button
                variant="link"
                size="sm"
                className="h-6 px-2 text-gray-600 hover:text-gray-900 dark:text-white/60 dark:hover:text-white"
                onClick={() => setSelectedPropertyTypes(['Single-family'])}
              >
                Reset
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((type) => (
                <Badge
                  key={type}
                  variant={selectedPropertyTypes.includes(type) ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer backdrop-blur-sm',
                    selectedPropertyTypes.includes(type)
                      ? 'bg-gray-900/10 dark:bg-white/20 text-gray-900 dark:text-white border-black/10 dark:border-white/20'
                      : 'bg-white/50 hover:bg-gray-900/5 dark:bg-white/5 text-gray-700 hover:text-gray-900 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white border-black/5 dark:border-white/10',
                  )}
                  onClick={() => {
                    if (type === 'All Properties') {
                      setSelectedPropertyTypes([type]);
                    } else if (selectedPropertyTypes.includes(type)) {
                      setSelectedPropertyTypes(selectedPropertyTypes.filter((t) => t !== type));
                    } else {
                      const newTypes = selectedPropertyTypes.filter((t) => t !== 'All Properties');
                      setSelectedPropertyTypes([...newTypes, type]);
                    }
                  }}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {/* Apply Filters Button */}
          <Button
            className="w-full bg-gray-900/10 hover:bg-gray-900/20 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white backdrop-blur-sm border-black/5 dark:border-white/10"
            onClick={() => searchProperties()}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Apply Filters
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
