import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const { data: requester } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!requester?.is_admin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { userId, level, reason } = await request.json();

    if (!userId || ![1, 2, 3].includes(level)) {
      return NextResponse.json({ error: "Invalid strike data" }, { status: 400 });
    }

    const admin = createAdminClient();

    const { error: insertError } = await admin.from("community_strikes").insert({
      user_id: userId,
      level,
      reason: reason || "Community guidelines violation",
      issued_by: user.id,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // A level-3 strike (or reaching 3 total strikes) removes community access.
    const { count: strikeCount } = await admin
      .from("community_strikes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (level === 3 || (strikeCount ?? 0) >= 3) {
      await admin.from("profiles").update({ community_banned: true }).eq("id", userId);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Issue strike error:", err);
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
