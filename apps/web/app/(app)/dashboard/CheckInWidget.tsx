"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const MOODS = [
  { value: 1, emoji: "😞", label: "Rough" },
  { value: 2, emoji: "😕", label: "Low" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Great" },
];

function todayDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function calculateStreak(dates: string[]): number {
  let streak = 0;
  const sorted = [...dates].sort().reverse();
  const today = todayDateString();
  let cursor = today;
  for (const d of sorted) {
    if (d === cursor) {
      streak++;
      const prev = new Date(cursor);
      prev.setDate(prev.getDate() - 1);
      cursor = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}-${String(
        prev.getDate()
      ).padStart(2, "0")}`;
    } else {
      break;
    }
  }
  return streak;
}

export function CheckInWidget({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [savedToday, setSavedToday] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const [streak, setStreak] = useState(0);

  async function loadCheckins() {
    const supabase = createClient();
    const { data } = await supabase
      .from("daily_checkins")
      .select("checkin_date, mood, note")
      .eq("user_id", userId)
      .order("checkin_date", { ascending: false })
      .limit(90);

    if (data) {
      setStreak(calculateStreak(data.map((d) => d.checkin_date)));
      const todayRow = data.find((d) => d.checkin_date === todayDateString());
      if (todayRow) {
        setMood(todayRow.mood);
        setNote(todayRow.note ?? "");
        setSavedToday(true);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCheckins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function handleSave() {
    if (mood === null) return;
    setSaving(true);
    setError("");
    setJustSaved(false);
    const supabase = createClient();
    const wasAlreadySavedToday = savedToday;
    const { error: upsertError } = await supabase.from("daily_checkins").upsert(
      {
        user_id: userId,
        checkin_date: todayDateString(),
        mood,
        note: note || null,
      },
      { onConflict: "user_id,checkin_date" }
    );
    if (upsertError) {
      setError("Couldn't save your check-in. Try again.");
    } else {
      setSavedToday(true);
      setJustSaved(true);
      if (!wasAlreadySavedToday) {
        setStreak((prev) => prev + 1);
      }
      setTimeout(() => setJustSaved(false), 3000);
    }
    setSaving(false);
  }

  if (loading) {
    return <p className="text-sm text-fog-300">Loading today&rsquo;s check-in…</p>;
  }

  return (
    <div className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6 text-left">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg italic text-mist-50">Daily check-in</h2>
        {streak > 0 && (
          <span className="shrink-0 rounded-full border border-beam-500/40 bg-beam-500/10 px-3 py-1 text-xs font-semibold text-beam-400">
            🔥 {streak} day{streak === 1 ? "" : "s"}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-fog-300">
        {savedToday ? "You've checked in today." : "How are you doing today?"}
      </p>

      <div className="mt-4 flex justify-between gap-2">
        {MOODS.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setMood(m.value)}
            className={`flex flex-1 flex-col items-center gap-1 rounded-xl border py-3 text-2xl transition ${
              mood === m.value
                ? "border-beam-500 bg-beam-500/10"
                : "border-storm-700 hover:border-fog-500/50"
            }`}
          >
            <span>{m.emoji}</span>
            <span className="text-[10px] text-fog-300">{m.label}</span>
          </button>
        ))}
      </div>

      <label htmlFor="checkin-note" className="mt-4 block text-xs font-medium text-fog-300">
        Anything on your mind? (optional)
      </label>
      <textarea
        id="checkin-note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        className="mt-2 w-full rounded-xl border border-storm-700 bg-storm-800/60 px-4 py-2 text-sm text-mist-100 placeholder:text-fog-500 focus:border-beam-500"
        placeholder="A word or two is enough."
      />

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}

      {justSaved && (
        <p role="status" className="mt-2 text-sm text-signal-400">
          ✓ Your check-in has been saved.
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={mood === null || saving}
        className="relative z-40 mt-4 rounded-full bg-[#E5A526] px-5 py-2 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B] disabled:opacity-50"
      >
        {saving ? "Saving…" : savedToday ? "Update check-in" : "Save check-in"}
      </button>
    </div>
  );
}
