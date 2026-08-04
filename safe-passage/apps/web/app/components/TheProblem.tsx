const storms = [
  "Isolation",
  "Depression",
  "Anxiety",
  "Fatherhood struggles",
  "Relationship breakdown",
  "Divorce",
  "Financial stress",
  "Identity loss",
  "Addiction",
  "Shame",
];

export function TheProblem() {
  return (
    <section
      id="the-problem"
      aria-labelledby="the-problem-heading"
      className="border-t border-storm-700/60 bg-storm-950 py-24"
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
          The problem
        </p>
        <h2
          id="the-problem-heading"
          className="mt-4 font-display text-2xl text-mist-50 sm:text-3xl"
        >
          Millions of men are weathering this silently.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-fog-300">
          Many don&rsquo;t seek help because existing solutions feel
          clinical, impersonal, or simply don&rsquo;t resonate. Safe Passage
          is built around resilience and community — not labels.
        </p>

        <ul className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2.5">
          {storms.map((storm) => (
            <li
              key={storm}
              className="rounded-full border border-storm-700 bg-storm-800/60 px-4 py-1.5 text-sm text-fog-300"
            >
              {storm}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
