import { createOpenAI } from '@ai-sdk/openai';
import { CoreMessage, streamText } from 'ai';
import {
  RealEstateAPIResponse,
  CMARequest,
  PropertyDetailRequest,
  PropertySearchRequest,
  MLSDetailRequest,
  MLSListing,
} from '../../../types/real-estate';
import { RealEstateAPI } from '../../../lib/real-estate-api';

// export const runtime = "edge";

const openaiApiKey = process.env.OPENAI_API_KEY;
const realEstateApiKey = process.env.REAL_ESTATE_API_KEY || '';

export const POST = async (request: Request): Promise<Response> => {
  const body = (await request.json()) as CMARequest;

  if (!body.address) {
    return new Response('Invalid request', { status: 400 });
  }

  if (!openaiApiKey || !realEstateApiKey) {
    console.error('Missing API keys:', {
      openaiApiKey: !!openaiApiKey,
      realEstateApiKey: !!realEstateApiKey,
    });
    return new Response('Missing API keys', { status: 500 });
  }

  const openai = createOpenAI({
    apiKey: openaiApiKey,
  });

  try {
    const realEstateAPI = new RealEstateAPI(realEstateApiKey);

    // Fetch subject property data using Property Detail API
    let subjectProperty: RealEstateAPIResponse;
    try {
      // The getPropertyDetail method expects a property ID string, not an object
      // For now, we'll use a mock property ID derived from the address
      const propertyId = `mock-property-${body.address.replace(/\s+/g, '-').toLowerCase()}`;

      const propertyDetail = await realEstateAPI.getPropertyDetail(propertyId);

      if (!propertyDetail) {
        throw new Error('No property found for the given address');
      }

      // Map PropertyDetailResponse to RealEstateAPIResponse format
      subjectProperty = {
        property_id: propertyDetail.data.id.toString(),
        address: {
          line: propertyDetail.data.propertyInfo.address.address,
          city: propertyDetail.data.propertyInfo.address.city,
          state: propertyDetail.data.propertyInfo.address.state,
          postal_code: propertyDetail.data.propertyInfo.address.zip,
          neighborhood_name: propertyDetail.data.lotInfo.subdivision || undefined,
          county: propertyDetail.data.propertyInfo.address.county,
        },
        property: {
          type: propertyDetail.data.propertyInfo.propertyUse,
          year_built: propertyDetail.data.propertyInfo.yearBuilt,
          size_sqft: propertyDetail.data.propertyInfo.livingSquareFeet,
          beds: propertyDetail.data.propertyInfo.bedrooms,
          baths: propertyDetail.data.propertyInfo.bathrooms,
          rooms: propertyDetail.data.propertyInfo.roomsCount,
          stories: propertyDetail.data.propertyInfo.stories,
          parking: {
            type: propertyDetail.data.propertyInfo.garageType || 'none',
            spaces: propertyDetail.data.propertyInfo.parkingSpaces || 0,
          },
        },
        price: {
          list: propertyDetail.data.mlsListingPrice || 0,
          estimate: propertyDetail.data.estimatedValue || 0,
          last_sold: propertyDetail.data.lastSale?.saleAmount || 0,
          last_sold_date: propertyDetail.data.lastSale?.saleDate || '',
        },
        photos: propertyDetail.data.propertyInfo.photos || [],
        description: '', // Default empty description since it's not available in the response
      };
    } catch (error) {
      console.error('Error fetching subject property data:', error);
      return new Response('Error fetching subject property data', {
        status: 500,
      });
    }

    // Try to get MLS details if available
    let mlsDetails: MLSListing | null = null;
    try {
      // Check if we have an MLS ID from the subject property
      if (subjectProperty.mls_id) {
        const mlsDetailRequest = subjectProperty.mls_id;

        mlsDetails = await realEstateAPI.getMLSDetail(mlsDetailRequest);

        // Merge MLS details with subject property if available
        if (mlsDetails && mlsDetails.property) {
          // Map the MLSListing property to RealEstateAPIResponse format
          const mappedProperty: RealEstateAPIResponse = {
            property_id: mlsDetails.reapiId || subjectProperty.property_id,
            mls_id: mlsDetails.mlsNumber,
            address: {
              line: subjectProperty.address.line,
              city: subjectProperty.address.city,
              state: subjectProperty.address.state,
              postal_code: subjectProperty.address.postal_code,
              neighborhood_name:
                mlsDetails.property.neighborhood || subjectProperty.address.neighborhood_name,
              county: subjectProperty.address.county,
            },
            property: {
              type: mlsDetails.property.propertyType,
              sub_type: mlsDetails.property.propertySubType,
              year_built: parseInt(mlsDetails.property.yearBuilt) || undefined,
              size_sqft: mlsDetails.property.livingArea,
              beds: mlsDetails.property.bedroomsTotal,
              baths: mlsDetails.property.bathroomsTotal,
              parking: {
                type: 'garage',
                spaces: mlsDetails.property.garageSpaces,
              },
            },
            price: {
              list: mlsDetails.listPrice,
              estimate: subjectProperty.price.estimate,
            },
            photos:
              mlsDetails.media?.photosList?.map((photo) => photo.highRes) || subjectProperty.photos,
            description: mlsDetails.publicRemarks || subjectProperty.description,
          };

          subjectProperty = mappedProperty;
        }
      }
    } catch (error) {
      console.error('Error fetching MLS details:', error);
      // Continue without MLS details
    }

    // Fetch comparable properties using Property Search API
    let comparableProperties: RealEstateAPIResponse[] = [];
    try {
      // Create search parameters with safe property access
      const propertySearchRequest: PropertySearchRequest = {
        address: body.address,
        radius_miles: body.radius_miles,
        property_type: body.property_type,
        limit: 10,
      };

      // Add optional parameters only if they have values
      if (body.min_price) {
        propertySearchRequest.min_price = body.min_price;
      } else if (subjectProperty.price?.list) {
        propertySearchRequest.min_price = Math.max(0, subjectProperty.price.list * 0.8);
      }

      if (body.max_price) {
        propertySearchRequest.max_price = body.max_price;
      } else if (subjectProperty.price?.list) {
        propertySearchRequest.max_price = subjectProperty.price.list * 1.2;
      }

      if (body.min_beds) {
        propertySearchRequest.min_beds = body.min_beds;
      } else if (subjectProperty.property?.beds) {
        propertySearchRequest.min_beds = Math.max(1, subjectProperty.property.beds - 1);
      } else {
        propertySearchRequest.min_beds = 2; // Default value
      }

      if (body.max_beds) {
        propertySearchRequest.max_beds = body.max_beds;
      } else if (subjectProperty.property?.beds) {
        propertySearchRequest.max_beds = subjectProperty.property.beds + 1;
      } else {
        propertySearchRequest.max_beds = 4; // Default value
      }

      if (body.min_baths) {
        propertySearchRequest.min_baths = body.min_baths;
      } else if (subjectProperty.property?.baths) {
        propertySearchRequest.min_baths = Math.max(1, subjectProperty.property.baths - 1);
      } else {
        propertySearchRequest.min_baths = 1; // Default value
      }

      if (body.max_baths) {
        propertySearchRequest.max_baths = body.max_baths;
      } else if (subjectProperty.property?.baths) {
        propertySearchRequest.max_baths = subjectProperty.property.baths + 1;
      } else {
        propertySearchRequest.max_baths = 3; // Default value
      }

      if (body.min_sqft) {
        propertySearchRequest.min_sqft = body.min_sqft;
      } else if (subjectProperty.property?.size_sqft) {
        propertySearchRequest.min_sqft = Math.max(500, subjectProperty.property.size_sqft * 0.8);
      } else {
        propertySearchRequest.min_sqft = 1000; // Default value
      }

      if (body.max_sqft) {
        propertySearchRequest.max_sqft = body.max_sqft;
      } else if (subjectProperty.property?.size_sqft) {
        propertySearchRequest.max_sqft = subjectProperty.property.size_sqft * 1.2;
      } else {
        propertySearchRequest.max_sqft = 3000; // Default value
      }

      // Search for comparable properties
      const searchResponse = await realEstateAPI.searchProperties(propertySearchRequest);

      // Extract the properties array from the search response
      comparableProperties = searchResponse.properties || [];

      if (!comparableProperties || comparableProperties.length === 0) {
        console.warn('No comparable properties found, using empty array');
        comparableProperties = [];
      }
    } catch (error) {
      console.error('Error fetching comparable properties:', error);
      // Continue with empty comparables
      comparableProperties = [];
    }

    // Use OpenAI to generate CMA analysis
    const propertyData = {
      subject_property: subjectProperty,
      comparable_properties: comparableProperties ? comparableProperties.slice(0, 10) : [], // Limit to 10 comparables
    };

    const messages: CoreMessage[] = [
      {
        role: 'system',
        content: `You are a real estate expert who creates detailed Competitive Market Analysis (CMA) reports. Analyze the following property and its comparables to create a comprehensive CMA report:
        
        Property Data:
        ${JSON.stringify(propertyData)}
        
        Provide your analysis in this format:
        
        # COMPETITIVE MARKET ANALYSIS REPORT
        
        ## SUBJECT PROPERTY OVERVIEW
        * Address and basic details
        * Key features and amenities
        * Current listing price analysis
        
        ## COMPARABLE PROPERTIES ANALYSIS
        * Overview of comparable properties
        * Price per square foot comparison
        * Days on market comparison
        * Feature comparison (beds, baths, lot size, etc.)
        
        ## MARKET TRENDS
        * Recent sales in the neighborhood
        * Price trends
        * Inventory levels
        * Days on market trends
        
        ## VALUATION ANALYSIS
        * Recommended price range
        * Pricing strategy recommendations
        * Justification for valuation
        
        ## MARKETING RECOMMENDATIONS
        * Suggested improvements before listing
        * Marketing strategy recommendations
        * Negotiation strategy
        
        ## COMPETITIVE ADVANTAGES
        * Unique selling points
        * Neighborhood advantages
        * Investment potential`,
      },
      {
        role: 'user',
        content: `Generate a Competitive Market Analysis (CMA) report for the property at ${body.address}.`,
      },
    ];

    const stream = await streamText({
      model: openai('gpt-4o-mini'),
      messages: messages,
    });

    return stream.toDataStreamResponse();
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error processing request', { status: 500 });
  }
};
