'use client';
import { OperatorSearch } from '@/components/operator-search';
import { SidebarLeft } from '@/components/sidebar-left';
import { SidebarRight } from '@/components/sidebar-right';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyCard } from '@/components/property-card-old';
import { RealEstateGuide } from '@/components/real-estate-guide';
import { useState, useEffect, Suspense, useRef } from 'react';
import {
  ChevronUp,
  Loader2,
  ChevronRight,
  X,
  AlertCircle,
  Phone,
  Share2,
  HelpCircle,
} from 'lucide-react';
import { ScrollProgress } from '@/components/scroll-progress';
import { useParams, useSearchParams } from 'next/navigation';
import { MLSListing, PropertyDetailResponse, RealEstateAPIResponse } from '@/app/types/real-estate';
import { Button } from '@/components/ui/button';
import { PieComponent } from '@/components/charts/pie';
import { AreaComponent } from '@/components/charts/area';
import { RealEstateAPI } from '@/app/lib/real-estate-api';
import PropertyHistory from '@/components/property-history';
import { MLSInformation } from '@/components/mls-information';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import React from 'react';
import { useTheme } from 'next-themes';
import { Session } from '@supabase/supabase-js';

// Import our new components
import { PropertyHero } from '@/components/property-hero';
import { PropertyGallery } from '@/components/property-gallery';
import { PropertyDetails } from '@/components/property-details';
import { SchoolInformation } from '@/components/school-information';
import { FinancialDetails } from '@/components/financial-details';
import { FloodAndEnvironmental } from '@/components/flood-environmental';
import { AgentInformation } from '@/components/agent-information';
import { LocationInformation } from '@/components/location-information';
import { Badge } from '@/components/ui/badge';
import { SearchHeader } from '@/components/search-header';
import { PropertyCharts } from '@/components/property-charts';
import { RelatedProperties } from '@/components/related-properties';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AIChat } from '@/components/ai-chat';
import RealEstateCMAModal from '@/components/real-estate-cma-modal';
import clsx from 'clsx';
import { NewNavbar } from '@/components/new-navbar';
import { LoginModal } from '@/components/login';
import { Search } from '@/components/search';
import { PageSectionNav, PageSection } from '@/components/PageSectionNav';

// Imports from RealEstateCMAModal
import { useMediaQuery } from '@/hooks/use-media-query';
import { ExtendedMLSListing, Property } from '@/utils/property-types';
import {
  calculateInvestmentScore,
  calculateAppreciationRate,
  calculateZipTrend,
  calculateSchoolRating,
  calculateMarketScore,
  calculateMarketActivityScore,
  calculateLocationScore,
  calculatePropertyConditionScore,
  calculateNeighborhoodSafetyScore,
  // calculateTaxRate, // Already effectively calculated inline later or part of propertyData
} from '@/utils/real-estate-scores';
import { MarketAnalysis } from '@/components/MarketAnalysis';
import { PropertyImages as CMAPropertyImages } from '@/components/PropertyImages'; // Alias to avoid conflict
import { PropertyCombinedAnalysis } from '@/components/PropertyCombinedAnalysis';
// import PropertyDetailModal from '@/components/property-detail-modal'; // If needed later

// Simple spinner component
const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex justify-center">
      <div
        className={`rounded-full border-4 animate-spin ${sizeClasses[size]} border-primary border-t-transparent`}
      ></div>
    </div>
  );
};

