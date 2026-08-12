import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BrandSeal } from "../../../components/BrandSeal";
import { BackLink } from "../../../components/BackLink";
import { COMMUNITY_TOPICS } from "@/lib/community/guidelines";
import { ThreadList } from "./ThreadList";
import { LighthouseBeam } from "../../../components/LighthouseBeam";
import { LighthouseBackdrop } from "../../../components/LighthouseBackdrop";

export function generateStaticParams() {
  return COMMUNITY_TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { topic: string };
}): Promise<Metadata> {
  const topic = COMMUNITY_TOPICS.find((t) => t.slug === params.topic);
  return { title: topic ? `${topic.name} — The Watch — Safe Passage` : "The Watch" };
}

export default async function TopicPage({ params }: { params: { topic: string } }) {
  const topic = COMMUNITY_TOPICS.find((t) => t.slug === params.topic);
  if (!topic) notFound();

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/sign-in?redirectedFrom=/community/${params.topic}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("community_guidelines_accepted_at, community_banned, full_name, plan, is_admin")
    .eq("id", user.id)
    .single();

  if (profile?.community_banned || !profile?.community_guidelines_accepted_at) {
    redirect("/community");
  }

  const isPremium = profile?.plan === "premium" || profile?.is_admin === true;

  if (!isPremium) {
    return (
      <section className="bg-storm-gradient pb-24 pt-16">
        <LighthouseBackdrop topOffset={96} variant="soft" />
        <LighthouseBeam topOffset={96} variant="soft" />
        <div className="mx-auto max-w-lg px-6">
          <BackLink href="/community" label="Back to The Watch" />
          <div className="mx-4 sm:mx-auto max-w-lg rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
            <BrandSeal className="mb-8" />
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
              The Watch
            </p>
            <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
              {topic.name} is a Premium discussion group.
            </h1>
            <p className="mt-3 text-sm text-fog-300">
              Open Space stays free for everyone. Topic groups like{" "}
              {topic.name} are part of the Premium plan. Upgrade for full
              access to all six.
            </p>
            <Link
              href="/upgrade"
              className="relative z-40 mt-8 inline-block rounded-full bg-[#E5A526] px-6 py-3 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B]"
            >
              Upgrade to Premium
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-storm-gradient pb-24 pt-16">
      <LighthouseBackdrop topOffset={96} variant="soft" />
      <LighthouseBeam topOffset={96} variant="soft" />
      <div className="mx-auto max-w-2xl px-6">
        <BackLink href="/community" label="Back to The Watch" />
        <div className="mx-4 sm:mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12">
          <BrandSeal className="mb-6" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            The Watch
          </p>
          <h1 className="mt-3 font-display text-2xl italic text-mist-50 sm:text-3xl">
            {topic.name}
          </h1>
        </div>

        <ThreadList
          topicSlug={topic.slug}
          userId={user.id}
          displayName={profile.full_name?.split(" ")[0] ?? "Anonymous"}
        />
      </div>
    </section>
  );
}
