import { NextRequest } from "next/server";
import { searchDayPhoto } from "@/lib/unsplash-service";

export const runtime = "nodejs";
export const maxDuration = 15;

// Serves a hero photo for a day card (POC_followup_prompt.md item 13). GET + query string so
// the response can ride normal HTTP caching, unlike the POST-only Places routes.
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") ?? "";
  if (!query.trim()) return Response.json({ photo: null });
  const photo = await searchDayPhoto(query);
  return Response.json({ photo });
}