// Create a component that uses useSearchParams
function SearchPageContent() {
  const searchParams = useSearchParams();
  const addressQuery = searchParams.get('q');
  const mlsId = searchParams.get('mlsId');
  const searchType = searchParams.get('searchType');
  const propertyId = searchParams.get('propertyId');
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propertyData, setPropertyData] = useState<PropertyDetailResponse | null>(null);
  const [mlsData, setMlsData] = useState<MLSListing | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const fetchInProgress = useRef(false);

  // State for CMA components
  const [isMobileCMA, setIsMobileCMA] = useState(false);
  const [relatedMLSData, setRelatedMLSData] = useState<Record<string, ExtendedMLSListing>>({});
  const [loadingCompsData, setLoadingCompsData] = useState(false);
  const [cmaProperties, setCmaProperties] = useState<Property[]>([]);
  const [cmaSubjectProperty, setCmaSubjectProperty] = useState<Property | null>(null);
  const [selectedCMAProperty, setSelectedCMAProperty] = useState<Property | null>(null);

  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  useEffect(() => {
    setIsMobileCMA(isSmallScreen);
  }, [isSmallScreen]);

  console.log('mlsData', mlsData);
  console.log('propertyData', propertyData);
  // Define page sections for anchor links
  const pageSections: PageSection[] = [
    { id: 'hero', label: 'Featured Property', icon: '🏠' },
    { id: 'gallery', label: 'Photo Gallery', icon: '📷' },
    { id: 'details', label: 'Property Details', icon: '📋' },
    { id: 'financial', label: 'Financials', icon: '💰' },
    { id: 'schools', label: 'Schools', icon: '🏫' },
    { id: 'location', label: 'Location', icon: '📍' },
    { id: 'flood', label: 'Environmental', icon: '🌊' },
    { id: 'agent', label: 'Contact', icon: '👤' },
    ...(cmaProperties.length > 0 && cmaSubjectProperty
      ? [
          { id: 'cma-overview-details', label: 'Comparables', icon: '📊' },
          { id: 'cma-market-analysis', label: 'Market View', icon: '📈' },
          { id: 'cma-images', label: 'Comp Images', icon: '🖼️' },
        ]
      : []),
    { id: 'history', label: 'History', icon: '📜' },
  ];

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Show back to top button after scrolling down 300px
      setShowBackToTop(scrollY > 300);

      // Calculate scroll progress
      const scrolled = (scrollY / (docHeight - winHeight)) * 100;
      setScrollProgress(scrolled);

      // Update active section based on scroll position
      const sections = pageSections.map((section) => ({
        id: section.id,
        element: document.getElementById(section.id),
      }));

      const currentSection = sections.find((section) => {
        if (!section.element) return false;
        const rect = section.element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom > 100;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch property data when addressQuery changes
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!addressQuery || fetchInProgress.current) return;

      console.log('🔍 Starting property data fetch for:', addressQuery);
      setLoading(true);
      setError(null);
      fetchInProgress.current = true;

      try {
        console.log('📤 Sending request to /api/real-estate/property-detail');
        const response = await fetch('/api/real-estate/property-detail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // propertyId,
            address: addressQuery,
          }),
        });

        console.log('📥 Response status:', response.status);
        const debugInfo = response.headers.get('X-Debug-Info');
        if (debugInfo) {
          console.log('🔍 API Debug Info:', JSON.parse(debugInfo));
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as PropertyDetailResponse;
        console.log('✅ Received property data:', data);
        setPropertyData(data);
      } catch (err) {
        console.error('❌ Error fetching property details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch property details');
      } finally {
        setLoading(false);
        fetchInProgress.current = false;
      }
    };

    fetchPropertyData();
  }, [addressQuery, propertyId]);

  // Fetch MLS data when propertyData changes
  useEffect(() => {
    const fetchMLSDetails = async () => {
      if (!propertyData) return;

      try {
        const response = await fetch('/api/real-estate/mls-detail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // propertyId,
            address: addressQuery,
            // mls_id: mlsId,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as MLSListing;
        setMlsData(data);
      } catch (err) {
        console.error('Error fetching MLS details:', err);
        // Don't set error state for MLS data - it's optional
      } finally {
        setLoading(false);
      }
    };

    fetchMLSDetails();
  }, [addressQuery, mlsId, propertyData]);

  // Fetch MLS data for a comparable property
  const fetchMLSDataForComp = async (compProperty: any) => {
    // Skip if no address or if we already have the data
    if (
      !compProperty.address?.address ||
      relatedMLSData[`${compProperty.property_id}_${compProperty.address?.address}`]
    )
      return null;

    try {
      const response = await fetch('/api/real-estate/mls-detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: compProperty.address.address,
        }),
      });

      if (!response.ok) {
        console.error(
          `HTTP error for comp ${compProperty.address.address}! status: ${response.status}`,
        );
        return null;
      }

      // Check if data is incomplete
      const isIncompleteData = response.headers.get('X-Incomplete-Data') === 'true';
      if (isIncompleteData) {
        console.log(
          `Incomplete MLS data for comp ${compProperty.address.address}, using basic data`,
        );
        // Return basic data structure for incomplete MLS data
        return {
          listPrice: compProperty.price || null,
          property: {
            bedroomsTotal: compProperty.bedrooms || null,
            bathroomsTotal: compProperty.bathrooms || null,
            livingArea: compProperty.squareFeet ? parseInt(compProperty.squareFeet) : null,
          },
          _propertyId: compProperty.property_id,
          _address: compProperty.address?.address,
          _isIncomplete: true,
        } as ExtendedMLSListing;
      }

      const rawData = (await response.json()) as { mlsData?: MLSListing } | MLSListing;
      const mlsDetailData = 'mlsData' in rawData ? rawData.mlsData : rawData;
      return {
        ...mlsDetailData,
        _propertyId: compProperty.property_id,
        _address: compProperty.address?.address,
      } as ExtendedMLSListing;
    } catch (err) {
      console.error(
        'Error fetching MLS details for comp property:',
        compProperty.address?.address,
        err,
      );
      return null;
    }
  };

  // Process property data for CMA components
  useEffect(() => {
    const processCMAData = async () => {
      if (!propertyData) {
        setCmaProperties([]);
        setCmaSubjectProperty(null);
        return;
      }

      setLoadingCompsData(true);

      const currentSubjectProperty: Property = {
        id: Number(propertyData?.data?.id || 0),
        address: propertyData?.data?.propertyInfo?.address?.label || 'Address not available',
        price: mlsData?.listPrice
          ? `$${mlsData.listPrice.toLocaleString()}`
          : 'Price not available',
        image:
          mlsData?.media?.primaryListingImageUrl ||
          propertyData?.data?.propertyInfo?.photos?.[0] ||
          '/placeholder.svg',
        images: [
          ...(mlsData?.media?.photosList?.map(
            (photo) => photo.highRes || photo.midRes || photo.lowRes,
          ) || []),
          ...(propertyData?.data?.propertyInfo?.photos || []),
        ].filter(Boolean) as string[],
        beds: mlsData?.property?.bedroomsTotal || propertyData?.data?.propertyInfo?.bedrooms || 0,
        baths:
          mlsData?.property?.bathroomsTotal || propertyData?.data?.propertyInfo?.bathrooms || 0,
        sqft:
          mlsData?.property?.lotSizeSquareFeet || // CMA modal used lotSizeSquareFeet, main page might use livingSquareFeet
          propertyData?.data?.propertyInfo?.livingSquareFeet ||
          0,
        daysToSale: mlsData?.daysOnMarket ? parseInt(mlsData.daysOnMarket) : null,
        daysOnMarket: mlsData?.daysOnMarket ? parseInt(mlsData.daysOnMarket) : 0,
        percentOfAsking:
          mlsData?.price_changes?.[0]?.change_amount && mlsData.listPrice
            ? Math.round((1 - mlsData.price_changes[0].change_amount / mlsData.listPrice) * 100)
            : null,
        amenities: [
          ...(mlsData?.homedetails?.appliances
            ? String(mlsData.homedetails.appliances)
                .split(',')
                .map((a) => a.trim())
            : []),
          ...(mlsData?.homedetails?.exteriorFeatures
            ? String(mlsData.homedetails.exteriorFeatures)
                .split(',')
                .map((a) => a.trim())
            : []),
        ],
        investmentScore: calculateInvestmentScore(mlsData || null, propertyData || null),
        yearBuilt: Number(
          mlsData?.property?.yearBuilt || propertyData?.data?.propertyInfo?.yearBuilt || 0,
        ),
        lotSize: mlsData?.property?.lotSizeSquareFeet
          ? `${(mlsData.property.lotSizeSquareFeet / 43560).toFixed(2)} acres`
          : propertyData?.data?.propertyInfo?.lotSquareFeet
            ? `${(Number(propertyData.data.propertyInfo.lotSquareFeet) / 43560).toFixed(2)} acres`
            : 'N/A',
        status: mlsData?.standardStatus || mlsData?.customStatus || 'Unknown',
        taxRate:
          propertyData?.data?.taxInfo?.taxAmount && propertyData?.data?.taxInfo?.assessedValue
            ? (parseFloat(propertyData.data.taxInfo.taxAmount) /
                parseFloat(propertyData.data.taxInfo.assessedValue.toString())) *
              100
            : 0,
        appreciationRate: calculateAppreciationRate(mlsData || null),
        zipTrend: calculateZipTrend(mlsData || null, propertyData || null),
        schoolRating: calculateSchoolRating(mlsData || null),
        marketScore: calculateMarketScore(mlsData || null),
        marketActivityScore: calculateMarketActivityScore(mlsData || null),
        locationScore: calculateLocationScore(mlsData || null, propertyData || null),
        propertyConditionScore: calculatePropertyConditionScore(mlsData || null),
        neighborhoodSafetyScore: calculateNeighborhoodSafetyScore(
          mlsData || null,
          propertyData || null,
        ),
        zipTrendValue: 0, // Placeholder, original modal had this
      };
      setCmaSubjectProperty(currentSubjectProperty);

      const comps = propertyData?.data?.comps || [];
      const fetchedCompMLSData: Record<string, ExtendedMLSListing> = {};

      // Fetch MLS data for all comps in parallel
      const compMLSPromises = comps.map(async (comp) => {
        const compMLS = await fetchMLSDataForComp(comp);
        if (compMLS) {
          const uniqueKey = `${comp.property_id}_${comp.address?.address}`;
          fetchedCompMLSData[uniqueKey] = compMLS;
        }
      });
      await Promise.all(compMLSPromises);
      setRelatedMLSData(fetchedCompMLSData);

      const processedComps = comps
        .filter((comp: any) => {
          const uniqueKey = `${comp.property_id}_${comp.address?.address}`;
          const compMls = fetchedCompMLSData[uniqueKey];
          return compMls?.media?.primaryListingImageUrl || (comp.photos && comp.photos.length > 0);
        })
        .map((comp: any): Property => {
          const uniqueKey = `${comp.property_id}_${comp.address?.address}`;
          const compMlsDetail = fetchedCompMLSData[uniqueKey];

          const compImages = [
            ...(compMlsDetail?.media?.photosList?.map(
              (photo: any) => photo.highRes || photo.midRes || photo.lowRes,
            ) || []),
            ...(comp.photos || []),
          ].filter(Boolean) as string[];

          return {
            id: Number(comp.id),
            address: comp.address?.address || 'N/A',
            price: compMlsDetail?.listPrice
              ? `$${compMlsDetail.listPrice.toLocaleString()}`
              : 'N/A',
            image:
              compMlsDetail?.media?.primaryListingImageUrl ||
              comp.photos?.[0] ||
              '/placeholder.svg',
            images: compImages,
            beds: compMlsDetail?.property?.bedroomsTotal || comp.bedrooms || 0,
            baths: compMlsDetail?.property?.bathroomsTotal || comp.bathrooms || 0,
            sqft:
              compMlsDetail?.property?.lotSizeSquareFeet ||
              (comp.squareFeet ? parseInt(comp.squareFeet) : 0),
            daysToSale: compMlsDetail?.daysOnMarket ? parseInt(compMlsDetail.daysOnMarket) : null,
            daysOnMarket: compMlsDetail?.daysOnMarket ? parseInt(compMlsDetail.daysOnMarket) : 0,
            percentOfAsking:
              compMlsDetail?.price_changes?.[0]?.change_amount && compMlsDetail.listPrice
                ? Math.round(
                    (1 - compMlsDetail.price_changes[0].change_amount / compMlsDetail.listPrice) *
                      100,
                  )
                : null,
            amenities: [
              ...(compMlsDetail?.homedetails?.appliances
                ? String(compMlsDetail.homedetails.appliances)
                    .split(',')
                    .map((a: string) => a.trim())
                : []),
              ...(compMlsDetail?.homedetails?.exteriorFeatures
                ? String(compMlsDetail.homedetails.exteriorFeatures)
                    .split(',')
                    .map((a: string) => a.trim())
                : []),
            ],
            investmentScore: calculateInvestmentScore(compMlsDetail || null, null), // Pass null for propertyData for comps
            zipTrend: calculateZipTrend(compMlsDetail || null, null),
            zipTrendValue: 0,
            yearBuilt: compMlsDetail?.property?.yearBuilt
              ? Number(compMlsDetail.property.yearBuilt)
              : 0,
            lotSize: compMlsDetail?.property?.lotSizeSquareFeet
              ? `${compMlsDetail.property.lotSizeSquareFeet} sqft` // CMA modal used sqft for lot size
              : 'N/A',
            schoolRating: calculateSchoolRating(compMlsDetail || null),
            taxRate: 0, // Comps usually don't show this directly in CMA summary
            appreciationRate: calculateAppreciationRate(compMlsDetail || null),
            status: compMlsDetail?.standardStatus || compMlsDetail?.customStatus || 'Active',
            marketScore: calculateMarketScore(compMlsDetail || null),
            marketActivityScore: calculateMarketActivityScore(compMlsDetail || null),
            locationScore: calculateLocationScore(compMlsDetail || null, null),
            propertyConditionScore: calculatePropertyConditionScore(compMlsDetail || null),
            neighborhoodSafetyScore: calculateNeighborhoodSafetyScore(compMlsDetail || null, null),
          };
        });

      setCmaProperties([currentSubjectProperty, ...processedComps]);
      setLoadingCompsData(false);
    };

    if (propertyData) {
      processCMAData();
    }
    // Depend on propertyData and mlsData (for subject property's MLS info)
  }, [propertyData, mlsData]);

  React.useEffect(() => {
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

  const handleShare = (platform: string) => {
    // Implement share functionality based on the platform
    console.log(`Sharing on ${platform}`);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        return;
      }
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

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
      {/* Left Sidebar */}
      <SidebarLeft />

      <SidebarInset>
        {/* Unified Sticky Header */}
        <div className="overflow-x-hidden overflow-y-hidden sticky top-0 z-50 w-full shadow-sm bg-background dark:bg-background/95">
          <NewNavbar
            propertyData={propertyData} // Pass the fetched data
            mlsData={mlsData}
            showSearch={true}
            showThemeToggle={true}
            showLanguageSelector={true}
            showUserMenu={true}
            showBalance={true}
            showCreateButton={true}
            isLogoVisible={false}
            isSidebarVisible={true}
            balance={1547.4}
            user={{
              name:
                session?.user?.user_metadata?.full_name ||
                session?.user?.email?.split('@')[0] ||
                '',
              email: session?.user?.email || '',
              initials: session?.user?.user_metadata?.full_name
                ? session.user.user_metadata.full_name
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase()
                : session?.user?.email?.charAt(0).toUpperCase() || '',
            }}
            className="w-full border-b-0"
            isDark={theme === 'dark'}
            onThemeToggle={(newTheme) => setTheme(newTheme || 'system')}
            onLogout={handleLogout}
          />
          {/* Page Section Navigation - now part of the sticky block */}
          {!loading && !error && propertyData && (
            <PageSectionNav sections={pageSections} activeSection={activeSection} />
          )}
        </div>

        {/* Main content area */}
        <div className="flex overflow-x-hidden flex-col flex-1 gap-4 p-4 md:p-6 lg:max-w-none">
          {/* AI Chat Sidebar */}
          {/* <AIChat /> */}

          {/* OperatorSearch fixed to bottom and centered relative to SidebarInset */}
          <div className="flex fixed right-0 left-0 bottom-6 z-50 justify-center pl-0 mx-auto lg:pl-64">
            <div className="px-4 w-full max-w-4xl">
              <Search />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-lg text-foreground">
                {addressQuery ? `Loading details for ${addressQuery}...` : 'Loading...'}
              </span>
            </div>
          ) : error ? (
            <div className="px-4 py-3 rounded-md border bg-destructive/10 border-destructive/20 text-destructive">
              <p className="font-medium">{error}</p>
              <p className="mt-1 text-sm">
                {addressQuery
                  ? `Unable to load property at address: ${addressQuery}`
                  : 'No property information provided.'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Hero Section */}
              <div id="hero" className="w-full">
                <PropertyHero propertyData={propertyData} mlsData={mlsData} />
              </div>

              <div className="w-full md:px-6">
                <div className="overflow-x-hidden space-y-12 max-w-full">
                  {(mlsData?.standardStatus || mlsData?.customStatus) && (
                    <div id="gallery">
                      <PropertyGallery propertyData={propertyData} mlsData={mlsData} />
                    </div>
                  )}

                  {/* Property Details */}
                  <div id="details">
                    <PropertyDetails propertyData={propertyData} mlsData={mlsData} />
                  </div>

                  {/* Financial Details */}
                  <div id="financial">
                    <FinancialDetails propertyData={propertyData} mlsData={mlsData} />
                  </div>

                  {/* School Information */}
                  <div id="schools">
                    <SchoolInformation propertyData={propertyData} mlsData={mlsData} />
                  </div>

                  {/* Location Information */}
                  <div id="location">
                    <LocationInformation propertyData={propertyData} mlsData={mlsData} />
                  </div>

                  {/* Flood and Environmental */}
                  <div id="flood">
                    <FloodAndEnvironmental propertyData={propertyData} mlsData={mlsData} />
                  </div>

                  {/* Property Charts */}
                  <div id="charts" className="mb-8">
                    <PropertyCharts propertyData={propertyData} mlsData={mlsData} />
                  </div>

                  {/* Agent Information */}
                  <div id="agent">
                    <AgentInformation propertyData={propertyData} mlsData={mlsData} />
                  </div>

                  {/* Related Properties */}
                  <div id="related">
                    {/* <RelatedProperties propertyData={propertyData} mlsData={mlsData} /> */}
                    <div className="mx-auto w-full max-w-full">
                      {/* <RealEstateCMAModal mlsData={mlsData} propertyData={propertyData} /> */}
                      {loadingCompsData ? (
                        <Spinner size="lg" />
                      ) : cmaProperties.length > 0 && cmaSubjectProperty ? (
                        <div className="space-y-16 w-full">
                          <section id="cma-overview-details">
                            <h2 className="mb-4 text-2xl font-bold text-foreground">
                              Property Competitive Analysis
                            </h2>
                            <PropertyCombinedAnalysis
                              properties={cmaProperties}
                              subjectProperty={cmaSubjectProperty}
                              isMobile={isMobileCMA}
                              onPropertyClick={setSelectedCMAProperty}
                            />
                          </section>

                          <section id="cma-market-analysis">
                            <h2 className="mb-4 text-2xl font-bold text-foreground">
                              {' '}
                              Market Analysis
                            </h2>
                            <MarketAnalysis
                              properties={cmaProperties}
                              subjectProperty={cmaSubjectProperty}
                              isMobile={isMobileCMA}
                              onPropertyClick={setSelectedCMAProperty}
                            />
                          </section>

                          <section id="cma-images">
                            <h2 className="mb-4 text-2xl font-bold text-foreground">
                              {' '}
                              Property Images Comparison
                            </h2>
                            <CMAPropertyImages
                              properties={cmaProperties}
                              subjectProperty={cmaSubjectProperty}
                              isMobile={isMobileCMA}
                              onPropertyClick={setSelectedCMAProperty}
                            />
                          </section>
                        </div>
                      ) : (
                        !loading &&
                        !error && (
                          <p className="text-center text-muted-foreground">
                            No comparable properties data to display.
                          </p>
                        )
                      )}
                    </div>
                  </div>

                  {/* Property History */}
                  <div id="history">
                    <PropertyHistory
                      address={
                        propertyData?.data?.propertyInfo?.address
                          ? `${propertyData.data.propertyInfo.address.house} ${propertyData.data.propertyInfo.address.street} ${propertyData.data.propertyInfo.address.streetType}, ${propertyData.data.propertyInfo.address.city}, ${propertyData.data.propertyInfo.address.state} ${propertyData.data.propertyInfo.address.zip}`
                          : 'Address not available'
                      }
                      mlsData={mlsData}
                      propertyData={propertyData}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading property details...</span>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
