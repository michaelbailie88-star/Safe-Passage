import { NextResponse } from "next/server";

// Vercel injects these on every request in production — no third-party
// geolocation service, no extra tracking beyond what's already there by
// default. Returns null values locally/off-Vercel, where these headers
// don't exist.
export async function GET(request: Request) {
  const country = request.headers.get("x-vercel-ip-country");
  const city = request.headers.get("x-vercel-ip-city");

  return NextResponse.json({
    country: country || null,
    city: city ? decodeURIComponent(city) : null,
  });
}
