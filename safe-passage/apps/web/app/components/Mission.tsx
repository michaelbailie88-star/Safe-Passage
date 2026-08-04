import { BrandSeal } from "./BrandSeal";

const beliefs = [
  "Every man has value.",
  "Every father can grow.",
  "Strength includes vulnerability.",
  "Asking for help is courageous.",
  "Healing creates better fathers.",
  "Brotherhood changes lives.",
];

export function Mission() {
  return (
    <section
      id="mission"
      aria-label="Mission and core beliefs"
      className="relative overflow-hidden bg-storm-800/50 pb-24 pt-32 sm:pt-40"
    >
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
      </div>
    </section>
  );
}
