import {
  RealEstateAPIResponse,
  PropertyDetailResponse,
  PropertySearchResponse,
  PropertyCompsResponse,
  MLSSearchResponse,
  AutocompleteResponse,
  MLSListing,
} from '../types/real-estate';

export class RealEstateAPI {
  private apiKey: string;
  private baseUrl: string = 'https://api.realestateapi.com/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`RealEstateAPI error: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error('Error calling RealEstateAPI:', error);

      throw error;
    }
  }

  // Property Detail API
  async getPropertyDetail(propertyId: string): Promise<PropertyDetailResponse> {
    console.log(`Calling property detail API with ID: "${propertyId}"`);

    try {
      const response = await fetch(`${this.baseUrl}/PropertyDetail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'x-user-id': 'UniqueUserIdentifier',
        },
        body: JSON.stringify({
          comps: false,
          id: propertyId,
          // address: "22201 100th Ave, New Virginia, IA, 50210",
        }),
      });

      // Log response status for debugging
      console.log(`API response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}): ${errorText}`);
        throw new Error(`RealEstateAPI error: ${response.statusText}`);
      }

      const data = (await response.json()) as PropertyDetailResponse;
      console.log('API response data received successfully');
      return data;
    } catch (error) {
      console.error('Error in getPropertyDetail:', error);
      throw error;
    }
  }

  // Property Detail by Address API
  async getPropertyDetailByAddress(address: string): Promise<any> {
    console.log(`Calling property detail API with address: "${address}"`);

    try {
      const response = await fetch(`${this.baseUrl}/PropertyDetail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'x-user-id': 'UniqueUserIdentifier',
        },
        body: JSON.stringify({
          address,
          comps: true, // Request comparable properties
        }),
      });

      // Log response status for debugging
      console.log(`API response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}): ${errorText}`);
        throw new Error(`RealEstateAPI error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API response data received successfully');
      return data;
    } catch (error) {
      console.error('Error in getPropertyDetailByAddress:', error);
      throw error;
    }
  }

  // MLS Detail API
  async getMLSDetail(propertyId: string): Promise<MLSListing> {
    // console.log(`Calling MLS detail API with address: "${address}"`);

    // Log the exact request we're sending
    const requestBody = {
      address: propertyId,
    };

    console.log('MLS Request body:', JSON.stringify(requestBody));

    try {
      console.log(`Making MLS API request to: ${this.baseUrl}/MLSDetail`);
      const response = await fetch(`${this.baseUrl}/MLSDetail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'x-user-id': 'UniqueUserIdentifier',
        },
        body: JSON.stringify(requestBody),
      });

      // Log response status for debugging
      console.log(`MLS API response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`MLS API Error (${response.status}): ${errorText}`);
        throw new Error(`RealEstateAPI error: ${response.statusText}`);
      }

      const rawData = (await response.json()) as { data: MLSListing };
      console.log('MLS API response data received successfully');

      // Check if data exists in the response
      if (!rawData.data) {
        console.error('MLS API response missing data property:', rawData);
        throw new Error('MLS API response missing data property');
      }

      // Extract the data property from the response
      const data = rawData.data;


      console.log("=======================data",data)

      // Add mock price_changes and status_changes for testing if they don't exist
      if (!data.price_changes) {
        data.price_changes = [
          {
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            price: data.listPrice ? data.listPrice * 1.05 : 1000000,
            change_amount: data.listPrice ? data.listPrice * 0.05 : 50000,
            direction: 'down',
          },
        ];
      }

      if (!data.status_changes) {
        data.status_changes = [
          {
            date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Listed',
          },
        ];
      }

      return data;
    } catch (error) {
      console.error('Error in getMLSDetail:', error);
      throw error;
    }
  }

  // MLS Detail By ID
  async getMLSDetailByID(mls_id: string): Promise<MLSListing> {
    const requestBody = {
      id: mls_id,
    };

    console.log('MLS Request body:', JSON.stringify(requestBody));

    try {
      console.log(`Making MLS API request to: ${this.baseUrl}/MLSDetail`);
      const response = await fetch(`${this.baseUrl}/MLSDetail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'x-user-id': 'UniqueUserIdentifier',
        },
        body: JSON.stringify(requestBody),
      });

      // Log response status for debugging
      console.log(`MLS API response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`MLS API Error (${response.status}): ${errorText}`);
        throw new Error(`RealEstateAPI error: ${response.statusText}`);
      }

      const rawData = (await response.json()) as { data: MLSListing };
      console.log('MLS API response data received successfully');

      // Check if data exists in the response
      if (!rawData.data) {
        console.error('MLS API response missing data property:', rawData);
        throw new Error('MLS API response missing data property');
      }

      // Extract the data property from the response
      const data = rawData.data;


      console.log("=======================data",data)

      // Add mock price_changes and status_changes for testing if they don't exist
      if (!data.price_changes) {
        data.price_changes = [
          {
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            price: data.listPrice ? data.listPrice * 1.05 : 1000000,
            change_amount: data.listPrice ? data.listPrice * 0.05 : 50000,
            direction: 'down',
          },
        ];
      }

      if (!data.status_changes) {
        data.status_changes = [
          {
            date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Listed',
          },
        ];
      }

      return data;
    } catch (error) {
      console.error('Error in getMLSDetail:', error);
      throw error;
    }
  }

  // Property Search API
  async searchProperties(params: {
    city?: string;
    state?: string;
    zip_code?: string;
    max_price?: number;
    min_price?: number;
    beds?: number;
    baths?: number;
    property_type?: string;
    page?: number;
    limit?: number;
  }): Promise<PropertySearchResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.fetchWithAuth<PropertySearchResponse>(
      `https://api.realestateapi.com/v1/properties?${queryParams.toString()}`,
    );
  }

  // PropertyComps API
  async getPropertyComps(
    propertyId: string,
    params: {
      radius?: number;
      limit?: number;
      min_price?: number;
      max_price?: number;
    } = {},
  ): Promise<PropertyCompsResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.fetchWithAuth<PropertyCompsResponse>(
      `https://api.realestateapi.com/v3/property/${propertyId}/comps?${queryParams.toString()}`,
    );
  }

  // MLS Search API
  async searchMLS(params: {
    city?: string;
    state?: string;
    zip_code?: string;
    max_price?: number;
    min_price?: number;
    beds?: number;
    baths?: number;
    property_type?: string;
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<MLSSearchResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.fetchWithAuth<MLSSearchResponse>(
      `https://api.realestateapi.com/v1/mls?${queryParams.toString()}`,
    );
  }

  // AutoComplete API
  async autocompleteAddress(query: string): Promise<AutocompleteResponse> {
    return this.fetchWithAuth<AutocompleteResponse>(
      'https://api.realestateapi.com/v2/AutoComplete',
      {
        method: 'POST',
        body: JSON.stringify({
          search: query,
        }),
      },
    );
  }

  // Opportunity Zone Search
  async searchOpportunityZones(params: {
    zip_codes: string[];
    property_type?: string;
    max_price?: number;
    min_price?: number;
  }): Promise<PropertySearchResponse> {
    const queryParams = new URLSearchParams();

    if (params.zip_codes && params.zip_codes.length > 0) {
      queryParams.append('zip_codes', params.zip_codes.join(','));
    }

    if (params.property_type) {
      queryParams.append('property_type', params.property_type);
    }

    if (params.max_price) {
      queryParams.append('max_price', params.max_price.toString());
    }

    if (params.min_price) {
      queryParams.append('min_price', params.min_price.toString());
    }

    queryParams.append('opportunity_zone', 'true');

    return this.fetchWithAuth<PropertySearchResponse>(
      `https://api.realestateapi.com/v1/properties?${queryParams.toString()}`,
    );
  }
}
