'use client';

import * as React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { addToSearchHistory } from '@/lib/search-history';

interface SearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

interface Suggestion {
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_id?: string;
  searchType?: string;
  raw_item?: any;
}

interface AutocompleteAPIResponse {
  suggestions: Suggestion[];
}

type SearchType = 'text' | 'image';

export function Search({ onSearch, placeholder = "What's your task?!" }: SearchProps) {
  const [query, setQuery] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [searchType, setSearchType] = React.useState<SearchType>('text');
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isFixedToBottom = pathname === '/search' || pathname === '/maps-search';

  const fetchSuggestions = React.useCallback(async (value: string) => {
    if (value.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    setIsLoading(true);
    let finalSuggestions: Suggestion[] = [];
    let attemptFallback = false;

    // Attempt 1: /api/real-estate/autocomplete (New Primary)
    try {
      console.log('Fetching suggestions from /api/real-estate/autocomplete for query:', value);
      const response = await fetch('/api/real-estate/autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: value }),
      });

      if (response.ok) {
        const data = (await response.json()) as AutocompleteAPIResponse;
        console.log('/api/real-estate/autocomplete response:', data);
        finalSuggestions = data.suggestions || [];
        // If primary API call is successful, use its suggestions. No fallback needed.
      } else {
        // Primary API returned a non-OK response, so it's "not working".
        console.warn(
          `Failed to fetch from /api/real-estate/autocomplete: ${response.status} ${response.statusText}. Attempting fallback.`,
        );
        attemptFallback = true;
      }
    } catch (error) {
      // Network error or other issue with primary API call, so it's "not working".
      console.error(
        'Error fetching from /api/real-estate/autocomplete:',
        error,
        '. Attempting fallback.',
      );
      attemptFallback = true;
    }

    // If primary API failed, attempt fallback.
    if (attemptFallback) {
      try {
        console.log(
          'Fetching suggestions from fallback /api/geocode/autocomplete for query:',
          value,
        );
        const response = await fetch('/api/geocode/autocomplete', {
          // Original API, now fallback
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: value }),
        });

        if (response.ok) {
          const data = (await response.json()) as AutocompleteAPIResponse;
          console.log('/api/geocode/autocomplete response (fallback):', data);
          finalSuggestions = data.suggestions || [];
        } else {
          // Fallback also failed.
          console.error(
            `Failed to fetch from /api/geocode/autocomplete (fallback): ${response.status} ${response.statusText}`,
          );
          finalSuggestions = []; // Ensure suggestions are empty.
        }
      } catch (error) {
        console.error('Error fetching from /api/geocode/autocomplete (fallback):', error);
        finalSuggestions = []; // Ensure suggestions are empty.
      }
    }

    setSuggestions(finalSuggestions);
    setOpen(finalSuggestions.length > 0);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        fetchSuggestions(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleSelect = async (suggestion: Suggestion) => {
    // Get the full address from the suggestion
    let fullAddress = '';
    // Ensure searchType has a default, as suggestion.searchType can be undefined
    const currentSearchType = suggestion.searchType || 'A'; // Default to address search if not specified

    if (suggestion.raw_item && suggestion.raw_item.title) {
      // The title field often has the most complete address
      fullAddress = suggestion.raw_item.title;
    } else if (suggestion.raw_item && suggestion.raw_item.house && suggestion.raw_item.street) {
      // Construct the address if house and street are present in raw_item
      fullAddress = `${suggestion.raw_item.house} ${
        suggestion.raw_item.street
      }, ${suggestion.city || ''}, ${suggestion.state || ''}, ${suggestion.zip_code || ''}`;
    } else if (suggestion.address) {
      // Fallback to using suggestion.address, ensuring city, state, zip are included if not already
      if (
        suggestion.address.includes(suggestion.city) &&
        suggestion.address.includes(suggestion.state) &&
        suggestion.address.includes(suggestion.zip_code)
      ) {
        fullAddress = suggestion.address;
      } else {
        fullAddress = `${suggestion.address}, ${suggestion.city || ''}, ${
          suggestion.state || ''
        }, ${suggestion.zip_code || ''}`;
      }
    }

    // Clean up any double commas or trailing commas/spaces
    fullAddress = fullAddress.replace(/,\s*,/g, ',').replace(/,\s*$/g, '').trim();

    console.log('Selected suggestion in Search component:', suggestion);
    console.log('Constructed fullAddress:', fullAddress);
    console.log('Using searchType:', currentSearchType);

    setQuery(fullAddress);
    setOpen(false);

    let targetPage = '/search'; // Default to property search page
    const searchParams = new URLSearchParams();

    // Handle different search types
    switch (currentSearchType) {
      case 'A': // Address
        targetPage = '/search';
        searchParams.append('q', fullAddress);
        // property_id logic can be added here if needed, e.g., from suggestion.property_id
        // if (suggestion.property_id) {
        //   searchParams.append('propertyId', suggestion.property_id);
        // }
        break;
      case 'Z': // ZIP
        targetPage = '/maps-search';
        searchParams.append('q', fullAddress); // Or just suggestion.zip_code if preferred for ZIP searches
        searchParams.append('searchType', 'zip');
        break;
      case 'C': // City
        targetPage = '/maps-search';
        searchParams.append('q', fullAddress); // Or just suggestion.city if preferred for City searches
        searchParams.append('searchType', 'city');
        break;
      case 'N': // County (Assuming 'N' stands for Neighborhood/County as in OperatorSearch)
        targetPage = '/maps-search';
        searchParams.append('q', fullAddress);
        searchParams.append('searchType', 'county');
        break;
      default:
        // Fallback for unknown or unspecified search types
        // OperatorSearch defaulted to /maps-search, let's be consistent
        targetPage = '/maps-search';
        searchParams.append('q', fullAddress);
        console.warn(
          `Unhandled searchType "${currentSearchType}", defaulting to /maps-search with full address.`,
        );
    }

    const searchUrl = `${targetPage}?${searchParams.toString()}`;
    console.log('Redirecting to:', searchUrl);

    // Save to search history with correct type and route
    let historySearchType: 'property' | 'map' = 'property'; // Default
    if (targetPage === '/maps-search') {
      historySearchType = 'map';
    }
    // Note: 'agent' type from OperatorSearch was tied to email logic, not included here.

    await addToSearchHistory(fullAddress, historySearchType, searchUrl);
    router.push(searchUrl);
  };

  const handleNavigate = () => {
    const searchParams = query ? `?q=${encodeURIComponent(query)}` : '';
    router.push(`/maps-search${searchParams}`);
  };

  const renderInput = () => {
    if (searchType === 'text') {
      return (
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length > 0) {
              setOpen(true);
            } else {
              setOpen(false);
            }
          }}
          placeholder={placeholder}
          className="flex-1 w-full text-sm text-gray-300 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-lg placeholder:text-gray-500"
        />
      );
    } else {
      return (
        <Input
          type="file"
          accept="image/*"
          className="flex-1 bg-transparent border-0 focus-visible:ring-0 w-full focus-visible:ring-offset-0 text-gray-300 text-sm sm:text-lg file:bg-[#6366F1] file:text-white file:border-0 file:rounded-md file:px-2 sm:file:px-4 file:py-1 sm:file:py-1.5 file:text-[10px] sm:file:text-xs file:font-bold file:uppercase hover:file:bg-[#5355d1] cursor-pointer"
        />
      );
    }
  };

  return (
    <div className="relative w-full max-w-[800px] mx-auto px-4">
      <div className="relative z-10 gradient-border" ref={searchRef}>
        <div className="bg-[#252935] rounded-[14px] overflow-visible">
          <form
            onSubmit={handleSubmit}
            className="flex items-center h-[60px] px-3 sm:px-6 gap-2 sm:gap-4"
          >
            <Select defaultValue="text" onValueChange={(value: SearchType) => setSearchType(value)}>
              <SelectTrigger className="w-[100px] sm:w-[160px] bg-white text-[#6366F1] border-0 focus:ring-offset-0 focus:ring-0 rounded-lg text-[10px] sm:text-xs uppercase tracking-wider font-bold">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Search</SelectItem>
                <SelectItem value="image">Image Search</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-1 ml-2 sm:ml-6">
              {renderInput()}
              {isLoading && searchType === 'text' && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 sm:right-10">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#6366F1] border-t-[#818CF8]"></div>
                </div>
              )}

              {open && suggestions.length > 0 && searchType === 'text' && (
                <div
                  className={`absolute left-0 right-0 z-50 mt-2 bg-[#1a1a1a] rounded-xl shadow-lg max-h-60 overflow-auto border border-[#6366F1]/50 ${
                    isFixedToBottom ? 'bottom-full mb-2' : 'top-full mt-2'
                  }`}
                >
                  <div className="py-1">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={`${suggestion.address}-${index}`}
                        onClick={() => handleSelect(suggestion)}
                        className="px-4 py-2 transition-colors duration-200 cursor-pointer hover:bg-gray-800"
                      >
                        <div className="text-sm font-medium text-white">{suggestion.address}</div>
                        <div className="text-xs text-indigo-300">
                          {suggestion.city}, {suggestion.state} {suggestion.zip_code}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={handleNavigate}
              type="submit"
              size="icon"
              className="text-indigo-600 bg-white rounded-md hover:bg-slate-100"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
