import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { BrandSeal } from "../../../components/BrandSeal";
import { BackLink } from "../../../components/BackLink";
import { COMMUNITY_TOPICS } from "@/lib/community/guidelines";
import { ThreadList } from "./ThreadList";

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
    .select("community_guidelines_accepted_at, community_banned, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.community_banned || !profile?.community_guidelines_accepted_at) {
    redirect("/community");
  }

  return (
    <section className="bg-storm-gradient pb-24 pt-16">
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
