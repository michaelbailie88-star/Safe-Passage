"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { programs } from "@/lib/courses";

export function GuardianCard({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [guardianStatus, setGuardianStatus] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const supabase = createClient();
    const [{ data: progress }, { data: profile }] = await Promise.all([
      supabase.from("program_progress").select("program_slug, week_number").eq("user_id", userId),
      supabase.from("profiles").select("guardian_status").eq("id", userId).single(),
    ]);

    const weeksBySlug = new Map<string, Set<number>>();
    for (const row of progress ?? []) {
      const set = weeksBySlug.get(row.program_slug) ?? new Set<number>();
      set.add(row.week_number);
      weeksBySlug.set(row.program_slug, set);
    }
    const done = programs.filter((p) => (weeksBySlug.get(p.slug)?.size ?? 0) >= 8).length;

    setCompletedCount(done);
    setGuardianStatus(!!profile?.guardian_status);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function handleAccept() {
    setAccepting(true);
    setError("");
    const res = await fetch("/api/guardian/accept", { method: "POST" });
    if (res.ok) {
      setGuardianStatus(true);
    } else {
      setError("Couldn't confirm all six courses are complete. Try again.");
    }
    setAccepting(false);
  }

  async function handleShare() {
    try {
      const res = await fetch("/api/badge/guardian");
      const blob = await res.blob();
      const file = new File([blob], "safe-passage-guardian-badge.png", { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "A Guardian to the Still Lost",
          text: "I completed every Safe Passage program. This is my Guardian badge.",
        });
        return;
      }
    } catch {
      // fall through to download
    }

    // Fallback: direct download for browsers without the Web Share API
    // (or that don't support sharing files, e.g. most desktop browsers).
    const a = document.createElement("a");
    a.href = "/api/badge/guardian";
    a.download = "safe-passage-guardian-badge.png";
    a.click();
  }

  if (loading) return null;

  if (guardianStatus) {
    return (
      <div className="rounded-2xl border border-beam-500/40 bg-beam-500/5 p-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-beam-400">Guardian</p>
        <h2 className="mt-3 font-display text-xl italic text-mist-50">
          A Guardian to the Still Lost.
        </h2>
        <p className="mt-2 text-sm text-fog-300">
          You completed all six programs and accepted the mission. Your
          badge is yours to keep and share.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/api/badge/guardian"
          alt="Guardian badge"
          className="mx-auto mt-5 h-40 w-40 rounded-full"
        />
        <button
          type="button"
          onClick={handleShare}
          className="relative z-40 mt-5 inline-block rounded-full bg-[#E5A526] px-6 py-3 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B]"
        >
          Share your badge
        </button>
      </div>
    );
  }

  if (completedCount >= 6) {
    return (
      <div className="rounded-2xl border border-beam-500/40 bg-beam-500/5 p-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-beam-400">
          Mission available
        </p>
        <h2 className="mt-3 font-display text-xl italic text-mist-50">
          Because you've shown such honour and bravery in completing these
          tasks, it is now your duty to be a guardian for the next who is
          also lost out there.
        </h2>
        <button
          type="button"
          onClick={handleAccept}
          disabled={accepting}
          className="relative z-40 mt-5 inline-block rounded-full bg-[#E5A526] px-6 py-3 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B] disabled:opacity-50"
        >
          {accepting ? "Confirming…" : "Accept the mission"}
        </button>
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6 text-left">
      <h2 className="font-display text-lg italic text-mist-50">Guardian status</h2>
      <p className="mt-1 text-sm text-fog-300">
        Complete all six programs to earn your Guardian badge and the
        chance to guide the next man who's still lost.
      </p>
      <p className="mt-4 font-display text-2xl text-signal-400">
        {completedCount} of 6 complete
      </p>
    </div>
  );
}
