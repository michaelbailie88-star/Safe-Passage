import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { embed } from "@/lib/listener/voyage";

/**
 * Visit this once (signed in as admin) after VOYAGE_API_KEY is set in
 * Vercel, to generate embeddings for every trigger phrase currently in
 * listener_responses. Safe to re-run: it only embeds responses that
 * don't already have embeddings (so adding new content later and
 * re-visiting this URL only costs tokens for the new rows, not a full
 * re-embed of everything).
 */
export async function POST() {
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

    const admin = createAdminClient();

    // Only responses with no rows yet in listener_trigger_embeddings —
    // this is what makes re-running safe after adding new content later.
    const { data: alreadyEmbedded, error: existingError } = await admin
      .from("listener_trigger_embeddings")
      .select("response_id");

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }

    const embeddedResponseIds = new Set((alreadyEmbedded ?? []).map((r) => r.response_id));

    const { data: responses, error: fetchError } = await admin
      .from("listener_responses")
      .select("id, trigger_examples")
      .eq("is_active", true);

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const pending = (responses ?? []).filter((r) => !embeddedResponseIds.has(r.id));

    if (pending.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Nothing to embed — every active response already has embeddings.",
        embedded: 0,
      });
    }

    // Flatten to (response_id, trigger_text) pairs, keeping order aligned
    // so the returned embedding vectors can be matched back correctly.
    const pairs: { response_id: string; trigger_text: string }[] = [];
    for (const r of pending) {
      for (const trigger of r.trigger_examples as string[]) {
        pairs.push({ response_id: r.id, trigger_text: trigger });
      }
    }

    const vectors = await embed(
      pairs.map((p) => p.trigger_text),
      "document"
    );

    const rows = pairs.map((p, i) => ({
      response_id: p.response_id,
      trigger_text: p.trigger_text,
      embedding: JSON.stringify(vectors[i]),
    }));

    const { error: insertError } = await admin.from("listener_trigger_embeddings").insert(rows);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      responsesEmbedded: pending.length,
      triggerPhrasesEmbedded: rows.length,
    });
  } catch (err) {
    console.error("Seed embeddings error:", err);
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
