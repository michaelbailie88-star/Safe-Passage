import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { programs } from "@/lib/courses";

export async function POST() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    // Re-verify server-side rather than trusting the client — all 6
    // courses, all 8 weeks each.
    const { data: progress } = await supabase
      .from("program_progress")
      .select("program_slug, week_number")
      .eq("user_id", user.id);

    const weeksBySlug = new Map<string, Set<number>>();
    for (const row of progress ?? []) {
      const set = weeksBySlug.get(row.program_slug) ?? new Set<number>();
      set.add(row.week_number);
      weeksBySlug.set(row.program_slug, set);
    }

    const allComplete = programs.every((p) => (weeksBySlug.get(p.slug)?.size ?? 0) >= 8);

    if (!allComplete) {
      return NextResponse.json(
        { error: "Not all six courses are complete yet" },
        { status: 403 }
      );
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ guardian_status: true, guardian_accepted_at: new Date().toISOString() })
      .eq("id", user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Guardian accept error:", err);
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
