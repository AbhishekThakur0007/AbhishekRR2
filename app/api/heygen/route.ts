import { NextResponse } from "next/server";

// Heygen API configuration
const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HEYGEN_API_URL = "https://api.heygen.com/v2";

// Default avatar to use from the default Heygen collection
// Updated to use the Daisy avatar which is commonly available in Heygen
const DEFAULT_AVATAR_ID = "Daisy-inskirt-20220818";

// Default voice to use - using standard voices that should be available in most accounts
// These are organized by priority - we'll try each one until one works
const FALLBACK_VOICE_IDS = [
  "en-US-Jenny", // Common English voice
  "en-US-Davis", // Common English voice
  "en-GB-Charlie", // Common British English voice
  "en-US-Jason", // Another common English voice
  "female-en-US-1", // Legacy format
  "male-en-US-1", // Legacy format
  "en-female-1", // Another format
  "en-male-1", // Another format
];

// Define interfaces for type safety
interface VideoGenerateRequest {
  text: string;
  avatarId?: string;
  voiceId?: string;
}

interface HeygenVideoResponse {
  data: {
    video_id: string;
  };
  error: null | string;
}

interface HeygenVideoStatusResponse {
  data: {
    status: string;
    video_url?: string;
  };
  error: null | string;
}

interface HeygenAvatarResponse {
  avatars: Array<{
    avatar_id: string;
    avatar_name: string;
    gender: string;
    preview_image_url: string;
    preview_video_url: string;
    premium: boolean;
  }>;
}

