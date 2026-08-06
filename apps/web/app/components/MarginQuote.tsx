export function MarginQuote({ quote, author }: { quote: string; author: string }) {
  return (
    <aside
      className="pointer-events-none fixed left-6 top-1/2 z-10 hidden max-w-[200px] -translate-y-1/2 xl:left-12 xl:block"
      aria-hidden="true"
    >
      <span className="font-display text-4xl italic text-fog-500/40">&ldquo;</span>
      <p className="mt-1 font-display text-sm italic leading-relaxed text-fog-300/50">
        {quote}
      </p>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-fog-500/40">
        — {author}
      </p>
    </aside>
  );
}
