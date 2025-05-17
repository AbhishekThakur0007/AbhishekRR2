import { NextResponse } from "next/server";

// Heygen API configuration
const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HEYGEN_API_URL = "https://api.heygen.com/v2";

// Define interface for voice response
interface HeygenVoice {
  voice_id: string;
  name: string;
  language: string;
  gender: string;
  preview_audio: string;
}

// GET endpoint to list available voices
export async function GET(request: Request) {
  try {
    console.log("DEBUG: Fetching available Heygen voices");

    if (!HEYGEN_API_KEY) {
      return NextResponse.json(
        { error: "Heygen API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(`${HEYGEN_API_URL}/voice`, {
      method: "GET",
      headers: {
        "X-Api-Key": HEYGEN_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: "Failed to fetch voices",
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = (await response.json()) as unknown;

    // Transform the data to match our expected interface
    // Note: Heygen's API response format may vary, adjust as needed
    const voices: HeygenVoice[] = Array.isArray((data as any).data)
      ? (data as any).data.map((voice: any) => ({
          voice_id: voice.voice_id,
          name: voice.name || voice.voice_id,
          language: voice.language || "Unknown",
          gender: voice.gender || "Unknown",
          preview_audio: voice.preview_url || "",
        }))
      : [];

    return NextResponse.json({ voices });
  } catch (error) {
    console.error("ERROR: Exception when fetching voices:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
