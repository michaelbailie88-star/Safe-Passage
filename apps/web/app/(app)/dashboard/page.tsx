import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CheckInWidget } from "./CheckInWidget";
import { HabitTracker } from "./HabitTracker";
import { BadHabitTracker } from "./BadHabitTracker";
import { GuardianCard } from "./GuardianCard";
import { MarginQuote } from "../../components/MarginQuote";
import { LighthouseBeam } from "../../components/LighthouseBeam";
import { LighthouseBackdrop } from "../../components/LighthouseBackdrop";
import { pageQuotes } from "@/lib/pageQuotes";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders: middleware already protects this route, but a
  // Server Component should never trust that alone.
  if (!user) {
    redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, subscription_status, full_name, is_admin")
    .eq("id", user.id)
    .single();

  const isPremium = profile?.plan === "premium" || profile?.is_admin === true;
  const firstName = profile?.full_name?.split(" ")[0];

  return (
    <section className="relative bg-storm-gradient pb-24 pt-16">
      <LighthouseBackdrop topOffset={96} variant="full" />
      <LighthouseBeam topOffset={96} variant="full" />
      <MarginQuote quote={pageQuotes.dashboard.quote} author={pageQuotes.dashboard.author} cardWidthPx={672} />
      <div className="mx-4 sm:mx-auto max-w-2xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            The Lighthouse
          </p>
          <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
            {firstName ? `Welcome back, ${firstName}.` : "Welcome back."}
          </h1>
          <p className="mt-2 text-sm text-fog-300">{user.email}</p>

          <p className="mt-4">
            <span
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                isPremium
                  ? "bg-beam-500/20 text-beam-400"
                  : "bg-storm-700 text-fog-300"
              }`}
            >
              {isPremium ? "Premium" : "Free plan"}
            </span>
          </p>

          {!isPremium && (
            <p className="mt-3 text-sm text-fog-300">
              <Link href="/upgrade" className="text-beam-400 underline underline-offset-2">
                Upgrade to Premium
              </Link>{" "}
              for transformation programs, advanced analytics, and more.
            </p>
          )}
        </div>

        <div className="mt-6 space-y-5">
          <CheckInWidget userId={user.id} />
          <HabitTracker userId={user.id} />
          <BadHabitTracker userId={user.id} />
          <GuardianCard userId={user.id} />

          <div className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6 text-left">
            <h2 className="font-display text-lg italic text-mist-50">The Logbook</h2>
            <p className="mt-1 text-sm text-fog-300">
              Private journaling — reflections, gratitude, whatever you need
              to put down.
            </p>
            <Link
              href="/logbook"
              className="relative z-40 mt-4 inline-block rounded-full bg-[#E5A526] px-5 py-2 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B]"
            >
              Open your Logbook
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
