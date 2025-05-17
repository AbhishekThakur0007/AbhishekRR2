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
  const addDebug = (msg: string) => debugInfo.push(msg);

  try {
    const body = (await request.json()) as {
      address?: string;
    };

    addDebug(`Request received with address: ${body.address}`);

    // Get user but don't require authentication for now (for testing)
    const user = await auth();
    addDebug(`Auth status: ${!!user?.user}`);

    // Check if address is provided
    if (!body.address) {
      addDebug('No address provided in request');
      return new Response(
        JSON.stringify({
          error: 'Invalid request - address is required',
          receivedBody: body,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'X-Debug-Info': JSON.stringify(debugInfo),
          },
        },
      );
    }

    // First, check if we have this property in Supabase
    addDebug(`Checking Supabase for address: ${body.address}`);
    const { data: existingProperty, error: dbError } = await supabase
      .from('reva_property_details')
      .select('*')
      .ilike('address', body.address)
      .single();

    if (dbError) {
      addDebug(`Supabase query error: ${dbError.message}`);
      if (dbError.code !== 'PGRST116') {
        addDebug(`Supabase error: ${dbError.message}`);
      } else {
        addDebug(`No property found in Supabase for address: ${body.address}`);
      }
    }

    // Check if we have fresh data (less than 1 year old)
    const isFreshData =
      existingProperty &&
      new Date(existingProperty.last_fetched_at).getTime() > Date.now() - 365 * 24 * 60 * 60 * 1000;

    if (existingProperty && isFreshData) {
      addDebug('Found fresh property data in database (less than 1 year old)');
      return new Response(JSON.stringify(existingProperty.data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Info': JSON.stringify(debugInfo),
        },
      });
    }

    addDebug('Property not found in database or data is stale, calling Real Estate API');
    const realEstateAPI = new RealEstateAPI(realEstateApiKey);

    try {
      // Use the address to fetch data
      addDebug(`Calling Real Estate API with address: ${body.address}`);
      const propertyDetail = await realEstateAPI.getPropertyDetailByAddress(body.address.trim());

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

      // Extract property_id from the response if available
      const propertyId = propertyDetail.data?.propertyId || propertyDetail.data?.id || null;

      // Store or update the property detail in Supabase
      if (existingProperty) {
        addDebug(`Updating existing property record for address: ${body.address}`);
        const { error: updateError } = await supabase
          .from('reva_property_details')
          .update({
            data: propertyDetail,
            property_id: propertyId,
            updated_at: new Date().toISOString(),
            last_fetched_at: new Date().toISOString(),
          })
          .eq('id', existingProperty.id);

        if (updateError) {
          addDebug(`Error updating property in Supabase: ${updateError.message}`);
        } else {
          addDebug('Successfully updated property in Supabase');
        }
      } else {
        addDebug(`Inserting new property record for address: ${body.address}`);
        const { error: insertError } = await supabase.from('reva_property_details').insert({
          address: body.address,
          property_id: propertyId,
          data: propertyDetail,
        });

        if (insertError) {
          addDebug(`Error storing property in Supabase: ${insertError.message}`);
        } else {
          addDebug('Successfully stored property in Supabase');
        }
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
