import { Bed, Bath, Square, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RealEstateAPIResponse } from '@/app/types/real-estate';

interface SelectedPropertyInfoProps {
  property: RealEstateAPIResponse;
  viewDetails: () => void;
  onClose: () => void;
  showListings: boolean;
  showFilters: boolean;
}

export function SelectedPropertyInfo({
  property,
  viewDetails,
  onClose,
  showListings,
  showFilters,
}: SelectedPropertyInfoProps) {
  // Format address details, handling cases where parts might be missing
  const formatAddress = () => {
    const parts = [];
    if (property.address?.city) parts.push(property.address.city);
    if (property.address?.state) parts.push(property.address.state);
    if (property.address?.postal_code) parts.push(property.address.postal_code);

    if (parts.length === 0) return 'Location unavailable';
    return parts.join(', ');
  };

  // Format price for display with proper formatting
  const formatPrice = (price: number | undefined) => {
    if (!price) return 'Price unavailable';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className={`
        fixed md:absolute 
        bottom-0 left-0 right-0 
        md:bottom-4 md:left-4 md:right-4 
        bg-white rounded-t-lg md:rounded-lg 
        shadow-md p-3 md:p-4 
        z-40
        border border-border
        ${showListings || showFilters ? 'translate-y-full md:translate-y-0' : 'translate-y-0'}
        transition-transform duration-300 w-[500px]
      `}
    >
      <div className="flex gap-3">
        <div className="relative w-24 h-20 flex-shrink-0">
          {property.photos && property.photos.length > 0 ? (
            <img
              src={property.photos[0]}
              alt={property.address?.line || 'Property'}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center rounded">
              <Home className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-primary">{formatPrice(property.price?.list)}</p>
              <h3 className="font-semibold line-clamp-1">
                {property.address?.line || 'Address unavailable'}
              </h3>
              <p className="text-sm text-muted-foreground">{formatAddress()}</p>
            </div>
            <Button variant="outline" size="sm" className="h-6" onClick={onClose}>
              Close
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            {property.property?.beds !== undefined && property.property?.beds > 0 && (
              <span className="flex items-center">
                <Bed className="h-3 w-3 mr-1" />
                {property.property.beds} bd
              </span>
            )}
            {property.property?.baths !== undefined && property.property?.baths > 0 && (
              <span className="flex items-center">
                <Bath className="h-3 w-3 mr-1" />
                {property.property.baths} ba
              </span>
            )}
            {property.property?.size_sqft && property.property?.size_sqft > 0 && (
              <span className="flex items-center">
                <Square className="h-3 w-3 mr-1" />
                {property.property.size_sqft.toLocaleString()} sqft
              </span>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            <Button size="sm" onClick={viewDetails}>
              View Details
            </Button>
            <Button variant="outline" size="sm">
              Save Property
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
