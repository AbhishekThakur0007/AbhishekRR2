import { RealEstateAPIResponse } from "@/app/types/real-estate";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Square, Home, Calendar, DollarSign } from "lucide-react";

interface PropertyDetailsProps {
  property: RealEstateAPIResponse;
  onClose: () => void;
}

export function PropertyDetails({ property, onClose }: PropertyDetailsProps) {
  return (
    <div className="bg-background rounded-lg shadow-md p-4 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{property.address?.line}</h2>
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Property Images */}
        <div className="rounded-lg overflow-hidden h-64">
          {property.photos && property.photos.length > 0 ? (
            <img
              src={property.photos[0]}
              alt={property.address?.line || "Property"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-muted w-full h-full flex items-center justify-center">
              <Home className="h-12 w-12 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                No image available
              </span>
            </div>
          )}
        </div>

        {/* Property Info */}
        <div>
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-primary">
              ${property.price?.list?.toLocaleString() || "N/A"}
            </h3>
            <p className="text-lg">
              {property.address?.city}, {property.address?.state}{" "}
              {property.address?.postal_code}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="flex flex-col items-center bg-muted p-2 rounded">
              <Bed className="h-5 w-5 mb-1" />
              <span className="font-semibold">
                {property.property?.beds || 0}
              </span>
              <span className="text-xs text-muted-foreground">Beds</span>
            </div>
            <div className="flex flex-col items-center bg-muted p-2 rounded">
              <Bath className="h-5 w-5 mb-1" />
              <span className="font-semibold">
                {property.property?.baths || 0}
              </span>
              <span className="text-xs text-muted-foreground">Baths</span>
            </div>
            <div className="flex flex-col items-center bg-muted p-2 rounded">
              <Square className="h-5 w-5 mb-1" />
              <span className="font-semibold">
                {property.property?.size_sqft?.toLocaleString() || 0}
              </span>
              <span className="text-xs text-muted-foreground">SqFt</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Home className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Type: {property.property?.type || "Unknown"}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                Year Built: {property.property?.year_built || "Unknown"}
              </span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                Price per SqFt: $
                {property.price?.list && property.property?.size_sqft
                  ? Math.round(
                      property.price.list / property.property.size_sqft
                    )
                  : "Unknown"}
              </span>
            </div>
          </div>

          <div className="mt-4 flex justify-between">
            <Button>Contact Agent</Button>
            <Button variant="outline">Schedule Tour</Button>
          </div>
        </div>
      </div>

      {/* Property Description */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">About This Property</h3>
        <p className="text-muted-foreground">
          {property.description ||
            "No description available for this property."}
        </p>
      </div>
    </div>
  );
}