// GET endpoint to list available avatars
export async function GET(request: Request) {
  try {
    console.log("DEBUG: Fetching available Heygen avatars");

    if (!HEYGEN_API_KEY) {
      return NextResponse.json(
        { error: "Heygen API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(`${HEYGEN_API_URL}/avatars`, {
      method: "GET",
      headers: {
        "X-Api-Key": HEYGEN_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: "Failed to fetch avatars",
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = (await response.json()) as { avatars: Array<any> };
    return NextResponse.json({ avatars: data.avatars });
  } catch (error) {
    console.error("ERROR: Exception when fetching avatars:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log("DEBUG: Heygen API route called");
    console.log("DEBUG: Using API URL:", HEYGEN_API_URL);
    console.log("DEBUG: API Key configured:", !!HEYGEN_API_KEY);
    console.log("DEBUG: API Key length:", HEYGEN_API_KEY?.length || 0);

    // Parse the request body with type assertion
    const body = (await request.json()) as unknown;
    const {
      text,
      // Use the new default avatar ID if none provided in the request
      avatarId = DEFAULT_AVATAR_ID,
      // Use the first fallback voice ID by default
      voiceId = FALLBACK_VOICE_IDS[0],
    } = body as VideoGenerateRequest;

    console.log("DEBUG: Request params:", {
      textLength: text?.length || 0,
      avatarId,
      voiceId,
    });

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!HEYGEN_API_KEY) {
      console.error(
        "ERROR: Heygen API key not configured in environment variables"
      );
      return NextResponse.json(
        {
          error: "Heygen API key not configured",
          videoUrl:
            "https://placehold.co/600x400/000000/FFFFFF/mp4?text=API+Key+Missing",
        },
        { status: 200 } // Return 200 so client can still work, with a placeholder
      );
    }

    // Try multiple voice IDs in order until one works
    let successfulResponse: Response | null = null;
    let attemptedVoiceId = voiceId;

    // First try the provided voice ID
    const voicesToTry = [voiceId];

    // Then add fallback voices if not already included
    for (const fallbackVoice of FALLBACK_VOICE_IDS) {
      if (fallbackVoice !== voiceId) {
        voicesToTry.push(fallbackVoice);
      }
    }

    for (const currentVoiceId of voicesToTry) {
      attemptedVoiceId = currentVoiceId;
      console.log(`DEBUG: Trying voice ID: ${attemptedVoiceId}`);

      // Prepare request body for Heygen API using v2 format
      const requestBody = {
        video_inputs: [
          {
            character: {
              type: "avatar",
              avatar_id: avatarId,
              avatar_style: "normal",
            },
            voice: {
              type: "text",
              input_text: text,
              voice_id: attemptedVoiceId,
              speed: 1.0,
            },
            background: {
              type: "color",
              value: "#F8F8F8",
            },
          },
        ],
        dimension: {
          width: 1280,
          height: 720,
        },
      };

      console.log(
        "DEBUG: Sending request to Heygen API:",
        JSON.stringify(requestBody, null, 2)
      );

      // Call Heygen API to generate video
      try {
        const response = await fetch(`${HEYGEN_API_URL}/video/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": HEYGEN_API_KEY,
          },
          body: JSON.stringify(requestBody),
        });

        console.log(
          `DEBUG: Heygen API response for voice ${attemptedVoiceId} status:`,
          response.status
        );

        if (response.ok) {
          // Success! Save the response and break the loop
          successfulResponse = response;
          console.log(
            `DEBUG: Successfully generated video with voice ID: ${attemptedVoiceId}`
          );
          break;
        }

        // Read the error response to see if it's a voice not found error
        const errorText = await response.text();
        console.error(
          `ERROR: Heygen API error with voice ${attemptedVoiceId}:`,
          errorText
        );

        if (!errorText.includes("Voice not found")) {
          // If it's not a voice-related error, don't try more voices
          break;
        }
      } catch (err) {
        console.error(
          `ERROR: Exception trying voice ${attemptedVoiceId}:`,
          err
        );
        // Continue to next voice ID
      }
    }

    // Check if any voice ID worked
    if (!successfulResponse) {
      console.error("ERROR: All voice IDs failed");
      return NextResponse.json(
        {
          error: "Failed to generate video with any available voice",
          videoUrl: "",
        },
        { status: 200 } // Return 200 so client still works with a placeholder
      );
    }

    // Proceed with the successful response
    try {
      const responseText = await successfulResponse.text();
      const data = JSON.parse(responseText) as HeygenVideoResponse;

      console.log(
        "DEBUG: Successful response from Heygen API, video ID retrieved:",
        data.data?.video_id
      );

      if (!data.data?.video_id) {
        console.error("ERROR: No video ID in Heygen API response:", data);
        return NextResponse.json({
          error: "No video ID in response",
          details: data,
          videoUrl: "",
        });
      }

      // In v2 API, we need to make another request to get the video URL
      // We need to check the status and wait for the video to be ready
      let videoData: HeygenVideoStatusResponse | undefined;
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        console.log(
          `DEBUG: Checking video status, attempt ${attempts + 1}/${maxAttempts}`
        );

        // Wait for 1 second before checking status
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const statusResponse = await fetch(
          `${HEYGEN_API_URL}/video/${data.data.video_id}`,
          {
            method: "GET",
            headers: {
              "X-Api-Key": HEYGEN_API_KEY,
            },
          }
        );

        if (!statusResponse.ok) {
          console.error(
            "ERROR: Failed to get video status:",
            statusResponse.status
          );
          attempts++;
          continue;
        }

        videoData = (await statusResponse.json()) as HeygenVideoStatusResponse;
        console.log("DEBUG: Video status:", videoData.data?.status);

        if (
          videoData.data?.status === "completed" &&
          videoData.data?.video_url
        ) {
          console.log("DEBUG: Video is ready, URL:", videoData.data.video_url);
          return NextResponse.json({ videoUrl: videoData.data.video_url });
        }

        if (videoData.data?.status === "failed") {
          console.error("ERROR: Video generation failed:", videoData);
          return NextResponse.json({
            error: "Video generation failed",
            details: videoData,
            videoUrl: "",
          });
        }

        attempts++;
      }

      console.error("ERROR: Timeout waiting for video to be ready");
      return NextResponse.json({
        error: "Timeout waiting for video",
        details: videoData || { error: "Timeout" },
        videoUrl: "",
      });
    } catch (e) {
      console.error("ERROR: Failed to parse JSON response:", e);
      console.error("ERROR: Raw response was from voice ID:", attemptedVoiceId);

      return NextResponse.json(
        {
          error: "Failed to parse response",
          details: e instanceof Error ? e.message : String(e),
          videoUrl: "",
        },
        { status: 200 } // Return 200 so client still works with placeholder
      );
    }
  } catch (error) {
    console.error("ERROR: Exception in Heygen route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
        videoUrl: "",
      },
      { status: 200 } // Return 200 with placeholder so client doesn't break
    );
  }
}

// For Speech to Text
export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    // In a real implementation, you would send this to a speech-to-text service
    // For example, using OpenAI's Whisper API
    // This is a placeholder for the actual implementation

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return a simulated transcription
    return NextResponse.json({
      text: "This is a simulated transcription of the speech. In production, you would use a real speech-to-text service.",
    });
  } catch (error) {
    console.error("Error processing speech to text:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
