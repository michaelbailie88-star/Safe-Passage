import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { embed } from "@/lib/listener/voyage";

/**
 * Visit this once (signed in as admin) after VOYAGE_API_KEY is set in
 * Vercel, to generate embeddings for every trigger phrase currently in
 * listener_responses. Safe to re-run: it diffs each response's current
 * trigger_examples against what's already embedded for that response
 * and only embeds the phrases that are missing — so adding new phrases
 * to an already-seeded response, or adding a brand-new response, both
 * work correctly on re-run without re-embedding anything that already
 * has a vector.
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

    // Per-response, per-phrase diff — not just "has this response ever
    // been embedded." A response can gain new trigger_examples after
    // its first seed pass; this makes sure those new phrases still get
    // embedded, while phrases already embedded are never redone.
    const { data: existingEmbeddings, error: existingError } = await admin
      .from("listener_trigger_embeddings")
      .select("response_id, trigger_text");

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }

    const embeddedPhraseKeys = new Set(
      (existingEmbeddings ?? []).map((r) => `${r.response_id}::${r.trigger_text}`)
    );

    const { data: responses, error: fetchError } = await admin
      .from("listener_responses")
      .select("id, trigger_examples")
      .eq("is_active", true);

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const pairs: { response_id: string; trigger_text: string }[] = [];
    for (const r of responses ?? []) {
      for (const trigger of r.trigger_examples as string[]) {
        if (!embeddedPhraseKeys.has(`${r.id}::${trigger}`)) {
          pairs.push({ response_id: r.id, trigger_text: trigger });
        }
      }
    }

    if (pairs.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Nothing to embed — every trigger phrase on every active response already has an embedding.",
        embedded: 0,
      });
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

    const respondedResponseIds = new Set(pairs.map((p) => p.response_id));

    return NextResponse.json({
      success: true,
      responsesTouched: respondedResponseIds.size,
      triggerPhrasesEmbedded: rows.length,
    });
  } catch (err) {
    console.error("Seed embeddings error:", err);
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
