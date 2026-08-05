"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { createClient } from "@/lib/supabase/client";

type MoodPoint = { date: string; mood: number };
type HabitStat = { name: string; percent: number };

export function AnalyticsView({ userId }: { userId: string }) {
  const [moodData, setMoodData] = useState<MoodPoint[]>([]);
  const [habitStats, setHabitStats] = useState<HabitStat[]>([]);
  const [journalCount, setJournalCount] = useState(0);
  const [checkinStreak, setCheckinStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sinceDate = thirtyDaysAgo.toISOString().slice(0, 10);

      const [{ data: checkins }, { data: habits }, { count: journalTotal }] = await Promise.all([
        supabase
          .from("daily_checkins")
          .select("checkin_date, mood")
          .eq("user_id", userId)
          .gte("checkin_date", sinceDate)
          .order("checkin_date", { ascending: true }),
        supabase.from("habits").select("id, name").eq("user_id", userId).eq("archived", false),
        supabase
          .from("journal_entries")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId),
      ]);

      setMoodData(
        (checkins ?? []).map((c) => ({
          date: new Date(c.checkin_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          mood: c.mood,
        }))
      );
      setJournalCount(journalTotal ?? 0);

      // Current check-in streak (consecutive days ending today or yesterday).
      let streak = 0;
      const sortedDates = (checkins ?? [])
        .map((c) => c.checkin_date)
        .sort()
        .reverse();
      const today = new Date().toISOString().slice(0, 10);
      let cursor = today;
      for (const d of sortedDates) {
        if (d === cursor) {
          streak++;
          const prev = new Date(cursor);
          prev.setDate(prev.getDate() - 1);
          cursor = prev.toISOString().slice(0, 10);
        } else {
          break;
        }
      }
      setCheckinStreak(streak);

      if (habits && habits.length > 0) {
        const { data: logs } = await supabase
          .from("habit_logs")
          .select("habit_id, log_date")
          .eq("user_id", userId)
          .gte("log_date", sinceDate);

        const stats = habits.map((h) => {
          const completedDays = new Set(
            (logs ?? []).filter((l) => l.habit_id === h.id).map((l) => l.log_date)
          ).size;
          return { name: h.name, percent: Math.round((completedDays / 30) * 100) };
        });
        setHabitStats(stats);
      }

      setLoading(false);
    }
    load();
  }, [userId]);

  if (loading) {
    return <p className="mt-10 text-center text-sm text-fog-300">Loading your analytics…</p>;
  }

  return (
    <div className="mt-10 space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-storm-700 bg-storm-800/40 p-5 text-center">
          <p className="text-xs uppercase tracking-wide text-fog-500">Check-in streak</p>
          <p className="mt-1 font-display text-2xl text-mist-50">{checkinStreak} days</p>
        </div>
        <div className="rounded-2xl border border-storm-700 bg-storm-800/40 p-5 text-center">
          <p className="text-xs uppercase tracking-wide text-fog-500">Journal entries</p>
          <p className="mt-1 font-display text-2xl text-mist-50">{journalCount}</p>
        </div>
        <div className="rounded-2xl border border-storm-700 bg-storm-800/40 p-5 text-center">
          <p className="text-xs uppercase tracking-wide text-fog-500">Check-ins (30d)</p>
          <p className="mt-1 font-display text-2xl text-mist-50">{moodData.length}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6">
        <h2 className="font-display text-lg italic text-mist-50">Mood, last 30 days</h2>
        {moodData.length === 0 ? (
          <p className="mt-4 text-sm text-fog-500">
            No check-ins yet in this window — check in on your dashboard to start seeing trends.
          </p>
        ) : (
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#182640" />
                <XAxis dataKey="date" stroke="#8DA0B5" fontSize={12} />
                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#8DA0B5" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#101B2E",
                    border: "1px solid #182640",
                    borderRadius: 8,
                    color: "#E9EEF4",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#E5A526"
                  strokeWidth={2}
                  dot={{ fill: "#E5A526", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6">
        <h2 className="font-display text-lg italic text-mist-50">
          Habit completion, last 30 days
        </h2>
        {habitStats.length === 0 ? (
          <p className="mt-4 text-sm text-fog-500">
            No habits yet — add some on your dashboard to start tracking.
          </p>
        ) : (
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#182640" />
                <XAxis dataKey="name" stroke="#8DA0B5" fontSize={12} />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  stroke="#8DA0B5"
                  fontSize={12}
                />
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    background: "#101B2E",
                    border: "1px solid #182640",
                    borderRadius: 8,
                    color: "#E9EEF4",
                  }}
                />
                <Bar dataKey="percent" fill="#5FB8B0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
