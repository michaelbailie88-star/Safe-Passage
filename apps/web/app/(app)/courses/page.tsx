import type { Metadata } from "next";
import Link from "next/link";
import { BrandSeal } from "../../components/BrandSeal";
import { programs } from "@/lib/courses";
import { createClient } from "@/lib/supabase/server";
import { getAllCourseProgress } from "@/lib/courses/progress";
import { ProgressMeter } from "./ProgressMeter";
import { LighthouseBeam } from "../../components/LighthouseBeam";
import { LighthouseBackdrop } from "../../components/LighthouseBackdrop";

export const metadata: Metadata = {
  title: "Courses — Safe Passage",
  description: "Six guided transformation programs: Rebuild, Fatherhood, Purpose, Relationships, Confidence, and Faith.",
};

export default async function ProgramsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isPremium = false;
  let progress: Awaited<ReturnType<typeof getAllCourseProgress>> = {};
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();
    isPremium = profile?.plan === "premium" || user.email === "michaelbailie31@gmail.com";
    if (isPremium) {
      progress = await getAllCourseProgress(supabase, user.id);
    }
  }
  return (
    <section className="bg-storm-gradient pb-24 pt-16">
      <LighthouseBackdrop topOffset={96} variant="soft" />
      <LighthouseBeam topOffset={96} variant="soft" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-4 sm:mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
          <BrandSeal className="mb-8" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            Courses
          </p>
          <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
            Six programs. Eight weeks each. Real change.
          </h1>
          <p className="mt-3 text-sm text-fog-300">
            Each program ends with a certificate — not because it proves
            anything to anyone else, but because you&rsquo;ll know what it
            took to earn it.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, i) => (
            <Link
              key={program.slug}
              href={`/courses/${program.slug}`}
              className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6 transition hover:border-beam-500/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-fog-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full bg-beam-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-beam-400">
                  Premium
                </span>
              </div>
              <h2 className="mt-3 font-display text-lg italic text-mist-50">
                {program.name}
              </h2>
              <p className="mt-1 text-xs uppercase tracking-wide text-beam-400">
                8 weeks
              </p>
              <p className="mt-3 text-sm leading-relaxed text-fog-300">
                {program.tagline}
              </p>
              {isPremium && progress[program.slug] && (
                <ProgressMeter
                  completedWeeks={progress[program.slug].completedWeeks}
                  totalWeeks={program.weeks.length}
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
