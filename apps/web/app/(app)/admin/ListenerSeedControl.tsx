"use client";

import { useState } from "react";

export function ListenerSeedControl() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSeed() {
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/listener/seed-embeddings", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }
      setStatus("done");
      setMessage(
        data.embedded === 0
          ? data.message
          : `Embedded ${data.triggerPhrasesEmbedded} trigger phrases across ${data.responsesTouched} responses.`
      );
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Network error.");
    }
  }

  return (
    <div className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6">
      <h2 className="font-display text-lg italic text-mist-50">The Listener</h2>
      <p className="mt-2 text-sm leading-relaxed text-fog-300">
        Generates embeddings for any listener_responses that don&apos;t have them yet. Safe to
        run again after adding new content — it only embeds what&apos;s new.
      </p>
      <button
        onClick={handleSeed}
        disabled={status === "loading"}
        className="mt-4 rounded-full bg-[#E5A526] px-5 py-2 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B] disabled:opacity-50"
      >
        {status === "loading" ? "Embedding…" : "Seed embeddings"}
      </button>
      {message && (
        <p
          className={`mt-3 text-sm ${status === "error" ? "text-rose-400" : "text-fog-300"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
