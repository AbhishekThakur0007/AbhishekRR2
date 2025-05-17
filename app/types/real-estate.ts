export interface FirecrawlResponse {
  success: boolean;
  data: {
    properties?: PropertyData[];
    locations?: LocationData[];
  };
  status: string;
  expiresAt: string;
}

export interface PropertyData {
  building_name: string;
  property_type: string;
  location_address: string;
  price: string;
  description: string;
  square_feet?: string;
  bedrooms?: string;
  bathrooms?: string;
  year_built?: string;
}

export interface PropertiesResponse {
  properties: PropertyData[];
}

export interface LocationData {
  location: string;
  price_per_sqft: number;
  percent_increase: number;
  rental_yield: number;
}

export interface LocationsResponse {
  locations: LocationData[];
}

export interface RealEstateAPIResponse {
  property_id: string;
  mls_id?: string;
  status?: string;
  list_date?: string;
  last_update_date?: string;
  address: {
    line: string;
    city: string;
    state: string;
    postal_code: string;
    neighborhood_name?: string;
    county?: string;
    latitude?: string;
    longitude?: string;
    house?: string;
    street?: string;
    streetType?: string;
    unit?: string | null;
    unitType?: string | null;
    zip?: string;
    zip4?: string;
    carrierRoute?: string;
    congressionalDistrict?: string;
    fips?: string;
    jurisdiction?: string;
    label?: string;
    preDirection?: string | null;
  };
  property: {
    type: string;
    sub_type?: string;
    status?: string;
    year_built?: number;
    size_sqft?: number;
    lot_size_sqft?: number;
    beds?: number;
    baths?: number;
    rooms?: number;
    stories?: number | null;
    pool?: boolean;
    spa?: boolean;
    cooling?: boolean;
    heating?: boolean;
    fireplace?: boolean;
    parking: {
      type: string;
      spaces: number;
    };
    opportunity_zone?: boolean;
    propertyUse?: string;
    propertyUseCode?: number;
    livingSquareFeet?: number;
    bedrooms?: number;
    bathrooms?: number;
    partialBathrooms?: number;
    roomsCount?: number;
    lotSquareFeet?: number;
    buildingSquareFeet?: number;
    garageSquareFeet?: number;
    poolArea?: number;
    patioArea?: string;
    deckArea?: number;
    porchArea?: number | null;
    porchType?: string | null;
    pricePerSquareFoot?: number;
    construction?: string | null;
    roofConstruction?: string | null;
    roofMaterial?: string;
    interiorStructure?: string | null;
    heatingType?: string;
    heatingFuelType?: string | null;
    airConditioningType?: string;
    utilitiesSewageUsage?: string | null;
    utilitiesWaterSource?: string | null;
    plumbingFixturesCount?: number;
    parkingSpaces?: number;
    garageType?: string | null;
    basementType?: string;
    basementSquareFeet?: number;
    basementSquareFeetFinished?: number;
    basementSquareFeetUnfinished?: number;
    basementFinishedPercent?: number;
    fireplaces?: number | null;
    patio?: boolean;
    deck?: boolean;
    featureBalcony?: boolean;
    breezeway?: boolean;
    attic?: boolean;
    carport?: boolean;
    rvParking?: boolean;
    safetyFireSprinklers?: boolean;
    hoa?: boolean;
    taxExemptionHomeownerFlag?: boolean;
    unitsCount?: number;
    buildingsCount?: number;
  };
  price: {
    list: number;
    estimate?: number;
    last_sold?: number;
    last_sold_date?: string;
  };
  photos: string[];
  description: string;
  data?: {
    propertyInfo?: {
      address?: {
        address: string;
        carrierRoute: string;
        city: string;
        congressionalDistrict: string;
        county: string;
        fips: string;
        house: string;
        jurisdiction: string;
        label: string;
        preDirection: string | null;
        state: string;
        street: string;
        streetType: string;
        unit: string | null;
        unitType: string | null;
        zip: string;
        zip4: string;
      };
      photos?: string[];
      airConditioningType?: string;
      attic?: boolean;
      basementFinishedPercent?: number;
      basementSquareFeet?: number;
      basementSquareFeetFinished?: number;
      basementSquareFeetUnfinished?: number;
      basementType?: string;
      bathrooms?: number;
      bedrooms?: number;
      breezeway?: boolean;
      buildingSquareFeet?: number;
      buildingsCount?: number;
      carport?: boolean;
      construction?: string | null;
      deck?: boolean;
      deckArea?: number;
      featureBalcony?: boolean;
      fireplace?: boolean;
      fireplaces?: number | null;
      garageSquareFeet?: number;
      garageType?: string | null;
      heatingFuelType?: string | null;
      heatingType?: string;
      hoa?: boolean;
      interiorStructure?: string | null;
      latitude?: number;
      livingSquareFeet?: number;
      longitude?: number;
      lotSquareFeet?: number;
      parcelAccountNumber?: string | null;
      parkingSpaces?: number;
      partialBathrooms?: number;
      patio?: boolean;
      patioArea?: string;
      plumbingFixturesCount?: number;
      pool?: boolean;
      poolArea?: number;
      porchArea?: number | null;
      porchType?: string | null;
      pricePerSquareFoot?: number;
      propertyUse?: string;
      propertyUseCode?: number;
      roofConstruction?: string | null;
      roofMaterial?: string;
      roomsCount?: number;
      rvParking?: boolean;
      safetyFireSprinklers?: boolean;
      stories?: number | null;
      taxExemptionHomeownerFlag?: boolean;
      unitsCount?: number;
      yearBuilt?: number;
    };
    lotInfo?: {
      apn?: string;
      apnUnformatted?: string;
      censusBlock?: string;
      censusBlockGroup?: string;
      censusTract?: string;
      landUse?: string;
      legalDescription?: string;
      legalSection?: string | null;
      lotAcres?: string;
      lotNumber?: string | null;
      lotSquareFeet?: number;
      propertyClass?: string;
      propertyUse?: string;
      subdivision?: string | null;
      zoning?: string;
    };
    floodZone?: boolean;
    floodZoneType?: string;
    floodZoneDescription?: string;
    mlsListingPrice?: number;
    lastSale?: {
      saleAmount: number;
      saleDate: string;
    };
    estimatedValue?: number;
    taxInfo?: {
      assessedValue: number;
      marketValue: number;
      year: number;
      taxAmount: string;
    };
    currentMortgages?: Array<{
      amount: number;
      documentDate: string;
      lenderName: string;
      interestRate: number;
      term: number;
      loanType: string;
    }>;
    equity?: number;
    equityPercent?: number;
    estimatedEquity?: number;
    estimatedMortgageBalance?: string;
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
  };
}

