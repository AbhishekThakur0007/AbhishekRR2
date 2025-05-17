import React from "react";
import { MLSListing, PropertyDetailResponse } from "@/app/types/real-estate";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Phone,
  Mail,
  Building,
  User,
  Calendar,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";

interface AgentInformationProps {
  propertyData?: PropertyDetailResponse | null;
  mlsData?: MLSListing | null;
}

export function AgentInformation({
  propertyData,
  mlsData,
}: AgentInformationProps) {
  // Skip if no MLS data or no agent info
  if (!mlsData?.listingAgent) {
    return null;
  }

  const agentName = mlsData.listingAgent.fullName || "Listing Agent";
  const agentEmail = mlsData.listingAgent.email || "";
  const agentPhone = mlsData.listingAgent.phone || "";
  const agentId = mlsData.listingAgent.mlsAgentId?.toString() || "";
  const daysOnMarket = mlsData.daysOnMarket;

  // Office information
  const officeName = mlsData.listingOffice?.name || "";
  const officeId = mlsData.listingOffice?.mlsOfficeId?.toString() || "";
  const officePhone = mlsData.listingOffice?.phone || "";
  const officeAddress = [
    mlsData.listingOffice?.address,
    mlsData.listingOffice?.city,
    mlsData.listingOffice?.stateOrProvince,
    mlsData.listingOffice?.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  // Get agent's initials for avatar fallback
  const getInitials = (name: string): string => {
    if (!name) return "LA";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <h2 className="mb-4 text-2xl font-bold text-foreground">
        Contact Information
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Agent Information */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex gap-2 items-center">
              <User className="w-5 h-5 text-primary" />
              <span>Listing Agent</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex gap-4 items-center">
              <Avatar className="w-16 h-16 border">
                <AvatarFallback>{getInitials(agentName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-medium">{agentName}</p>
                {agentId && (
                  <p className="text-xs text-muted-foreground">
                    Agent ID: {agentId}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {agentPhone && (
                <div className="flex gap-2 items-center text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{agentPhone}</span>
                </div>
              )}
              {agentEmail && (
                <div className="flex gap-2 items-center text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="underline text-primary">{agentEmail}</span>
                </div>
              )}
              {daysOnMarket && (
                <div className="flex gap-2 items-center text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Listed {daysOnMarket} days ago</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pt-2 sm:flex-row">
            <Button className="w-full sm:w-auto" size="sm">
              <Phone className="mr-2 w-4 h-4" />
              Call Agent
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" size="sm">
              <MessageSquare className="mr-2 w-4 h-4" />
              Send Message
            </Button>
          </CardFooter>
        </Card>

        {/* Office Information */}
        {officeName && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex gap-2 items-center">
                <Building className="w-5 h-5 text-primary" />
                <span>Brokerage Office</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex gap-4">
                <div className="flex justify-center items-center w-16 h-16 rounded-md border bg-muted">
                  <Building className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-medium">{officeName}</p>
                  {officeId && (
                    <p className="text-xs text-muted-foreground">
                      Office ID: {officeId}
                    </p>
                  )}
                </div>
              </div>

              {officeAddress && (
                <div className="mt-4 space-y-2">
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">Office Address:</p>
                    <p>{officeAddress}</p>
                  </div>
                </div>
              )}

              {officePhone && (
                <div className="mt-4">
                  <div className="flex gap-2 items-center text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{officePhone}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-muted-foreground">
        The information provided by this listing agent and brokerage is deemed
        reliable but not guaranteed. Interested parties should independently
        verify all information before entering into any transaction.
      </p>
    </div>
  );
}
