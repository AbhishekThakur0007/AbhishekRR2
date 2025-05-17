import { auth } from '@/server/auth';
import { RealEstateAPI, AutocompleteResponse as APIResponse } from '@/lib/real-estate-api';

// export const runtime = "edge";

const realEstateApiKey = process.env.REAL_ESTATE_API_KEY || '';

export const POST = async (request: Request): Promise<Response> => {
  try {
    const body = (await request.json()) as { query: string };
    console.log('Received query:', body.query);

    const user = await auth();
    console.log('Auth status:', !!user?.user);

    if (!body.query) {
      return new Response('Query is required', { status: 400 });
    }

    // Temporarily disable auth check for testing
    // if (!user?.user) {
    //   return new Response("Unauthorized", { status: 401 });
    // }

    if (!realEstateApiKey) {
      console.error('Missing API key: realEstateApiKey');
      return new Response('Missing API key', { status: 500 });
    }

    const realEstateAPI = new RealEstateAPI(realEstateApiKey);
    const response = await realEstateAPI.autocompleteAddress(body.query);
    console.log('RealEstate API response:', response);

    // Transform the response to match the frontend expectations
    const suggestions = response.data.map((item) => {
      // Get the most complete address possible
      let address = '';

      // If title contains a full address, use it
      if (item.title && item.title.includes(item.state)) {
        address = item.title;
      }
      // If we have a street, use it (house number might be part of street)
      else if (item.street) {
        address = item.street;
      }
      // Otherwise use whatever address field is available
      else {
        address = item.neighborhoodName || item.title || '';
      }

      return {
        address,
        city: item.city || '',
        state: item.state || '',
        zip_code: item.zip || '',
        // Use the actual property ID if available, otherwise use FIPS or neighborhoodId
        property_id: item.fips || item.neighborhoodId || '',
        // Include the search type to help with debugging
        searchType: item.searchType || '',
        // Include the raw item for debugging
        raw_item: item,
      };
    });

    console.log('Transformed suggestions:', suggestions);

    return new Response(JSON.stringify({ suggestions }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in autocomplete API:', error);
    return new Response(JSON.stringify({ error: 'Error fetching address suggestions' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
