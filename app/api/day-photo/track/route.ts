import { NextRequest } from "next/server";
import { trackUnsplashDownload } from "@/lib/unsplash-service";

export const runtime = "nodejs";
export const maxDuration = 10;

interface Body {
  downloadLocation?: string;
}

// Unsplash's API terms require pinging download_location whenever a fetched photo is
// actually displayed to a user — this proxies that ping server-side (item 13).
export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new Response("Invalid request", { status: 400 });
  }
  if (body.downloadLocation) {
    await trackUnsplashDownload(body.downloadLocation);
  }
  return Response.json({ ok: true });
}
