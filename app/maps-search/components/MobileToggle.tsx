import { Home, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileToggleProps {
  showListings: boolean;
  setShowListings: (show: boolean) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  propertiesCount: number;
}

export function MobileToggle({
  showListings,
  setShowListings,
  showFilters,
  setShowFilters,
  propertiesCount,
}: MobileToggleProps) {
  return (
    <div className="fixed top-20 left-0 right-0 z-30 flex justify-center gap-2 p-2 md:hidden bg-background/80 backdrop-blur-sm border-b border-border">
      <Button
        variant={showListings ? "default" : "outline"}
        size="sm"
        onClick={() => {
          setShowListings(!showListings);
          if (showFilters) setShowFilters(false);
        }}
        className="flex-1 max-w-[160px]"
      >
        <Home className="h-4 w-4 mr-2" />
        {propertiesCount} Properties
      </Button>
      <Button
        variant={showFilters ? "default" : "outline"}
        size="sm"
        onClick={() => {
          setShowFilters(!showFilters);
          if (showListings) setShowListings(false);
        }}
        className="flex-1 max-w-[160px]"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </Button>
    </div>
  );
}
