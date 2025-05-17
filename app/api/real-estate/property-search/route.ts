import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@/server/auth';
import { RealEstateAPI } from '@/lib/real-estate-api';
// import { addDebug } from '@/lib/debug';

export const runtime = 'edge';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

/**
 * PropertySearchParams interface
 * This defines the expected parameters for the RealEstateAPI PropertySearch endpoint
 * At least one location parameter is required
 *
 * Based on: https://developer.realestateapi.com/reference/property-search-field-guide
 */
interface PropertySearchParams {
  // Geo Fields (location parameters - at least one required)
  address?: string;
  city?: string;
  state?: string;
  county?: string;
  neighborhood?: string;
  subdivision?: string;
  zip?: string;
  country?: string;
  fips?: string;
  radius?: number;
  radius_unit?: 'mi' | 'km';

  // Boolean Fields
  absentee_owner?: boolean;
  active_mortgage?: boolean;
  cash_buyer?: boolean;
  corporate_owned?: boolean;
  distressed?: boolean;
  equity?: boolean;
  first_lien?: boolean;
  flood_zone?: boolean;
  foreclosure?: boolean;
  hoa?: boolean;
  is_rental?: boolean;
  link_properties?: boolean;
  non_owner_occupied?: boolean;
  owner_occupied?: boolean;
  pool?: boolean;
  pre_foreclosure?: boolean;
  recently_sold?: boolean;
  second_lien?: boolean;
  tax_lien?: boolean;
  third_lien?: boolean;
  vacant?: boolean;

  // Enumeration Fields
  property_type?: string | string[]; // Options: SFR, MFR, LAND, CONDO, MOBILE, OTHER
  document_type_code?: string;
  flood_zone_type?: string;
  loan_type_code_first?: string;
  loan_type_code_second?: string;
  loan_type_code_third?: string;
  notice_type?: string;
  property_use_code?: string;
  search_range?: string;

  // Range Fields
  assessed_improvement_value_min?: number;
  assessed_improvement_value_max?: number;
  assessed_land_value_min?: number;
  assessed_land_value_max?: number;
  assessed_value_min?: number;
  assessed_value_max?: number;
  baths_min?: number;
  baths_max?: number;
  beds_min?: number;
  beds_max?: number;
  building_size_min?: number;
  building_size_max?: number;
  deck_area_min?: number;
  deck_area_max?: number;
  estimated_equity_min?: number;
  estimated_equity_max?: number;
  last_sale_date_min?: string;
  last_sale_date_max?: string;
  last_sale_price_min?: number;
  last_sale_price_max?: number;
  lot_size_min?: number;
  lot_size_max?: number;
  median_income_min?: number;
  median_income_max?: number;
  mortgage_min?: number;
  mortgage_max?: number;
  pool_area_min?: number;
  pool_area_max?: number;
  value_min?: number;
  value_max?: number;
  // Alternative price parameters (for backward compatibility)
  price_min?: number;
  price_max?: number;
  rooms_min?: number;
  rooms_max?: number;
  stories_min?: number;
  stories_max?: number;
  tax_delinquent_year_min?: number;
  tax_delinquent_year_max?: number;
  tax_value_min?: number;
  tax_value_max?: number;
  units_min?: number;
  units_max?: number;
  year_built_min?: number;
  year_built_max?: number;
  years_owned_min?: number;
  years_owned_max?: number;

  // API control parameters
  size?: number;
  offset?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  ids_only?: boolean;
  obfuscate?: boolean;
  summary?: boolean;
  exclude?: string[];
}

/**
 * Property data as returned by the RealEstateAPI
 */
interface PropertyData {
  propertyId?: string;
  id?: string;
  mlsStatus?: string;
  lastSaleDate?: string;
  lastUpdateDate?: string;
  lastSaleAmount?: string;
  assessedValue?: number;
  estimatedValue?: number;
  address?: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  latitude?: number;
  longitude?: number;
  propertyType?: string;
  propertyUse?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  yearBuilt?: number;
  // Add any other fields that might be in the response
}

/**
 * Response from the PropertySearch API
 */
interface PropertySearchResponse {
  live?: boolean;
  input?: any;
  data?: PropertyData[];
  error?: string;
  message?: string;
}

/**
 * Valid property types according to the RealEstateAPI documentation
 */
const VALID_PROPERTY_TYPES = ['SFR', 'MFR', 'LAND', 'CONDO', 'MOBILE', 'OTHER'];

/**
 * Validates and normalizes parameters before sending to the API
 */
function validateAndNormalizeParams(params: PropertySearchParams): PropertySearchParams {
  const validatedParams = { ...params };

  // Validate property types if present
  if (validatedParams.property_type) {
    if (Array.isArray(validatedParams.property_type)) {
      // Filter array to only include valid types
      validatedParams.property_type = validatedParams.property_type.filter((type) =>
        VALID_PROPERTY_TYPES.includes(type),
      );

      // If the array is empty after filtering, remove the property
      if (validatedParams.property_type.length === 0) {
        delete validatedParams.property_type;
      }
    } else {
      // Single string value
      if (!VALID_PROPERTY_TYPES.includes(validatedParams.property_type)) {
        delete validatedParams.property_type;
      }
    }
  }

  return validatedParams;
}

interface APIResponse {
  error?: string;
  data?: any[];
  statusCode?: number;
  statusMessage?: string;
  resultCount?: number;
  recordCount?: number;
}

