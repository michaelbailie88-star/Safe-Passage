"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Stage = "loading" | "ask" | "not-sure" | "reflect" | "prayer" | "done" | "prior";

const REFLECTIONS = [
  "Everyone falls short of who they were made to be — you're not the exception. Can you be honest with yourself about that, the way Week 1 talked about?",
  "Do you believe Jesus died for what you've done, and rose again so you could be made new?",
  "Are you willing to turn your life over to Him — not perfectly, not all at once, just honestly, starting today?",
];

const PRAYER_TEXT =
  "God, I know I've fallen short — I don't need to pretend otherwise with You. I believe Jesus died for what I've done and rose again so I could be made new. I'm turning my life over to You — not perfectly, just honestly, starting today. Thank You for meeting me exactly where I am. Amen.";

export function FaithDeclaration({ userId }: { userId: string }) {
  const [stage, setStage] = useState<Stage>("loading");
  const [declaredAt, setDeclaredAt] = useState<string | null>(null);
  const [reflectionStep, setReflectionStep] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("faith_declared_at, faith_prior_acceptance")
        .eq("id", userId)
        .single();

      if (data?.faith_declared_at) {
        setDeclaredAt(data.faith_declared_at);
        setStage("done");
      } else if (data?.faith_prior_acceptance) {
        setStage("prior");
      } else {
        setStage("ask");
      }
    }
    load();
  }, [userId]);

  async function handlePriorAcceptance() {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("profiles").update({ faith_prior_acceptance: true }).eq("id", userId);
    setSaving(false);
    setStage("prior");
  }

  async function handlePrayed() {
    setSaving(true);
    const supabase = createClient();
    const now = new Date().toISOString();
    await supabase.from("profiles").update({ faith_declared_at: now }).eq("id", userId);
    setDeclaredAt(now);
    setSaving(false);
    setStage("done");
  }

  if (stage === "loading") return null;

  if (stage === "done") {
    return (
      <div className="mx-4 sm:mx-auto mt-8 max-w-2xl rounded-2xl border border-beam-500/30 bg-beam-500/5 p-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-beam-400">
          Your declaration
        </p>
        <p className="mt-3 text-sm italic leading-relaxed text-fog-300">
          &ldquo;{PRAYER_TEXT}&rdquo;
        </p>
        {declaredAt && (
          <p className="mt-3 text-xs text-fog-500">
            {new Date(declaredAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>
    );
  }

  if (stage === "prior") {
    return (
      <div className="mx-4 sm:mx-auto mt-8 max-w-2xl rounded-2xl border border-storm-700 bg-storm-800/40 p-6 text-center">
        <p className="text-sm text-fog-300">
          Good. That&rsquo;s the foundation everything else in this course
          builds on.
        </p>
      </div>
    );
  }

  if (stage === "not-sure") {
    return (
      <div className="mx-4 sm:mx-auto mt-8 max-w-2xl rounded-2xl border border-storm-700 bg-storm-800/40 p-6 text-center">
        <p className="text-sm text-fog-300">
          That&rsquo;s alright — this isn&rsquo;t something to force. Keep
          going through the course. The offer&rsquo;s here whenever
          you&rsquo;re ready, no deadline on it.
        </p>
        <button
          type="button"
          onClick={() => setStage("reflect")}
          className="relative z-40 mt-4 text-sm text-beam-400 underline underline-offset-2"
        >
          Actually, I&rsquo;d like to now
        </button>
      </div>
    );
  }

  if (stage === "reflect") {
    const isLast = reflectionStep === REFLECTIONS.length - 1;
    return (
      <div className="mx-4 sm:mx-auto mt-8 max-w-2xl rounded-2xl border border-storm-700 bg-storm-800/40 p-6">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
          {reflectionStep + 1} of {REFLECTIONS.length}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-mist-100">
          {REFLECTIONS[reflectionStep]}
        </p>
        <button
          type="button"
          onClick={() =>
            isLast ? setStage("prayer") : setReflectionStep((s) => s + 1)
          }
          className="relative z-40 mt-5 rounded-full bg-[#E5A526] px-6 py-3 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B]"
        >
          {isLast ? "Continue" : "Yes"}
        </button>
      </div>
    );
  }

  if (stage === "prayer") {
    return (
      <div className="mx-4 sm:mx-auto mt-8 max-w-2xl rounded-2xl border border-storm-700 bg-storm-800/40 p-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
          If you mean it, pray this
        </p>
        <p className="mt-3 text-sm italic leading-relaxed text-mist-100">
          &ldquo;{PRAYER_TEXT}&rdquo;
        </p>
        <button
          type="button"
          onClick={handlePrayed}
          disabled={saving}
          className="relative z-40 mt-5 rounded-full bg-[#E5A526] px-6 py-3 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B] disabled:opacity-50"
        >
          {saving ? "…" : "I prayed this"}
        </button>
      </div>
    );
  }

  // stage === "ask"
  return (
    <div className="mx-4 sm:mx-auto mt-8 max-w-2xl rounded-2xl border border-storm-700 bg-storm-800/40 p-6 text-center">
      <h3 className="font-display text-lg italic text-mist-50">
        Have you ever accepted Jesus?
      </h3>
      <p className="mt-2 text-sm text-fog-300">
        Not a test, no wrong answer here. Just honest.
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={handlePriorAcceptance}
          disabled={saving}
          className="relative z-40 rounded-full border border-storm-700 px-5 py-2.5 text-sm text-mist-100 transition hover:border-fog-500/50 disabled:opacity-50"
        >
          I already have
        </button>
        <button
          type="button"
          onClick={() => setStage("not-sure")}
          className="relative z-40 rounded-full border border-storm-700 px-5 py-2.5 text-sm text-mist-100 transition hover:border-fog-500/50"
        >
          I&rsquo;m not sure
        </button>
        <button
          type="button"
          onClick={() => setStage("reflect")}
          className="relative z-40 rounded-full bg-[#E5A526] px-5 py-2.5 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B]"
        >
          I&rsquo;d like to now
        </button>
      </div>
    </div>
  );
}
