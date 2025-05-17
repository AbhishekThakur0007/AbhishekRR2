'use client';
import { MLSListing, PropertyDetailResponse } from '@/app/types/real-estate';
import { OperatorSearch } from '@/components/operator-search';
import PropertyHistory from '@/components/property-history';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { Suspense, useEffect, useRef, useState } from 'react';

import { AgentInformation } from '@/components/agent-information';
import { FinancialDetails } from '@/components/financial-details';
import { FloodAndEnvironmental } from '@/components/flood-environmental';
import { LocationInformation } from '@/components/location-information';
import { PropertyCharts } from '@/components/property-charts';
import { PropertyDetails } from '@/components/property-details';
import { PropertyGallery } from '@/components/property-gallery';
import { PropertyHero } from '@/components/property-hero';
import { RelatedProperties } from '@/components/related-properties';
import { SchoolInformation } from '@/components/school-information';
import { PageSectionNav } from './PageSectionNav';

const PropertyDetailModal = ({
  addressQuery,
  handleClose,
  propertyId,
}: {
  // addressQuery: string;
  addressQuery: string;
  propertyId?: string;
  handleClose: () => void;
}) => {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = React.useState<any>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propertyData, setPropertyData] = useState<PropertyDetailResponse | null>(null);
  const [mlsData, setMlsData] = useState<MLSListing | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const fetchInProgress = useRef(false);

  // Define page sections for anchor links
  const pageSections = [
    { id: 'hero', label: 'Featured Property', icon: '🏠' },
    { id: 'gallery', label: 'Photo Gallery', icon: '📷' },
    { id: 'details', label: 'Property Details', icon: '📋' },
    { id: 'financial', label: 'Financial Details', icon: '💰' },
    { id: 'schools', label: 'School Information', icon: '🏫' },
    { id: 'location', label: 'Location', icon: '📍' },
    { id: 'flood', label: 'Environmental', icon: '🌊' },
    { id: 'agent', label: 'Contact Information', icon: '👤' },
    { id: 'history', label: 'Property History', icon: '📜' },
  ];

  // Handle scroll events
  // useEffect(() => {
  //   const handleScroll = () => {
  //     console.log('handling scroll......');
  //     const scrollY = window.scrollY;
  //     const winHeight = window.innerHeight;
  //     const docHeight = document.documentElement.scrollHeight;

  //     // Show back to top button after scrolling down 300px
  //     setShowBackToTop(scrollY > 300);

  //     // Calculate scroll progress
  //     const scrolled = (scrollY / (docHeight - winHeight)) * 100;
  //     setScrollProgress(scrolled);

  //     // Update active section based on scroll position
  //     const sections = pageSections.map((section) => ({
  //       id: section.id,
  //       element: document.getElementById(section.id),
  //     }));

  //     const currentSection = sections.find((section) => {
  //       if (!section.element) return false;
  //       const rect = section.element.getBoundingClientRect();
  //       return rect.top <= 100 && rect.bottom > 100;
  //     });

  //     if (currentSection) {
  //       setActiveSection(currentSection.id);
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  useEffect(() => {
    const handleScroll = () => {
      console.log('handleScroll');
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollY = container.scrollTop;
      const winHeight = container.clientHeight;
      const docHeight = container.scrollHeight;

      // Show back to top button after scrolling down 300px
      setShowBackToTop(scrollY > 300);

      // Calculate scroll progress
      const scrolled = (scrollY / (docHeight - winHeight)) * 100;
      setScrollProgress(scrolled);

      // Determine active section
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

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Fetch property data when addressQuery changes
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!addressQuery || fetchInProgress.current) return;

      setLoading(true);
      setError(null);
      fetchInProgress.current = true;

      try {
        console.log('📤 Sending request to /api/real-estate/property-detail-for-modal');
        // const response = await fetch('/api/real-estate/property-detail', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     // propertyId,
        //     address: addressQuery,
        //   }),
        // });
        const response = await fetch('/api/real-estate/property-detail-for-modal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            propertyId,
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

      console.log('=====================================', propertyData);

      try {
        // const response = await fetch('/api/real-estate/mls-detail', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     // propertyId,
        //     address: addressQuery,
        //     // mls_id: mlsId,
        //   }),
        // });
        const response = await fetch('/api/real-estate/mls-detail-for-modal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mls_id: propertyData.data.id,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as MLSListing;

        console.log('data::::::::', data);
        setMlsData(data);
      } catch (err) {
        console.error('Error fetching MLS details:', err);
        // Don't set error state for MLS data - it's optional
      } finally {
        setLoading(false);
      }
    };

    fetchMLSDetails();
  }, [propertyData, addressQuery]);

  React.useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading property details...</span>
        </div>
      }
    >
      <div className="fixed inset-0 z-50 flex flex-col w-full h-full bg-background dark:bg-background/95">
        {/* Fixed header */}
        <div className="sticky top-0 z-10 w-full shadow-sm bg-background dark:bg-background/95">
          {!loading && !error && propertyData && (
            <PageSectionNav
              sections={pageSections}
              activeSection={activeSection}
              scrollContainerRef={scrollContainerRef}
            />
          )}
        </div>
        <div
          ref={scrollContainerRef}
          className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:max-w-none overflow-x-hidden overflow-y-auto h-full"
        >
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg text-foreground"></span>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-1"></p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Hero Section */}
              <div id="hero" className="w-full">
                <PropertyHero propertyData={propertyData} mlsData={mlsData} />
              </div>

              <div className="w-full md:px-6">
                <div className="space-y-12 max-w-full overflow-x-hidden">
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

                  {/* Related Properties */}
                  <div id="related">
                    <RelatedProperties propertyData={propertyData} mlsData={mlsData} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default PropertyDetailModal;
