import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BrandSeal } from "../../../../components/BrandSeal";
import { BackLink } from "../../../../components/BackLink";
import { ReportButton } from "../../ReportButton";
import { COMMUNITY_TOPICS } from "@/lib/community/guidelines";
import { ThreadDetail } from "./ThreadDetail";
import { LighthouseBeam } from "../../../../components/LighthouseBeam";
import { LighthouseBackdrop } from "../../../../components/LighthouseBackdrop";

export const metadata: Metadata = {
  title: "Thread — The Watch — Safe Passage",
};

export default async function ThreadPage({
  params,
}: {
  params: { topic: string; threadId: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/sign-in?redirectedFrom=/community/${params.topic}/${params.threadId}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("community_guidelines_accepted_at, community_banned, full_name, plan")
    .eq("id", user.id)
    .single();

  if (profile?.community_banned || !profile?.community_guidelines_accepted_at) {
    redirect("/community");
  }

  const isPremium = profile?.plan === "premium";

  if (!isPremium) {
    const topic = COMMUNITY_TOPICS.find((t) => t.slug === params.topic);
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
              {topic?.name ?? "This discussion group"} is Premium.
            </h1>
            <p className="mt-3 text-sm text-fog-300">
              Open Space stays free for everyone. Topic groups are part of
              the Premium plan. Upgrade for full access to all six.
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

  const { data: thread } = await supabase
    .from("community_threads")
    .select("id, user_id, display_name, title, content, created_at")
    .eq("id", params.threadId)
    .single();

  if (!thread) notFound();

  return (
    <section className="bg-storm-gradient pb-24 pt-16">
      <LighthouseBackdrop topOffset={96} variant="soft" />
      <LighthouseBeam topOffset={96} variant="soft" />
      <div className="mx-auto max-w-2xl px-6">
        <BackLink href={`/community/${params.topic}`} label="Back to topic" />
        <div className="mx-4 sm:mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 text-left shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12">
          <div className="text-center">
            <BrandSeal className="mb-6" />
          </div>
          <h1 className="font-display text-2xl italic text-mist-50 sm:text-3xl">
            {thread.title}
          </h1>
          <p className="mt-2 text-xs text-fog-500">
            {thread.display_name} ·{" "}
            {new Date(thread.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-fog-300">
            {thread.content}
          </p>
          {thread.user_id !== user.id && (
            <div className="mt-3">
              <ReportButton
                reportedUserId={thread.user_id}
                contentType="thread"
                contentId={thread.id}
              />
            </div>
          )}
        </div>

        <ThreadDetail
          threadId={thread.id}
          userId={user.id}
          displayName={profile.full_name?.split(" ")[0] ?? "Anonymous"}
        />
      </div>
    </section>
  );
}
