import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BrandSeal } from "../../components/BrandSeal";
import { MarginQuote } from "../../components/MarginQuote";
import { pageQuotes } from "@/lib/pageQuotes";
import { AnalyticsView } from "./AnalyticsView";

export const metadata: Metadata = {
  title: "Analytics — Safe Passage",
  description: "Advanced analytics — mood trends, habit completion, and progress.",
};

export default async function AnalyticsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?redirectedFrom=/analytics");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const isPremium = profile?.plan === "premium";

  if (!isPremium) {
    return (
      <section className="relative bg-storm-gradient pb-24 pt-16">
        <MarginQuote quote={pageQuotes.analytics.quote} author={pageQuotes.analytics.author} cardWidthPx={512} />
        <div className="mx-4 sm:mx-auto max-w-lg rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
          <BrandSeal className="mb-8" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            Analytics
          </p>
          <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
            Advanced analytics is a Premium feature.
          </h1>
          <p className="mt-3 text-sm text-fog-300">
            Mood trends, habit completion rates, and progress over time —
            upgrade to unlock.
          </p>
          <Link
            href="/upgrade"
            className="relative z-40 mt-8 inline-block rounded-full bg-[#E5A526] px-6 py-3 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B]"
          >
            Upgrade to Premium
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-storm-gradient pb-24 pt-16">
        <MarginQuote quote={pageQuotes.analytics.quote} author={pageQuotes.analytics.author} cardWidthPx={672} />
      <div className="mx-auto max-w-3xl px-6">
        <div className="mx-4 sm:mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
          <BrandSeal className="mb-8" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            Analytics
          </p>
          <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
            Your progress, in detail.
          </h1>
        </div>

        <AnalyticsView userId={user.id} />
      </div>
    </section>
  );
}
