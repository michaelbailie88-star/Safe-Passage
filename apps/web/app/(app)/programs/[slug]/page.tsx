import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getFreeProgram, freePrograms } from "@/lib/free-programs";
import { BrandSeal } from "../../../components/BrandSeal";
import { BackLink } from "../../../components/BackLink";
import { MarginQuote } from "../../../components/MarginQuote";
import { pageQuotes } from "@/lib/pageQuotes";
import { TaskChecklist } from "../TaskChecklist";

const PROGRAM_QUOTE_KEY: Record<string, keyof typeof pageQuotes> = {
  rebuild: "programRebuild",
  fatherhood: "programFatherhood",
  purpose: "programPurpose",
  relationships: "programRelationships",
  confidence: "programConfidence",
  faith: "programFaith",
};

export function generateStaticParams() {
  return freePrograms.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const program = getFreeProgram(params.slug);
  if (!program) return {};
  return {
    title: `${program.name} — Programs — Safe Passage`,
    description: program.tagline,
  };
}

export default async function FreeProgramDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const program = getFreeProgram(params.slug);
  if (!program) notFound();

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/sign-in?redirectedFrom=/programs/${params.slug}`);
  }

  return (
    <section className="bg-storm-gradient pb-24 pt-16">
      {(() => {
        const pq = pageQuotes[PROGRAM_QUOTE_KEY[program.slug]];
        return (
          <>
            <MarginQuote quote={pq.quote} author={pq.author} />
          </>
        );
      })()}
      <div className="mx-auto max-w-2xl px-6">
        <BackLink href="/programs" label="Back to Programs" />
        <div className="mx-4 sm:mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
          <BrandSeal className="mb-8" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            Programs
          </p>
          <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
            {program.name}
          </h1>
          <p className="mt-3 text-sm text-fog-300">{program.tagline}</p>
        </div>

        <TaskChecklist program={program} userId={user.id} />
      </div>
    </section>
  );
}
