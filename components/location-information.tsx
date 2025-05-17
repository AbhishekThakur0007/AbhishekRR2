import React from "react";
import { MLSListing, PropertyDetailResponse } from "@/app/types/real-estate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Building,
  Landmark,
  Layers,
  Home,
  Map,
  Globe,
  Navigation,
  Compass,
  CircleDollarSign,
  Building2,
  MapPinned,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface LocationInformationProps {
  propertyData?: PropertyDetailResponse | null;
  mlsData?: MLSListing | null;
}

export function LocationInformation({
  propertyData,
  mlsData,
}: LocationInformationProps) {
  // Skip if no data
  if (!propertyData && !mlsData) {
    return null;
  }

  // Extract location data
  const address = propertyData?.data?.propertyInfo?.address;
  const lotInfo = propertyData?.data?.lotInfo;
  const propertyInfo = propertyData?.data?.propertyInfo;

  // Check if we have enough data to show
  const hasAddressData = address;
  const hasLotData = lotInfo;
  const hasPropertyData = propertyInfo;

  if (!hasAddressData && !hasLotData && !hasPropertyData) {
    return null;
  }

  // Generate Google Maps URL using coordinates from propertyData
  const getGoogleMapsUrl = (): string | undefined => {
    if (!propertyInfo?.latitude || !propertyInfo?.longitude) return undefined;
    return `https://maps.google.com/maps?q=${propertyInfo.latitude},${propertyInfo.longitude}&t=&z=20&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Location Information
      </h2>

      {/* Map Section */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            <span>Property Location</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative h-[400px] w-full">
            {getGoogleMapsUrl() ? (
              <iframe
                src={getGoogleMapsUrl()}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            ) : (
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <div className="text-center">
                  <MapPinned className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Map unavailable</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Address Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Address Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Full Address</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{address?.label || "N/A"}</p>
                <p>
                  {address?.house} {address?.street}
                  {address?.streetType ? ` ${address.streetType}` : ""}
                  {address?.unit ? ` ${address.unit}` : ""}
                </p>
                <p>
                  {address?.city}, {address?.state} {address?.zip}
                  {address?.zip4 ? `-${address.zip4}` : ""}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Location Details</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>County: {address?.county || "N/A"}</p>
                <p>Jurisdiction: {address?.jurisdiction || "N/A"}</p>
                <p>
                  Congressional District:{" "}
                  {address?.congressionalDistrict || "N/A"}
                </p>
                <p>FIPS Code: {address?.fips || "N/A"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lot Information */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" />
            <span>Lot Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Property Details</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>APN: {lotInfo?.apn || "N/A"}</p>
                <p>Legal Description: {lotInfo?.legalDescription || "N/A"}</p>
                <p>Legal Section: {lotInfo?.legalSection || "N/A"}</p>
                <p>Lot Number: {lotInfo?.lotNumber || "N/A"}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Land Use</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Land Use: {lotInfo?.landUse || "N/A"}</p>
                <p>Property Class: {lotInfo?.propertyClass || "N/A"}</p>
                <p>Property Use: {lotInfo?.propertyUse || "N/A"}</p>
                <p>Zoning: {lotInfo?.zoning || "N/A"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Area Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <span>Area Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Census Information</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Census Block: {lotInfo?.censusBlock || "N/A"}</p>
                <p>Census Block Group: {lotInfo?.censusBlockGroup || "N/A"}</p>
                <p>Census Tract: {lotInfo?.censusTract || "N/A"}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Lot Details</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Subdivision: {lotInfo?.subdivision || "N/A"}</p>
                <p>
                  Lot Size:{" "}
                  {lotInfo?.lotAcres ? `${lotInfo.lotAcres} acres` : "N/A"}
                </p>
                <p>
                  Lot Square Feet:{" "}
                  {lotInfo?.lotSquareFeet?.toLocaleString() || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
