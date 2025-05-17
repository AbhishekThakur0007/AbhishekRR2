const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY || '';

interface GeoapifyResult {
  formatted: string;
  city?: string;
  state?: string;
  postcode?: string;
  place_id?: string;
  result_type?: string;
  [key: string]: any;
}

interface GeoapifyResponse {
  results: GeoapifyResult[];
}

export const POST = async (request: Request): Promise<Response> => {
  try {
    const body = (await request.json()) as { query: string };

    if (!body.query) {
      return new Response('Query is required', { status: 400 });
    }

    if (!GEOAPIFY_API_KEY) {
      console.error('Missing API key: GEOAPIFY_API_KEY');
      return new Response('Missing API key', { status: 500 });
    }

    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        body.query,
      )}&filter=countrycode:us&format=json&apiKey=${GEOAPIFY_API_KEY}`,
    );

    if (!response.ok) {
      throw new Error(`Geoapify API error: ${response.statusText}`);
    }

    const data = (await response.json()) as GeoapifyResponse;
    // console.log('Geoapify API response:', data);

    // Transform the response to match the frontend expectations
    const suggestions = data.results.map((item) => ({
      address: item.formatted,
      city: item.city || '',
      state: item.state || '',
      zip_code: item.postcode || '',
      property_id: item.place_id || '',
      searchType: item.result_type || '',
      raw_item: item,
    }));

    return new Response(JSON.stringify({ suggestions }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in geocode autocomplete API:', error);
    return new Response(JSON.stringify({ error: 'Error fetching address suggestions' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
