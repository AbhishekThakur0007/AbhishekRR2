/**
 * Autocomplete result interface for location search
 */
export interface AutocompleteResult {
  zip: string;
  city: string;
  searchType: string;
  title: string;
  neighborhoodName?: string;
  neighborhoodId?: string;
  state: string;
  neighborhoodType?: string;
  stateId?: string;
  county?: string;
  fips?: string;
  countyId?: string;
  street?: string;
}

/**
 * Response from the autocomplete API
 */
export interface AutocompleteResponse {
  input: {
    search: string;
  };
  data: AutocompleteResult[];
  totalResults: number;
  returnedResults: number;
  statusCode: number;
  statusMessage: string;
  live: boolean;
  requestExecutionTimeMS: string;
}

/**
 * Property location information
 */
export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  latitude: number;
  longitude: number;
  neighborhood?: string;
  schoolDistrict?: string;
}

/**
 * Property details interface
 */
export interface PropertyDetails {
  propertyId: string;
  mlsId?: string;
  location: PropertyLocation;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize: number;
  yearBuilt: number;
  propertyType: string;
  listingStatus: 'active' | 'pending' | 'sold' | 'off-market';
  listingPrice?: number;
  salePrice?: number;
  saleDate?: string;
  description?: string;
  features: string[];
  images: string[];
  schools?: SchoolInfo[];
  taxInfo?: TaxInfo;
  zoning?: string;
  floodZone?: string;
}

/**
 * School information interface
 */
export interface SchoolInfo {
  name: string;
  type: 'elementary' | 'middle' | 'high' | 'private';
  rating: number;
  distance: number;
  address: string;
  phone?: string;
  website?: string;
}

/**
 * Tax information interface
 */
export interface TaxInfo {
  taxYear: number;
  taxAmount: number;
  assessedValue: number;
  taxRate: number;
}

/**
 * Property detail response interface
 */
export interface PropertyDetailResponse {
  property: PropertyDetails;
  similarProperties?: PropertyDetails[];
  marketTrends?: {
    medianPrice: number;
    averageDaysOnMarket: number;
    pricePerSquareFoot: number;
    yearOverYearChange: number;
  };
  statusCode: number;
  statusMessage: string;
  requestExecutionTimeMS: string;
}

/**
 * MLS detail response interface
 */
export interface MLSDetailResponse {
  property: PropertyDetails;
  agent?: {
    name: string;
    company: string;
    phone: string;
    email: string;
    license: string;
  };
  listingHistory: {
    date: string;
    price: number;
    status: string;
  }[];
  statusCode: number;
  statusMessage: string;
  requestExecutionTimeMS: string;
}

/**
 * API error response
 */
export interface APIErrorResponse {
  statusCode: number;
  statusMessage: string;
  errorCode: string;
  errorMessage: string;
}

/**
 * Real Estate API client
 */
export class RealEstateAPI {
  private apiKey: string;
  private baseUrl = "https://api.realestateapi.com/v2";
  private userId = "reVA-web-user";

  /**
   * Create a new RealEstateAPI client
   * @param apiKey API key for authentication
   * @param userId Optional user ID for tracking API usage
   */
  constructor(apiKey: string, userId?: string) {
    this.apiKey = apiKey;
    if (userId) {
      this.userId = userId;
    }
  }

  /**
   * Get default headers for API requests
   */
  private getHeaders(): HeadersInit {
    return {
      "content-type": "application/json",
      "x-api-key": this.apiKey,
      "x-user-id": this.userId,
    };
  }

  /**
   * Handle API response and error cases
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json() as APIErrorResponse;
      throw new Error(
        `API call failed: ${errorData.statusMessage || response.statusText}. ${errorData.errorMessage || ''}`
      );
    }
    return response.json() as Promise<T>;
  }

  /**
   * Autocomplete address search
   * @param search Search query string
   * @returns Autocomplete results
   */
  async autocompleteAddress(search: string): Promise<AutocompleteResponse> {
    const response = await fetch(`${this.baseUrl}/AutoComplete`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ search }),
    });

    return this.handleResponse<AutocompleteResponse>(response);
  }

  /**
   * Get property details by property ID
   * @param propertyId Unique property identifier
   * @returns Property details
   */
  async getPropertyDetail(propertyId: string): Promise<PropertyDetailResponse> {
    const response = await fetch(`${this.baseUrl}/PropertyDetail`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ propertyId }),
    });

    return this.handleResponse<PropertyDetailResponse>(response);
  }

  /**
   * Get property details by address
   * @param address Property address
   * @param includeComps Whether to include comparable properties
   * @returns Property details
   */
  async getPropertyDetailByAddress(
    address: string, 
    includeComps: boolean = false
  ): Promise<PropertyDetailResponse> {
    const response = await fetch(`${this.baseUrl}/PropertyDetail`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        address,
        comps: includeComps,
      }),
    });

    return this.handleResponse<PropertyDetailResponse>(response);
  }

  /**
   * Get MLS listing details
   * @param mlsId MLS listing ID
   * @returns MLS listing details
   */
  async getMLSDetail(mlsId: string): Promise<MLSDetailResponse> {
    const response = await fetch(`${this.baseUrl}/MLSDetail`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ mlsId }),
    });

    return this.handleResponse<MLSDetailResponse>(response);
  }
}
