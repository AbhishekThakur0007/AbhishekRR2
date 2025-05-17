'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Map, Marker, Overlay } from 'pigeon-maps';
import { useTheme } from 'next-themes';
import { createClient } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';
import {
  ChevronUp,
  Search as SearchIcon,
  MapPin,
  Calendar,
  Music,
  Filter,
  ChevronDown,
  ArrowLeft,
  DollarSign,
  Bed,
  Bath,
  Square,
  Home,
  Loader2,
} from 'lucide-react';

// Components
import { SidebarLeft } from '@/components/sidebar-left';
import { SidebarRight } from '@/components/sidebar-right';
import { AddressAutocomplete } from '@/components/address-autocomplete';
import { PropertyListItem } from './components/PropertyListItem';
import { PropertyDetails } from './components/PropertyDetails';
import { FilterPanel } from './components/FilterPanel';
import { MobileToggle } from './components/MobileToggle';
import { SelectedPropertyInfo } from './components/SelectedPropertyInfo';
import { PropertyFilters } from './components/PropertyFilters';

// UI Components
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ScrollProgress } from '@/components/scroll-progress';
import { Badge } from '@/components/ui/badge';

// Types
import { RealEstateAPIResponse, MLSListing, PropertyDetailResponse } from '@/app/types/real-estate';
import ListingCard from '@/components/PropertyDetiales';
import { processMLSPropertyResults } from '@/utils/helper';
import PropertyPopup from './components/PropertyPopup';
import PropertyDetailModal from '@/components/property-detail-modal';
import PropertyListCard from './components/PropertyListCard';
import { NewNavbar } from '@/components/new-navbar';
import { LoginModal } from '@/components/login';
import { Search } from '@/components/search';

