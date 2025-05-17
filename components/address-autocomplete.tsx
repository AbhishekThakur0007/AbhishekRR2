'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface Suggestion {
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_id?: string;
}

interface AddressAutocompleteProps {
  onSelect: (address: any) => void;
  placeholder?: string;
  className?: string;
  setLocationObj: (address: any) => void;
}

export function AddressAutocomplete({
  onSelect,
  placeholder = 'Enter an address, city, or ZIP code',
  className = '',
  setLocationObj,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<
    Array<{
      address: string;
      city: string;
      state: string;
      zip_code: string;
      property_id?: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch('/api/real-estate/autocomplete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        });

        if (response.ok) {
          const data = (await response.json()) as { suggestions: Suggestion[] };
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
        } else {
          console.error('Error fetching address suggestions');
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      if (query) {
        fetchSuggestions();
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (suggestion: any) => {
    // console.log('SUGGESTIONS HERE IS :::', suggestion);

    const address: any = {};

    if (suggestion.raw_item) {
      const obj = suggestion.raw_item;
      if (obj?.street) address.street = obj.street;
      if (obj?.zip) address.zip = obj.zip;
      if (obj?.state) address.state = obj.state;
      if (obj?.city) address.city = obj.city;
      if (obj?.latitude) address.latitude = obj.latitude;
      if (obj?.longitude) address.longitude = obj.longitude;
      if (obj?.county) address.county = obj.county;
      if (obj?.address) address.address = obj.address;
    }
    setLocationObj(address);
    onSelect(suggestion.address);
    setQuery(suggestion.address);
    setShowSuggestions(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionRef}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(suggestion)}
            >
              <div className="font-medium">{suggestion.address}</div>
              <div className="text-sm text-gray-600">
                {suggestion.city}, {suggestion.state} {suggestion.zip_code}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
