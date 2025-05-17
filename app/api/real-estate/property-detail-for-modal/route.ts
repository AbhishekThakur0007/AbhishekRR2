import { auth } from '@/server/auth';
import { RealEstateAPI } from '../../../lib/real-estate-api';
import { PropertyDetailResponse } from '../../../types/real-estate';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

// Use the API key that works in Postman
const realEstateApiKey =
  process.env.REAL_ESTATE_API_KEY || 'AGENTEDGETEST-212d-7219-9fcc-c03008d19b22';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const POST = async (request: Request): Promise<Response> => {
  const debugInfo: string[] = [];
  const addDebug = (msg: string) => {
    console.log(msg);
    debugInfo.push(msg);
  };

  try {
    const body = (await request.json()) as {
      propertyId: string;
      address: string;
    };

    // addDebug(`Request received with address: ${body.address}`);

    // Get user but don't require authentication for now (for testing)
    const user = await auth();
    addDebug(`Auth status: ${!!user?.user}`);

    const { data: existingProperty, error: dbError } = await supabase
      .from('reva-property_details')
      .select('*')
      .ilike('property_id', body.propertyId)
      .ilike('address', body.address)
      .single();
    console.log('=================existingProperty', existingProperty);
    if (dbError) {
      addDebug(`Supabase query error: ${dbError.message}`);
      if (dbError.code !== 'PGRST116') {
        addDebug(`Supabase error: ${dbError.message}`);
      } else {
        addDebug(`No property found in Supabase for property_id: ${body.propertyId}`);
      }
    }

    if (existingProperty) {
      addDebug('Found property in database');
      addDebug(`Property data: ${JSON.stringify(existingProperty.data)}`);
      return new Response(JSON.stringify(existingProperty.data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Info': JSON.stringify(debugInfo),
        },
      });
    }

    addDebug('Property not found in database, calling Real Estate API');
    const realEstateAPI = new RealEstateAPI(realEstateApiKey);

    try {
      // Use the address to fetch data
      addDebug(`Calling Real Estate API with property_id: ${body.propertyId}`);
      // const propertyDetail = await realEstateAPI.getPropertyDetail(body.propertyId.trim());
      const propertyDetail = await realEstateAPI.getPropertyDetail(body.propertyId);

      if (!propertyDetail) {
        addDebug('No data returned from Real Estate API');
        return new Response(
          JSON.stringify({
            error: 'Property not found',
            message: 'No data returned from the property API',
          }),
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
              'X-Debug-Info': JSON.stringify(debugInfo),
            },
          },
        );
      }

      // Store the property detail in Supabase
      // addDebug(`Storing property in Supabase with address: ${body.address}`);
      const { error: insertError } = await supabase.from('reva-property_details').insert({
        property_id: body.propertyId,
        address: body.address,
        data: propertyDetail,
      });

      if (insertError) {
        addDebug(`Error storing property in Supabase: ${insertError.message}`);
      } else {
        addDebug('Successfully stored property in Supabase');
      }

      return new Response(JSON.stringify(propertyDetail), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Info': JSON.stringify(debugInfo),
        },
      });
    } catch (error) {
      addDebug(`API call failed: ${error instanceof Error ? error.message : String(error)}`);
      return new Response(
        JSON.stringify({
          error: 'Error fetching property details from external API',
          message: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            'X-Debug-Info': JSON.stringify(debugInfo),
          },
        },
      );
    }
  } catch (error) {
    addDebug(
      `Error in property-detail API route: ${error instanceof Error ? error.message : String(error)}`,
    );
    return new Response(
      JSON.stringify({
        error: 'Error processing property details request',
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Info': JSON.stringify(debugInfo),
        },
      },
    );
  }
};
