import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { BrandSeal } from "../../../components/BrandSeal";
import { OpenChat } from "./OpenChat";

export const metadata: Metadata = {
  title: "Open Space — The Watch — Safe Passage",
};

export default async function OpenSpacePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?redirectedFrom=/community/open");
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
        <div className="mx-4 sm:mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12">
          <BrandSeal className="mb-6" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            Open Space
          </p>
          <h1 className="mt-3 font-display text-xl italic text-mist-50 sm:text-2xl">
            One shared conversation.
          </h1>
        </div>

        <OpenChat
          userId={user.id}
          displayName={profile.full_name?.split(" ")[0] ?? "Anonymous"}
        />
      </div>
    </section>
  );
}
