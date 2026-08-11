import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Vercel sets these on every request at the edge — free, no
      // third-party geolocation service, no extra tracking beyond what
      // the platform already provides by default. Only set once (never
      // overwrite), since this route can fire again on future magic-link
      // sign-ins and we don't want a VPN/travel day to silently rewrite
      // someone's recorded location.
      const country = request.headers.get("x-vercel-ip-country");
      const city = request.headers.get("x-vercel-ip-city");
      if (country || city) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("country, city")
            .eq("id", user.id)
            .single();
          if (profile && !profile.country && !profile.city) {
            await supabase
              .from("profiles")
              .update({
                country: country ? decodeURIComponent(country) : null,
                city: city ? decodeURIComponent(city) : null,
              })
              .eq("id", user.id);
          }
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/sign-in?error=auth_callback_failed`);
}
