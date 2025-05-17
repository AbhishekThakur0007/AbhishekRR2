"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MLSListing, PropertyDetailResponse } from "@/app/types/real-estate";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bed,
  Bath,
  Ruler,
  MapPin,
  ArrowRight,
  Clock,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ScrollProgress } from "@/components/scroll-progress";
import { SidebarLeft } from "@/components/sidebar-left";

interface AgentInfo {
  fullName: string;
  email: string;
  phone?: string;
}

interface AgentListing {
  listingId: string;
  id: string;
  modificationTimestamp: string;
  listing: {
    courtesyOf: string;
    customStatus: string;
    hasPhotos: boolean;
    isListed: boolean;
    listingAgentEmailAddress: string;
    listingContractDate: string;
    listPriceLow: number;
    mlsNumber: string;
    mlsBoardCode: string;
    publicRemarks: string;
    standardStatus: string;
    url: string;
    address: {
      city: string;
      countyOrParish: string;
      stateOrProvince: string;
      unparsedAddress: string;
      zipCode: string;
    };
    property: {
      bathroomsText: string;
      bathroomsTotal: number;
      bedroomsTotal: number;
      livingArea: number;
      propertyType: string;
      subdivisionName: string;
      yearBuilt: string;
    };
    media: {
      primaryListingImageUrl: string;
      photosCount: string;
    };
  };
  listingAgent: {
    email: string;
    firstName: string;
    fullName: string;
    lastName: string;
    phone: string;
  };
  listingOffice: {
    address: string;
    city: string;
    stateOrProvince: string;
    postalCode: string;
    name: string;
    phone: string;
  };
}

interface AgentListingsResponse {
  input: {
    listing_agent_email: string;
  };
  data: AgentListing[];
}

export default function AgentListingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [listings, setListings] = useState<AgentListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null);

  useEffect(() => {
    const fetchAgentListings = async () => {
      const email = searchParams.get("email");
      if (!email) {
        setError("No agent email provided");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/real-estate/agent-listings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ listing_agent_email: email }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch agent listings");
        }

        const data = (await response.json()) as AgentListingsResponse;
        setListings(data.data || []);
        if (data.data?.[0]?.listingAgent) {
          setAgentInfo({
            fullName: data.data[0].listingAgent.fullName,
            email: data.data[0].listingAgent.email,
            phone: data.data[0].listingAgent.phone,
          });
        }
      } catch (err) {
        console.error("Error fetching agent listings:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch listings"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgentListings();
  }, [searchParams]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="mb-4 text-red-500">{error}</p>
        <Button onClick={() => router.push("/")}>Return Home</Button>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <ScrollProgress />
      {/* Left Sidebar */}
      <SidebarLeft />

      <SidebarInset>
        <div className="container px-4 py-8 mx-auto">
          {agentInfo && (
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold">
                Listings by {agentInfo.fullName}
              </h1>
              <div className="flex gap-4 items-center text-muted-foreground">
                <p>{agentInfo.email}</p>
                {agentInfo.phone && <p>Phone: {agentInfo.phone}</p>}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <Card key={listing.listingId} className="overflow-hidden">
                <div className="relative aspect-video">
                  <Image
                    src={
                      listing.listing.media?.primaryListingImageUrl ||
                      "/placeholder.svg"
                    }
                    alt={`${
                      listing.listing.property.propertyType || "Property"
                    } listing`}
                    fill
                    className="object-cover"
                  />
                  <Badge
                    className={`absolute top-2 right-2 ${
                      listing.listing.standardStatus === "Active"
                        ? "bg-green-500"
                        : listing.listing.standardStatus === "Pending"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {listing.listing.standardStatus ||
                      listing.listing.customStatus}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h2 className="mb-2 font-semibold line-clamp-1">
                    {listing.listing.address.unparsedAddress}
                  </h2>
                  <p className="mb-2 text-lg font-bold text-primary">
                    {formatCurrency(listing.listing.listPriceLow)}
                  </p>
                  <div className="flex gap-4 items-center mb-2 text-sm text-muted-foreground">
                    <div className="flex gap-1 items-center">
                      <Bed className="w-4 h-4" />
                      <span>
                        {listing.listing.property.bedroomsTotal || "N/A"}
                      </span>
                    </div>
                    <div className="flex gap-1 items-center">
                      <Bath className="w-4 h-4" />
                      <span>
                        {listing.listing.property.bathroomsTotal || "N/A"}
                      </span>
                    </div>
                    <div className="flex gap-1 items-center">
                      <Ruler className="w-4 h-4" />
                      <span>
                        {listing.listing.property.livingArea?.toLocaleString() ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center mb-4 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {listing.listing.address.city},{" "}
                      {listing.listing.address.stateOrProvince}
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      const searchParams = new URLSearchParams();
                      searchParams.append(
                        "q",
                        `${listing.listing.address.unparsedAddress}, ${listing.listing.address.city}, ${listing.listing.address.stateOrProvince} ${listing.listing.address.zipCode}`
                      );
                      router.push(`/search?${searchParams.toString()}`);
                    }}
                  >
                    View Details
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {listings.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No listings found for this agent.
              </p>
              <Button onClick={() => router.push("/")} className="mt-4">
                Return Home
              </Button>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
