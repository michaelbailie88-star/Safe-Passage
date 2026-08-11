import type { ReactNode } from "react";
import { BrandSeal } from "./BrandSeal";
import { LighthouseBackdrop } from "./LighthouseBackdrop";
import { LighthouseBeam } from "./LighthouseBeam";

const primary = [
  "Fathers",
  "Single fathers",
  "Divorced fathers",
  "Men rebuilding after hardship",
  "Professionals",
  "Veterans",
  "Tradesmen",
  "Entrepreneurs",
];

export function ForWho({ marginQuote }: { marginQuote: ReactNode }) {
  return (
    <section
      id="for-who"
      aria-labelledby="for-who-heading"
      className="relative border-t border-storm-700/60 bg-storm-950 pb-24 pt-32 sm:pt-40"
    >
      <LighthouseBackdrop variant="soft" />
      <LighthouseBeam variant="soft" />
      {marginQuote}
      <div className="mx-4 sm:mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
        <BrandSeal className="mb-8" />
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
          Built for
        </p>
        <h1
          id="for-who-heading"
          className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl"
        >
          Men aged 25&ndash;55, especially&hellip;
        </h1>
        <ul className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-x-6 gap-y-2 text-left text-sm text-fog-300">
          {primary.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-beam-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
