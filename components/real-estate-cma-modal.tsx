'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyImageGallery } from './property-image-gallery';
import PropertyDetailModal from './property-detail-modal';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  MLSListing,
  PropertyDetailResponse,
  Property,
  ExtendedMLSListing,
} from '@/utils/property-types';
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
  calculateTaxRate,
} from '@/utils/real-estate-scores';
import { PropertyOverview } from './PropertyOverview';
import { PropertyDetails } from './PropertyDetails';
import { MarketAnalysis } from './MarketAnalysis';
import { PropertyImages } from './PropertyImages';

interface RealEstateCMAModalProps {
  mlsData?: MLSListing | null;
  propertyData?: PropertyDetailResponse | null;
}

export default function RealEstateCMAModal({ mlsData, propertyData }: RealEstateCMAModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [relatedMLSData, setRelatedMLSData] = useState<Record<string, ExtendedMLSListing>>({});
  const [loadingMLS, setLoadingMLS] = useState<Record<string, boolean>>({});
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Check if the screen is mobile size
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  // Update isMobile state when screen size changes
  useEffect(() => {
    setIsMobile(isSmallScreen);
  }, [isSmallScreen]);

  // Get comps from property data
  const comps = propertyData?.data?.comps || [];

  // Fetch MLS data for a property
  const fetchMLSData = async (property: any) => {
    if (!property.address?.address || relatedMLSData[property.property_id]) return;

    setLoadingMLS((prev) => ({ ...prev, [property.property_id]: true }));

    try {
      const response = await fetch('/api/real-estate/mls-detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: property.address.address,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = (await response.json()) as { mlsData?: MLSListing } | MLSListing;
      const mlsData = 'mlsData' in rawData ? rawData.mlsData : rawData;

      const uniqueKey = `${property.property_id}_${property.address?.address}`;

      setRelatedMLSData((prev) => ({
        ...prev,
        [uniqueKey]: {
          ...mlsData,
          _propertyId: property.property_id,
          _address: property.address?.address,
        },
      }));
    } catch (err) {
      console.error('Error fetching MLS details for property:', property.address?.address, err);
    } finally {
      setLoadingMLS((prev) => ({ ...prev, [property.property_id]: false }));
    }
  };

  // Fetch MLS data for all related properties
  useEffect(() => {
    comps.forEach((property) => {
      fetchMLSData(property);
    });
  }, [comps]);

  // Get property images from both MLS and property data
  const mlsImages =
    mlsData?.media?.photosList?.map((photo: any) => ({
      src: photo.highRes || photo.midRes || photo.lowRes,
      alt: 'Property image',
    })) || [];

  const propertyImages =
    propertyData?.data?.propertyInfo?.photos?.map((url: string, index: number) => ({
      src: url,
      alt: `Property image ${index + 1}`,
    })) || [];

  // Use MLS images if available, otherwise use property images
  const images = mlsImages.length > 0 ? mlsImages : propertyImages;

  // Get address from property data
  const address = propertyData?.data?.propertyInfo?.address;
  const fullAddress = address?.label || 'N/A';

  // Transform comps into the format needed for the table
  const properties = comps
    .filter((comp: any) => {
      const uniqueKey = `${comp.property_id}_${comp.address?.address}`;
      const mlsData = relatedMLSData[uniqueKey];
      return mlsData?.media?.primaryListingImageUrl || (comp.photos && comp.photos.length > 0);
    })
    .map((comp: any) => {
      const uniqueKey = `${comp.property_id}_${comp.address?.address}`;
      const mlsData = relatedMLSData[uniqueKey];

      const images = [
        ...(mlsData?.media?.photosList?.map(
          (photo: any) => photo.highRes || photo.midRes || photo.lowRes,
        ) || []),
        ...(comp.photos || []),
      ].filter(Boolean) as string[];

      return {
        id: Number(comp.id),
        address: comp.address?.address || 'N/A',
        price: mlsData?.listPrice ? `$${mlsData.listPrice.toLocaleString()}` : 'N/A',
        image: mlsData?.media?.primaryListingImageUrl || comp.photos?.[0] || '/placeholder.svg',
        images,
        beds: mlsData?.property?.bedroomsTotal || comp.bedrooms || 0,
        baths: mlsData?.property?.bathroomsTotal || comp.bathrooms || 0,
        sqft:
          mlsData?.property?.lotSizeSquareFeet || (comp.squareFeet ? parseInt(comp.squareFeet) : 0),
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
        zipTrend: calculateZipTrend(mlsData || null, propertyData || null),
        zipTrendValue: 0,
        yearBuilt: mlsData?.property?.yearBuilt ? Number(mlsData.property.yearBuilt) : 0,
        lotSize: mlsData?.property?.lotSizeSquareFeet
          ? `${mlsData.property.lotSizeSquareFeet} sqft`
          : 'N/A',
        schoolRating: calculateSchoolRating(mlsData || null),
        taxRate: 0,
        appreciationRate: calculateAppreciationRate(mlsData || null),
        status: mlsData?.standardStatus || mlsData?.customStatus || 'Active',
        marketScore: calculateMarketScore(mlsData || null),
        marketActivityScore: calculateMarketActivityScore(mlsData || null),
        locationScore: calculateLocationScore(mlsData || null, propertyData || null),
        propertyConditionScore: calculatePropertyConditionScore(mlsData || null),
        neighborhoodSafetyScore: calculateNeighborhoodSafetyScore(
          mlsData || null,
          propertyData || null,
        ),
      };
    });

  // Transform subject property data
  const subjectProperty = {
    id: Number(propertyData?.data?.propertyInfo?.id),
    address: propertyData?.data?.propertyInfo?.address?.label || 'Address not available',
    price: mlsData?.listPrice ? `$${mlsData.listPrice.toLocaleString()}` : 'Price not available',
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
    baths: mlsData?.property?.bathroomsTotal || propertyData?.data?.propertyInfo?.bathrooms || 0,
    sqft:
      mlsData?.property?.lotSizeSquareFeet ||
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
    zipTrendValue: 0,
  };

  // Add subject property to the beginning of the properties array
  properties.unshift(subjectProperty);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full">
        Open Competitive Market Analysis
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold md:text-2xl">
              Competitive Market Analysis
            </DialogTitle>
            <DialogDescription>{fullAddress}</DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {/* Replace the subject property section in the modal with this updated version that includes the image gallery */}
            <div className="p-3 mb-6 rounded-lg bg-muted md:p-4">
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-lg font-bold md:text-xl">{subjectProperty?.address}</h2>
                  <Badge className="mt-1">{subjectProperty?.status}</Badge>
                </div>

                {subjectProperty && (
                  <PropertyImageGallery
                    images={subjectProperty.images}
                    address={subjectProperty.address}
                  />
                )}

                <div className="grid grid-cols-2 gap-4 mt-2 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-base font-semibold md:text-lg">{subjectProperty?.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Beds/Baths</p>
                    <p className="text-base font-semibold md:text-lg">
                      {subjectProperty?.beds}/{subjectProperty?.baths}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Square Feet</p>
                    <p className="text-base font-semibold md:text-lg">
                      {subjectProperty?.sqft.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Days on Market</p>
                    <p className="text-base font-semibold md:text-lg">
                      {subjectProperty?.daysOnMarket}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview">
              {/* Make tabs responsive */}
              <TabsList className="grid grid-cols-2 w-full md:grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="detailed">Details</TabsTrigger>
                <TabsTrigger value="market">Market</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <PropertyOverview
                  properties={properties}
                  subjectProperty={subjectProperty}
                  isMobile={isMobile}
                  onPropertyClick={setSelectedProperty}
                />
              </TabsContent>

              <TabsContent value="detailed" className="mt-4">
                <PropertyDetails
                  properties={properties}
                  subjectProperty={subjectProperty}
                  isMobile={isMobile}
                  onPropertyClick={setSelectedProperty}
                />
              </TabsContent>

              <TabsContent value="market" className="mt-4">
                <MarketAnalysis
                  properties={properties}
                  subjectProperty={subjectProperty}
                  isMobile={isMobile}
                  onPropertyClick={setSelectedProperty}
                />
              </TabsContent>

              {/* Add a new TabsContent for the property images tab */}
              <TabsContent value="images" className="mt-4">
                <PropertyImages
                  properties={properties}
                  subjectProperty={subjectProperty}
                  isMobile={isMobile}
                  onPropertyClick={setSelectedProperty}
                />
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
      {/* Add the PropertyDetailModal component at the end of the component, before the final return closing tag */}
      {/* <PropertyDetailModal
        property={selectedProperty}
        isOpen={selectedProperty !== null}
        onClose={() => setSelectedProperty(null)}
      /> */}
    </>
  );
}
