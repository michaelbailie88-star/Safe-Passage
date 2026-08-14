// Thin wrapper around Voyage AI's embeddings endpoint. Server-only —
// never import this from a client component (uses VOYAGE_API_KEY).
//
// Anthropic doesn't offer its own embedding model and officially
// recommends Voyage AI for this: https://platform.claude.com/docs/en/build-with-claude/embeddings
//
// input_type matters for retrieval quality per Voyage's own guidance:
// "document" for text going INTO the database (trigger phrases),
// "query" for the live message being matched AGAINST it. Mixing these
// up doesn't error, it just quietly gives worse matches.

const VOYAGE_MODEL = "voyage-4";
const EMBEDDING_DIMENSION = 1024; // must match listener_trigger_embeddings.embedding

type VoyageInputType = "document" | "query";

type VoyageResponse = {
  data: { embedding: number[]; index: number }[];
  model: string;
  usage: { total_tokens: number };
};

/**
 * Embeds one or more texts. Voyage accepts up to 128 inputs per request,
 * so this batches internally if given more than that.
 */
export async function embed(texts: string[], inputType: VoyageInputType): Promise<number[][]> {
  if (texts.length === 0) return [];

  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "VOYAGE_API_KEY is not set. Add it in Vercel: Project -> Settings -> Environment Variables."
    );
  }

  const BATCH_SIZE = 128;
  const results: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    const res = await fetch("https://api.voyageai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input: batch,
        model: VOYAGE_MODEL,
        input_type: inputType,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Voyage embeddings request failed (${res.status}): ${errText}`);
    }

    const json = (await res.json()) as VoyageResponse;
    // Voyage returns results in the same order as the input, with an
    // `index` field as a safety check -- sort defensively rather than
    // trusting array order alone.
    const sorted = [...json.data].sort((a, b) => a.index - b.index);

    for (const item of sorted) {
      if (item.embedding.length !== EMBEDDING_DIMENSION) {
        throw new Error(
          `Unexpected embedding dimension: got ${item.embedding.length}, expected ${EMBEDDING_DIMENSION}. ` +
            `Voyage model/dimension config may have changed -- check listener_trigger_embeddings schema.`
        );
      }
      results.push(item.embedding);
    }
  }

  return results;
}

/** Convenience for the common single-text case (e.g. one live user message). */
export async function embedOne(text: string, inputType: VoyageInputType): Promise<number[]> {
  const [vec] = await embed([text], inputType);
  return vec;
}
