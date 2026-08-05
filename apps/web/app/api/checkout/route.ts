import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";
import { PREMIUM_MONTHLY_PRICE_ID, PREMIUM_YEARLY_PRICE_ID } from "@/lib/stripe/price-ids";

const ALLOWED_PRICE_IDS = [PREMIUM_MONTHLY_PRICE_ID, PREMIUM_YEARLY_PRICE_ID];

export async function POST(request: Request) {
  try {
    const { priceId } = await request.json();

    if (!ALLOWED_PRICE_IDS.includes(priceId)) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const origin = request.headers.get("origin") ?? new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/upgrade?checkout=cancelled`,
      metadata: { supabase_user_id: user.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Surface a real, readable error instead of letting the function crash
    // with an empty response body (which breaks res.json() on the client
    // with "Unexpected end of JSON input").
    console.error("Checkout error:", err);
    const message =
      err instanceof Error ? err.message : "Something went wrong creating checkout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
