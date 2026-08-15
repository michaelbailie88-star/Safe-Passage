import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { matchMessage } from "@/lib/listener/match";

const MAX_MESSAGE_LENGTH = 2000;

const FALLBACK_TEXT =
  "I don't have a good answer ready for that one — I only work from things that have already been thought through carefully, so I'd rather say that honestly than guess. If you head to the Resources page, there's a lot there that might actually help. And if this is urgent, please don't wait on me — reach out to someone directly.";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const body = (await request.json()) as { sessionId: string | null; message: string };
    const message = (body.message ?? "").trim();

    if (!message) {
      return NextResponse.json({ error: "Message can't be empty." }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: "That message is too long." }, { status: 400 });
    }

    let sessionId = body.sessionId;

    if (sessionId) {
      // RLS already scopes this to the caller's own sessions — an
      // empty result here means either it doesn't exist or it isn't
      // theirs, and those should be indistinguishable to the client.
      const { data: existing, error: sessionLookupError } = await supabase
        .from("listener_sessions")
        .select("id")
        .eq("id", sessionId)
        .maybeSingle();

      if (sessionLookupError) throw sessionLookupError;
      if (!existing) {
        return NextResponse.json({ error: "Session not found." }, { status: 404 });
      }
    } else {
      const { data: newSession, error: createError } = await supabase
        .from("listener_sessions")
        .insert({ user_id: user.id })
        .select("id")
        .single();

      if (createError) throw createError;
      sessionId = newSession.id;
    }

    const { error: userMessageError } = await supabase
      .from("listener_messages")
      .insert({ session_id: sessionId, role: "user", content: message });

    if (userMessageError) throw userMessageError;

    const result = await matchMessage(message);

    let responseText: string;
    let crisisType: string | null = null;
    let matchedResponseId: string | null = null;
    let matchConfidence: number | null = null;
    let flagged: boolean;
    let flagReason: string | null;

    if (result.matched) {
      responseText = result.responseText;
      crisisType = result.crisisType;
      matchedResponseId = result.responseId;
      matchConfidence = result.similarity;
      flagged = result.lowConfidence;
      flagReason = result.lowConfidence ? "low_confidence_match" : null;
    } else {
      responseText = FALLBACK_TEXT;
      flagged = true;
      // "no_candidates" and "below_threshold" are internal match.ts
      // reason codes — the flag_reason column's check constraint only
      // allows "no_match" for this case (also: "crisis_detected",
      // "low_confidence_match", "manual_review" for other cases).
      flagReason = "no_match";
    }

    const { error: assistantMessageError } = await supabase.from("listener_messages").insert({
      session_id: sessionId,
      role: "listener",
      content: responseText,
      matched_response_id: matchedResponseId,
      match_confidence: matchConfidence,
      flagged,
      flag_reason: flagReason,
    });

    if (assistantMessageError) throw assistantMessageError;

    const { error: touchError } = await supabase
      .from("listener_sessions")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", sessionId);

    if (touchError) throw touchError;

    let resources: { label: string; href: string }[] = [];
    if (crisisType) {
      const { data: resourceRows, error: resourcesError } = await supabase
        .from("listener_crisis_resources")
        .select("label, href")
        .eq("crisis_type", crisisType)
        .order("display_order");

      if (resourcesError) throw resourcesError;
      resources = resourceRows ?? [];
    }

    return NextResponse.json({ sessionId, responseText, crisisType, resources });
  } catch (err) {
    console.error("Listener message error:", err);
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
