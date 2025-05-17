import { auth } from '@/server/auth';
import { createOpenAI } from '@ai-sdk/openai';
import { CoreMessage, streamText } from 'ai';
import {
  RealEstateAPIResponse,
  FirecrawlResponse,
  PropertyDetailResponse,
  MLSSearchResponse,
  AutocompleteResponse,
} from '../../types/real-estate';
import { FirecrawlAPI } from '../../lib/firecrawl';
import { RealEstateAPI } from '../../lib/real-estate-api';

// Helper function to generate mock RealEstateAPIResponse objects
function generateMockRealEstateAPIResponses(
  city: string,
  state: string = '',
  maxPrice: number = 5,
  propertyType: string = 'Single-family',
): RealEstateAPIResponse[] {
  return Array(6)
    .fill(null)
    .map((_, index) => ({
      property_id: `mock-property-${index}`,
      status: 'Active',
      list_date: '2024-01-01',
      last_update_date: '2024-01-15',
      price: {
        list: 500000 + index * 10000,
        estimate: 520000 + index * 10000,
        last_sold: 450000 + index * 10000,
      },
      address: {
        line: `${100 + index} Main St`,
        city: 'Sample City',
        state: 'CA',
        postal_code: '12345',
        neighborhood_name: 'Sample Neighborhood',
        county: 'Sample County',
      },
      property: {
        type: 'Single-family',
        sub_type: 'Detached',
        beds: 3 + index,
        baths: 2 + index,
        size_sqft: 2000 + index * 100,
        lot_size_sqft: 5000 + index * 100,
        year_built: 1990 + index,
        parking: {
          spaces: 2,
          type: 'Garage',
        },
      },
      photos: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
      description: 'Beautiful home in a great neighborhood',
    }));
}

export const runtime = 'edge';

const openaiApiKey = process.env.OPENAI_API_KEY;
const realEstateApiKey = process.env.REAL_ESTATE_API_KEY || '';
const firecrawlApiKey = process.env.FIRECRAWL_API_KEY || '';
const grokApiKey = process.env.GROK_API_KEY || '';

interface MLSSearchRequest {
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
}

