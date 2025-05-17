import React from "react";
import { MLSListing, PropertyDetailResponse } from "@/app/types/real-estate";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bed,
  Bath,
  Calendar,
  Home,
  DollarSign,
  Ruler,
  KeySquare,
  Droplets,
  Fan,
  Car,
  Building,
  MapPin,
  Flame,
  Info,
  LayoutGrid,
  Landmark,
  Layers,
  AlertCircle,
  CircleDollarSign,
  ListFilter,
  Warehouse,
} from "lucide-react";

interface PropertyDetailsProps {
  propertyData?: PropertyDetailResponse | null;
  mlsData?: MLSListing | null;
}

export function PropertyDetails({
  propertyData,
  mlsData,
}: PropertyDetailsProps) {
  // Skip rendering if no data is available
  if (!propertyData && !mlsData) {
    return (
      <Card className="border-2 border-dashed border-muted">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
          <Info className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-xl font-medium text-muted-foreground">
            Property details unavailable
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            We couldn&apos;t find property information for this address.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Format currency values
  const formatCurrency = (value: number | null | undefined): string => {
    if (!value) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Extract property details
  const propertyDetails = {
    // Property type and basics
    type:
      mlsData?.property?.propertySubType ||
      propertyData?.data?.propertyInfo?.propertyUse ||
      "N/A",
    yearBuilt:
      mlsData?.property?.yearBuilt ||
      propertyData?.data?.propertyInfo?.yearBuilt?.toString() ||
      "N/A",
    stories:
      mlsData?.property?.stories?.toString() ||
      propertyData?.data?.propertyInfo?.stories?.toString() ||
      "N/A",

    // Size data
    beds:
      mlsData?.property?.bedroomsTotal ||
      propertyData?.data?.propertyInfo?.bedrooms ||
      0,
    baths:
      mlsData?.property?.bathroomsTotal ||
      propertyData?.data?.propertyInfo?.bathrooms ||
      0,
    sqft:
      mlsData?.property?.livingArea ||
      propertyData?.data?.propertyInfo?.livingSquareFeet ||
      0,

    // Lot information
    lotSizeSqft:
      mlsData?.property?.lotSizeSquareFeet ||
      propertyData?.data?.propertyInfo?.lotSquareFeet ||
      0,
    lotSizeAcres: propertyData?.data?.lotInfo?.lotAcres || "N/A",

    // Features
    hasBasement:
      mlsData?.property?.hasBasement ||
      propertyData?.data?.propertyInfo?.basementType
        ? true
        : false,
    basementInfo: propertyData?.data?.propertyInfo?.basementType || "None",
    basementSqft: propertyData?.data?.propertyInfo?.basementSquareFeet || 0,
    basementFinishedSqft:
      propertyData?.data?.propertyInfo?.basementSquareFeetFinished || 0,
    basementUnfinishedSqft:
      propertyData?.data?.propertyInfo?.basementSquareFeetUnfinished || 0,
    basementFinishedPercent:
      propertyData?.data?.propertyInfo?.basementFinishedPercent || 0,
    hasGarage: propertyData?.data?.propertyInfo?.garageType ? true : false,
    garageSpaces: propertyData?.data?.propertyInfo?.parkingSpaces || 0,
    garageSqft: propertyData?.data?.propertyInfo?.garageSquareFeet || 0,
    garageType: propertyData?.data?.propertyInfo?.garageType || "None",

    // Utilities
    heating:
      mlsData?.homedetails?.heating ||
      propertyData?.data?.propertyInfo?.heatingType ||
      "N/A",
    heatingFuel: propertyData?.data?.propertyInfo?.heatingFuelType || "N/A",
    cooling: mlsData?.homedetails?.cooling || "N/A",
    sewer: mlsData?.homedetails?.sewer || "N/A",
    water: mlsData?.homedetails?.watersource || "N/A",

    // Additional features
    appliances: mlsData?.homedetails?.appliances
      ? [mlsData.homedetails.appliances]
      : ["Not specified"],
    flooring: mlsData?.homedetails?.flooring || "Not specified",
    fireplaces: propertyData?.data?.propertyInfo?.fireplaces || 0,
    hasPool:
      mlsData?.property?.hasPool ||
      propertyData?.data?.propertyInfo?.pool ||
      false,
    poolArea: propertyData?.data?.propertyInfo?.poolArea || 0,
    hasPatio: propertyData?.data?.propertyInfo?.patio || false,
    patioArea: propertyData?.data?.propertyInfo?.patioArea || 0,
    hasDeck: propertyData?.data?.propertyInfo?.deck || false,
    deckArea: propertyData?.data?.propertyInfo?.deckArea || 0,
    hasPorch: propertyData?.data?.propertyInfo?.porchType ? true : false,
    porchType: propertyData?.data?.propertyInfo?.porchType || "None",
    porchArea: propertyData?.data?.propertyInfo?.porchArea || 0,
    hasBreezeway: propertyData?.data?.propertyInfo?.breezeway || false,
    hasAttic: propertyData?.data?.propertyInfo?.attic || false,
    hasCarport: propertyData?.data?.propertyInfo?.carport || false,
    hasBalcony: propertyData?.data?.propertyInfo?.featureBalcony || false,
    hasFireSprinklers:
      propertyData?.data?.propertyInfo?.safetyFireSprinklers || false,
    hasRvParking: propertyData?.data?.propertyInfo?.rvParking || false,

    // Exterior
    exteriorFeatures: mlsData?.homedetails?.exteriorFeatures || "Not specified",
    roof: mlsData?.homedetails?.roof || "Not specified",
    roofConstruction:
      propertyData?.data?.propertyInfo?.roofConstruction || "Not specified",
    construction:
      propertyData?.data?.propertyInfo?.construction || "Not specified",
    interiorStructure:
      propertyData?.data?.propertyInfo?.interiorStructure || "Not specified",

    // Zoning
    zoning:
      mlsData?.homedetails?.zoning ||
      propertyData?.data?.lotInfo?.zoning ||
      "Not specified",
    floodZone: propertyData?.data?.floodZone ? "Yes" : "No",
    floodZoneType: propertyData?.data?.floodZoneType || "N/A",
    floodZoneDescription: propertyData?.data?.floodZoneDescription || "N/A",
  };

  // Property description - prefer MLS data
  const description =
    mlsData?.publicRemarks || "No description available for this property.";

  return (
    <div className="space-y-6">
      {/* Property Description */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Property Details
        </h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

          {/* Key Features Overview */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  <span>Key Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-2 gap-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Year Built:</span>
                  </div>
                  <span className="text-sm font-medium">
                    {propertyDetails.yearBuilt}
                  </span>

                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Property Type:</span>
                  </div>
                  <span className="text-sm font-medium">
                    {propertyDetails.type}
                  </span>

                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Stories:</span>
                  </div>
                  <span className="text-sm font-medium">
                    {propertyDetails.stories}
                  </span>

                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Lot Size:</span>
                  </div>
                  <span className="text-sm font-medium">
                    {propertyDetails.lotSizeSqft.toLocaleString()} sq ft
                    {propertyDetails.lotSizeAcres !== "N/A" &&
                      ` (${propertyDetails.lotSizeAcres} acres)`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-3">
                  <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Building Count:</span>
                  </div>
                  <span className="text-sm font-medium">
                {propertyData?.data?.propertyInfo?.buildingsCount || "1"}
                  </span>

                  <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Units:</span>
                  </div>
                  <span className="text-sm font-medium">
                {propertyData?.data?.propertyInfo?.unitsCount || "1"}
                  </span>

                      <div className="flex items-center gap-2">
                <Landmark className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">HOA:</span>
                      </div>
                      <span className="text-sm font-medium">
                {propertyData?.data?.propertyInfo?.hoa ? "Yes" : "No"}
                      </span>

                      <div className="flex items-center gap-2">
                        <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Tax Exempt:</span>
                      </div>
                      <span className="text-sm font-medium">
                {propertyData?.data?.propertyInfo?.taxExemptionHomeownerFlag
                  ? "Yes"
                  : "No"}
                      </span>
            </div>
                </div>
              </CardContent>
            </Card>

          {/* Main Features */}
      <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <ListFilter className="h-5 w-5 text-primary" />
                <span>Property Highlights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-1.5">
                    <Bed className="h-4 w-4 text-primary" />
                    <span>Living Space</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-muted-foreground">Bedrooms:</span>
                    <span>{propertyDetails.beds}</span>

                    <span className="text-muted-foreground">Bathrooms:</span>
                    <span>{propertyDetails.baths}</span>

                    <span className="text-muted-foreground">Square Feet:</span>
                    <span>{propertyDetails.sqft.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-1.5">
                    <Warehouse className="h-4 w-4 text-primary" />
                    <span>Additional Spaces</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-muted-foreground">Basement:</span>
                    <span>{propertyDetails.hasBasement ? "Yes" : "No"}</span>

                    <span className="text-muted-foreground">Garage:</span>
                    <span>
                      {propertyDetails.hasGarage
                        ? `${propertyDetails.garageSpaces} car`
                        : "No"}
                    </span>

                    <span className="text-muted-foreground">Patio/Deck:</span>
                    <span>{propertyDetails.hasPatio ? "Yes" : "No"}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-1.5">
                    <Home className="h-4 w-4 text-primary" />
                    <span>Amenities</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-muted-foreground">Heating:</span>
                    <span>{propertyDetails.heating}</span>

                    <span className="text-muted-foreground">Cooling:</span>
                    <span>{propertyDetails.cooling}</span>

                    <span className="text-muted-foreground">Pool:</span>
                    <span>{propertyDetails.hasPool ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

      {/* Interior Features */}
              <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            <span>Interior Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basement Information */}
            {propertyDetails.hasBasement && (
              <div>
                <h3 className="font-semibold mb-2">Basement</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Type: {propertyDetails.basementInfo}</p>
                  <p>Total Area: {propertyDetails.basementSqft} sq ft</p>
                  <p>
                    Finished Area: {propertyDetails.basementFinishedSqft} sq ft
                  </p>
                  <p>
                    Unfinished Area: {propertyDetails.basementUnfinishedSqft} sq
                    ft
                  </p>
                  <p>
                    Finished Percentage:{" "}
                    {propertyDetails.basementFinishedPercent}%
                  </p>
                </div>
              </div>
            )}

            {/* Appliances */}
                {propertyDetails.appliances &&
                  propertyDetails.appliances.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Appliances</h3>
                      <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                        {Array.isArray(propertyDetails.appliances) ? (
                          propertyDetails.appliances.map((appliance, index) => (
                            <li key={index}>{appliance}</li>
                          ))
                        ) : (
                          <li>{propertyDetails.appliances}</li>
                        )}
                      </ul>
                    </div>
                  )}

            {/* Flooring */}
                {propertyDetails.flooring !== "Not specified" && (
                  <div>
                    <h3 className="font-semibold mb-2">Flooring</h3>
                    <p className="text-muted-foreground">
                      {propertyDetails.flooring}
                    </p>
                  </div>
                )}

            {/* Fireplaces */}
            {propertyDetails.fireplaces > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Fireplaces</h3>
                <p className="text-muted-foreground">
                  {propertyDetails.fireplaces} fireplace(s)
                </p>
              </div>
            )}

            {/* Additional Features */}
            <div>
              <h3 className="font-semibold mb-2">Additional Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {propertyDetails.hasAttic && <li>Attic</li>}
                {propertyDetails.hasFireSprinklers && <li>Fire Sprinklers</li>}
                {propertyDetails.hasBreezeway && <li>Breezeway</li>}
                {propertyDetails.hasBalcony && <li>Balcony</li>}
              </ul>
              </div>

            {/* Interior Structure */}
            {propertyData?.data?.propertyInfo?.interiorStructure && (
              <div>
                <h3 className="font-semibold mb-2">Interior Structure</h3>
                  <p className="text-muted-foreground">
                  {propertyData.data.propertyInfo.interiorStructure}
                  </p>
                </div>
              )}

            {/* Room Information */}
            <div>
              <h3 className="font-semibold mb-2">Room Information</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  Total Rooms:{" "}
                  {propertyData?.data?.propertyInfo?.roomsCount || "N/A"}
                </li>
                <li>
                  Partial Bathrooms:{" "}
                  {propertyData?.data?.propertyInfo?.partialBathrooms || "0"}
                </li>
                <li>
                  Plumbing Fixtures:{" "}
                  {propertyData?.data?.propertyInfo?.plumbingFixturesCount ||
                    "N/A"}
                </li>
              </ul>
            </div>
          </div>
            </CardContent>
          </Card>

      {/* Exterior Features */}
          <Card>
            <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            <span>Exterior & Systems</span>
          </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Exterior Features */}
                {propertyDetails.exteriorFeatures !== "Not specified" && (
                  <div>
                    <h3 className="font-semibold mb-2">Exterior Features</h3>
                    <p className="text-muted-foreground">
                      {propertyDetails.exteriorFeatures}
                    </p>
                  </div>
                )}

            {/* Roof Information */}
                  <div>
                    <h3 className="font-semibold mb-2">Roof</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Material: {propertyDetails.roof}</p>
                <p>Construction: {propertyDetails.roofConstruction}</p>
              </div>
            </div>

            {/* Construction */}
            {propertyDetails.construction !== "Not specified" && (
              <div>
                <h3 className="font-semibold mb-2">Construction</h3>
                    <p className="text-muted-foreground">
                  {propertyDetails.construction}
                    </p>
                  </div>
                )}

            {/* Outdoor Spaces */}
                  <div>
              <h3 className="font-semibold mb-2">Outdoor Spaces</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {propertyDetails.hasPool && (
                  <li>Pool ({propertyDetails.poolArea} sq ft)</li>
                )}
                {propertyDetails.hasPatio && (
                  <li>Patio ({propertyDetails.patioArea} sq ft)</li>
                )}
                {propertyDetails.hasDeck && (
                  <li>Deck ({propertyDetails.deckArea} sq ft)</li>
                )}
                {propertyDetails.hasPorch && (
                  <li>
                    {propertyDetails.porchType} ({propertyDetails.porchArea} sq
                    ft)
                  </li>
                )}
              </ul>
            </div>

            {/* Parking */}
                  <div>
              <h3 className="font-semibold mb-2">Parking</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {propertyDetails.hasGarage && (
                  <li>
                    {propertyDetails.garageType} ({propertyDetails.garageSpaces}{" "}
                    spaces, {propertyDetails.garageSqft} sq ft)
                  </li>
                )}
                {propertyDetails.hasCarport && <li>Carport</li>}
                {propertyDetails.hasRvParking && <li>RV Parking</li>}
                <li>
                  Total Parking Spaces:{" "}
                  {propertyData?.data?.propertyInfo?.parkingSpaces || "N/A"}
                </li>
              </ul>
            </div>

            {/* Lot Information */}
            <div>
              <h3 className="font-semibold mb-2">Lot Information</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>APN: {propertyData?.data?.lotInfo?.apn || "N/A"}</li>
                <li>
                  Legal Description:{" "}
                  {propertyData?.data?.lotInfo?.legalDescription || "N/A"}
                </li>
                <li>
                  Land Use: {propertyData?.data?.lotInfo?.landUse || "N/A"}
                </li>
                <li>
                  Subdivision:{" "}
                  {propertyData?.data?.lotInfo?.subdivision || "N/A"}
                </li>
                <li>
                  Lot Number: {propertyData?.data?.lotInfo?.lotNumber || "N/A"}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Utilities & Systems */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fan className="h-5 w-5 text-primary" />
            <span>Utilities & Systems</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Heating & Cooling */}
            <div>
              <h3 className="font-semibold mb-2">Heating & Cooling</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Heating Type: {propertyDetails.heating}</li>
                <li>Heating Fuel: {propertyDetails.heatingFuel}</li>
                <li>Cooling: {propertyDetails.cooling}</li>
                <li>
                  Air Conditioning Type:{" "}
                  {propertyData?.data?.propertyInfo?.airConditioningType ||
                    "N/A"}
                </li>
              </ul>
            </div>

            {/* Water & Sewer */}
            <div>
              <h3 className="font-semibold mb-2">Water & Sewer</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Water Source: {propertyDetails.water}</li>
                <li>Sewer: {propertyDetails.sewer}</li>
                <li>
                  Sewage Usage:{" "}
                  {propertyData?.data?.propertyInfo?.utilitiesSewageUsage ||
                    "N/A"}
                </li>
                <li>
                  Water Source Type:{" "}
                  {propertyData?.data?.propertyInfo?.utilitiesWaterSource ||
                    "N/A"}
                </li>
              </ul>
            </div>

            {/* Plumbing */}
            <div>
              <h3 className="font-semibold mb-2">Plumbing</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  Plumbing Fixtures:{" "}
                  {propertyData?.data?.propertyInfo?.plumbingFixturesCount ||
                    "N/A"}
                </li>
              </ul>
            </div>

            {/* Safety Systems */}
            <div>
              <h3 className="font-semibold mb-2">Safety Systems</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  Fire Sprinklers:{" "}
                  {propertyDetails.hasFireSprinklers ? "Yes" : "No"}
                </li>
              </ul>
            </div>

            {/* Location Information */}
            <div>
              <h3 className="font-semibold mb-2">Location Details</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  Congressional District:{" "}
                  {propertyData?.data?.propertyInfo?.address
                    ?.congressionalDistrict || "N/A"}
                </li>
                <li>
                  County:{" "}
                  {propertyData?.data?.propertyInfo?.address?.county || "N/A"}
                </li>
                <li>
                  FIPS Code:{" "}
                  {propertyData?.data?.propertyInfo?.address?.fips || "N/A"}
                </li>
                <li>
                  Jurisdiction:{" "}
                  {propertyData?.data?.propertyInfo?.address?.jurisdiction ||
                    "N/A"}
                </li>
              </ul>
            </div>

            {/* Census Information */}
            <div>
              <h3 className="font-semibold mb-2">Census Information</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  Census Block:{" "}
                  {propertyData?.data?.lotInfo?.censusBlock || "N/A"}
                </li>
                <li>
                  Census Block Group:{" "}
                  {propertyData?.data?.lotInfo?.censusBlockGroup || "N/A"}
                </li>
                <li>
                  Census Tract:{" "}
                  {propertyData?.data?.lotInfo?.censusTract || "N/A"}
                </li>
              </ul>
            </div>
              </div>
            </CardContent>
          </Card>
    </div>
  );
}
