import React from "react";

interface Amenity {
  name: string;
  distance: string;
  rating?: number;
  type?: string;
}

interface AmenityCategory {
  category: string;
  items: Amenity[];
}

interface PropertyLocationProps {
  address: string;
  neighborhood?: string;
  nearbyAmenities?: AmenityCategory[];
  propertyData?: any;
  mlsData?: any;
}

export function PropertyLocation({
  address,
  neighborhood,
  nearbyAmenities = [],
  propertyData,
  mlsData,
}: PropertyLocationProps) {
  // Extract real coordinates from property data
  const latitude =
    propertyData?.data?.propertyInfo?.latitude ||
    mlsData?.property?.latitude ||
    38.8977;

  const longitude =
    propertyData?.data?.propertyInfo?.longitude ||
    mlsData?.property?.longitude ||
    -77.0365;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Location</h2>

      {/* Map */}
      <div className="rounded-lg overflow-hidden border border-border h-[400px] relative">
        <iframe
          src={`https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          className="w-full h-full"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          title="Property Location Map"
        ></iframe>
      </div>
    </div>
  );
}