type Property = {
  property_id: string;
  price?: { list?: number };
  address?: { latitude?: string; longitude?: string; full?: string };
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  image?: string;
  name?: string;
};

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q');
  const { theme, setTheme } = useTheme();
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);

  // State for property data
  const [properties, setProperties] = useState<RealEstateAPIResponse[]>([]);
  const [mlsListings, setMlsListings] = useState<MLSListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState<string>(initialQuery || 'Washington, DC');
  const [locationObj, setLocationObj] = useState<any>({});
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.7749, -122.4194]); // Default: San Francisco
  const [mapZoom, setMapZoom] = useState(12);
  const [selectedProperty, setSelectedProperty] = useState<RealEstateAPIResponse | null>(null);

  // Filter states
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(['Single-family']);
  const [priceRange, setPriceRange] = useState<[number, number]>([500000, 1500000]);
  const [bedsRange, setBedsRange] = useState<number>(0); // Minimum beds
  const [bathsRange, setBathsRange] = useState<number>(0); // Minimum baths
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [showListings, setShowListings] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [isMarkCliked, setIsMarkClicked] = useState(false);
  const [listingCard, setListingCard] = useState(false);
  const [selectedPropertys, setSelectedPropertys] = useState({});

  const formatPrice = (price: number) => {
    // Format price for display
    return price >= 1000000
      ? `$${(price / 1000000).toFixed(1)}M`
      : `$${(price / 1000).toFixed(0)}K`;
  };

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

      // // Add location-based parameters
      // if (searchLocation) {
      //   // Get the search type from URL parameters
      //   const urlParams = new URLSearchParams(window.location.search);
      //   const searchType = urlParams.get('searchType');

      //   // Handle different search types
      //   if (searchType === 'zip') {
      //     // For ZIP search, just use the first 5 digits if it's a ZIP code
      //     const zipMatch = searchLocation.match(/\b\d{5}\b/);
      //     if (zipMatch) {
      //       searchParams.zip = zipMatch[0];
      //     }
      //   } else if (searchType === 'county') {
      //     // For county search, extract county and state
      //     const parts = searchLocation.split(',').map((part) => part.trim());
      //     if (parts.length >= 2) {
      //       searchParams.county = parts[0];
      //       const stateMatch = parts[1].match(/[A-Z]{2}/);
      //       if (stateMatch) {
      //         searchParams.state = stateMatch[0];
      //       }
      //     }
      //   } else if (searchType === 'city') {
      //     // For city search, extract city and state
      //     const parts = searchLocation.split(',').map((part) => part.trim());
      //     if (parts.length >= 2) {
      //       searchParams.city = parts[0];
      //       const stateMatch = parts[1].match(/[A-Z]{2}/);
      //       if (stateMatch) {
      //         searchParams.state = stateMatch[0];
      //       }
      //     }
      //   } else {
      //     // Default behavior - try to parse the location
      //     const locationParts = searchLocation.split(',').map((part) => part.trim());
      //     const zipCodeRegex = /\b\d{5}\b/;
      //     const zipMatch = searchLocation.match(zipCodeRegex);

      //     if (zipMatch) {
      //       searchParams.zip = zipMatch[0];
      //     } else if (locationParts.length >= 2) {
      //       const firstPart = locationParts[0];
      //       if (firstPart.toLowerCase().includes('county')) {
      //         searchParams.county = firstPart;
      //       } else {
      //         searchParams.city = firstPart;
      //       }
      //       const stateMatch = locationParts[1].match(/[A-Z]{2}/);
      //       if (stateMatch) {
      //         searchParams.state = stateMatch[0];
      //       }
      //     }
      //   }
      // }

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

      // searchParams.status = 'Active';

      console.log('Searching with params:', searchParams);

      // Call our property-search API endpoint
      // const response = await fetch('/api/real-estate/property-search', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(searchParams),
      // });

      // const params = {
      //   zip: '90210',
      // };

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

      // else if (data.resultCount && data.resultCount > 0) {
      //   // For some reason the data array is not there, but we have results
      //   // Try to extract properties from the response directly
      //   const propertyResults = Object.entries(data)
      //     .filter(
      //       ([key, value]) =>
      //         typeof value === 'object' &&
      //         value !== null &&
      //         !Array.isArray(value) &&
      //         (value as any).propertyId,
      //     )
      //     .map(([_, value]) => value);

      //   if (propertyResults.length > 0) {
      //     mappedProperties = processMLSPropertyResults(propertyResults);
      //   } else {
      //     setError('No properties found matching your criteria. Try adjusting your filters.');
      //   }
      // }

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
  // console.log('the properties hase this atribiutes let as see them', properties[0]);

  // Function to process property results into the expected format
  // const processPropertyResults = (propertyResults: any[]) => {
  //   // Map API response to our RealEstateAPIResponse format
  //   const mappedProperties = propertyResults
  //     .filter((property) => {
  //       // Filter out properties without necessary coordinates for the map
  //       return property && property.latitude && property.longitude;
  //     })
  //     .map((property) => {
  //       // Extract sale amount or use assessed value for price
  //       let listPrice = 0;
  //       if (property.lastSaleAmount) {
  //         // Clean the lastSaleAmount - remove non-numeric characters except for decimal points
  //         const cleanedAmount =
  //           typeof property.lastSaleAmount === 'string'
  //             ? property.lastSaleAmount.replace(/[^\d.]/g, '')
  //             : property.lastSaleAmount;
  //         listPrice = parseFloat(cleanedAmount) || 0;
  //       } else if (property.assessedValue) {
  //         listPrice = property.assessedValue;
  //       } else if (property.estimatedValue) {
  //         listPrice = property.estimatedValue;
  //       }

  //       // Build the address object
  //       const addressObj = property.address || {};

  //       // Handle different address formats
  //       let addressLine = 'Address unavailable';
  //       if (typeof addressObj === 'string') {
  //         addressLine = addressObj;
  //       } else if (addressObj.address) {
  //         addressLine = addressObj.address;
  //       } else if (property.streetAddress) {
  //         addressLine = property.streetAddress;
  //       }

  //       return {
  //         property_id: property.propertyId || property.id || '',
  //         status: property.mlsStatus || 'Active',
  //         list_date: property.lastSaleDate || undefined,
  //         last_update_date: property.lastUpdateDate || undefined,
  //         price: {
  //           list: listPrice,
  //           estimate: property.estimatedValue || property.assessedValue || listPrice,
  //         },
  //         address: {
  //           line: addressLine,
  //           city: addressObj.city || property.city || '',
  //           state: addressObj.state || property.state || '',
  //           postal_code: addressObj.zip || addressObj.postal_code || property.zip_code || '',
  //           latitude: (property.latitude || 0).toString(),
  //           longitude: (property.longitude || 0).toString(),
  //         },
  //         property: {
  //           type: property.propertyType || property.propertyUse || 'Unknown',
  //           sub_type: '',
  //           beds: property.bedrooms || 0,
  //           baths: property.bathrooms || 0,
  //           size_sqft: property.squareFeet || 0,
  //           year_built: property.yearBuilt || 0,
  //         },
  //         photos: [],
  //         description: `${
  //           property.propertyType || property.propertyUse || ''
  //         } in ${addressObj.city || property.city || ''}, ${
  //           addressObj.state || property.state || ''
  //         }`,
  //       } as RealEstateAPIResponse;
  //     });

  //   setProperties(mappedProperties);

  //   // If we have at least one property, center the map on the first one
  //   if (
  //     mappedProperties.length > 0 &&
  //     mappedProperties[0].address?.latitude &&
  //     mappedProperties[0].address?.longitude
  //   ) {
  //     setMapCenter([
  //       parseFloat(mappedProperties[0].address.latitude),
  //       parseFloat(mappedProperties[0].address.longitude),
  //     ]);
  //   }
  // };

  // Function to search MLS listings
  // const searchMLSListings = async (city: string, state: string) => {
  //   try {
  //     // Prepare MLS search parameters for your existing API
  //     const mlsSearchParams = {
  //       city,
  //       state,
  //       max_price: priceRange[1] / 1000000, // Convert to millions as per your API
  //       min_price: priceRange[0] / 1000000, // Convert to millions as per your API
  //       property_type: selectedPropertyTypes.includes('All Properties')
  //         ? undefined
  //         : selectedPropertyTypes[0], // Your API expects a single property type
  //       action: 'mls_search', // Specify the action for MLS search
  //       query: searchQuery || searchLocation, // Use the search query or location
  //     };

  //     // Call the MLS Search API using your existing route
  //     const response = await fetch('/api/real-estate/route', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(mlsSearchParams),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch MLS listings');
  //     }

  //     interface MLSSearchResponse {
  //       listings: MLSListing[];
  //     }

  //     const data = (await response.json()) as MLSSearchResponse;

  //     // Update MLS listings state
  //     if (data.listings) {
  //       setMlsListings(data.listings);
  //     } else {
  //       setMlsListings([]);
  //     }
  //   } catch (err) {
  //     console.error('Error searching MLS listings:', err);
  //     // We don't set the error state here to avoid blocking the UI
  //     // if only the MLS search fails
  //   }
  // };

  // Function to handle address selection from autocomplete
  const handleAddressSelect = (address: string) => {
    setSearchLocation(address);

    // When an address is selected, trigger a search
    if (address) {
      setSearchQuery(address);
      // searchProperties();
    }
  };

  // Function to view property details
  const viewPropertyDetails = (property: RealEstateAPIResponse) => {
    router.push(`/search?propertyId=${property.property_id}`);
  };

  // Function to view MLS listing details
  // const viewMLSDetails = (listing: MLSListing) => {
  //   router.push(`/search?mlsId=${listing.mlsNumber}`);
  // };

  // Add function to fetch property details using the property-detail API route
  // const fetchPropertyDetail = async (propertyId: string, address?: string) => {
  //   try {
  //     const response = await fetch('/api/real-estate/property-detail', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         propertyId,
  //         address,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch property details');
  //     }

  //     const data = (await response.json()) as PropertyDetailResponse;
  //     return data;
  //   } catch (error) {
  //     console.error('Error fetching property details:', error);
  //     return null;
  //   }
  // };

  // Add function to fetch MLS details using the mls-detail API route
  // const fetchMLSDetail = async (mlsId: string) => {
  //   try {
  //     const response = await fetch('/api/real-estate/mls-detail', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ mlsId }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch MLS details');
  //     }

  //     const data = (await response.json()) as MLSListing;
  //     return data;
  //   } catch (error) {
  //     console.error('Error fetching MLS details:', error);
  //     return null;
  //   }
  // };

  // Update the property click handler to fetch and display detailed property information
  const handlePropertyClick = async (property: RealEstateAPIResponse) => {
    setSelectedProperty(property);

    if (property.address?.latitude && property.address?.longitude) {
      setMapCenter([parseFloat(property.address.latitude), parseFloat(property.address.longitude)]);
      setMapZoom(15);
    }

    // If we have a property_id, fetch more detailed information
    // if (property.property_id) {
    //   setLoading(true);
    //   const detailedProperty = await fetchPropertyDetail(
    //     property.property_id,
    //     property.address?.line,
    //   );
    //   if (detailedProperty) {
    //     // Map PropertyDetailResponse to RealEstateAPIResponse format
    //     const mappedProperty: RealEstateAPIResponse = {
    //       property_id: detailedProperty.data.id.toString(),
    //       address: {
    //         line: detailedProperty.data.propertyInfo.address.address,
    //         city: detailedProperty.data.propertyInfo.address.city,
    //         state: detailedProperty.data.propertyInfo.address.state,
    //         postal_code: detailedProperty.data.propertyInfo.address.zip,
    //         neighborhood_name: detailedProperty.data.lotInfo.subdivision || undefined,
    //         county: detailedProperty.data.propertyInfo.address.county,
    //         latitude: detailedProperty.data.propertyInfo.latitude?.toString(),
    //         longitude: detailedProperty.data.propertyInfo.longitude?.toString(),
    //         house: detailedProperty.data.propertyInfo.address.house,
    //         street: detailedProperty.data.propertyInfo.address.street,
    //         streetType: detailedProperty.data.propertyInfo.address.streetType,
    //         unit: detailedProperty.data.propertyInfo.address.unit,
    //         unitType: detailedProperty.data.propertyInfo.address.unitType,
    //         zip: detailedProperty.data.propertyInfo.address.zip,
    //         zip4: detailedProperty.data.propertyInfo.address.zip4,
    //         carrierRoute: detailedProperty.data.propertyInfo.address.carrierRoute,
    //         congressionalDistrict: detailedProperty.data.propertyInfo.address.congressionalDistrict,
    //         fips: detailedProperty.data.propertyInfo.address.fips,
    //         jurisdiction: detailedProperty.data.propertyInfo.address.jurisdiction,
    //         label: detailedProperty.data.propertyInfo.address.label,
    //         preDirection: detailedProperty.data.propertyInfo.address.preDirection,
    //       },
    //       property: {
    //         type: detailedProperty.data.propertyInfo.propertyUse,
    //         sub_type: detailedProperty.data.propertyInfo.propertyUse,
    //         status: undefined,
    //         year_built: detailedProperty.data.propertyInfo.yearBuilt,
    //         size_sqft: detailedProperty.data.propertyInfo.livingSquareFeet,
    //         lot_size_sqft: detailedProperty.data.propertyInfo.lotSquareFeet,
    //         beds: detailedProperty.data.propertyInfo.bedrooms,
    //         baths: detailedProperty.data.propertyInfo.bathrooms,
    //         rooms: detailedProperty.data.propertyInfo.roomsCount,
    //         stories: detailedProperty.data.propertyInfo.stories,
    //         pool: detailedProperty.data.propertyInfo.pool,
    //         spa: undefined,
    //         cooling: detailedProperty.data.propertyInfo.airConditioningType ? true : false,
    //         heating: detailedProperty.data.propertyInfo.heatingType ? true : false,
    //         fireplace: detailedProperty.data.propertyInfo.fireplaces ? true : false,
    //         parking: {
    //           type: detailedProperty.data.propertyInfo.garageType || 'None',
    //           spaces: detailedProperty.data.propertyInfo.parkingSpaces,
    //         },
    //         opportunity_zone: undefined,
    //         propertyUse: detailedProperty.data.propertyInfo.propertyUse,
    //         propertyUseCode: detailedProperty.data.propertyInfo.propertyUseCode,
    //         livingSquareFeet: detailedProperty.data.propertyInfo.livingSquareFeet,
    //         bedrooms: detailedProperty.data.propertyInfo.bedrooms,
    //         bathrooms: detailedProperty.data.propertyInfo.bathrooms,
    //         partialBathrooms: detailedProperty.data.propertyInfo.partialBathrooms,
    //         roomsCount: detailedProperty.data.propertyInfo.roomsCount,
    //         lotSquareFeet: detailedProperty.data.propertyInfo.lotSquareFeet,
    //         buildingSquareFeet: detailedProperty.data.propertyInfo.buildingSquareFeet,
    //         garageSquareFeet: detailedProperty.data.propertyInfo.garageSquareFeet,
    //         poolArea: detailedProperty.data.propertyInfo.poolArea,
    //         patioArea: detailedProperty.data.propertyInfo.patioArea,
    //         deckArea: detailedProperty.data.propertyInfo.deckArea,
    //         porchArea: detailedProperty.data.propertyInfo.porchArea,
    //         porchType: detailedProperty.data.propertyInfo.porchType,
    //         pricePerSquareFoot: detailedProperty.data.propertyInfo.pricePerSquareFoot,
    //         construction: detailedProperty.data.propertyInfo.construction,
    //         roofConstruction: detailedProperty.data.propertyInfo.roofConstruction,
    //         roofMaterial: detailedProperty.data.propertyInfo.roofMaterial,
    //         interiorStructure: detailedProperty.data.propertyInfo.interiorStructure,
    //         heatingType: detailedProperty.data.propertyInfo.heatingType,
    //         heatingFuelType: detailedProperty.data.propertyInfo.heatingFuelType,
    //         airConditioningType: detailedProperty.data.propertyInfo.airConditioningType,
    //         utilitiesSewageUsage: detailedProperty.data.propertyInfo.utilitiesSewageUsage,
    //         utilitiesWaterSource: detailedProperty.data.propertyInfo.utilitiesWaterSource,
    //         plumbingFixturesCount: detailedProperty.data.propertyInfo.plumbingFixturesCount,
    //         parkingSpaces: detailedProperty.data.propertyInfo.parkingSpaces,
    //         garageType: detailedProperty.data.propertyInfo.garageType,
    //         basementType: detailedProperty.data.propertyInfo.basementType,
    //         basementSquareFeet: detailedProperty.data.propertyInfo.basementSquareFeet,
    //         basementSquareFeetFinished:
    //           detailedProperty.data.propertyInfo.basementSquareFeetFinished,
    //         basementSquareFeetUnfinished:
    //           detailedProperty.data.propertyInfo.basementSquareFeetUnfinished,
    //         basementFinishedPercent: detailedProperty.data.propertyInfo.basementFinishedPercent,
    //         fireplaces: detailedProperty.data.propertyInfo.fireplaces,
    //         patio: detailedProperty.data.propertyInfo.patio,
    //         deck: detailedProperty.data.propertyInfo.deck,
    //         featureBalcony: detailedProperty.data.propertyInfo.featureBalcony,
    //         breezeway: detailedProperty.data.propertyInfo.breezeway,
    //         attic: detailedProperty.data.propertyInfo.attic,
    //         carport: detailedProperty.data.propertyInfo.carport,
    //         rvParking: detailedProperty.data.propertyInfo.rvParking,
    //         safetyFireSprinklers: detailedProperty.data.propertyInfo.safetyFireSprinklers,
    //         hoa: detailedProperty.data.propertyInfo.hoa,
    //         taxExemptionHomeownerFlag: detailedProperty.data.propertyInfo.taxExemptionHomeownerFlag,
    //         unitsCount: detailedProperty.data.propertyInfo.unitsCount,
    //         buildingsCount: detailedProperty.data.propertyInfo.buildingsCount,
    //       },
    //       price: {
    //         list: detailedProperty.data.mlsListingPrice || 0,
    //         estimate: detailedProperty.data.estimatedValue || 0,
    //         last_sold: detailedProperty.data.lastSale?.saleAmount || 0,
    //         last_sold_date: detailedProperty.data.lastSale?.saleDate,
    //       },
    //       photos: detailedProperty.data.propertyInfo.photos || [],
    //       description: detailedProperty.data.propertyInfo.address.address,
    //     };
    //     setSelectedProperty(mappedProperty);
    //   }
    //   setLoading(false);
    // }
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
  const allProperties = [
    ...properties,
    // Filter out MLS listings that don't have the required properties
    ...mlsListings
      .filter((listing) => listing.reapiId) // Only include listings with reapiId
      .map((listing) => {
        // Convert MLSListing to RealEstateAPIResponse format
        return {
          property_id: listing.reapiId,
          status: listing.standardStatus,
          list_date: listing.listingContractDate,
          last_update_date: listing.modificationTimestamp,
          price: {
            list: listing.listPrice,
            estimate: listing.listPrice,
          },
          address: {
            line: listing.property.neighborhood || 'Address unavailable',
            city: listing.listingOffice?.city || '',
            state: listing.listingOffice?.stateOrProvince || '',
            postal_code: listing.listingOffice?.postalCode || '',
            latitude: listing.property.latitude?.toString() || '',
            longitude: listing.property.longitude?.toString() || '',
          },
          property: {
            type: listing.property.propertyType || 'Unknown',
            sub_type: listing.property.propertySubType || '',
            beds: listing.property.bedroomsTotal || 0,
            baths: listing.property.bathroomsTotal || 0,
            size_sqft: listing.property.livingArea || 0,
            year_built: parseInt(listing.property.yearBuilt) || 0,
          },
          photos: listing.media?.photosList?.map((photo) => photo.highRes) || [],
          description: listing.publicRemarks || '',
        } as RealEstateAPIResponse;
      }),
  ];

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

        {/* Mobile Toggle Buttons */}
        <MobileToggle
          showListings={showListings}
          setShowListings={setShowListings}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          propertiesCount={allProperties.length}
        />

        <div className="flex flex-row-reverse flex-1 h-full">
          {/* Left Panel - Property Listings */}
          <div
            className={`
            fixed md:relative w-full md:w-1/2 lg:w-1/2
            border-r border-gray-200 overflow-y-auto 
            transition-all duration-300 ease-in-out
            bg-background z-20
            ${
              showListings
                ? 'opacity-100 pointer-events-auto translate-y-[140px]'
                : 'opacity-0 translate-y-full pointer-events-none'
            } 
            md:translate-y-0 md:opacity-100 md:pointer-events-auto
            h-[calc(100vh-140px)] md:h-[calc(100vh-3.5rem)]
            order-2 md:order-1
          `}
          >
            <div className="overflow-y-auto p-4 h-full">
              <h1 className="text-2xl font-bold">Properties in {searchLocation}</h1>
              <p className="text-gray-600">
                {loading
                  ? 'Searching properties...'
                  : `Found ${allProperties.length} properties matching your criteria.`}
              </p>

              {/* Search Input */}
              <div className="relative">
                <AddressAutocomplete
                  onSelect={handleAddressSelect}
                  setLocationObj={setLocationObj}
                  placeholder="Address, City, ZIP, or Neighborhood"
                  className="w-full"
                />
              </div>

              {/* Quick Filters */}
              <PropertyFilters
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                priceRange={priceRange}
                bedsRange={bedsRange}
                bathsRange={bathsRange}
                selectedPropertyTypes={selectedPropertyTypes}
                formatPrice={formatPrice}
                searchProperties={searchProperties}
                loading={loading}
              />

              {/* Property List */}
              <div className="grid grid-cols-1 gap-4 mt-6 xl:grid-cols-2">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="ml-2 text-lg">Searching properties...</span>
                  </div>
                ) : error ? (
                  <div className="px-4 py-3 text-red-700 bg-red-50 rounded-md border border-red-200">
                    {error}
                  </div>
                ) : allProperties.length === 0 ? (
                  <div className="py-8 text-center">
                    <Home className="mx-auto mb-2 w-12 h-12 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No properties found</h3>
                    <p className="text-muted-foreground">Try adjusting your search filters</p>
                  </div>
                ) : (
                  allProperties.map((property, index) => (
                    // <PropertyListItem
                    //   key={property.property_id || `property-${index}`}
                    //   property={property}
                    //   onClick={() => handlePropertyClick(property)}
                    //   viewDetails={() => viewPropertyDetails(property)}
                    // />
                    <PropertyListCard
                      key={property.property_id || `property-${index}`}
                      property={property}
                      onClick={() => {
                        setSelectedProperty(property);
                        setListingCard(!listingCard);
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Map View */}
          <div className="fixed md:relative w-full h-[calc(100vh-140px)] md:h-[calc(100vh-3.5rem)] md:w-1/2 lg:w-2/3 order-1 md:order-2">
            {/* Map */}
            <div className="h-full">
              <Map
                center={mapCenter}
                zoom={mapZoom}
                onBoundsChanged={({ center, zoom }) => {
                  setMapCenter(center);
                  setMapZoom(zoom);
                }}
                onClick={() => setSelectedProperty(null)}
              >
                {allProperties.map((property, index) => {
                  // Only render markers for properties with valid coordinates
                  let color: any = 'bg-red-700';
                  console.log('staus', property.status);
                  if (property.status?.toLowerCase().includes('active')) {
                    color = 'bg-green-700';
                  } else if (property.status?.toLowerCase().includes('pending')) {
                    color = 'bg-yellow-700';
                  } else if (property.status?.toLowerCase().includes('closed')) {
                    color = 'bg-red-700';
                  }
                  if (
                    property.address?.latitude &&
                    property.address?.longitude &&
                    !isNaN(parseFloat(property.address.latitude)) &&
                    !isNaN(parseFloat(property.address.longitude))
                  ) {
                    return (
                      <Marker
                        key={property.property_id || `marker-${index}`}
                        width={40}
                        anchor={[
                          parseFloat(property.address.latitude),
                          parseFloat(property.address.longitude),
                        ]}
                        onClick={() => {
                          console.log('The marker was clicked');
                          setHoveredProperty(property);
                          setIsMarkClicked(!isMarkCliked);
                        }}
                      >
                        <div className="relative pointer-events-auto">
                          <button
                            onClick={() => {
                              console.log('Marker clicked', color);
                              setIsMarkClicked(!isMarkCliked);
                              setHoveredProperty(property);
                              setSelectedProperty(
                                property.property_id == selectedProperty?.property_id
                                  ? null
                                  : property,
                              );
                            }}
                            className={`z-30 px-3 py-1 text-sm font-bold text-white rounded-full border border-white shadow-md ${color}`}
                          >
                            {formatPrice(property.price?.estimate || 0)}
                          </button>
                        </div>
                      </Marker>
                    );
                  }
                  return null; // Don't render markers for properties without coordinates
                })}

                {selectedProperty &&
                  selectedProperty.address?.latitude &&
                  selectedProperty.address?.longitude && (
                    <Overlay
                      anchor={[
                        parseFloat(selectedProperty.address.latitude),
                        parseFloat(selectedProperty.address.longitude),
                      ]}
                      offset={[0, 20]}
                      className="cursor-pointer"
                    >
                      <PropertyPopup
                        property={selectedProperty}
                        onClick={() => setListingCard(!listingCard)}
                      />
                    </Overlay>
                  )}
              </Map>

              {listingCard && (
                <div
                  className="flex fixed inset-0 z-50 justify-center items-center backdrop-blur-sm bg-black/40"
                  onClick={() => setListingCard(false)}
                >
                  <div
                    className="overflow-auto relative p-6 w-full max-w-6xl h-screen bg-white rounded-2xl border shadow-xl backdrop-blur-xl dark:bg-background/40 border-black/10 dark:border-white/10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setListingCard(false)}
                      className="absolute top-4 right-4 text-2xl font-bold text-gray-700 transition dark:text-white/70 hover:text-black dark:hover:text-white"
                    >
                      &times;
                    </button>
                    {/* <ListingCard propertie={selectedPropertys} /> */}
                    <PropertyDetailModal
                      addressQuery={selectedProperty?.address?.line || ''}
                      handleClose={() => setListingCard(false)}
                      propertyId={selectedProperty?.property_id}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Map Controls */}
            <div className="flex absolute top-20 left-1/2 z-10 gap-2 -translate-x-1/2 md:top-4">
              <Button
                variant="outline"
                className="text-xs bg-white shadow-sm md:text-sm dark:bg-background dark:text-foreground"
                onClick={() => searchProperties()}
                disabled={loading}
              >
                <SearchIcon className="mr-1 w-3 h-3 md:h-4 md:w-4 md:mr-2" />
                Search Area
              </Button>
              <Button
                variant="outline"
                className="text-xs bg-white shadow-sm md:text-sm dark:bg-background dark:text-foreground"
                onClick={() => {
                  // Reset the map center to a default position
                  setMapCenter([37.7749, -122.4194]); // Default to San Francisco
                  setMapZoom(12);

                  // Reset search location if it's not already set
                  if (!searchLocation) {
                    setSearchLocation('Washington, DC');
                  }
                }}
              >
                <ArrowLeft className="mr-1 w-3 h-3 md:h-4 md:w-4 md:mr-2" />
                Reset
              </Button>
            </div>

            {/* Filter Panel */}
            <FilterPanel
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              bedsRange={bedsRange}
              setBathsRange={setBathsRange}
              bathsRange={bathsRange}
              setBedsRange={setBedsRange}
              selectedPropertyTypes={selectedPropertyTypes}
              setSelectedPropertyTypes={setSelectedPropertyTypes}
              formatPrice={formatPrice}
              searchProperties={searchProperties}
              loading={loading}
            />

            {/* Selected Property Info */}
            {/* {selectedProperty && (
              <SelectedPropertyInfo
                property={selectedProperty}
                viewDetails={() => viewPropertyDetails(selectedProperty)}
                onClose={() => setSelectedProperty(null)}
                showListings={showListings}
                showFilters={showFilters}
              />
            )} */}
          </div>
        </div>

        {/* Search Bar */}
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

      {/* Back to Top Button */}
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
