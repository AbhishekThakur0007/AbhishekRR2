import { NextResponse } from "next/server";

interface AgentListingsRequest {
  listing_agent_email: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AgentListingsRequest;
    const { listing_agent_email } = body;

    if (!listing_agent_email) {
      return NextResponse.json(
        { error: "listing_agent_email is required" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.realestateapi.com/v2/MLSSearch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REAL_ESTATE_API_KEY || "",
      },
      body: JSON.stringify({ listing_agent_email }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in agent-listings route:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent listings" },
      { status: 500 }
    );
  }
}
