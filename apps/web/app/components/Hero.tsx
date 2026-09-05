import type { ReactNode } from "react";
import Link from "next/link";
import { BrandSeal } from "./BrandSeal";

export function Hero({ marginQuote }: { marginQuote: ReactNode }) {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="hero-cine relative overflow-hidden"
    >
      <div className="hero-cine-bg" aria-hidden="true" />
      <div className="storm-clouds" aria-hidden="true" />
      <div className="hero-stars" aria-hidden="true" />

      {/* live beam sweeping from the lighthouse lamp in the photograph */}
      <span className="hero-lamp" aria-hidden="true" />
      <span className="hero-beam" aria-hidden="true" />
      <span className="hero-beam hero-beam-low" aria-hidden="true" />

      {/* soft darkness behind the type so the message floats on the storm */}
      <div className="hero-vignette" aria-hidden="true" />

      {marginQuote}

      <div className="relative z-10 mx-auto w-full max-w-2xl px-6 text-center">
        <p className="rise-in rise-d1 mb-7 flex items-center justify-center gap-5 font-mono text-[11px] uppercase tracking-[0.34em] text-signal-400">
          <span className="hero-rule" aria-hidden="true" />
          A lighthouse for men
          <span className="hero-rule" aria-hidden="true" />
        </p>
        <h1
          id="hero-heading"
          className="rise-in rise-d1 font-display text-5xl italic leading-[1.08] text-mist-50 [text-shadow:0_2px_40px_rgba(8,13,22,0.9)] sm:text-6xl"
        >
          You weren&rsquo;t<br />built to <span className="text-glow-amber">sink.</span>
        </h1>
        <p className="rise-in rise-d2 mx-auto mt-6 max-w-lg text-balance text-base leading-relaxed text-mist-100/85 [text-shadow:0_1px_20px_rgba(8,13,22,0.9)] sm:text-lg">
          Guided programs, a brotherhood that answers, and a Listener that&rsquo;s
          awake at 3 a.m. — built for men carrying divorce, burnout, job loss,
          or isolation. Start free. No card. No performance.
        </p>

        <div className="rise-in rise-d3 mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/sign-up"
            className="relative z-40 w-full rounded-full bg-[#E5A526] px-8 py-3.5 text-sm font-semibold text-[#080D16] shadow-[0_0_34px_-6px_rgba(242,184,75,0.7)] transition hover:bg-[#F2B84B] sm:w-auto"
          >
            Start your free program
          </Link>
          <Link
            href="/mission"
            className="w-full rounded-full border border-mist-100/25 px-8 py-3.5 text-sm font-medium text-mist-100 backdrop-blur-sm transition hover:border-beam-400/60 hover:text-beam-400 sm:w-auto"
          >
            Read the mission
          </Link>
        </div>
      </div>
    </section>
  );
}
