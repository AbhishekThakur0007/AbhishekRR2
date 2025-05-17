import React, { useState, useEffect } from 'react';
import { MLSListing, PropertyDetailResponse } from '@/app/types/real-estate';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Ruler, MapPin, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface MinimalMLSData {
  status_changes?: Array<{ status: string; date: string }>;
  price_changes?: Array<{ price: number; date: string; change_amount: number; direction: string }>;
}

interface ComparableProperty {
  property_id: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: string;
  estimatedValue: string;
  photos?: string[];
  address?: {
    address: string;
  };
}

interface MLSResponse {
  mlsData?: MLSListing;
  price_changes?: Array<{ price: number; date: string; change_amount: number; direction: string }>;
  status_changes?: Array<{ status: string; date: string }>;
}

interface ExtendedMLSListing extends MLSListing {
  _propertyId?: string;
  _address?: string;
}

interface RelatedPropertiesProps {
  propertyData?: PropertyDetailResponse | null;
  mlsData?: MLSListing | null;
}

export function RelatedProperties({ propertyData, mlsData }: RelatedPropertiesProps) {
  const router = useRouter();
  const [relatedMLSData, setRelatedMLSData] = useState<Record<string, ExtendedMLSListing>>({});
  const [loadingMLS, setLoadingMLS] = useState<Record<string, boolean>>({});

  // Get related properties from the API response
  const relatedProperties = propertyData?.data?.comps || [];

  // Fetch MLS data for a property
  const fetchMLSData = async (property: ComparableProperty) => {
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

      const rawData = (await response.json()) as MLSResponse;

      // Extract the correct MLS data and cast it
      const mlsData = (rawData.mlsData || rawData) as MLSListing;

      // Create a unique key using both property ID and address to ensure uniqueness
      const uniqueKey = `${property.property_id}_${property.address?.address}`;

      // console.log('MLS Data Processing:', {
      //   propertyId: property.property_id,
      //   address: property.address?.address,
      //   uniqueKey,
      //   imageUrl: mlsData.media?.primaryListingImageUrl,
      //   hasPhotos: mlsData.hasPhotos,
      // });

      // Store with the unique key
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
    relatedProperties.forEach((property) => {
      fetchMLSData(property);
    });
  }, [relatedProperties]);

  // Skip if no data
  if (!propertyData && !mlsData) return null;

  // If no related properties, return null
  if (!relatedProperties || relatedProperties.length === 0) {
    return null;
  }

  // Format currency helper function
  const formatCurrency = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  const handleViewDetails = (property: ComparableProperty) => {
    if (!property.address?.address) return;

    const searchParams = new URLSearchParams();
    searchParams.append('q', property.address.address);
    if (property.property_id) {
      searchParams.append('propertyId', property.property_id);
    }

    router.push(`/search?${searchParams.toString()}`);
  };

  const getBadgeColor = (status: string) => {
    if (!status) return 'bg-secondary';

    const statusLower = status.toLowerCase();

    if (statusLower.includes('active') || statusLower === 'for sale')
      return 'bg-green-500 hover:bg-green-600';

    if (statusLower.includes('pending') || statusLower.includes('contingent'))
      return 'bg-yellow-500 hover:bg-yellow-600';

    if (statusLower.includes('sold') || statusLower === 'closed')
      return 'bg-blue-500 hover:bg-blue-600';

    if (statusLower.includes('withdrawn') || statusLower.includes('cancelled'))
      return 'bg-red-500 hover:bg-red-600';

    return 'bg-secondary';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">Similar Properties</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {relatedProperties
          .filter((property: ComparableProperty) => {
            // Create the same unique key for lookup
            const uniqueKey = `${property.property_id}_${property.address?.address}`;
            const mlsData = relatedMLSData[uniqueKey];

            // Only show properties with images
            return (
              mlsData?.media?.primaryListingImageUrl ||
              (property.photos && property.photos.length > 0)
            );
          })
          .map((property: ComparableProperty) => {
            // Create the same unique key for lookup
            const uniqueKey = `${property.property_id}_${property.address?.address}`;
            const mlsData = relatedMLSData[uniqueKey];
            const isLoading = loadingMLS[property.property_id];

            // Verify we're using the correct data for this property
            // console.log('Rendering Property:', {
            //   propertyId: property.property_id,
            //   address: property.address?.address,
            //   uniqueKey,
            //   storedAddress: mlsData?._address,
            //   imageUrl: mlsData?.media?.primaryListingImageUrl,
            //   fallbackImage: property.photos?.[0],
            // });

            // Get the image URL, ensuring we're using the correct property's data
            const imageUrl =
              (mlsData?._address === property.address?.address
                ? mlsData?.media?.primaryListingImageUrl
                : null) ||
              property.photos?.[0] ||
              '/placeholder.svg';

            return (
              <Card key={uniqueKey} className="group hover:shadow-lg transition-shadow">
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <Image
                      src={imageUrl}
                      alt={property.address?.address || 'Property'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  {mlsData?.standardStatus && (
                    <Badge
                      className={`absolute top-2 right-2 text-xs ${getBadgeColor(mlsData.standardStatus)}`}
                      variant="default"
                    >
                      {mlsData.standardStatus}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">
                        {property.address?.address || 'Address not available'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm truncate">
                      {property.address?.address || 'Address not available'}
                    </h3>
                    <p className="text-base font-bold text-primary">
                      {formatCurrency(mlsData ? mlsData.listPrice : property.estimatedValue || 0)}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-0.5">
                        <Bed className="h-3 w-3" />
                        <span>
                          {mlsData
                            ? mlsData.property?.bedroomsTotal || property.bedrooms || 0
                            : property.bedrooms || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Bath className="h-3 w-3" />
                        <span>
                          {mlsData
                            ? mlsData.property?.bathroomsTotal || property.bathrooms || 0
                            : property.bathrooms || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Ruler className="h-3 w-3" />
                        <span>
                          {(mlsData
                            ? mlsData.property?.livingArea || property.squareFeet || 0
                            : property.squareFeet || 0
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Status: {mlsData?.standardStatus || mlsData?.customStatus || 'Unknown'}
                    </div>
                  </div>
                  <Button
                    className="w-full mt-2 text-xs"
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(property)}
                  >
                    View Details
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
      </div>

      <div className="text-center mt-6">
        <Button variant="outline" size="lg">
          View More Similar Properties
        </Button>
      </div>
    </div>
  );
}
