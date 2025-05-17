import { NextRequest, NextResponse } from 'next/server';

// Enable dynamic rendering to ensure the route is not cached
export const dynamic = 'force-dynamic';

export async function POST(req:Request) {
  try {
    // Parse the JSON body from the request
    const body = await req.json();
    const roomInfo = body.roomInfo;
    const roomTYpeID = body.roomTYpeID;
    // Construct the URL the same way as in the original code
    const apiUrl = `http://api-qa.mediamagic.ai/api/v1/vstage/${roomInfo}${roomTYpeID ? `/${roomTYpeID}` : ''}`;
    
    // Make the API request
    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-mediamagic-key': '611be21b-b03f-11ee-9768-86580f59f94b'
      }
    });

    // Parse the response
    const response = await resp.json();
    
    // Return the response using NextResponse
    return NextResponse.json({ 
      success: true, 
      data: response 
    });
  } catch (error) {
    // Log the error
    console.log("error", error instanceof Error ? error.message : String(error));
    
    // Return an error response
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    );
  }
}