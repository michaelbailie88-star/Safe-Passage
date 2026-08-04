const points = [
  "Privacy by design.",
  "Not a replacement for professional mental healthcare.",
  "Crisis resources are always accessible.",
  "Community safety and moderation are core features.",
  "The faith pathway is optional, always.",
];

export function TrustStrip() {
  return (
    <section
      id="non-negotiables"
      aria-label="Our non-negotiables"
      className="border-y border-storm-700/60 bg-storm-950 py-14"
    >
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-center font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
          Our non-negotiables
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3 text-center text-sm text-fog-300">
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
