const POSITION_CLASSES = {
  "upper-left": "left-6 top-[38%] xl:left-28",
  "lower-left": "left-6 top-[74%] xl:left-28",
  right: "right-6 top-1/2 -translate-y-1/2 xl:right-96",
} as const;

export function MarginQuote({
  quote,
  author,
  position,
}: {
  quote: string;
  author: string;
  position: "upper-left" | "lower-left" | "right";
}) {
  return (
    <aside
      className={`pointer-events-none fixed z-10 hidden max-w-[200px] xl:block ${POSITION_CLASSES[position]}`}
      aria-hidden="true"
    >
      <span className="font-display text-4xl italic text-beam-400">&ldquo;</span>
      <p className="mt-1 font-display text-sm italic leading-relaxed text-mist-100">
        {quote}
      </p>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-beam-400">
        — {author}
      </p>
    </aside>
  );
}
