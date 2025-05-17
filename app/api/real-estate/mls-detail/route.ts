// import { auth } from "@/server/auth";
import { RealEstateAPI } from '../../../lib/real-estate-api';
import { MLSListing } from '../../../types/real-estate';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

const realEstateApiKey = process.env.REAL_ESTATE_API_KEY || 'AGENTEDGE-9d99-7b2e-ad8c-61bddbb0a231';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const POST = async (request: Request): Promise<Response> => {
  const debugInfo: string[] = [];
  const addDebug = (msg: string) => debugInfo.push(msg);

  try {
    const body = (await request.json()) as { address: string };
    addDebug(`Request received with address: ${body.address}`);

    if (!body.address) {
      addDebug('Missing required parameter: address');
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

    // Validate that the address starts with a number (house number)
    if (!body.address.match(/^\d+/)) {
      addDebug('Invalid address format - missing house number: ' + body.address);
      return new Response(
        JSON.stringify({
          error: 'Invalid address format - must include house number',
          address: body.address,
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
    const { data: existingMLS, error: dbError } = await supabase
      .from('reva_mls_details')
      .select('*')
      .ilike('address', body.address)
      .single();

    if (dbError) {
      addDebug(`Supabase query error: ${dbError.message}`);
      if (dbError.code !== 'PGRST116') {
        addDebug(`Supabase error: ${dbError.message}`);
      } else {
        addDebug(`No MLS data found in Supabase for address: ${body.address}`);
      }
    }

    // Check if we have fresh data (less than 24 hours old)
    const isFreshData =
      existingMLS &&
      new Date(existingMLS.last_fetched_at).getTime() > Date.now() - 24 * 60 * 60 * 1000;

    if (existingMLS && isFreshData) {
      addDebug('Found fresh MLS data in database');
      return new Response(JSON.stringify(existingMLS.data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Info': JSON.stringify(debugInfo),
        },
      });
    }

    addDebug('Fetching fresh MLS data from external API');
    if (!realEstateApiKey) {
      addDebug('Missing API key: realEstateApiKey');
      return new Response(JSON.stringify({ error: 'Missing API key' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Info': JSON.stringify(debugInfo),
        },
      });
    }

    try {
      const realEstateAPI = new RealEstateAPI(realEstateApiKey);
      const mlsDetail = await realEstateAPI.getMLSDetail(body.address);
      addDebug('Successfully fetched MLS data from external API');

      // Only store if we have complete MLS data
      const isCompleteMlsData =
        mlsDetail &&
        mlsDetail.mlsNumber &&
        mlsDetail.listPrice &&
        mlsDetail.property &&
        (mlsDetail.property.bedroomsTotal ||
          mlsDetail.property.bathroomsTotal ||
          mlsDetail.property.livingArea);

      if (mlsDetail && isCompleteMlsData) {
        addDebug('MLS data is complete, storing in database');
        // Store or update the MLS data in Supabase
        const mlsNumber = mlsDetail.mlsNumber;
        const propertyId = mlsDetail.reapiId;

        if (existingMLS) {
          addDebug('Updating existing MLS record');
          const { error: updateError } = await supabase
            .from('reva_mls_details')
            .update({
              data: mlsDetail,
              mls_number: mlsNumber,
              property_id: propertyId,
              updated_at: new Date().toISOString(),
              last_fetched_at: new Date().toISOString(),
            })
            .eq('id', existingMLS.id);

          if (updateError) {
            addDebug(`Error updating MLS data: ${updateError.message}`);
          }
        } else {
          addDebug('Creating new MLS record');
          const { error: insertError } = await supabase.from('reva_mls_details').insert({
            address: body.address,
            mls_number: mlsNumber,
            property_id: propertyId,
            data: mlsDetail,
          });

          if (insertError) {
            addDebug(`Error inserting MLS data: ${insertError.message}`);
          }
        }
      } else {
        addDebug('MLS data is incomplete, skipping database storage');
      }

      return new Response(JSON.stringify(mlsDetail), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Info': JSON.stringify(debugInfo),
          ...(isCompleteMlsData ? {} : { 'X-Incomplete-Data': 'true' }),
        },
      });
    } catch (error) {
      addDebug(
        `Error fetching MLS details: ${error instanceof Error ? error.message : String(error)}`,
      );

      // If API call fails and we have existing data (even if stale), return it as fallback
      if (existingMLS) {
        addDebug('API call failed, falling back to existing MLS data from database');
        return new Response(
          JSON.stringify({
            ...existingMLS.data,
            _meta: {
              isStaleData: true,
              lastFetched: existingMLS.last_fetched_at,
              fetchError: error instanceof Error ? error.message : String(error),
            },
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'X-Debug-Info': JSON.stringify(debugInfo),
              'X-Using-Stale-Data': 'true',
            },
          },
        );
      }

      // If no existing data at all, return error
      return new Response(
        JSON.stringify({
          error: 'Error fetching MLS details',
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
  } catch (error) {
    addDebug(
      `Error in MLS detail API route: ${error instanceof Error ? error.message : String(error)}`,
    );
    return new Response(
      JSON.stringify({
        error: 'Error processing MLS details request',
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
