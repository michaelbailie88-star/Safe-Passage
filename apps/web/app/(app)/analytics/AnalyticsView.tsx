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
import { freePrograms } from "@/lib/free-programs";
import { programs as coursePrograms } from "@/lib/courses";

type MoodPoint = { date: string; mood: number };
type HabitStat = { name: string; percent: number };
type ProgramCompletion = { completed: number; inProgress: number; notStarted: number };

export function AnalyticsView({ userId }: { userId: string }) {
  const [moodData, setMoodData] = useState<MoodPoint[]>([]);
  const [habitStats, setHabitStats] = useState<HabitStat[]>([]);
  const [journalCount, setJournalCount] = useState(0);
  const [checkinStreak, setCheckinStreak] = useState(0);
  const [programStats, setProgramStats] = useState<ProgramCompletion>({
    completed: 0,
    inProgress: 0,
    notStarted: freePrograms.length,
  });
  const [courseStats, setCourseStats] = useState<ProgramCompletion>({
    completed: 0,
    inProgress: 0,
    notStarted: coursePrograms.length,
  });
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sinceDate = thirtyDaysAgo.toISOString().slice(0, 10);

      const [{ data: checkins }, { data: habits }, { count: journalTotal }, { data: taskProgress }, { data: weekProgress }] = await Promise.all([
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
        supabase
          .from("program_task_progress")
          .select("program_slug, task_number, status")
          .eq("user_id", userId),
        supabase
          .from("program_progress")
          .select("program_slug, week_number")
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

      let habitStatsForTips: HabitStat[] = [];
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
        habitStatsForTips = stats;
      }

      // Free Programs: only submitted tasks count toward completion (matches
      // the badge rule used on the Programs pages themselves).
      let programsCompleted = 0;
      let programsInProgress = 0;
      for (const p of freePrograms) {
        const submitted = new Set(
          (taskProgress ?? [])
            .filter((t) => t.program_slug === p.slug && t.status === "submitted")
            .map((t) => t.task_number)
        ).size;
        if (submitted >= p.tasks.length) programsCompleted++;
        else if (submitted > 0) programsInProgress++;
      }
      setProgramStats({
        completed: programsCompleted,
        inProgress: programsInProgress,
        notStarted: freePrograms.length - programsCompleted - programsInProgress,
      });

      let coursesCompleted = 0;
      let coursesInProgress = 0;
      for (const c of coursePrograms) {
        const weeksDone = new Set(
          (weekProgress ?? []).filter((w) => w.program_slug === c.slug).map((w) => w.week_number)
        ).size;
        if (weeksDone >= c.weeks.length) coursesCompleted++;
        else if (weeksDone > 0) coursesInProgress++;
      }
      setCourseStats({
        completed: coursesCompleted,
        inProgress: coursesInProgress,
        notStarted: coursePrograms.length - coursesCompleted - coursesInProgress,
      });

      // Rule-based suggestions — every tip here is derived from data we
      // actually just computed, not invented. A mix of commendation and
      // constructive nudges, never more than a handful at once so it reads
      // as guidance rather than a wall of alerts.
      const generatedTips: string[] = [];
      const recentMoods = (checkins ?? []).slice(-7).map((c) => c.mood);
      if (recentMoods.length >= 4) {
        const firstHalf = recentMoods.slice(0, Math.floor(recentMoods.length / 2));
        const secondHalf = recentMoods.slice(Math.floor(recentMoods.length / 2));
        const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
        const trend = avg(secondHalf) - avg(firstHalf);
        if (trend <= -0.75) {
          generatedTips.push(
            "Your mood's trended down over your last several check-ins. That's worth paying attention to — the Logbook or a Program built around what's going on might help more than powering through alone."
          );
        } else if (trend >= 0.75) {
          generatedTips.push(
            "Your mood's trended upward over your last several check-ins — whatever you've been doing, it's working. Worth noticing what changed."
          );
        }
      }

      if (streak === 0 && (checkins ?? []).length > 0) {
        generatedTips.push(
          "No active check-in streak right now. A 30-second check-in is the fastest way to keep the pattern visible to yourself."
        );
      } else if (streak >= 7) {
        generatedTips.push(
          `${streak} days of consecutive check-ins. That's real, consistent follow-through — not everyone does that.`
        );
      }

      if (habitStatsForTips.length > 0) {
        const weakest = habitStatsForTips.reduce((min, h) => (h.percent < min.percent ? h : min));
        const strongest = habitStatsForTips.reduce((max, h) => (h.percent > max.percent ? h : max));
        if (weakest.percent < 25) {
          generatedTips.push(
            `"${weakest.name}" is at ${weakest.percent}% over the last 30 days. That might mean it needs to be smaller or more specific, not that you're failing at it.`
          );
        }
        if (strongest.percent >= 80) {
          generatedTips.push(
            `"${strongest.name}" is at ${strongest.percent}% — that's close to automatic now. Solid work.`
          );
        }
      }

      if (programsCompleted === 0 && programsInProgress === 0 && (habits ?? []).length === 0) {
        generatedTips.push(
          "Nothing started yet in Programs or Habits — even one task or one habit is enough to begin. Pick whichever feels least intimidating."
        );
      }
      if (programsInProgress > 0) {
        generatedTips.push(
          `You have ${programsInProgress} Program${programsInProgress > 1 ? "s" : ""} in progress. Finishing one out and claiming the badge tends to build momentum for the next.`
        );
      }
      if (programsCompleted > 0) {
        generatedTips.push(
          `${programsCompleted} Program${programsCompleted > 1 ? "s" : ""} completed. That's ${programsCompleted} times you followed through on something hard.`
        );
      }
      if (coursesInProgress > 0) {
        generatedTips.push(
          `${coursesInProgress} Course${coursesInProgress > 1 ? "s" : ""} in progress — you're building toward a certificate, one week at a time.`
        );
      }
      if (journalTotal && journalTotal >= 5) {
        generatedTips.push(
          `${journalTotal} logbook entries written. Writing things down when you don't have to is its own kind of discipline.`
        );
      }

      setTips(generatedTips.slice(0, 5));
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

      {tips.length > 0 && (
        <div className="rounded-2xl border border-beam-500/40 bg-beam-500/5 p-6">
          <h2 className="font-display text-lg italic text-mist-50">Suggestions</h2>
          <ul className="mt-4 space-y-3">
            {tips.map((tip, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-fog-200">
                <span className="mt-1 text-beam-400">—</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6">
          <h2 className="font-display text-lg italic text-mist-50">Programs</h2>
          <p className="mt-1 text-xs uppercase tracking-wide text-fog-500">
            Free, task-based
          </p>
          <div className="mt-4 flex gap-4 text-center">
            <div className="flex-1">
              <p className="font-display text-xl text-beam-400">{programStats.completed}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wide text-fog-500">Complete</p>
            </div>
            <div className="flex-1">
              <p className="font-display text-xl text-mist-50">{programStats.inProgress}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wide text-fog-500">In progress</p>
            </div>
            <div className="flex-1">
              <p className="font-display text-xl text-fog-500">{programStats.notStarted}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wide text-fog-500">Not started</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6">
          <h2 className="font-display text-lg italic text-mist-50">Courses</h2>
          <p className="mt-1 text-xs uppercase tracking-wide text-fog-500">
            Premium, 8-week
          </p>
          <div className="mt-4 flex gap-4 text-center">
            <div className="flex-1">
              <p className="font-display text-xl text-beam-400">{courseStats.completed}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wide text-fog-500">Complete</p>
            </div>
            <div className="flex-1">
              <p className="font-display text-xl text-mist-50">{courseStats.inProgress}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wide text-fog-500">In progress</p>
            </div>
            <div className="flex-1">
              <p className="font-display text-xl text-fog-500">{courseStats.notStarted}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wide text-fog-500">Not started</p>
            </div>
          </div>
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
