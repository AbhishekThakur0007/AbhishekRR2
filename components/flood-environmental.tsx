import React from "react";
import { MLSListing, PropertyDetailResponse } from "@/app/types/real-estate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Waves,
  AlertTriangle,
  Shield,
  Info,
  MapPin,
  Cloud,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FloodAndEnvironmentalProps {
  propertyData?: PropertyDetailResponse | null;
  mlsData?: MLSListing | null;
}

export function FloodAndEnvironmental({
  propertyData,
  mlsData,
}: FloodAndEnvironmentalProps) {
  // Skip if no property data
  if (!propertyData) {
    return null;
  }

  // Check if there's any meaningful environmental data to display
  const hasFloodData = propertyData.data?.floodZone;
  const hasFloodZoneDescription = propertyData.data?.floodZoneDescription;
  const hasFloodZoneType = propertyData.data?.floodZoneType;

  if (!hasFloodData && !hasFloodZoneDescription && !hasFloodZoneType) {
    return null;
  }

  // Determine the risk level based on the flood zone type
  const getRiskLevel = (): "low" | "moderate" | "high" => {
    if (!propertyData.data?.floodZoneType) return "low";

    const zoneType = propertyData.data.floodZoneType.toUpperCase();

    // High risk zones
    if (["A", "AE", "AH", "AO", "AR", "V", "VE"].includes(zoneType)) {
      return "high";
    }

    // Moderate risk zones
    if (
      ["B", "X SHADED", "0.2 PCT ANNUAL CHANCE FLOOD HAZARD"].includes(zoneType)
    ) {
      return "moderate";
    }

    // Low risk zones (X, C, or anything else)
    return "low";
  };

  const riskLevel = getRiskLevel();

  // Define colors and icons based on risk level
  const riskDisplay = {
    low: {
      icon: <Shield className="h-5 w-5" />,
      title: "Low Flood Risk",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "This area has minimal flood hazard.",
    },
    moderate: {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: "Moderate Flood Risk",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      description:
        "This area has a reduced risk of flooding but is still susceptible during severe weather events.",
    },
    high: {
      icon: <Waves className="h-5 w-5" />,
      title: "High Flood Risk",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      description: "This area has a significant risk of flooding.",
    },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Environmental Information
      </h2>

      {/* Flood Zone Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={`border ${riskDisplay[riskLevel].borderColor}`}>
          <CardHeader className={`pb-2 ${riskDisplay[riskLevel].bgColor}`}>
            <CardTitle className="flex items-center gap-2">
              <div
                className={`p-1.5 rounded-full ${riskDisplay[riskLevel].bgColor} ${riskDisplay[riskLevel].color}`}
              >
                {riskDisplay[riskLevel].icon}
              </div>
              <span className={riskDisplay[riskLevel].color}>
                {riskDisplay[riskLevel].title}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {riskDisplay[riskLevel].description}
              </p>

              {hasFloodZoneType && (
                <div>
                  <p className="text-sm font-medium mb-1">Flood Zone Type</p>
                  <p className="text-sm text-muted-foreground">
                    {propertyData.data?.floodZoneType}
                  </p>
                </div>
              )}

              {hasFloodZoneDescription && (
                <div>
                  <p className="text-sm font-medium mb-1">Description</p>
                  <p className="text-sm text-muted-foreground">
                    {propertyData.data?.floodZoneDescription}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-blue-50 text-blue-600">
                <Info className="h-5 w-5" />
              </div>
              <span>Understanding Flood Zones</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Zone X</p>
                <p className="text-sm text-muted-foreground">
                  Areas outside the 0.2% annual chance floodplain (minimal
                  risk).
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Zone B or X (shaded)</p>
                <p className="text-sm text-muted-foreground">
                  Areas of moderate flood hazard, usually between the limits of
                  the 1% and 0.2% annual chance floods.
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Zone A, AE, AH, AO</p>
                <p className="text-sm text-muted-foreground">
                  Areas with a 1% annual chance of flooding (high risk). AE
                  zones have determined base flood elevations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert className="mt-6 bg-background">
        <Info className="h-4 w-4" />
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground">
          Flood zone information is based on FEMA flood maps and other sources.
          This data is provided for informational purposes only and should not
          be relied upon for legal or insurance decisions. Contact your
          insurance provider for official flood risk assessment.
        </AlertDescription>
      </Alert>
    </div>
  );
}