export const POST = async (request: Request) => {
  const debugInfo: string[] = [];
  const addDebug = (msg: string) => {
    // Only add debug info if we're under the limit
    if (JSON.stringify(debugInfo).length < 20000) {
      debugInfo.push(msg);
    }
  };

  addDebug(`Request method: ${request.method}`);
  addDebug(`Request URL: ${request.url}`);
  addDebug(`Request headers: ${JSON.stringify(Object.fromEntries(request.headers))}`);

  // Add CORS headers to all responses
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const body = (await request.json()) as PropertySearchParams;
    addDebug(`Request received with params: ${JSON.stringify(body)}`);

    // Get user but don't require authentication for now (for testing)
    const user = await auth();
    addDebug(`Auth status: ${!!user?.user}`);

    // Set default parameters if not provided
    const params: PropertySearchParams = {
      size: 20, // Default to 20 results
      ids_only: false,
      obfuscate: false,
      summary: false,
      ...body,
    };

    // First, check if we have this search in Supabase
    addDebug('Checking Supabase for cached results');

    // Create a stable cache key based on the essential search parameters
    const cacheKey = {
      location: params.address || params.city || params.state || params.county || params.zip || '',
      property_type: params.property_type || '',
      value_min: params.value_min || params.price_min || 0,
      value_max: params.value_max || params.price_max || 0,
      beds_min: params.beds_min || 0,
      baths_min: params.baths_min || 0,
      size: params.size || 20,
    };

    addDebug(`Cache key: ${JSON.stringify(cacheKey)}`);

    const { data: cachedResults, error: cacheError } = await supabase
      .from('reva-property_search_results')
      .select('results')
      .eq('cache_key', JSON.stringify(cacheKey))
      .single();

    if (cacheError) {
      addDebug(`Supabase query error: ${cacheError.message}`);
      if (cacheError.code !== 'PGRST116') {
        addDebug(`Supabase error: ${cacheError.message}`);
      } else {
        addDebug('No cached results found in Supabase');
      }
    }

    if (cachedResults) {
      addDebug('Found cached results in database');
      try {
        // Ensure the results are properly parsed
        const parsedResults =
          typeof cachedResults.results === 'string'
            ? JSON.parse(cachedResults.results)
            : cachedResults.results;

        // Only add a small portion of the results to debug info
        addDebug(`Cached results count: ${parsedResults.data?.length || 0}`);

        return new Response(JSON.stringify(parsedResults), {
          status: 200,
          headers: {
            ...headers,
            'X-Data-Source': 'Supabase',
            'X-Debug-Info': JSON.stringify(debugInfo),
          },
        });
      } catch (parseError) {
        addDebug(`Error parsing cached results: ${parseError}`);
        // If parsing fails, continue to fetch fresh data
      }
    }

    // Map price_min/price_max to value_min/value_max if they exist
    // According to the Property Search Field Guide, value_min/value_max correspond to taxInfo.estimatedValue
    if (params.price_min !== undefined && params.value_min === undefined) {
      params.value_min = params.price_min;
      delete params.price_min;
    }

    if (params.price_max !== undefined && params.value_max === undefined) {
      params.value_max = params.price_max;
      delete params.price_max;
    }

    // Validate that at least one location parameter is provided
    const hasLocationParam =
      params.address ||
      params.city ||
      params.state ||
      params.county ||
      params.zip ||
      params.subdivision;

    if (!hasLocationParam) {
      return new Response(
        JSON.stringify({
          error:
            'At least one location parameter (address, city, state, county, zip, or subdivision) is required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Remove any undefined parameters to avoid API errors
    Object.keys(params).forEach((key) => {
      if (params[key as keyof PropertySearchParams] === undefined) {
        delete params[key as keyof PropertySearchParams];
      }
    });

    // Validate and normalize parameters
    const validatedParams = validateAndNormalizeParams(params);

    // Call the API
    addDebug('No cached results found, calling Real Estate API');
    const apiUrl = 'https://api.realestateapi.com/v2/PropertySearch';
    const apiKey = process.env.REAL_ESTATE_API_KEY || 'AGENTEDGETEST-212d-7219-9fcc-c03008d19b22';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'x-user-id': 'UniqueUserIdentifier',
        },
        body: JSON.stringify(validatedParams),
      });

      addDebug(`API response status: ${response.status}`);
      addDebug(`API response headers: ${JSON.stringify(Object.fromEntries(response.headers))}`);

      if (!response.ok) {
        const errorText = await response.text();
        addDebug(`API error response: ${errorText}`);
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = (await response.json()) as APIResponse;
      addDebug(`API response data: ${JSON.stringify(data)}`);

      // Only store results if we got valid data and it's not already in Supabase
      if (data && !data.error && !cachedResults) {
        addDebug('Storing results in Supabase cache');
        const { error: insertError } = await supabase.from('reva-property_search_results').insert({
          cache_key: JSON.stringify(cacheKey),
          search_params: params,
          results: data,
        });

        if (insertError) {
          addDebug(`Error storing results in cache: ${insertError.message}`);
        } else {
          addDebug('Successfully stored results in cache');
        }
      }

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          ...headers,
          'X-Data-Source': 'Real Estate API',
          'X-Debug-Info': JSON.stringify(debugInfo),
        },
      });
    } catch (error) {
      addDebug(`API call failed: ${error instanceof Error ? error.message : String(error)}`);
      return new Response(
        JSON.stringify({
          error: 'Error fetching property search results from external API',
          message: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 502,
          headers,
        },
      );
    }
  } catch (error) {
    addDebug(
      `Error in property-search API route: ${error instanceof Error ? error.message : String(error)}`,
    );
    return new Response(
      JSON.stringify({
        error: 'Error processing property search request',
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          ...headers,
          'X-Debug-Info': JSON.stringify(debugInfo),
        },
      },
    );
  }
};
