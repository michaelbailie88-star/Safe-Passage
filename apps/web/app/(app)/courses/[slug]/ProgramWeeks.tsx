"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Program } from "@/lib/courses";

export function ProgramWeeks({
  program,
  userId,
}: {
  program: Program;
  userId: string;
}) {
  const [completedWeeks, setCompletedWeeks] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [pendingWeek, setPendingWeek] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("program_progress")
      .select("week_number")
      .eq("user_id", userId)
      .eq("program_slug", program.slug)
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          setError("Couldn't load your progress. Try refreshing.");
        } else if (data) {
          setCompletedWeeks(new Set(data.map((row) => row.week_number)));
        }
        setLoading(false);
      });
  }, [program.slug, userId]);

  async function toggleWeek(weekNumber: number) {
    setPendingWeek(weekNumber);
    setError("");
    const supabase = createClient();
    const isDone = completedWeeks.has(weekNumber);

    if (isDone) {
      const { error: deleteError } = await supabase
        .from("program_progress")
        .delete()
        .eq("user_id", userId)
        .eq("program_slug", program.slug)
        .eq("week_number", weekNumber);

      if (deleteError) {
        setError("Couldn't update. Try again.");
      } else {
        setCompletedWeeks((prev) => {
          const next = new Set(prev);
          next.delete(weekNumber);
          return next;
        });
      }
    } else {
      const { error: insertError } = await supabase
        .from("program_progress")
        .insert({ user_id: userId, program_slug: program.slug, week_number: weekNumber });

      if (insertError) {
        setError("Couldn't update. Try again.");
      } else {
        setCompletedWeeks((prev) => new Set(prev).add(weekNumber));
      }
    }
    setPendingWeek(null);
  }

  const isComplete = completedWeeks.size >= 8;

  return (
    <div className="mt-10 space-y-5">
      {loading && (
        <p className="text-center text-sm text-fog-300">Loading your progress…</p>
      )}

      {error && (
        <p role="alert" className="text-center text-sm text-red-400">
          {error}
        </p>
      )}

      {isComplete && !loading && (
        <div className="rounded-2xl border border-beam-500/40 bg-beam-500/10 p-6 text-center">
          <p className="font-display text-lg italic text-mist-50">
            You completed {program.name}.
          </p>
          <p className="mt-2 text-sm text-fog-300">
            The comeback is always greater than the setback. That&rsquo;s
            worth marking.
          </p>
          <a
            href={`/api/certificate/${program.slug}`}
            className="relative z-40 mt-5 inline-block rounded-full bg-[#E5A526] px-6 py-3 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B]"
          >
            Download your certificate
          </a>
        </div>
      )}

      {!loading &&
        program.weeks.map((week) => {
          const done = completedWeeks.has(week.weekNumber);
          return (
            <div
              key={week.weekNumber}
              className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-xs text-fog-500">
                    Week {week.weekNumber}
                  </span>
                  <h2 className="mt-1 font-display text-lg italic text-mist-50">
                    {week.title}
                  </h2>
                  <p className="mt-1 text-xs uppercase tracking-wide text-beam-400">
                    {week.mission}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleWeek(week.weekNumber)}
                  disabled={pendingWeek === week.weekNumber}
                  className={`relative z-40 shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition disabled:opacity-60 ${
                    done
                      ? "border border-signal-500/40 bg-signal-500/10 text-signal-400"
                      : "bg-[#E5A526] text-[#080D16] hover:bg-[#F2B84B]"
                  }`}
                >
                  {pendingWeek === week.weekNumber
                    ? "…"
                    : done
                    ? "Completed"
                    : "Mark complete"}
                </button>
              </div>

              {week.body && (
                <p className="mt-4 text-sm leading-relaxed text-fog-300">
                  {week.body}
                </p>
              )}

              {week.scripture && week.scripture.length > 0 && (
                <div className="mt-4 space-y-2 border-l-2 border-beam-500/40 pl-4">
                  {week.scripture.map((s) => (
                    <p key={s.reference} className="text-sm italic text-mist-100">
                      &ldquo;{s.text}&rdquo;{" "}
                      <span className="not-italic text-beam-400">
                        — {s.reference}
                      </span>
                    </p>
                  ))}
                </div>
              )}

              {week.story && (
                <p className="mt-4 text-sm leading-relaxed text-fog-300">
                  <span className="font-semibold text-mist-100">Story: </span>
                  {week.story}
                </p>
              )}

              <ul className="mt-4 space-y-1.5 text-sm text-fog-300">
                {week.tasks.map((task, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-beam-400">–</span>
                    {task}
                  </li>
                ))}
              </ul>

              <div className="mt-4 rounded-xl border border-storm-700 bg-storm-900/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-signal-400">
                  Note from Michael
                </p>
                <p className="mt-2 text-sm italic leading-relaxed text-fog-300">
                  {week.noteFromMichael}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
}
