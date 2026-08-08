// cardWidthPx must match the actual pixel width of the glass-morphism card
// on the page this is used on (e.g. 672 for max-w-2xl, 768 for max-w-3xl,
// 512 for max-w-lg). The quote's wrapper spans exactly from the left edge
// of its containing section to the card's left edge — since the card is
// centered via mx-auto, that edge sits at (100% - cardWidthPx) / 2 of the
// section's own width. The quote is centered horizontally and vertically
// within that gutter.
//
// This is `absolute`, not `fixed`. Absolute is scoped to the nearest
// positioned ancestor (the <section> this renders inside must have
// `relative` set), so the quote scrolls away naturally together with its
// own section — it appears once, next to the one card it belongs to, and
// is gone once you scroll past that section. `fixed` would pin it to the
// screen and keep it floating over every section indefinitely, which is
// not what's wanted here.
export function MarginQuote({
  quote,
  author,
  cardWidthPx,
}: {
  quote: string;
  author: string;
  cardWidthPx: number;
}) {
  return (
    <aside
      className="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-full 2xl:flex 2xl:items-center 2xl:justify-center"
      aria-hidden="true"
    >
      <div
        className="flex h-full items-center justify-center"
        style={{ width: `calc((100% - ${cardWidthPx}px) / 2)` }}
      >
        <div className="max-w-[340px] px-6">
          <span className="font-display text-6xl italic text-beam-400">&ldquo;</span>
          <p className="mt-2 font-display text-2xl italic leading-snug text-mist-100">
            {quote}
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-beam-400">
            — {author}
          </p>
        </div>
      </div>
    </aside>
  );
}
