import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BrandSeal } from "../../components/BrandSeal";
import { MarginQuote } from "../../components/MarginQuote";
import { pageQuotes } from "@/lib/pageQuotes";
import { GuidelinesGate } from "./GuidelinesGate";
import { COMMUNITY_TOPICS } from "@/lib/community/guidelines";

export const metadata: Metadata = {
  title: "The Watch — Safe Passage",
  description: "Community — one shared space, and six topic groups.",
};

export default async function CommunityPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?redirectedFrom=/community");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("community_guidelines_accepted_at, community_banned")
    .eq("id", user.id)
    .single();

  if (profile?.community_banned) {
    return (
      <section className="bg-storm-gradient pb-24 pt-16">
        <MarginQuote quote={pageQuotes.community.quote} author={pageQuotes.community.author} />
        <div className="mx-4 sm:mx-auto max-w-lg rounded-[2rem] border border-red-500/30 bg-red-500/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-red-400">
            Community access removed
          </p>
          <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
            You&rsquo;ve been removed from the community.
          </h1>
          <p className="mt-3 text-sm text-fog-300">
            This happened after repeated violations of the community
            guidelines. Everything else in Safe Passage is still available
            to you.
          </p>
        </div>
      </section>
    );
  }

  if (!profile?.community_guidelines_accepted_at) {
    return <GuidelinesGate userId={user.id} />;
  }

  return (
    <section className="bg-storm-gradient pb-24 pt-16">
        <MarginQuote quote={pageQuotes.community.quote} author={pageQuotes.community.author} />
      <div className="mx-auto max-w-4xl px-6">
        <div className="mx-4 sm:mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12">
          <BrandSeal className="mb-8" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            The Watch
          </p>
          <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
            You&rsquo;re in.
          </h1>
          <p className="mt-3 text-sm text-fog-300">
            One shared space, and six topic groups. Whatever's said here
            stays here.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/community/open"
            className="rounded-2xl border border-beam-500/40 bg-beam-500/5 p-6 transition hover:border-beam-500/60"
          >
            <h2 className="font-display text-lg italic text-mist-50">Open Space</h2>
            <p className="mt-1 text-xs uppercase tracking-wide text-beam-400">
              Live group chat
            </p>
            <p className="mt-3 text-sm text-fog-300">
              One shared conversation, open to everyone.
            </p>
          </Link>

          {COMMUNITY_TOPICS.map((topic) => (
            <Link
              key={topic.slug}
              href={`/community/${topic.slug}`}
              className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6 transition hover:border-fog-500/50"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg italic text-mist-50">{topic.name}</h2>
                <span className="rounded-full bg-beam-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-beam-400">
                  Premium
                </span>
              </div>
              <p className="mt-1 text-xs uppercase tracking-wide text-fog-500">
                Discussion group
              </p>
              <p className="mt-3 text-sm text-fog-300">
                Threads for men working through {topic.name.toLowerCase()}.
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