export const POST = async (request: Request): Promise<Response> => {
  try {
    const body = (await request.json()) as {
      query?: string;
      city?: string;
      state?: string;
      max_price?: number;
      property_category?: string;
      property_type?: string;
      use_firecrawl?: boolean;
      action?: string;
      zip_codes?: string[];
      task?: string;
      address?: string;
      budget?: number;
    };

    const user = await auth();

    if (!user?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    console.log('Request body:', body);

    if (!body.query && !body.city && !user?.user) {
      return new Response('Invalid request', { status: 400 });
    }

    // Use the properties directly from the body
    const city = body.city;
    const state = body.state;
    const max_price = body.max_price;
    const property_type = body.property_type;

    if (!city) {
      console.log('Missing city in request body');
      return new Response('Missing city in request body', { status: 400 });
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

    const realEstateAPI = new RealEstateAPI(realEstateApiKey);

    // Case 1: User search for property with autocomplete
    if (body.query && !body.action) {
      try {
        // Try to autocomplete the address
        const autocompleteResponse = await realEstateAPI.autocompleteAddress(body.query);

        if (autocompleteResponse.data && autocompleteResponse.data.length > 0) {
          const suggestion = autocompleteResponse.data[0];

          // If we have a property_id, fetch property details
          if (suggestion.property_id) {
            const propertyDetail = await realEstateAPI.getPropertyDetail(suggestion.property_id);

            // Fetch MLS details
            const mlsResponse = await realEstateAPI.searchMLS({
              city: suggestion.city,
              state: suggestion.state,
              zip_code: suggestion.zip_code,
              property_type: body.property_type,
            });

            return new Response(
              JSON.stringify({
                type: 'property_detail',
                property: propertyDetail,
                mls: mlsResponse.listings.find(
                  (listing) => listing.reapiId === suggestion.property_id,
                ),
              }),
              { status: 200 },
            );
          } else {
            // If no property_id, search for properties in that location
            const propertyResponse = await realEstateAPI.searchProperties({
              city: suggestion.city,
              state: suggestion.state,
              zip_code: suggestion.zip_code,
              max_price: body.max_price,
              property_type: body.property_type,
            });

            // Fetch MLS listings
            const mlsResponse = await realEstateAPI.searchMLS({
              city: suggestion.city,
              state: suggestion.state,
              zip_code: suggestion.zip_code,
              max_price: body.max_price,
              property_type: body.property_type,
            });

            return new Response(
              JSON.stringify({
                type: 'property_search',
                properties: propertyResponse.properties,
                mls_listings: mlsResponse.listings,
                location: {
                  city: suggestion.city,
                  state: suggestion.state,
                  zip_code: suggestion.zip_code,
                },
              }),
              { status: 200 },
            );
          }
        } else {
          // Case 2: No autocomplete results, do a broader search
          // Extract potential location information from the query
          const locationInfo = await extractLocationInfo(body.query, openai);

          // Search for properties based on extracted location and features
          const propertyResponse = await realEstateAPI.searchProperties({
            city: locationInfo.city,
            state: locationInfo.state,
            zip_code: locationInfo.zip_code,
            max_price: body.max_price || locationInfo.max_price,
            property_type: body.property_type || locationInfo.property_type,
          });

          // Fetch MLS listings
          const mlsResponse = await realEstateAPI.searchMLS({
            city: locationInfo.city,
            state: locationInfo.state,
            zip_code: locationInfo.zip_code,
            max_price: body.max_price || locationInfo.max_price,
            property_type: body.property_type || locationInfo.property_type,
          });

          return new Response(
            JSON.stringify({
              type: 'property_search',
              properties: propertyResponse.properties,
              mls_listings: mlsResponse.listings,
              location: {
                city: locationInfo.city,
                state: locationInfo.state,
                zip_code: locationInfo.zip_code,
              },
              extracted_features: locationInfo.features,
            }),
            { status: 200 },
          );
        }
      } catch (error) {
        console.error('Error processing property search:', error);

        // Case 3: If it's not a property or too general, use OpenAI
        const stream = await streamText({
          model: openai('gpt-4o-mini'),
          messages: [
            {
              role: 'system',
              content: `You are a real estate expert who helps find and analyze properties based on user preferences. The user has asked a general question that doesn't seem to be a specific property search. Provide helpful information about real estate related to their query.`,
            },
            {
              role: 'user',
              content: body.query,
            },
          ],
        });

        return stream.toDataStreamResponse();
      }
    }

    // Case 4: Opportunity zone search
    else if (body.action === 'opportunity_zone' && body.zip_codes && body.zip_codes.length > 0) {
      const opportunityZoneProperties = await realEstateAPI.searchOpportunityZones({
        zip_codes: body.zip_codes,
        property_type: body.property_type,
        max_price: body.max_price,
      });

      return new Response(
        JSON.stringify({
          type: 'opportunity_zone_search',
          properties: opportunityZoneProperties.properties,
        }),
        { status: 200 },
      );
    }

    // Case 5: Task execution (e.g., find a plumber)
    else if (body.action === 'task' && body.task && body.address) {
      // Use Make.com API or similar to execute the task
      // This is a placeholder for the actual implementation
      const taskResult = await executeTask(body.task, body.address, openai, body.budget);

      return new Response(
        JSON.stringify({
          type: 'task_execution',
          result: taskResult,
        }),
        { status: 200 },
      );
    }

    // Original property search functionality (fallback)
    else if (body.city) {
      let propertyData: any = null;

      // Use Firecrawl API if specified and API key is available
      if (body.use_firecrawl && firecrawlApiKey) {
        try {
          const firecrawl = new FirecrawlAPI(firecrawlApiKey);
          const firecrawlResponse = await firecrawl.findProperties(
            body.city,
            body.max_price || 5,
            body.property_category || 'Residential',
            body.property_type || 'Single-family',
            body.state || '',
          );

          if (firecrawlResponse.success) {
            propertyData = firecrawlResponse.data.properties || [];
          } else {
            console.error('Firecrawl API error:', firecrawlResponse);
            // Fall back to direct API call
          }
        } catch (error) {
          console.error('Error using Firecrawl API:', error);
          // Fall back to direct API call
        }
      }

      // Fall back to direct API call if Firecrawl failed or wasn't used
      if (!propertyData) {
        const propertyResponse = await realEstateAPI.searchProperties({
          city: body.city,
          state: body.state,
          max_price: body.max_price,
          property_type: body.property_type,
        });

        propertyData = propertyResponse.properties;
      }

      // Use OpenAI to analyze the property data
      const messages: CoreMessage[] = [
        {
          role: 'system',
          content: `You are a real estate expert who helps find and analyze properties based on user preferences. Analyze the following properties and provide recommendations:
        
        Properties Found:
        ${JSON.stringify(propertyData)}
        
        Provide your analysis in this format:
        
        🏠 SELECTED PROPERTIES
        • List only 5-6 best matching properties with prices closest to ${body.max_price || 5}
        • For each property include:
          - Name and Location
          - Price (with value analysis)
          - Key Features
          - Pros and Cons
        
        💰 BEST VALUE ANALYSIS
        • Compare the selected properties based on:
          - Price per sq ft
          - Location advantage
          - Amenities offered
        
        📍 LOCATION INSIGHTS
        • Specific advantages of the areas where selected properties are located
        
        💡 RECOMMENDATIONS
        • Top 3 properties from the selection with reasoning
        • Investment potential
        • Points to consider before purchase
        
        🤝 NEGOTIATION TIPS
        • Property-specific negotiation strategies`,
        },
        {
          role: 'user',
          content: `Find me properties in ${body.city}, ${
            body.state || ''
          } with a maximum price of $${(
            (body.max_price || 5) * 1000000
          ).toLocaleString()} that are ${
            body.property_category || 'Residential'
          } ${body.property_type || 'Single-family'}.`,
        },
      ];

      const stream = await streamText({
        model: openai('gpt-4o-mini'),
        messages: messages,
      });

      return stream.toDataStreamResponse();
    } else {
      return new Response('Invalid request parameters', { status: 400 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response('Error processing request', { status: 500 });
  }
};

// Helper function to extract location information from a query using OpenAI
async function extractLocationInfo(query: string, openai: any) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Extract real estate search parameters from the user query. Return a JSON object with the following fields:
      - city: string or null
      - state: string or null
      - zip_code: string or null
      - max_price: number or null (in millions)
      - property_type: string or null
      - features: array of strings (extracted features like "pool", "garage", etc.)`,
      },
      {
        role: 'user',
        content: query,
      },
    ],
    response_format: { type: 'json_object' },
  });

  try {
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error parsing location info:', error);
    return {
      city: null,
      state: null,
      zip_code: null,
      max_price: null,
      property_type: null,
      features: [],
    };
  }
}

// Helper function to execute a task using Make.com or similar service
async function executeTask(task: string, address: string, openai: any, budget?: number) {
  // This is a placeholder for the actual implementation
  // In a real implementation, you would call Make.com API or similar service

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a task execution assistant. The user wants to execute the following task:
      Task: ${task}
      Address: ${address}
      Budget: ${budget ? `$${budget}` : 'Not specified'}
      
      Provide a step-by-step plan for executing this task, including:
      1. What service providers to contact
      2. How to contact them
      3. What information to provide
      4. How to negotiate within the budget
      5. How to verify the service quality`,
      },
      {
        role: 'user',
        content: `Help me execute this task: ${task} at ${address} ${
          budget ? `with a budget of $${budget}` : ''
        }`,
      },
    ],
  });

  return {
    plan: response.choices[0].message.content,
    service_providers: [
      {
        name: 'Example Service Provider',
        phone: '(555) 123-4567',
        rating: 4.8,
        reviews: 120,
        estimated_cost: budget ? budget * 0.8 : null,
      },
      {
        name: 'Another Service Provider',
        phone: '(555) 987-6543',
        rating: 4.6,
        reviews: 85,
        estimated_cost: budget ? budget * 0.9 : null,
      },
    ],
  };
}
