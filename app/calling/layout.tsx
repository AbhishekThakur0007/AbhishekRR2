'use client';
import { useState, useEffect } from 'react';
import {  useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { createClient } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';
import {
  ChevronUp,
} from 'lucide-react';

import { SidebarLeft } from '@/components/sidebar-left';
import { SidebarInset, SidebarProvider,  } from '@/components/ui/sidebar';
import { ScrollProgress } from '@/components/scroll-progress';

import { RealEstateAPIResponse, MLSListing,  } from '@/app/types/real-estate';
import { processMLSPropertyResults } from '@/utils/helper';
import { NewNavbar } from '@/components/new-navbar';
import { LoginModal } from '@/components/login';
import { Search } from '@/components/search';


export default function Layout({
                               children,
                             }: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q');
  const { theme, setTheme } = useTheme();
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);

  // State for property data
  const [properties, setProperties] = useState<RealEstateAPIResponse[]>([]);
  const [mlsListings, ] = useState<MLSListing[]>([]);
  const [, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [, setSearchLocation] = useState<string>(initialQuery || 'Washington, DC');
  const [locationObj, setLocationObj] = useState<any>({});
  const [, setMapCenter] = useState<[number, number]>([37.7749, -122.4194]); // Default: San Francisco

  // Filter states
  const [activeFilter, ] = useState<string>('all');
  const [selectedPropertyTypes, ] = useState<string[]>(['Single-family']);
  const [priceRange, ] = useState<[number, number]>([500000, 1500000]);
  const [bedsRange, ] = useState<number>(0); // Minimum beds
  const [bathsRange, ] = useState<number>(0); // Minimum baths
  const [, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [showListings, setShowListings] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);



  // Function to search properties using the Property Search API
  const searchProperties = async () => {
    setLoading(true);
    setError(null);
    setProperties([]);

    try {
      let searchParams: any = {
        size: 20,
      };

      if (Object.values(locationObj).length) {
        searchParams = { ...searchParams, ...locationObj };
      } else {
        searchParams.city = 'Washington';
        searchParams.state = 'DC';
      }

      console.log('locationObj:::', locationObj);



      // Add filters for property type
      if (selectedPropertyTypes.length > 0 && !selectedPropertyTypes.includes('All Properties')) {
        // Map UI property types to API property types
        const propertyTypeMappings: Record<string, string> = {
          'Single-family': 'SFR',
          Condo: 'CONDO',
          Townhouse: 'CONDO', // Townhouses can be considered condos in this API
          'Multi-family': 'MFR',
          Land: 'LAND',
          Apartment: 'MFR', // Apartments are multi-family
          Mobile: 'MOBILE',
          'Farm/Ranch': 'LAND', // Farms/Ranches are mostly land
        };

        const apiPropertyTypes = selectedPropertyTypes
          .map((type) => propertyTypeMappings[type])
          .filter(Boolean);

        if (apiPropertyTypes.length > 0) {
          // If only one property type, send it as a string, otherwise as an array
          searchParams.property_type =
            +apiPropertyTypes.length === 1 ? apiPropertyTypes[0] : apiPropertyTypes.join(',');
        }
      }

      // Add price range filter
      if (priceRange && priceRange.length === 2) {
        searchParams.listing_price_min = priceRange[0];
        searchParams.listing_price_max = priceRange[1];
      }

      // Add beds/baths filters
      if (bedsRange > 0) {
        searchParams.bedrooms_min = bedsRange;
      }

      if (bathsRange > 0) {
        searchParams.bathrooms_min = bathsRange;
      }

      // Set recently_sold parameter for non-active listings
      if (activeFilter === 'all') {
        // Include all properties
      } else if (activeFilter === 'new') {
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - 1); // 24 hours ago
        searchParams.sold_date_min = dateThreshold.toISOString().split('T')[0];
      } else if (activeFilter === 'week') {
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - 7); // 7 days ago
        searchParams.sold_date_min = dateThreshold.toISOString().split('T')[0];
      } else if (activeFilter === 'month') {
        const dateThreshold = new Date();
        dateThreshold.setMonth(dateThreshold.getMonth() - 1); // 1 month ago
        searchParams.sold_date_min = dateThreshold.toISOString().split('T')[0];
      }

      const response = await fetch('/api/real-estate/mls-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error || 'Failed to fetch property data');
      }

      // The API response now returns properties directly rather than in a data array
      const data = (await response.json()) as {
        statusCode?: number;
        statusMessage?: string;
        resultCount?: number;
        recordCount?: number;
        data?: any[];
        error?: string;
      };

      // Fix these console logs - the statusCode should be from the response, not data.statusCode
      console.log('API response status:', response.status);
      console.log(`Found ${data.resultCount || 0} properties, ${data.recordCount || 0} returned`);

      if (data.error) {
        throw new Error(data.error);
      }

      let mappedProperties: any = [];
      // Check if we have results
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        mappedProperties = processMLSPropertyResults(data.data);
      }



      if (mappedProperties.length) {
        setProperties(mappedProperties);

        if (
          mappedProperties.length > 0 &&
          mappedProperties[0].address?.latitude &&
          mappedProperties[0].address?.longitude
        ) {
          setMapCenter([
            parseFloat(mappedProperties[0].address.latitude),
            parseFloat(mappedProperties[0].address.longitude),
          ]);
        }
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error('Error searching properties:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to search properties. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };




  // Effect to search properties when filters change or on initial query
  useEffect(() => {
    // Search on initial render if we have an initial query
    if (!initialQuery || (initialQuery && locationObj && Object.values(locationObj).length)) {
      searchProperties();
    }
  }, [locationObj]); // Only trigger on location change, other filters will use the search button

  // Handle initial query from URL
  useEffect(() => {
    if (initialQuery) {
      (async () => {
        const response = await fetch('/api/real-estate/autocomplete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: initialQuery }),
        });

        let suggestions: any;
        if (response.ok) {
          const data = (await response.json()) as any;
          suggestions = data.suggestions[0];
        }
        setSearchLocation(initialQuery);
        setSearchQuery(initialQuery);

        const address: any = {};

        if (suggestions?.raw_item) {
          const obj = suggestions?.raw_item;
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
      })();
    }
  }, [initialQuery]);

  // Effect to handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      // Back to top button logic
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Combine properties and MLS listings for display

  const handleEmailLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw new Error(error.message);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <SidebarProvider>
      {!session ? (
        <LoginModal
          showLoginModal
          onEmailLogin={handleEmailLogin}
          onGoogleLogin={handleGoogleLogin}
        />
      ) : null}
      <ScrollProgress />
      <SidebarLeft />
      <SidebarInset>
        <NewNavbar
          showSearch={true}
          showThemeToggle={true}
          showLanguageSelector={true}
          showUserMenu={true}
          showBalance={true}
          showCreateButton={true}
          isLogoVisible={false} // 👈 added this line
          isSidebarVisible={true}
          balance={1547.4}
          user={{
            name:
              session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || '',
            email: session?.user?.email || '',
            initials: session?.user?.user_metadata?.full_name
              ? session.user.user_metadata.full_name
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .toUpperCase()
              : session?.user?.email?.charAt(0).toUpperCase() || '',
          }}
          className="w-full"
          isDark={theme === 'dark'}
          onThemeToggle={(newTheme) => setTheme(newTheme || 'system')}
          onLogout={handleLogout}
        />
        {children}
        <div
          className={`
          fixed bottom-0 left-0 right-0 p-4 z-50 
          transition-transform duration-300
          ${showListings || showFilters ? 'translate-y-full md:translate-y-0' : 'translate-y-0'}
        `}
        >
          <div className="mx-auto max-w-3xl">
            <Search />
          </div>
        </div>
      </SidebarInset>
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className={`
            fixed right-4 md:right-6 p-2 
            bg-primary text-white rounded-full 
            shadow-lg hover:bg-primary/90 
            transition-all z-50
            ${showListings || showFilters ? 'bottom-4' : 'bottom-24'} 
            md:bottom-20
          `}
          aria-label="Back to top"
        >
          <ChevronUp className="w-4 h-4 md:h-5 md:w-5" />
        </button>
      )}
    </SidebarProvider>
  );
}
