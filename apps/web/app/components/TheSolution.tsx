import Link from "next/link";
import { BrandSeal } from "./BrandSeal";

const pillars = [
  {
    name: "The Lighthouse",
    role: "Your dashboard",
    description: "Daily emotional check-ins, habit tracking, goals, and progress in one place.",
    href: "/dashboard",
  },
  {
    name: "The Logbook",
    role: "Private journaling",
    description: "Guided reflections, mood tracking, gratitude, and fatherhood reflections.",
    href: "/logbook",
  },
  {
    name: "The Crossing",
    role: "Transformation programs",
    description: "Rebuild, Fatherhood, Purpose, Relationships, Confidence, and Faith (optional).",
    href: "/programs",
  },
  {
    name: "The Watch",
    role: "Community",
    description: "Accountability, discussion groups, mentorship, and events.",
    href: undefined,
  },
  {
    name: "The Beacon",
    role: "Support center",
    description: "Trusted contacts, professional resources, and safety information.",
    href: "/resources",
  },
];

export function TheSolution() {
  return (
    <section id="platform" aria-labelledby="platform-heading" className="bg-storm-900 pb-24 pt-32 sm:pt-40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-4 sm:mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
          <BrandSeal className="mb-8" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            The platform
          </p>
          <h1
            id="platform-heading"
            className="mt-4 font-display text-2xl text-mist-50 sm:text-3xl"
          >
            Five ways to find your footing.
          </h1>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {pillars.map((pillar, i) => {
            const cardClasses =
              "rounded-2xl border border-storm-700 bg-storm-800/40 p-6 transition hover:border-beam-500/40";
            const content = (
              <>
                <span className="font-mono text-xs text-fog-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-lg italic text-mist-50">
                  {pillar.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-beam-400">
                  {pillar.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-fog-300">
                  {pillar.description}
                </p>
              </>
            );

            return pillar.href ? (
              <Link key={pillar.name} href={pillar.href} className={cardClasses}>
                {content}
              </Link>
            ) : (
              <div key={pillar.name} className={cardClasses}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
