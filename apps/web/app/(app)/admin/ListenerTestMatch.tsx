"use client";

import { useState } from "react";

const DEFAULT_TEST_SET = [
  "honestly I don't even know why I keep going",
  "sometimes I think about ending things",
  "I've been hurting my arms again",
  "my wife hit me last night",
  "I'm terrified I'm gonna snap on my girlfriend",
  "I think I took way too many of my pills",
  "fell off the wagon again last night, drank a whole bottle",
  "my anxiety has been through the roof, can't breathe sometimes",
  "haven't left my room in days, nothing feels real",
  "I really think I might snap on my son if this keeps up",
  "we're two months behind on the mortgage",
  "got handed a subpoena yesterday, no idea what to do",
  "I'm so stressed about money I don't even want to be here anymore",
  "I feel like such a failure as a dad",
  "what's today's Bible reading?",
  "how do I mark a habit as complete?",
  "I finished week 3 of the Purpose course",
  "just checking in, had a decent day today",
  "can you recommend a book on fatherhood?",
  "help",
  "I'm fine",
].join("\n");

type TestResult = {
  message: string;
  result:
    | {
        matched: true;
        responseId: string;
        responseText: string;
        category: string;
        crisisType: string | null;
        similarity: number;
        lowConfidence: boolean;
      }
    | {
        matched: false;
        reason: string;
        bestCandidate?: { similarity: number; threshold: number; category: string; crisisType: string | null };
      };
};

export function ListenerTestMatch() {
  const [input, setInput] = useState(DEFAULT_TEST_SET);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [results, setResults] = useState<TestResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    setStatus("loading");
    setError(null);
    const messages = input.split("\n").map((m) => m.trim()).filter(Boolean);
    try {
      const res = await fetch("/api/admin/listener/test-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setResults(data.results);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Network error.");
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-storm-700 bg-storm-800/40 p-6">
      <h2 className="font-display text-lg italic text-mist-50">Test the matcher</h2>
      <p className="mt-2 text-sm leading-relaxed text-fog-300">
        One message per line. Pre-loaded with a hard test set — paraphrased crisis language,
        ambiguous cross-category cases, and ordinary messages that should match nothing.
      </p>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={10}
        className="mt-4 w-full rounded-xl border border-storm-700 bg-storm-900/60 p-3 text-sm text-mist-100"
      />
      <button
        onClick={handleRun}
        disabled={status === "loading"}
        className="mt-4 rounded-full bg-[#E5A526] px-5 py-2 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B] disabled:opacity-50"
      >
        {status === "loading" ? "Running…" : "Run test set"}
      </button>
      {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
      {results.length > 0 && (
        <div className="mt-6 space-y-3">
          {results.map((r, i) => (
            <div key={i} className="rounded-xl border border-storm-700 bg-storm-900/40 p-4 text-sm">
              <p className="text-mist-100">
                <span className="text-fog-500">Message:</span> &quot;{r.message}&quot;
              </p>
              {r.result.matched ? (
                <>
                  <p className="mt-1 text-fog-300">
                    <span className="text-fog-500">Matched:</span>{" "}
                    <span className={r.result.category === "crisis" ? "text-rose-400" : "text-signal-400"}>
                      {r.result.category}
                      {r.result.crisisType ? ` / ${r.result.crisisType}` : ""}
                    </span>{" "}
                    — similarity {r.result.similarity.toFixed(3)}
                    {r.result.lowConfidence ? " (low confidence)" : ""}
                  </p>
                  <p className="mt-1 text-fog-500 italic">&quot;{r.result.responseText}&quot;</p>
                </>
              ) : (
                <>
                  <p className="mt-1 text-fog-500">No match ({r.result.reason})</p>
                  {r.result.bestCandidate && (
                    <p className="mt-1 text-xs text-fog-600">
                      Closest was {r.result.bestCandidate.category}
                      {r.result.bestCandidate.crisisType ? ` / ${r.result.bestCandidate.crisisType}` : ""} at{" "}
                      {r.result.bestCandidate.similarity.toFixed(3)} (needed {r.result.bestCandidate.threshold})
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
