"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Habit = {
  id: string;
  name: string;
};

function todayDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function HabitTracker({ userId }: { userId: string }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [newHabitName, setNewHabitName] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  async function loadHabits() {
    const supabase = createClient();
    const { data: habitsData } = await supabase
      .from("habits")
      .select("id, name")
      .eq("user_id", userId)
      .eq("archived", false)
      .order("created_at", { ascending: true });

    const { data: logsData } = await supabase
      .from("habit_logs")
      .select("habit_id")
      .eq("user_id", userId)
      .eq("log_date", todayDateString());

    setHabits(habitsData ?? []);
    setCompletedToday(new Set((logsData ?? []).map((l) => l.habit_id)));
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
      .from("habits")
      .insert({ user_id: userId, name: newHabitName.trim() });

    if (insertError) {
      setError("Couldn't add that habit. Try again.");
    } else {
      setNewHabitName("");
      await loadHabits();
    }
    setAdding(false);
  }

  async function toggleHabit(habitId: string) {
    const supabase = createClient();
    const isDone = completedToday.has(habitId);

    if (isDone) {
      await supabase
        .from("habit_logs")
        .delete()
        .eq("habit_id", habitId)
        .eq("user_id", userId)
        .eq("log_date", todayDateString());
      setCompletedToday((prev) => {
        const next = new Set(prev);
        next.delete(habitId);
        return next;
      });
    } else {
      await supabase
        .from("habit_logs")
        .insert({ habit_id: habitId, user_id: userId, log_date: todayDateString() });
      setCompletedToday((prev) => new Set(prev).add(habitId));
    }
  }

  async function handleDeleteHabit(habitId: string, habitName: string) {
    const confirmed = window.confirm(`Delete "${habitName}"? This can't be undone.`);
    if (!confirmed) return;

    const supabase = createClient();
    await supabase.from("habits").update({ archived: true }).eq("id", habitId);
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  }

  return (
    <div className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6 text-left">
      <h2 className="font-display text-lg italic text-mist-50">Habits</h2>
      <p className="mt-1 text-sm text-fog-300">
        Small daily actions that support the man you're building toward —
        things like a morning prayer, a call to your kid, 10 minutes of
        exercise, or reading one page. Add your own below and check them
        off each day you do them.
      </p>

      {loading ? (
        <p className="mt-4 text-sm text-fog-300">Loading…</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {habits.length === 0 && (
            <li className="text-sm text-fog-500">No habits yet — add your first below.</li>
          )}
          {habits.map((habit) => {
            const done = completedToday.has(habit.id);
            return (
              <li key={habit.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleHabit(habit.id)}
                  className={`flex flex-1 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                    done
                      ? "border-signal-500/40 bg-signal-500/10 text-signal-400"
                      : "border-storm-700 text-mist-100 hover:border-fog-500/50"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      done ? "border-signal-400 bg-signal-500/20" : "border-fog-500"
                    }`}
                  >
                    {done && "✓"}
                  </span>
                  {habit.name}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteHabit(habit.id, habit.name)}
                  aria-label={`Delete ${habit.name}`}
                  className="shrink-0 rounded-full border border-storm-700 p-2 text-fog-500 transition hover:border-red-500/40 hover:text-red-400"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <form onSubmit={handleAddHabit} className="mt-4 flex gap-2">
        <label htmlFor="new-habit" className="sr-only">
          New habit name
        </label>
        <input
          id="new-habit"
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder='e.g. "10 minutes of exercise" or "Call my kids"'
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
