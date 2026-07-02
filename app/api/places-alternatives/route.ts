import { NextRequest } from "next/server";
import { searchPlaces } from "@/lib/places-service";

export const runtime = "nodejs";
export const maxDuration = 15;

interface Body {
  query: string;
  count?: number;
}

// Powers live venue grounding for Swap/Add alternatives (POC_followup_prompt.md item 5) —
// same Places service and field mask as Voyager Ask, just called from the client picker.
export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new Response("Invalid request", { status: 400 });
  }
  if (!body.query || !body.query.trim()) {
    return Response.json({ results: [] });
  }
  const results = await searchPlaces(body.query, Math.min(body.count ?? 3, 5));
  return Response.json({ results });
}
