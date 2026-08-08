// cardWidthPx must match the actual pixel width of the glass-morphism card
// on the page this is used on (e.g. 672 for max-w-2xl, 768 for max-w-3xl,
// 512 for max-w-lg). The quote's wrapper spans exactly from the screen's
// left edge to the card's left edge — since the card is centered via
// mx-auto, that edge sits at (100vw - cardWidthPx) / 2. The quote is then
// centered horizontally and vertically within that gutter. Because the
// wrapper's width is mathematically tied to the card's actual edge, the
// quote cannot overlap the card by construction, at any viewport width —
// this doesn't need to be re-verified per page like the old fixed-offset
// version did.
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
      className="pointer-events-none fixed left-0 top-0 z-10 hidden h-full 2xl:flex 2xl:items-center 2xl:justify-center"
      style={{ width: `calc((100vw - ${cardWidthPx}px) / 2)` }}
      aria-hidden="true"
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
    </aside>
  );
}
