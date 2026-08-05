import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { BrandSeal } from "../components/BrandSeal";
import { JournalView } from "./JournalView";

export const metadata: Metadata = {
  title: "The Logbook — Safe Passage",
  description: "Private journaling — reflections, mood tracking, gratitude.",
};

export default async function LogbookPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?redirectedFrom=/logbook");
  }

  return (
    <section className="bg-storm-gradient pb-24 pt-32 sm:pt-40">
      <div className="mx-auto max-w-2xl px-6">
        <div className="mx-4 sm:mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
          <BrandSeal className="mb-8" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            The Logbook
          </p>
          <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
            Your private journal.
          </h1>
          <p className="mt-3 text-sm text-fog-300">
            Only you can see this. Write freely.
          </p>
        </div>

        <JournalView userId={user.id} />
      </div>
    </section>
  );
}
