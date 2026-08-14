import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { freePrograms } from "@/lib/free-programs";
import { programs as courses } from "@/lib/courses";
import { LighthouseBeam } from "../../components/LighthouseBeam";
import { LighthouseBackdrop } from "../../components/LighthouseBackdrop";
import { ListenerSeedControl } from "./ListenerSeedControl";
import { ListenerTestMatch } from "./ListenerTestMatch";

export const metadata: Metadata = {
  title: "Admin — Safe Passage",
};

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-storm-700 bg-storm-800/40 p-5">
      <p className="text-xs uppercase tracking-wide text-fog-500">{label}</p>
      <p className="mt-1 font-display text-2xl text-mist-50">{value}</p>
    </div>
  );
}

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?redirectedFrom=/admin");
  }

  const { data: requester } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!requester?.is_admin) {
    redirect("/dashboard");
  }

  // Admin needs visibility across ALL users — the regular client is
  // RLS-scoped to the current user only, so the service-role client is
  // required here. Access to this page itself is already gated above.
  const admin = createAdminClient();

  const [
    { count: totalUsers },
    { count: premiumUsers },
    { count: totalCheckins },
    { count: totalJournalEntries },
    { count: totalHabits },
    { data: recentSignups },
    { data: courseProgress },
    { data: taskProgress },
    { count: pendingReports },
    { count: guardianCount },
    { count: totalBadHabits },
    { count: totalResets },
    { data: badHabitStarts },
    { data: countryRows },
    { count: activeLast7Days },
  ] = await Promise.all([
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin.from("profiles").select("*", { count: "exact", head: true }).eq("plan", "premium"),
    admin.from("daily_checkins").select("*", { count: "exact", head: true }),
    admin.from("journal_entries").select("*", { count: "exact", head: true }),
    admin.from("habits").select("*", { count: "exact", head: true }),
    admin
      .from("profiles")
      .select("email, full_name, plan, created_at, country, city")
      .order("created_at", { ascending: false })
      .limit(20),
    admin.from("program_progress").select("user_id, program_slug"),
    admin.from("program_task_progress").select("user_id, program_slug").eq("status", "submitted"),
    admin.from("community_reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("profiles").select("*", { count: "exact", head: true }).eq("guardian_status", true),
    admin.from("bad_habits").select("*", { count: "exact", head: true }),
    admin.from("bad_habit_resets").select("*", { count: "exact", head: true }),
    admin.from("bad_habits").select("started_at"),
    admin.from("profiles").select("country").not("country", "is", null),
    admin
      .from("daily_checkins")
      .select("user_id", { count: "exact", head: true })
      .gte("checkin_date", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)),
  ]);

  const freeUsers = (totalUsers ?? 0) - (premiumUsers ?? 0);

  const countryCounts = new Map<string, number>();
  (countryRows ?? []).forEach((r) => {
    const c = r.country as string;
    countryCounts.set(c, (countryCounts.get(c) ?? 0) + 1);
  });
  const topCountries = [...countryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const totalDaysClean = (badHabitStarts ?? []).reduce((sum, row) => {
    const days = Math.floor(
      (Date.now() - new Date(row.started_at as string).getTime()) / (1000 * 60 * 60 * 24)
    );
    return sum + Math.max(0, days);
  }, 0);
  const avgDaysClean = badHabitStarts?.length
    ? Math.round(totalDaysClean / badHabitStarts.length)
    : 0;

  // Count distinct users who've completed all 8 weeks of each course, and
  // all 12 tasks of each free program.
  function completionsFor(
    rows: { user_id: string; program_slug: string }[] | null,
    slug: string,
    required: number
  ) {
    const counts = new Map<string, number>();
    (rows ?? [])
      .filter((r) => r.program_slug === slug)
      .forEach((r) => counts.set(r.user_id, (counts.get(r.user_id) ?? 0) + 1));
    return [...counts.values()].filter((c) => c >= required).length;
  }

  return (
    <section className="bg-storm-gradient pb-24 pt-16">
      <LighthouseBackdrop topOffset={96} variant="soft" />
      <LighthouseBeam topOffset={96} variant="soft" />
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-4 sm:mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            Admin
          </p>
          <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
            Operational overview.
          </h1>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total users" value={totalUsers ?? 0} />
          <StatCard label="Premium" value={premiumUsers ?? 0} />
          <StatCard label="Free" value={freeUsers} />
          <StatCard
            label="Conversion"
            value={totalUsers ? `${Math.round(((premiumUsers ?? 0) / totalUsers) * 100)}%` : "—"}
          />
          <StatCard label="Daily check-ins" value={totalCheckins ?? 0} />
          <StatCard label="Journal entries" value={totalJournalEntries ?? 0} />
          <StatCard label="Habits tracked" value={totalHabits ?? 0} />
          <StatCard label="Active last 7 days" value={activeLast7Days ?? 0} />
          <StatCard label="Guardians" value={guardianCount ?? 0} />
          <StatCard label="Bad habits/addictions tracked" value={totalBadHabits ?? 0} />
          <StatCard label="Total resets logged" value={totalResets ?? 0} />
          <StatCard label="Avg. days clean (per habit)" value={avgDaysClean} />
        </div>

        {topCountries.length > 0 && (
          <div className="mt-10 rounded-2xl border border-storm-700 bg-storm-800/40 p-6">
            <h2 className="font-display text-lg italic text-mist-50">Top countries</h2>
            <ul className="mt-4 space-y-2 text-sm text-fog-300">
              {topCountries.map(([country, count]) => (
                <li key={country} className="flex justify-between">
                  <span>{country}</span>
                  <span className="text-signal-400">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10">
          <Link
            href="/admin/community"
            className="block rounded-2xl border border-red-500/30 bg-red-500/5 p-6 transition hover:border-red-500/50"
          >
            <h2 className="font-display text-lg italic text-mist-50">
              Community moderation
            </h2>
            <p className="mt-2 text-sm text-fog-300">
              {pendingReports ?? 0} pending report{pendingReports === 1 ? "" : "s"} to review
            </p>
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6">
            <h2 className="font-display text-lg italic text-mist-50">
              Courses — certificates earned
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-fog-300">
              {courses.map((c) => (
                <li key={c.slug} className="flex justify-between">
                  <span>{c.name}</span>
                  <span className="text-beam-400">
                    {completionsFor(courseProgress, c.slug, 8)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6">
            <h2 className="font-display text-lg italic text-mist-50">
              Programs — badges earned
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-fog-300">
              {freePrograms.map((p) => (
                <li key={p.slug} className="flex justify-between">
                  <span>{p.name}</span>
                  <span className="text-signal-400">
                    {completionsFor(taskProgress, p.slug, p.tasks.length)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-storm-700 bg-storm-800/40 p-6">
          <h2 className="font-display text-lg italic text-mist-50">Recent signups</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm text-fog-300">
              <thead>
                <tr className="border-b border-storm-700 text-xs uppercase text-fog-500">
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Plan</th>
                  <th className="py-2 pr-4">Location</th>
                  <th className="py-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {(recentSignups ?? []).map((row) => (
                  <tr key={row.email} className="border-b border-storm-700/50">
                    <td className="py-2 pr-4">{row.email}</td>
                    <td className="py-2 pr-4">{row.full_name ?? "—"}</td>
                    <td className="py-2 pr-4 capitalize">{row.plan}</td>
                    <td className="py-2 pr-4">
                      {row.city && row.country
                        ? `${row.city}, ${row.country}`
                        : row.country ?? "—"}
                    </td>
                    <td className="py-2">
                      {new Date(row.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 max-w-6xl">
          <ListenerSeedControl />
          <ListenerTestMatch />
        </div>
      </div>
    </section>
  );
}
