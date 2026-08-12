"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type BadHabit = {
  id: string;
  name: string;
  started_at: string;
};

type ResetRow = {
  bad_habit_id: string;
  reset_at: string;
};

function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

function encouragementFor(days: number): string {
  if (days === 0) return "Day one starts now. That's the hardest step.";
  if (days < 7) return "Every day you add here is real. Keep going.";
  if (days < 30) return "A week-plus clean. That's not luck — that's you.";
  if (days < 90) return "A month and counting. This is who you're becoming.";
  if (days < 365) return "This is sustained change. Be proud of this.";
  return "A year or more. This is who you are now.";
}

export function BadHabitTracker({ userId }: { userId: string }) {
  const [habits, setHabits] = useState<BadHabit[]>([]);
  const [resets, setResets] = useState<ResetRow[]>([]);
  const [avgMoodBefore, setAvgMoodBefore] = useState<Record<string, number | null>>({});
  const [avgMoodDuring, setAvgMoodDuring] = useState<Record<string, number | null>>({});
  const [loading, setLoading] = useState(true);
  const [newHabitName, setNewHabitName] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function loadHabits() {
    const supabase = createClient();
    const { data: habitsData } = await supabase
      .from("bad_habits")
      .select("id, name, started_at")
      .eq("user_id", userId)
      .eq("archived", false)
      .order("created_at", { ascending: true });

    const { data: resetsData } = await supabase
      .from("bad_habit_resets")
      .select("bad_habit_id, reset_at")
      .eq("user_id", userId)
      .order("reset_at", { ascending: true });

    const { data: checkins } = await supabase
      .from("daily_checkins")
      .select("checkin_date, mood")
      .eq("user_id", userId);

    setHabits(habitsData ?? []);
    setResets(resetsData ?? []);

    // "What success has this given you": average mood in the 30 days
    // BEFORE each habit's current streak started, vs average mood DURING
    // the current streak. A free, built-in comparison — no premium gate,
    // since the whole point is showing someone their own progress.
    const beforeMap: Record<string, number | null> = {};
    const duringMap: Record<string, number | null> = {};
    for (const habit of habitsData ?? []) {
      const startDate = new Date(habit.started_at);
      const baselineStart = new Date(startDate);
      baselineStart.setDate(baselineStart.getDate() - 30);

      const beforeMoods = (checkins ?? [])
        .filter((c) => {
          const d = new Date(c.checkin_date);
          return d >= baselineStart && d < startDate;
        })
        .map((c) => c.mood);
      const duringMoods = (checkins ?? [])
        .filter((c) => new Date(c.checkin_date) >= startDate)
        .map((c) => c.mood);

      beforeMap[habit.id] = beforeMoods.length
        ? beforeMoods.reduce((a, b) => a + b, 0) / beforeMoods.length
        : null;
      duringMap[habit.id] = duringMoods.length
        ? duringMoods.reduce((a, b) => a + b, 0) / duringMoods.length
        : null;
    }
    setAvgMoodBefore(beforeMap);
    setAvgMoodDuring(duringMap);

    setLoading(false);
  }

  useEffect(() => {
    loadHabits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function handleAddHabit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    setAdding(true);
    setError("");
    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("bad_habits")
      .insert({ user_id: userId, name: newHabitName.trim() });

    if (insertError) {
      setError("Couldn't add that. Try again.");
    } else {
      setNewHabitName("");
      await loadHabits();
    }
    setAdding(false);
  }

  async function handleReset(habitId: string) {
    const confirmed = window.confirm(
      "Log a reset? Your streak count starts over from today. This isn't a failure — it's a data point, and you can start again right now."
    );
    if (!confirmed) return;

    const supabase = createClient();
    const now = new Date().toISOString();
    await supabase.from("bad_habit_resets").insert({
      bad_habit_id: habitId,
      user_id: userId,
      reset_at: now,
    });
    await supabase.from("bad_habits").update({ started_at: now }).eq("id", habitId);
    await loadHabits();
  }

  async function handleDeleteHabit(habitId: string, habitName: string) {
    const confirmed = window.confirm(`Delete "${habitName}"? This can't be undone.`);
    if (!confirmed) return;

    const supabase = createClient();
    await supabase.from("bad_habits").update({ archived: true }).eq("id", habitId);
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  }

  function longestStreakDays(habit: BadHabit): number {
    const habitResets = resets
      .filter((r) => r.bad_habit_id === habit.id)
      .map((r) => new Date(r.reset_at))
      .sort((a, b) => a.getTime() - b.getTime());

    if (habitResets.length === 0) {
      return daysBetween(new Date(habit.started_at), new Date());
    }

    // Gaps between consecutive resets are past streaks; the current
    // streak (since the last reset) is the final, still-open gap.
    let longest = 0;
    let prev: Date | null = null;
    for (const resetDate of habitResets) {
      if (prev) longest = Math.max(longest, daysBetween(prev, resetDate));
      prev = resetDate;
    }
    const currentStreak = daysBetween(new Date(habit.started_at), new Date());
    return Math.max(longest, currentStreak);
  }

  return (
    <div className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6 text-left">
      <h2 className="font-display text-lg italic text-mist-50">Habits & Addictions I'm Overcoming</h2>
      <p className="mt-1 text-sm text-fog-300">
        Track what you're walking away from — a habit, an addiction,
        anything you're done letting run your life. Every day since you
        started counts, even if today is day one.
      </p>

      {loading ? (
        <p className="mt-4 text-sm text-fog-300">Loading…</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {habits.length === 0 && (
            <li className="text-sm text-fog-500">Nothing tracked yet — add one below.</li>
          )}
          {habits.map((habit) => {
            const days = daysBetween(new Date(habit.started_at), new Date());
            const totalResets = resets.filter((r) => r.bad_habit_id === habit.id).length;
            const longest = longestStreakDays(habit);
            const before = avgMoodBefore[habit.id];
            const during = avgMoodDuring[habit.id];
            const isExpanded = expandedId === habit.id;

            return (
              <li key={habit.id} className="rounded-xl border border-storm-700 bg-storm-900/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-mist-100">{habit.name}</p>
                    <p className="mt-1 text-2xl font-display text-signal-400">
                      {days} day{days === 1 ? "" : "s"}
                    </p>
                    <p className="mt-1 text-xs text-fog-300">{encouragementFor(days)}</p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : habit.id)}
                      className="rounded-full border border-storm-700 px-3 py-1.5 text-xs text-fog-300 hover:border-fog-500/50"
                    >
                      {isExpanded ? "Hide" : "See progress"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReset(habit.id)}
                      className="rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                    >
                      I slipped
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteHabit(habit.id, habit.name)}
                      className="rounded-full border border-storm-700 px-3 py-1.5 text-xs text-fog-500 hover:border-red-500/40 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-storm-700/60 pt-4 text-xs sm:grid-cols-4">
                    <div>
                      <p className="text-fog-500">Current streak</p>
                      <p className="mt-1 font-display text-base text-mist-100">{days}d</p>
                    </div>
                    <div>
                      <p className="text-fog-500">Longest streak</p>
                      <p className="mt-1 font-display text-base text-mist-100">{longest}d</p>
                    </div>
                    <div>
                      <p className="text-fog-500">Times reset</p>
                      <p className="mt-1 font-display text-base text-mist-100">{totalResets}</p>
                    </div>
                    <div>
                      <p className="text-fog-500">Mood, before → now</p>
                      <p className="mt-1 font-display text-base text-mist-100">
                        {before !== null && before !== undefined ? before.toFixed(1) : "—"}
                        {" → "}
                        {during !== null && during !== undefined ? during.toFixed(1) : "—"}
                      </p>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <form onSubmit={handleAddHabit} className="mt-4 flex gap-2">
        <label htmlFor="new-bad-habit" className="sr-only">
          Habit or addiction name
        </label>
        <input
          id="new-bad-habit"
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder='e.g. "Porn" or "Doom scrolling" or "Drinking alone"'
          className="flex-1 rounded-full border border-storm-700 bg-storm-800/60 px-4 py-2 text-sm text-mist-100 placeholder:text-fog-500 focus:border-beam-500"
        />
        <button
          type="submit"
          disabled={adding || !newHabitName.trim()}
          className="relative z-40 rounded-full bg-[#E5A526] px-4 py-2 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B] disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
