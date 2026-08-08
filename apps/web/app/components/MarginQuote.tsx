export function MarginQuote({
  quote,
  author,
}: {
  quote: string;
  author: string;
}) {
  return (
    <aside
      className="pointer-events-none fixed left-8 top-1/2 z-10 hidden max-w-[340px] -translate-y-1/2 2xl:block"
      aria-hidden="true"
    >
      <span className="font-display text-6xl italic text-beam-400">&ldquo;</span>
      <p className="mt-2 font-display text-2xl italic leading-snug text-mist-100">
        {quote}
      </p>
      <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-beam-400">
        — {author}
      </p>
    </aside>
  );
}
