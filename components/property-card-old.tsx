import { BriefcaseBusiness } from "lucide-react";
import { MLSListing } from "@/app/types/real-estate";

interface PropertyCardProps {
  propertyName: string;
  address: string;
  location: string;
  price: string;
  propertyType: string;
  imageUrl: string;
  beds: number;
  baths: number;
  sqft: number;
  listingUrl?: string;
  mlsData?: MLSListing | null;
}

export function PropertyCard({
  propertyName,
  address,
  location,
  price,
  propertyType,
  imageUrl,
  beds,
  baths,
  sqft,
  listingUrl = "#",
  mlsData,
}: PropertyCardProps) {
  // console.log("mlsData card", mlsData);
  // Get real property type from MLS data
  const realPropertyType = mlsData?.property?.propertyType || propertyType;

  // Get real location (neighborhood) from MLS data
  const realLocation = mlsData?.property?.neighborhood || location;

  // Get real availability status from MLS data
  const status = mlsData?.standardStatus || "Available Now";

  // Get the first image from MLS data or fallback to provided imageUrl
  const displayImage = mlsData?.media?.primaryListingImageUrl;

  // Get real beds/baths/sqft from MLS data if available
  const realBeds = mlsData?.property?.bedroomsTotal || beds;
  const realBaths = mlsData?.property?.bathroomsTotal || baths;
  const realSqft = mlsData?.property?.livingArea || sqft;

  // Get real price from MLS data if available
  const realPrice = mlsData?.listPrice
    ? `$${mlsData.listPrice.toLocaleString()}`
    : price;

  // Get real listing URL from MLS data if available
  const realListingUrl = mlsData?.url || listingUrl;

  // Get real agent info from MLS data
  const agent = {
    name: mlsData?.listingAgent?.fullName || "Contact Agent",
    company: mlsData?.listingOffice?.name || "Premier Realty",
    phone: mlsData?.listingAgent?.phone || "Contact for details",
    email: mlsData?.listingAgent?.email || "Contact for details",
  };

  // Format days on market
  const daysOnMarket = mlsData?.daysOnMarket
    ? `${mlsData.daysOnMarket} days on market`
    : "";

  return (
    <div className="flex flex-col md:flex-row rounded-lg overflow-hidden mb-8 bg-card">
      {/* Property Image with View Button */}
      <div className="relative w-full md:w-[450px] h-[450px] md:h-auto">
        <img
          src={displayImage}
          alt={propertyName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Property Details */}
      <div className="flex flex-col justify-between p-6 md:p-8 w-full">
        <div>
          <div className="uppercase text-muted-foreground text-sm font-medium mb-1">
            {realPropertyType}
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {propertyName}
          </h1>
          <p className="text-2xl text-foreground/90 mb-6">
            {address}
            {address ? "," : ""} {realLocation}
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-foreground/70"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="text-foreground/70">{realPropertyType}</span>
            </div>

            {realLocation && (
              <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-foreground/70"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-foreground/70">{realLocation}</span>
              </div>
            )}

            <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-foreground/70"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-foreground/70">{status}</span>
            </div>

            {daysOnMarket && (
              <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-foreground/70"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-foreground/70">{daysOnMarket}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-3 bg-muted rounded-md">
              <p className="text-lg font-bold text-foreground">{realBeds}</p>
              <p className="text-sm text-muted-foreground">Beds</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-md">
              <p className="text-lg font-bold text-foreground">{realBaths}</p>
              <p className="text-sm text-muted-foreground">Baths</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-md">
              <p className="text-lg font-bold text-foreground">
                {realSqft.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Sq Ft</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={realListingUrl}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium py-3 px-6 rounded-md hover:bg-primary/90 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
            Schedule Tour
          </a>

          <button className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground border border-border font-medium py-3 px-6 rounded-md hover:bg-secondary/80 transition-colors">
            <BriefcaseBusiness />
            Contact Agent
          </button>
          <button className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground border border-border font-medium py-3 px-6 rounded-md hover:bg-secondary/80 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Share
          </button>
        </div>

        <div className="text-xs text-muted-foreground mt-6">
          <span className="font-bold text-2xl text-foreground">
            {realPrice}
          </span>{" "}
          · Listed by <span className="text-primary">{agent.company}</span>
        </div>
      </div>
    </div>
  );
}
