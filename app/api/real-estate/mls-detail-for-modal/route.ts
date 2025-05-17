// import { auth } from "@/server/auth";
import { RealEstateAPI } from '../../../lib/real-estate-api';
import { MLSListing } from '../../../types/real-estate';

export const runtime = 'edge';

const realEstateApiKey = process.env.REAL_ESTATE_API_KEY || 'AGENTEDGE-9d99-7b2e-ad8c-61bddbb0a231';

export const POST = async (request: Request): Promise<Response> => {
  try {
    // const body = (await request.json()) as { propertyId: string };
    const body = (await request.json()) as { mls_id: string };
    // console.log("MLS Detail API Request:", body);

    // Temporarily disable auth check for testing
    // const user = await auth();
    // console.log("Auth status:", !!user?.user);


    if (!realEstateApiKey) {
      console.error('Missing API key: realEstateApiKey');
      return new Response(JSON.stringify({ error: 'Missing API key' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const realEstateAPI = new RealEstateAPI(realEstateApiKey);

      // If the method exists, use it
      // const mlsDetail = await realEstateAPI.getMLSDetail(body.propertyId);
      const mlsDetail = await realEstateAPI.getMLSDetailByID(body.mls_id);
      // console.log("MLS detail API response received successfully");

      return new Response(JSON.stringify(mlsDetail), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error fetching MLS details:', error);
      return new Response(
        JSON.stringify({
          error: 'Error fetching MLS details',
          message: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  } catch (error) {
    console.error('Error in MLS detail API route:', error);
    return new Response(
      JSON.stringify({
        error: 'Error processing MLS details request',
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
