const POSITION_CLASSES = {
  "upper-left": "left-6 top-[38%] xl:left-28",
  "lower-left": "left-6 top-[74%] xl:left-28",
  right: "right-4 top-1/2 -translate-y-1/2 2xl:right-6",
} as const;

// The right-side quote needs a wider viewport before there's guaranteed
// clearance past the widest cards on the site (max-w-6xl, e.g. Programs
// and Courses list pages only leave ~64-192px past that card at xl/2xl
// breakpoints). Left quotes are unaffected — pages never get that wide on
// the left margin, so they keep the original xl breakpoint and width.
const VISIBILITY_CLASSES = {
  "upper-left": "hidden max-w-[200px] xl:block",
  "lower-left": "hidden max-w-[200px] xl:block",
  right: "hidden max-w-[160px] 2xl:block",
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
      className={`pointer-events-none fixed z-10 ${VISIBILITY_CLASSES[position]} ${POSITION_CLASSES[position]}`}
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
