import { Search, Filter, DollarSign, Bed, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PropertyFiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  priceRange: [number, number];
  bedsRange: number;
  bathsRange: number;
  selectedPropertyTypes: string[];
  formatPrice: (price: number) => string;
  searchProperties: () => void;
  loading: boolean;
}

export function PropertyFilters({
  showFilters,
  setShowFilters,
  priceRange,
  bedsRange,
  bathsRange,
  selectedPropertyTypes,
  formatPrice,
  searchProperties,
  loading,
}: PropertyFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => searchProperties()}
        disabled={loading}
      >
        <Search className="h-4 w-4 mr-1" />
        Search
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter className="h-4 w-4 mr-1" />
        {showFilters ? "Hide Filters" : "Show Filters"}
      </Button>
      <Badge variant="outline" className="flex items-center">
        <DollarSign className="h-3 w-3 mr-1" />
        {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
      </Badge>
      {bedsRange > 0 && (
        <Badge variant="outline" className="flex items-center">
          <Bed className="h-3 w-3 mr-1" />
          {bedsRange}+ beds
        </Badge>
      )}
      {bathsRange > 0 && (
        <Badge variant="outline" className="flex items-center">
          <Bath className="h-3 w-3 mr-1" />
          {bathsRange}+ baths
        </Badge>
      )}
      {selectedPropertyTypes.length > 0 &&
        selectedPropertyTypes[0] !== "All Properties" && (
          <Badge variant="outline">{selectedPropertyTypes.join(", ")}</Badge>
        )}
    </div>
  );
}
