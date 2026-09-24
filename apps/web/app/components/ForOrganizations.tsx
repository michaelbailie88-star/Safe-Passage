import type { ReactNode } from "react";
import { BrandSeal } from "./BrandSeal";

// PLACEHOLDER COPY — Michael will fill in real content for this section later.
// Carried over from the old shared ForWho/Organizations column as a starting point.
const placeholderBody =
  "Churches, employers, mental wellness organizations, family organizations, and corporate wellness programs partner with Safe Passage to support the men in their care.";

export function ForOrganizations({ marginQuote }: { marginQuote: ReactNode }) {
  return (
    <section
      id="organizations"
      aria-labelledby="organizations-heading"
      className="relative border-t border-storm-700/60 bg-storm-900 pb-24 pt-32 sm:pt-40"
    >
      {marginQuote}
      <div className="mx-4 sm:mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
        <BrandSeal className="mb-8" />
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
          Alongside them
        </p>
        <h1
          id="organizations-heading"
          className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl"
        >
          Organizations who show up for men.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-fog-300">
          {placeholderBody}
        </p>
        <a
          href="https://form.jotform.com/262655906336060"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-full bg-[#E5A526] px-8 py-3.5 text-sm font-semibold text-[#080D16] shadow-[0_0_34px_-6px_rgba(242,184,75,0.7)] transition hover:bg-[#F2B84B]"
        >
          Partner With Us &rarr;
        </a>
      </div>
    </section>
  );
}
