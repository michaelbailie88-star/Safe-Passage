import type { ReactNode } from "react";
import { BrandSeal } from "./BrandSeal";

const beliefs = [
  "Every man has value.",
  "Every father can grow.",
  "Strength includes vulnerability.",
  "Asking for help is courageous.",
  "Healing creates better fathers.",
  "Brotherhood changes lives.",
];

export function Mission({ marginQuote }: { marginQuote: ReactNode }) {
  return (
    <section
      id="mission"
      aria-label="Mission and core beliefs"
      className="relative overflow-hidden bg-storm-800/50 pb-24 pt-32 sm:pt-40"
    >
      {marginQuote}
      <div className="mx-4 sm:mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
        <h1 className="sr-only">Mission</h1>
        <BrandSeal className="mb-8" />
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
          North star
        </p>
        <blockquote className="mt-6 font-display text-3xl italic leading-snug text-mist-50 sm:text-4xl">
          &ldquo;No man should have to navigate life&rsquo;s storms
          alone.&rdquo;
        </blockquote>

        <ul className="mx-auto mt-12 grid max-w-xl gap-y-3 text-left text-sm text-fog-300 sm:grid-cols-2 sm:gap-x-8">
          {beliefs.map((belief) => (
            <li key={belief} className="flex gap-2">
              <span className="text-beam-400">&ndash;</span>
              {belief}
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-14 max-w-xl border-t border-storm-700 pt-10 text-left">
          <p className="text-center font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            Why I built this
          </p>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-fog-300">
            <p>
              I became a father young. My kids were my whole world &mdash;
              and I didn&rsquo;t yet know that one day, that world would
              crash.
            </p>
            <p>
              I couldn&rsquo;t predict the storms coming. I couldn&rsquo;t
              prevent them. All I could do was go through them. Battle
              after battle, I endured in silence, and piece by piece, I
              lost parts of myself along the way. Depression. Thoughts of
              not wanting to be alive anymore. A darkness so complete that
              I became afraid of the light.
            </p>
            <p>
              In a storm like that, you&rsquo;ll take any security you can
              find &mdash; but I learned that security means nothing
              without safety underneath it. Safety in your mind. Safety in
              your self-confidence. Safety in the choices you make. You
              can&rsquo;t build the life you want until your life is
              safely secured first.
            </p>
            <p>
              It took real work &mdash; programs, people who showed up for
              me, and rediscovering my faith &mdash; before I found that
              safety. I was given a safe passage through my own storm. And
              with it, I was given a mission.
            </p>
            <p className="font-display text-base italic text-mist-100">
              Go back into the storm. Find the men still lost in it, on
              paths no one marked for them, and extend the same safety I
              was given.
            </p>
            <p>
              I didn&rsquo;t know my way out. That&rsquo;s exactly why
              I&rsquo;ve made it my mission to help other men find theirs.
            </p>
            <p className="pt-2 text-right text-xs text-fog-500">
              &mdash; Michael, founder
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
