import type { Metadata } from "next";
import Link from "next/link";
import { BrandSeal } from "../../components/BrandSeal";
import { MarginQuote } from "../../components/MarginQuote";
import { pageQuotes } from "@/lib/pageQuotes";
import { freePrograms } from "@/lib/free-programs";

export const metadata: Metadata = {
  title: "Programs — Safe Passage",
  description: "Free task-based programs across six topics — a taste of the full Courses.",
};

export default function ProgramsPage() {
  return (
    <section className="bg-storm-gradient pb-24 pt-16">
      <MarginQuote quote={pageQuotes.programsList.upperLeft.quote} author={pageQuotes.programsList.upperLeft.author} position="upper-left" />
        <MarginQuote quote={pageQuotes.programsList.lowerLeft.quote} author={pageQuotes.programsList.lowerLeft.author} position="lower-left" />
        <MarginQuote quote={pageQuotes.programsList.right.quote} author={pageQuotes.programsList.right.author} position="right" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-4 sm:mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
          <BrandSeal className="mb-8" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            Programs
          </p>
          <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
            Free, task-based, real progress.
          </h1>
          <p className="mt-3 text-sm text-fog-300">
            Complete every task in a program to earn its badge. Want to go
            deeper?{" "}
            <Link href="/courses" className="text-beam-400 underline underline-offset-2">
              The full 8-week Courses
            </Link>{" "}
            are a Premium feature.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {freePrograms.map((program, i) => (
            <Link
              key={program.slug}
              href={`/programs/${program.slug}`}
              className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6 transition hover:border-beam-500/40"
            >
              <span className="font-mono text-xs text-fog-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-3 font-display text-lg italic text-mist-50">
                {program.name}
              </h2>
              <p className="mt-1 text-xs uppercase tracking-wide text-beam-400">
                {program.tasks.length} tasks
              </p>
              <p className="mt-3 text-sm leading-relaxed text-fog-300">
                {program.tagline}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
