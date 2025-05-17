import React, { useEffect, useState } from "react";
import { MLSListing } from "@/app/types/real-estate";

interface PropertyHistoryProps {
  address?: string | null;
  mlsData?: MLSListing | null;
  propertyData?: any;
}

interface HistoryEvent {
  type: string;
  date: string;
  price?: number;
  description?: string;
  icon?: React.ReactNode;
}

const PropertyHistory: React.FC<PropertyHistoryProps> = ({
  address,
  mlsData,
  propertyData,
}) => {
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const events: HistoryEvent[] = [];

    // Add sale history from propertyData if available
    if (
      propertyData?.data?.saleHistory &&
      propertyData.data.saleHistory.length > 0
    ) {
      propertyData.data.saleHistory.forEach((sale: any) => {
        events.push({
          type: sale.documentType || "Sale",
          date: new Date(sale.saleDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          price: sale.saleAmount || 0,
          description: `Sold to ${sale.buyerNames || "Unknown Buyer"}${
            sale.purchaseMethod ? ` (${sale.purchaseMethod})` : ""
          }`,
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ),
        });
      });
    } else if (propertyData?.data?.lastSale) {
      // If no saleHistory array but there's a lastSale object
      const sale = propertyData.data.lastSale;
      events.push({
        type: sale.documentType || "Sale",
        date: new Date(sale.saleDate || sale.recordingDate).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        ),
        price: sale.saleAmount || 0,
        description: `Sold to ${sale.buyerNames || "Unknown Buyer"}${
          sale.purchaseMethod ? ` (${sale.purchaseMethod})` : ""
        }`,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        ),
      });
    }

    // Add mortgage history if available
    if (
      propertyData?.data?.mortgageHistory &&
      propertyData.data.mortgageHistory.length > 0
    ) {
      propertyData.data.mortgageHistory.forEach((mortgage: any) => {
        if (mortgage.documentDate) {
          events.push({
            type: `Mortgage ${mortgage.loanType || ""}`,
            date: new Date(mortgage.documentDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            price: mortgage.amount || 0,
            description: `${mortgage.loanType || "Mortgage"} from ${
              mortgage.lenderName || "Unknown Lender"
            }${
              mortgage.term
                ? ` (${mortgage.term} ${mortgage.termType || "term"})`
                : ""
            }`,
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            ),
          });
        }
      });
    }

    // Sort events by date (newest first)
    events.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    setHistoryEvents(events);
    setLoading(false);
  }, [address, mlsData, propertyData]);

  if (loading) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Property History
        </h2>
        <div className="mt-4 flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary"></div>
          <span className="ml-2 text-muted-foreground">Loading history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Property History
        </h2>
        <div className="mt-4 text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Property History
      </h2>

      {historyEvents.length > 0 ? (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>

          {/* Timeline events */}
          <div className="space-y-8">
            {historyEvents.map((event, index) => (
              <div key={index} className="relative pl-12">
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0
                      ? "bg-primary text-white"
                      : "bg-muted border border-border"
                  }`}
                >
                  {event.icon || (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>

                {/* Event content */}
                <div className="bg-background border border-border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{event.type}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.date}
                      </p>
                    </div>
                    {event.price && event.price > 0 && (
                      <div className="text-primary font-bold">
                        ${event.price.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {event.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">No history events available</p>
      )}

      {address && (
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Property history for: <span className="font-medium">{address}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyHistory;