export type PropertyDetailResponse = {
  id: number;
  input: {
    comps: boolean;
    address: string;
  };
  data: {
    id: number;
    propertyInfo: {
      address: {
        address: string;
        carrierRoute: string;
        city: string;
        congressionalDistrict: string;
        county: string;
        fips: string;
        house: string;
        jurisdiction: string;
        label: string;
        preDirection: string | null;
        state: string;
        street: string;
        streetType: string;
        unit: string | null;
        unitType: string | null;
        zip: string;
        zip4: string;
      };
      photos?: string[];
      airConditioningType: string;
      attic: boolean;
      basementFinishedPercent: number;
      basementSquareFeet: number;
      basementSquareFeetFinished: number;
      basementSquareFeetUnfinished: number;
      basementType: string;
      bathrooms: number;
      bedrooms: number;
      breezeway: boolean;
      buildingSquareFeet: number;
      buildingsCount: number;
      carport: boolean;
      construction: string | null;
      deck: boolean;
      deckArea: number;
      featureBalcony: boolean;
      fireplace: boolean;
      fireplaces: number | null;
      garageSquareFeet: number;
      garageType: string | null;
      heatingFuelType: string | null;
      heatingType: string;
      hoa: boolean;
      interiorStructure: string | null;
      latitude: number;
      livingSquareFeet: number;
      longitude: number;
      lotSquareFeet: number;
      parcelAccountNumber: string | null;
      parkingSpaces: number;
      partialBathrooms: number;
      patio: boolean;
      patioArea: string;
      plumbingFixturesCount: number;
      pool: boolean;
      poolArea: number;
      porchArea: number | null;
      porchType: string | null;
      pricePerSquareFoot: number;
      propertyUse: string;
      propertyUseCode: number;
      roofConstruction: string | null;
      roofMaterial: string;
      roomsCount: number;
      rvParking: boolean;
      safetyFireSprinklers: boolean;
      stories: number | null;
      taxExemptionHomeownerFlag: boolean;
      unitsCount: number;
      utilitiesSewageUsage: string | null;
      utilitiesWaterSource: string | null;
      yearBuilt: number;
    };
    lotInfo: {
      apn: string;
      apnUnformatted: string;
      censusBlock: string;
      censusBlockGroup: string;
      censusTract: string;
      landUse: string;
      legalDescription: string;
      legalSection: string | null;
      lotAcres: string;
      lotNumber: string | null;
      lotSquareFeet: number;
      propertyClass: string;
      propertyUse: string;
      subdivision: string | null;
      zoning: string;
    };
    floodZone: boolean;
    floodZoneType: string;
    floodZoneDescription: string;
    mlsListingPrice?: number;
    lastSale?: {
      saleAmount: number;
      saleDate: string;
    };
    estimatedValue?: number;
    taxInfo?: {
      assessedValue: number;
      marketValue: number;
      year: number;
      taxAmount: string;
    };
    currentMortgages?: Array<{
      amount: number;
      documentDate: string;
      lenderName: string;
      interestRate: number;
      term: number;
      loanType: string;
    }>;
    equity?: number;
    equityPercent?: number;
    estimatedEquity?: number;
    estimatedMortgageBalance?: string;
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
    schools?: Array<{
      name: string;
      type: string;
      grade: string;
      rating: number;
      distance: number;
      address: string;
      city: string;
      state: string;
      zip: string;
      phone: string;
      website: string;
      district: string;
      districtRating: number;
      studentCount: number;
      teacherCount: number;
      studentTeacherRatio: number;
      freeLunchPercent: number;
      reducedLunchPercent: number;
      testScores: {
        math: number;
        reading: number;
        science: number;
      };
    }>;
    ownerInfo?: {
      equity: number;
      equityPercent: number;
    };
  };
  statusCode: number;
  statusMessage: string;
  live: boolean;
  requestExecutionTimeMS: string;
  propertyLookupExecutionTimeMS: string;
  compsLookupExecutionTimeMS: string | null;
  price?: {
    list: number;
    estimate: number;
    last_sold: number;
    last_sold_date: string;
  };
  taxes?: {
    annual_amount: number;
    year: number;
  };
};

