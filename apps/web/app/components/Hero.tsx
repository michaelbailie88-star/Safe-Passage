import type { ReactNode } from "react";
import Link from "next/link";
import { BrandSeal } from "./BrandSeal";

export function Hero({ marginQuote }: { marginQuote: ReactNode }) {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-storm-gradient pb-28 pt-32 sm:pt-40"
    >
      {marginQuote}
      <div className="relative mx-4 sm:mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
        <BrandSeal className="mb-8" />
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
          Position holding · Safe Passage
        </p>
        <h1
          id="hero-heading"
          className="font-display text-4xl italic leading-[1.15] text-mist-50 sm:text-5xl md:text-6xl"
        >
          The lighthouse for men navigating life&rsquo;s storms.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-balance text-base text-fog-300 sm:text-lg">
          For men rebuilding after divorce, burnout, job loss, or
          isolation — a private next step, not an overwhelming platform.
          Start free with a guided program built around where you are
          right now.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/sign-up"
            className="relative z-40 w-full rounded-full bg-[#E5A526] px-7 py-3 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B] sm:w-auto"
          >
            Start your free program
          </Link>
          <Link
            href="/mission"
            className="w-full rounded-full border border-fog-500/30 px-7 py-3 text-sm font-medium text-mist-100 transition hover:border-fog-500/60 sm:w-auto"
          >
            Read the mission
          </Link>
        </div>
      </div>
    </section>
  );
}
