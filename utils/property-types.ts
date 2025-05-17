export interface MLSListing {
  listPrice?: number;
  pricePerSqFt?: number;
  daysOnMarket?: string;
  property?: {
    yearBuilt?: string;
    lotSizeSquareFeet?: number;
    postalCode?: string;
    hasPool?: boolean;
    hasBasement?: boolean;
    isWaterfront?: boolean;
    isMountainView?: boolean;
    associationFee?: string;
    bathroomsText?: string;
    bathroomsHalf?: number;
    bathroomsTotal?: number;
    bedroomsTotal?: number;
    garageSpaces?: number;
    isCityView?: boolean;
  };
  homedetails?: {
    appliances?: string;
    exteriorFeatures?: string;
    roof?: string;
    heating?: string;
    cooling?: string;
    sewer?: string;
    watersource?: string;
    flooring?: string;
    zoning?: string;
  };
  media?: {
    photosList?: Array<{
      highRes?: string;
      midRes?: string;
      lowRes?: string;
    }>;
    primaryListingImageUrl?: string;
  };
  price_changes?: Array<{
    date: string;
    price: number;
    change_amount?: number;
  }>;
  status_changes?: Array<{
    date: string;
    status: string;
  }>;
  schools?: Array<{
    type: string;
    rating?: number;
  }>;
  publicRemarks?: string;
  standardStatus?: string;
  customStatus?: string;
}

export interface PropertyDetailResponse {
  id: number;
  data: {
    propertyInfo: {
      id?: number;
      address: {
        address: string;
        label: string;
        zip?: string;
      };
      photos?: string[];
      bedrooms?: number;
      bathrooms?: number;
      livingSquareFeet?: number;
      yearBuilt?: number;
    };
    comps?: Array<{
      property_id: string;
      bedrooms: number;
      bathrooms: number;
      squareFeet: string;
      estimatedValue: string;
      photos?: string[];
      address?: {
        address: string;
      };
    }>;
    taxInfo?: {
      taxAmount: string;
      assessedValue: number;
      marketValue: number;
      year: number;
    };
    walkScore?: number;
    crimeRate?: number;
    populationDensity?: number;
    rentalData?: {
      estimatedRent: string;
    };
  };
}

export interface Property {
  id: number;
  address: string;
  price: string;
  image: string;
  images: string[];
  beds: number;
  baths: number;
  sqft: number;
  daysToSale: number | null;
  daysOnMarket: number;
  percentOfAsking: number | null;
  amenities: string[];
  investmentScore: number;
  zipTrend: string;
  zipTrendValue: number;
  yearBuilt: number;
  lotSize: string;
  status: string;
  taxRate: number;
  appreciationRate: number;
  schoolRating: number;
  marketScore: number;
  marketActivityScore: number;
  locationScore: number;
  propertyConditionScore: number;
  neighborhoodSafetyScore: number;
  // Market Analysis Properties
  priceChanges?: number;
  daysBetweenChanges?: number;
  pricePerSqFt?: number;
  priceReduction?: number;
  originalPrice?: number;
  pricePerSqFtVsComps?: number;
  marketPosition?: string;
  featureMatch?: number;
  uniqueFeatures?: string;
  missingFeatures?: string;
  valueAddedFeatures?: boolean;
  ageVsAreaAverage?: number;
  renovationHistory?: string;
  featureCompleteness?: number;
  photoQuality?: string;
  descriptionQuality?: string;
  priceToRentRatio?: number;
  estimatedROI?: number;
  estimatedMonthlyMaintenance?: number;
  estimatedAnnualInsurance?: number;
  hoaImpact?: string;
  taxAmount?: number;
  marketValue?: number;
  assessedValue?: number;
  lastAssessment?: string;
}

export interface ExtendedMLSListing extends MLSListing {
  _propertyId?: string;
  _address?: string;
}
