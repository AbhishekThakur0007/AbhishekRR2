'use client';

import * as React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowRight } from 'lucide-react'; // You may need to install lucide-react
import { useRouter, usePathname } from 'next/navigation';
import { Dialog } from './ui/dialog';
import { DialogDemo } from './dialog-demo';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { addToSearchHistory } from '@/lib/search-history';

interface OperatorSearchProps {
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
  raw_item?: any; // For debugging
}

interface AutocompleteAPIResponse {
  suggestions: Suggestion[];
}

type SearchType = 'text' | 'image';

export function OperatorSearch({
  onSearch,
  placeholder = "What's your task?!",
}: OperatorSearchProps) {
  const [query, setQuery] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [searchType, setSearchType] = React.useState<SearchType>('text');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on a page where dropdown should appear above
  const isFixedToBottom = pathname === '/search' || pathname === '/maps-search';

  const fetchSuggestions = React.useCallback(async (value: string) => {
    console.log('Fetching suggestions for:', value);
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // console.log('Making API call...');
      const response = await fetch('/api/real-estate/autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: value }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch suggestions: ${response.statusText}`);
      }

      const data = (await response.json()) as AutocompleteAPIResponse;
      console.log('API response:', data);
      setSuggestions(data.suggestions || []);
      setOpen(data.suggestions?.length > 0);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce the input to avoid too many API calls
  React.useEffect(() => {
    console.log('Query changed:', query);
    const timer = setTimeout(() => {
      if (query) {
        fetchSuggestions(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the query is an email address
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(query);

    if (isEmail) {
      // If it's an email, redirect to agent listings page
      router.push(`/agent-listings?email=${encodeURIComponent(query)}`);
      return;
    }

    if (onSearch) {
      if (searchType === 'text') {
        onSearch(query);
      } else if (searchType === 'image' && selectedFile) {
        // Handle image search submission
        // You can implement image upload logic here
      }
    }
  };

  const handleSelect = async (suggestion: Suggestion) => {
    // Check if the query is an email address
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(suggestion.address);

    if (isEmail) {
      // If it's an email, redirect to agent listings page
      router.push(`/agent-listings?email=${encodeURIComponent(suggestion.address)}`);
      return;
    }

    // Get the full address from the suggestion
    let fullAddress = '';
    let searchType = suggestion.searchType || 'A'; // Default to address search if not specified

    if (suggestion.raw_item && suggestion.raw_item.title) {
      // The title field often has the most complete address
      fullAddress = suggestion.raw_item.title;
    } else if (suggestion.raw_item && suggestion.raw_item.house && suggestion.raw_item.street) {
      // Construct the address in the exact format needed
      fullAddress = `${suggestion.raw_item.house} ${
        suggestion.raw_item.street
      }, ${suggestion.city || ''}, ${suggestion.state || ''}, ${suggestion.zip_code || ''}`;
    } else if (suggestion.address) {
      // If we have an address but need to add city, state, zip
      if (suggestion.address.includes(suggestion.city)) {
        fullAddress = suggestion.address;
      } else {
        fullAddress = `${suggestion.address}, ${suggestion.city || ''}, ${
          suggestion.state || ''
        }, ${suggestion.zip_code || ''}`;
      }
    }

    // Clean up any double commas or trailing commas
    fullAddress = fullAddress.replace(/,\s*,/g, ',').replace(/,\s*$/g, '').trim();

    console.log('Selected address:', fullAddress);
    setQuery(fullAddress);
    setOpen(false);

    // Determine which page to navigate to based on searchType
    let targetPage = '/search'; // Default to property search page
    let searchParams = new URLSearchParams();

    // Handle different search types
    switch (searchType) {
      // case 'A': // Address
      //   targetPage = '/search';
      //   searchParams.append('q', fullAddress);
      //   if (suggestion.property_id) {
      //     searchParams.append('propertyId', suggestion.property_id);
      //   }
      //   break;
      case 'A': // Address
        targetPage = '/search';
        searchParams.append('q', fullAddress);
        break;
      case 'Z': // ZIP
        targetPage = '/maps-search';
        searchParams.append('q', fullAddress);
        searchParams.append('searchType', 'zip');
        break;
      case 'C': // City
        targetPage = '/maps-search';
        searchParams.append('q', fullAddress);
        searchParams.append('searchType', 'city');
        break;
      case 'N': // County
        targetPage = '/maps-search';
        searchParams.append('q', fullAddress);
        searchParams.append('searchType', 'county');
        break;
      default:
        targetPage = '/maps-search';
        searchParams.append('q', fullAddress);
    }

    // Build the URL with the search parameters
    const searchUrl = `${targetPage}?${searchParams.toString()}`;
    console.log('Redirecting to:', searchUrl);

    // Save to search history with correct type and route
    let historySearchType: 'property' | 'map' | 'agent' = 'property';
    if (targetPage === '/maps-search') {
      historySearchType = 'map';
    } else if (targetPage === '/agent-listings') {
      historySearchType = 'agent';
    }

    await addToSearchHistory(fullAddress, historySearchType, searchUrl);

    // Actually navigate to the search page
    router.push(searchUrl);
  };

  const handleNavigate = () => {
    // If we have a query, encode it as a parameter
    const searchParams = query ? `?q=${encodeURIComponent(query)}` : '';

    // Navigate to the appropriate page based on search type
    if (searchType === 'text') {
      router.push(`/maps-search${searchParams}`);
    } else {
      router.push(`/search${searchParams}`);
    }
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
          className="flex-1 bg-transparent border-0 focus-visible:ring-0 w-full focus-visible:ring-offset-0 text-gray-300 text-sm sm:text-lg placeholder:text-gray-500"
        />
      );
    } else {
      return (
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setSelectedFile(file);
          }}
          className="flex-1 bg-transparent border-0 focus-visible:ring-0 w-full focus-visible:ring-offset-0 text-gray-300 text-sm sm:text-lg file:bg-[#6366F1] file:text-white file:border-0 file:rounded-md file:px-2 sm:file:px-4 file:py-1 sm:file:py-1.5 file:text-[10px] sm:file:text-xs file:font-bold file:uppercase hover:file:bg-[#5355d1] cursor-pointer"
        />
      );
    }
  };

  return (
    <div className="relative w-full max-w-[800px] mx-auto px-4">
      <div className="gradient-border relative z-10">
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
                <div className="absolute right-2 sm:right-10 top-1/2 -translate-y-1/2">
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
                        className="px-4 py-2 hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                      >
                        <div className="font-medium text-white text-sm">{suggestion.address}</div>
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
              className="bg-white hover:bg-slate-100 text-indigo-600 rounded-md"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
