import { Bed, Bath, Square, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RealEstateAPIResponse } from '@/app/types/real-estate';

interface PropertyListItemProps {
  property: RealEstateAPIResponse;
  onClick: () => void;
  viewDetails: (e?: React.MouseEvent) => void;
}

export function PropertyListItem({ property, onClick, viewDetails }: PropertyListItemProps) {
  // Format address details, handling cases where parts might be missing
  const formatAddress = () => {
    const parts = [];
    if (property.address?.city) parts.push(property.address.city);
    if (property.address?.state) parts.push(property.address.state);
    if (property.address?.postal_code) parts.push(property.address.postal_code);

    if (parts.length === 0) return 'Location unavailable';
    return parts.join(', ');
  };

  const formatPrice = (price: number | undefined) => {
    // Format price for display with proper formatting
    if (!price) return 'Price unavailable';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className="flex gap-3 border-b border-border pb-4 cursor-pointer hover:bg-muted p-2 rounded"
      onClick={onClick}
    >
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
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          {property.property?.beds !== undefined && property.property?.beds > 0 && (
            <span className="flex items-center">
              <Bed className="h-3 w-3 mr-1" />
              {property.property?.beds} bd
            </span>
          )}
          {property.property?.baths !== undefined && property.property?.baths > 0 && (
            <span className="flex items-center">
              <Bath className="h-3 w-3 mr-1" />
              {property.property?.baths} ba
            </span>
          )}
          {property.property?.size_sqft && property.property?.size_sqft > 0 && (
            <span className="flex items-center">
              <Square className="h-3 w-3 mr-1" />
              {property.property?.size_sqft?.toLocaleString()} sqft
            </span>
          )}
        </div>
        {property.property?.type && (
          <Badge variant="outline" className="mt-1 text-xs bg-muted">
            {property.property?.type}
          </Badge>
        )}
        <Button
          variant="link"
          size="sm"
          className="p-0 h-auto text-primary"
          onClick={(e) => {
            e.stopPropagation();
            viewDetails(e);
          }}
        >
          View details
        </Button>
      </div>
    </div>
  );
}
