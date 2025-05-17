import React from "react";
import { MLSListing } from "@/app/types/real-estate";

interface MLSInformationProps {
  mlsData: MLSListing | null;
}

export function MLSInformation({ mlsData }: MLSInformationProps) {
  if (!mlsData) return null;

  // Format price as currency
  const formatCurrency = (value: number | null | undefined): string => {
    if (!value) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get listing agent info
  const agentName = mlsData.listingAgent?.fullName || "Unknown Agent";

  const agentCompany = mlsData.listingOffice?.name || "Unknown Company";

  const agentPhone = mlsData.listingAgent?.phone || "No phone provided";

  const agentEmail = mlsData.listingAgent?.email || "No email provided";

  // Get listing status
  const listingStatus =
    mlsData.standardStatus || mlsData.customStatus || "Unknown";

  // Get listing dates
  const listDate = mlsData.listingContractDate || null;

  const lastUpdate = mlsData.modificationTimestamp || null;

  // Get MLS ID
  const mlsId = mlsData.mlsNumber || mlsData.listingId || "Unknown";

  // Get open houses
  const openHouses = mlsData.openHouseEvents || [];

  // Get virtual tour URL
  const virtualTourUrl = mlsData.virtualTourURLUnbranded || null;

  // Get listing remarks
  const remarks = mlsData.publicRemarks || "No listing remarks available.";

  return (
    <div className="bg-card rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        MLS Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Basic MLS Info */}
          <div className="bg-background rounded-lg border border-border p-4">
            <h3 className="text-lg font-semibold mb-3">Listing Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">MLS ID</p>
                <p className="font-medium">{mlsId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      listingStatus?.toLowerCase() === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : listingStatus?.toLowerCase() === "pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : listingStatus?.toLowerCase() === "sold"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {listingStatus}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Listed Date</p>
                <p className="font-medium">
                  {listDate ? new Date(listDate).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {lastUpdate
                    ? new Date(lastUpdate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              {mlsData.daysOnMarket && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Days on Market
                  </p>
                  <p className="font-medium">{mlsData.daysOnMarket}</p>
                </div>
              )}
              {mlsData.listPrice && (
                <div>
                  <p className="text-sm text-muted-foreground">List Price</p>
                  <p className="font-medium">
                    {formatCurrency(mlsData.listPrice)}
                  </p>
                </div>
              )}
              {mlsData.pricePerSqFt && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Price per Sq Ft
                  </p>
                  <p className="font-medium">
                    ${mlsData.pricePerSqFt.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Listing Agent */}
          {mlsData.listingAgent && (
            <div className="bg-background rounded-lg border border-border p-4">
              <h3 className="text-lg font-semibold mb-3">Listing Agent</h3>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {mlsData.listingAgent.fullName
                    ? mlsData.listingAgent.fullName.charAt(0)
                    : "?"}
                </div>
                <div>
                  <p className="font-medium">{agentName}</p>
                  <p className="text-sm text-muted-foreground">
                    {agentCompany}
                  </p>
                  <p className="text-sm text-muted-foreground">{agentPhone}</p>
                  <p className="text-sm text-primary">{agentEmail}</p>
                </div>
              </div>
            </div>
          )}

          {/* Property Details from MLS */}
          {mlsData.property && (
            <div className="bg-background rounded-lg border border-border p-4">
              <h3 className="text-lg font-semibold mb-3">Property Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {mlsData.property.propertyType && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Property Type
                    </p>
                    <p className="font-medium">
                      {mlsData.property.propertyType}
                    </p>
                  </div>
                )}
                {mlsData.property.propertySubType && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Property Subtype
                    </p>
                    <p className="font-medium">
                      {mlsData.property.propertySubType}
                    </p>
                  </div>
                )}
                {mlsData.property.bedroomsTotal && (
                  <div>
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="font-medium">
                      {mlsData.property.bedroomsTotal}
                    </p>
                  </div>
                )}
                {mlsData.property.bathroomsTotal && (
                  <div>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="font-medium">
                      {mlsData.property.bathroomsTotal}
                    </p>
                  </div>
                )}
                {mlsData.property.livingArea && (
                  <div>
                    <p className="text-sm text-muted-foreground">Living Area</p>
                    <p className="font-medium">
                      {mlsData.property.livingArea.toLocaleString()} sq ft
                    </p>
                  </div>
                )}
                {mlsData.property.lotSizeSquareFeet && (
                  <div>
                    <p className="text-sm text-muted-foreground">Lot Size</p>
                    <p className="font-medium">
                      {mlsData.property.lotSizeSquareFeet.toLocaleString()} sq
                      ft
                    </p>
                  </div>
                )}
                {mlsData.property.yearBuilt &&
                  mlsData.property.yearBuilt !== "0" && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Year Built
                      </p>
                      <p className="font-medium">
                        {mlsData.property.yearBuilt}
                      </p>
                    </div>
                  )}
                {mlsData.property.stories && (
                  <div>
                    <p className="text-sm text-muted-foreground">Stories</p>
                    <p className="font-medium">{mlsData.property.stories}</p>
                  </div>
                )}
                {mlsData.property.garageSpaces && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Garage Spaces
                    </p>
                    <p className="font-medium">
                      {mlsData.property.garageSpaces}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Open Houses */}
          {openHouses && openHouses.length > 0 && (
            <div className="bg-background rounded-lg border border-border p-4">
              <h3 className="text-lg font-semibold mb-3">Open Houses</h3>
              <div className="space-y-3">
                {openHouses.map((openHouse: any, index: number) => (
                  <div key={index} className="bg-muted p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">
                        {openHouse.startDateTime
                          ? new Date(
                              openHouse.startDateTime
                            ).toLocaleDateString()
                          : "Date TBD"}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-muted-foreground"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-muted-foreground">
                        {openHouse.startDateTime
                          ? new Date(
                              openHouse.startDateTime
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "00:00"}{" "}
                        -{" "}
                        {openHouse.endDateTime
                          ? new Date(openHouse.endDateTime).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )
                          : "00:00"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Virtual Tour */}
          {virtualTourUrl && (
            <div className="bg-background rounded-lg border border-border p-4">
              <h3 className="text-lg font-semibold mb-3">Virtual Tour</h3>
              <a
                href={virtualTourUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                    clipRule="evenodd"
                  />
                </svg>
                View Virtual Tour
              </a>
            </div>
          )}

          {/* Listing Remarks */}
          <div className="bg-background rounded-lg border border-border p-4">
            <h3 className="text-lg font-semibold mb-3">Listing Remarks</h3>
            <p className="text-muted-foreground">{remarks}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
