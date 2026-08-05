import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProgram, programs } from "@/lib/courses";
import { BrandSeal } from "../../../components/BrandSeal";
import { ProgramWeeks } from "./ProgramWeeks";

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const program = getProgram(params.slug);
  if (!program) return {};
  return {
    title: `${program.name} — Courses — Safe Passage`,
    description: program.tagline,
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const program = getProgram(params.slug);
  if (!program) notFound();

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/sign-in?redirectedFrom=/courses/${params.slug}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const isPremium = profile?.plan === "premium";

  if (!isPremium) {
    return (
      <section className="bg-storm-gradient pb-24 pt-16">
        <div className="mx-4 sm:mx-auto max-w-lg rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
          <BrandSeal className="mb-8" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            Courses
          </p>
          <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
            {program.name} is a Premium program.
          </h1>
          <p className="mt-3 text-sm text-fog-300">
            Transformation programs are part of the Premium plan. Upgrade
            to get full access to all six programs, including{" "}
            {program.name}.
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
    <section className="bg-storm-gradient pb-24 pt-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mx-4 sm:mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
          <BrandSeal className="mb-8" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            Courses
          </p>
          <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
            {program.name}
          </h1>
          <p className="mt-3 text-sm text-fog-300">{program.tagline}</p>
          <p className="mt-6 text-sm italic text-fog-300">
            {program.introNote}
          </p>
        </div>

        <ProgramWeeks program={program} userId={user.id} />
      </div>
    </section>
  );
}
