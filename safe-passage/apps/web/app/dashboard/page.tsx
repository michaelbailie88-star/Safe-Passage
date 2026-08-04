import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";

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
    .select("plan, subscription_status")
    .eq("id", user.id)
    .single();

  const isPremium = profile?.plan === "premium";

  return (
    <section className="bg-storm-gradient pb-24 pt-32 sm:pt-40">
      <div className="mx-4 sm:mx-auto max-w-lg rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
          The Lighthouse
        </p>
        <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
          You&rsquo;re signed in.
        </h1>
        <p className="mt-3 text-sm text-fog-300">{user.email}</p>

        <p className="mt-6">
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
          <p className="mt-4 text-sm text-fog-300">
            <Link href="/upgrade" className="text-beam-400 underline underline-offset-2">
              Upgrade to Premium
            </Link>{" "}
            for transformation programs, advanced analytics, and more.
          </p>
        )}

        <p className="mt-6 text-sm text-fog-300">
          This is a placeholder — the real dashboard (daily check-ins, habit
          tracking, goals, progress) is next.
        </p>
        <div className="mt-8">
          <SignOutButton />
        </div>
      </div>
    </section>
  );
}