export interface PropertySearchResponse {
  properties: RealEstateAPIResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface PropertyCompsResponse {
  subject_property: RealEstateAPIResponse;
  comps: RealEstateAPIResponse[];
  comp_analysis: {
    median_price: number;
    median_price_per_sqft: number;
    median_beds: number;
    median_baths: number;
    median_size_sqft: number;
  };
}

export type MLSListing = {
  listingId: number;
  reapiId: string;
  courtesyOf: string;
  customStatus: string;
  daysOnMarket: string;
  standardStatus: string;
  hasPhotos: boolean;
  isListed: boolean;
  listingAgentEmailAddress: string;
  listingContractDate: string;
  listPrice: number;
  mlsNumber: string;
  mlsBoardCode: string;
  modificationTimestamp: string;
  priceChangeTimestamp: string | null;
  pricePerSqFt: number;
  publicRemarks: string;
  url: string;
  virtualTourURLUnbranded?: string;
  openHouseEvents?: Array<{
    startDateTime: string;
    endDateTime: string;
    description?: string;
    isVirtual?: boolean;
    virtualTourUrl?: string;
  }>;
  media: {
    primaryListingImageUrl: string;
    photosCount: string;
    photosList: {
      lowRes: string;
      midRes: string;
      highRes: string;
    }[];
  };
  property: {
    associationFee: string;
    bathroomsText: string;
    bathroomsHalf: number;
    bathroomsTotal: number;
    bedroomsTotal: number;
    garageSpaces: number;
    hasBasement: boolean;
    hasPool: boolean;
    isCityView: boolean;
    isMountainView: boolean;
    isParkView: boolean;
    isWaterfront: boolean;
    isWaterview: boolean;
    latitude: number;
    livingArea: number;
    location: [number, number];
    longitude: number;
    lotSizeSquareFeet: number;
    neighborhood: string;
    propertySubType: string;
    propertyType: string;
    stories: number;
    subdivisionName: string;
    yearBuilt: string;
  };
  listingAgent: {
    email: string;
    firstName: string;
    fullName: string;
    lastName: string;
    mlsAgentId: number;
    mlsCode: string;
    phone: string;
  };
  listingOffice: {
    address: string;
    city: string;
    email: string;
    mlsCode: string;
    mlsOfficeId: number;
    name: string;
    phone: string;
    postalCode: string;
    stateOrProvince: string;
    websiteUrl: string;
  };
  price_changes: {
    date: string;
    price: number;
    change_amount: number;
    direction: string;
  }[];
  status_changes: {
    date: string;
    status: string;
  }[];
  homedetails: {
    heating: string;
    cooling: string;
    sewer: string;
    watersource: string;
    appliances: string;
    flooring: string;
    exteriorFeatures: string;
    roof: string;
    zoning: string;
  };
  schools?: Array<{
    name: string;
    type: string;
    grade: string;
    rating: number;
    distance: number;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    website: string;
    district: string;
    districtRating: number;
    studentCount: number;
    teacherCount: number;
    studentTeacherRatio: number;
    freeLunchPercent: number;
    reducedLunchPercent: number;
    testScores: {
      math: number;
      reading: number;
      science: number;
    };
  }>;
};

export interface MLSSearchResponse {
  listings: MLSListing[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface AutocompleteResponse {
  status: string;
  data: {
    address: string;
    city: string;
    state: string;
    zip_code: string;
    property_id?: string;
    latitude?: number;
    longitude?: number;
    county?: string;
    fips?: string;
  }[];
}
export interface CMARequest {
  address: string;
  radius_miles: number;
  property_type: string;
  min_price?: number;
  max_price?: number;
  min_beds?: number;
  max_beds?: number;
  min_baths?: number;
  max_baths?: number;
  min_sqft?: number;
  max_sqft?: number;
}

export interface CMAResponse {
  subject_property: RealEstateAPIResponse;
  comparable_properties: RealEstateAPIResponse[];
  market_trends: {
    median_price: number;
    median_price_per_sqft: number;
    median_days_on_market: number;
    price_change_percent: number;
  };
  valuation: {
    estimated_value: number;
    value_range_low: number;
    value_range_high: number;
    confidence_score: number;
  };
}

export interface PropertySearchRequest {
  city?: string;
  state?: string;
  zip?: string;
  address?: string;
  radius_miles?: number;
  min_price?: number;
  max_price?: number;
  min_beds?: number;
  max_beds?: number;
  min_baths?: number;
  max_baths?: number;
  min_sqft?: number;
  max_sqft?: number;
  property_type?: string;
  status?: string;
  sort_by?: string;
  limit?: number;
}

export interface MLSDetailRequest {
  mls_id?: string;
  address?: string;
  include_photos?: boolean;
  include_history?: boolean;
}

export interface PropertyDetailRequest {
  id?: string;
  address?: string;
  house?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  comps?: boolean;
  exact_match?: boolean;
}
