import { createAdminClient } from "@/lib/supabase/admin";
import { embedOne } from "./voyage";

// Deliberately asymmetric. A missed crisis disclosure is the one
// failure mode in this whole feature that actually matters — a
// borderline crisis match costs nothing (worst case: a slightly-off but
// still safe, still-never-advises response, plus the real resource
// links). A borderline general-topic match costs more relatively
// speaking (a confidently-wrong-feeling reply to an ordinary question),
// so that bar stays higher. Both are starting points — tune once real
// message data exists to calibrate against, not treated as final.
const CRISIS_THRESHOLD = 0.55;
const GENERAL_THRESHOLD = 0.72;

export type MatchResult =
  | {
      matched: true;
      responseId: string;
      responseText: string;
      category: string;
      crisisType: string | null;
      similarity: number;
      lowConfidence: boolean; // true = matched, but below the "confident" line — still returned, but worth flagging for review
    }
  | {
      matched: false;
      reason: "no_candidates" | "below_threshold";
      // Diagnostic only — the closest candidate found, even though it
      // didn't clear the bar. Never shown to end users, exists so the
      // matcher's behavior can be inspected/tuned against real threshold
      // numbers instead of guessing why something didn't match.
      bestCandidate?: { similarity: number; threshold: number; category: string; crisisType: string | null };
    };

/**
 * Given a live user message, finds the best pre-written listener
 * response. Never generates text — only ever returns a response that
 * already exists as a row in listener_responses.
 */
export async function matchMessage(userMessage: string): Promise<MatchResult> {
  const admin = createAdminClient();

  const queryEmbedding = await embedOne(userMessage, "query");

  const { data: candidates, error } = await admin.rpc("match_listener_trigger", {
    query_embedding: JSON.stringify(queryEmbedding),
    match_count: 5,
  });

  if (error) throw new Error(`match_listener_trigger RPC failed: ${error.message}`);
  if (!candidates || candidates.length === 0) {
    return { matched: false, reason: "no_candidates" };
  }

  // Multiple trigger phrases can point to the same response (that's the
  // point of having several per response) — dedupe to the single best
  // similarity score per response_id before picking a winner.
  const bestByResponse = new Map<string, number>();
  for (const c of candidates as { response_id: string; similarity: number }[]) {
    const current = bestByResponse.get(c.response_id);
    if (current === undefined || c.similarity > current) {
      bestByResponse.set(c.response_id, c.similarity);
    }
  }

  const responseIds = [...bestByResponse.keys()];
  const { data: responses, error: responsesError } = await admin
    .from("listener_responses")
    .select("id, response_text, category, crisis_type")
    .in("id", responseIds)
    .eq("is_active", true);

  if (responsesError) throw new Error(`Failed to load matched responses: ${responsesError.message}`);
  if (!responses || responses.length === 0) {
    return { matched: false, reason: "no_candidates" };
  }

  // Rank by similarity, but a crisis-category candidate wins over a
  // general one even at a lower raw score, provided it still clears the
  // (lower) crisis threshold — a message that's ambiguous between "this
  // sounds like financial stress" and "this sounds like a crisis
  // disclosure" should resolve toward the safer read.
  let best: { id: string; text: string; category: string; crisisType: string | null; similarity: number; threshold: number } | null = null;

  // Diagnostic only, tracked in parallel — the single closest candidate
  // by raw similarity regardless of whether it cleared its threshold.
  // Does not participate in winner selection above in any way.
  let closestOverall: { similarity: number; threshold: number; category: string; crisisType: string | null } | null = null;

  for (const r of responses) {
    const rawSimilarity = bestByResponse.get(r.id)!;
    const rawThreshold = r.category === "crisis" ? CRISIS_THRESHOLD : GENERAL_THRESHOLD;
    if (!closestOverall || rawSimilarity > closestOverall.similarity) {
      closestOverall = { similarity: rawSimilarity, threshold: rawThreshold, category: r.category, crisisType: r.crisis_type };
    }
  }

  for (const r of responses) {
    const similarity = bestByResponse.get(r.id)!;
    const threshold = r.category === "crisis" ? CRISIS_THRESHOLD : GENERAL_THRESHOLD;
    if (similarity < threshold) continue;

    const isCrisis = r.category === "crisis";
    const bestIsCrisis = best?.category === "crisis";

    if (!best) {
      best = { id: r.id, text: r.response_text, category: r.category, crisisType: r.crisis_type, similarity, threshold };
    } else if (isCrisis && !bestIsCrisis) {
      best = { id: r.id, text: r.response_text, category: r.category, crisisType: r.crisis_type, similarity, threshold };
    } else if (isCrisis === bestIsCrisis && similarity > best.similarity) {
      best = { id: r.id, text: r.response_text, category: r.category, crisisType: r.crisis_type, similarity, threshold };
    }
  }

  if (!best) {
    return { matched: false, reason: "below_threshold", bestCandidate: closestOverall ?? undefined };
  }

  // "Confident" means comfortably clear of the threshold, not just
  // technically over it — a match sitting right at the line is worth
  // surfacing for review even though it's still shown to the user.
  const lowConfidence = best.similarity < best.threshold + 0.08;

  return {
    matched: true,
    responseId: best.id,
    responseText: best.text,
    category: best.category,
    crisisType: best.crisisType,
    similarity: best.similarity,
    lowConfidence,
  };
}
