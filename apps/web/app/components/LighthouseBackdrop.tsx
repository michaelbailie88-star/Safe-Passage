/**
 * The lighthouse STRUCTURE (this component) is position: absolute, not
 * fixed — it scrolls away with the page like normal content, appearing
 * once near the top and then scrolling out of view as the user scrolls
 * down. That's the fix for it perpetually following the scroll and
 * landing on top of form content further down the page: it simply isn't
 * pinned to the viewport anymore. Only the light itself — the glow, the
 * lamp core, and the sweeping beam, all in LighthouseBeam.tsx — stays
 * position: fixed and visible at all times.
 *
 * The SVG's width is capped at max-width: 100vw (see the svg element
 * below). This isn't cosmetic — without it, on every phone, this SVG's
 * derived width mathematically EXCEEDS the screen. Its width comes from
 * w-auto, computed from its own height (--lighthouse-h, close to full
 * viewport height) via its 400:600 intrinsic aspect ratio. Phone screens
 * are taller/narrower than that 1.5:1 ratio (e.g. a 390×844 viewport:
 * height minus header ≈ 748px, × 400/600 ≈ 499px wide — 28% wider than
 * the 390px screen itself), so this always overflows horizontally on
 * mobile, for any phone, not as an edge case. That overflow is what was
 * triggering the "nav bar gets smaller" bug: html/body's overflow-x:
 * hidden hides the ability to SCROLL to the overflow, but doesn't
 * reliably stop position:absolute content from expanding the browser's
 * underlying layout-viewport width calculation on mobile Safari — which
 * uses that width to decide the page's zoom/scale, auto-zooming out to
 * fit it, and then not zooming back in on its own. max-width: 100vw
 * fixes this at the source: the browser then treats height as auto
 * instead of the aspect-ratio-derived width once width hits that cap,
 * which shrinks the whole SVG down (proportionally, using the same
 * replaced-element sizing rules as e.g. an <img>) until it actually
 * fits — so it can never cause that overflow in the first place. On
 * desktop this constraint never actually engages (the derived width is
 * comfortably under 100vw there already), so nothing changes above md:.
 *
 * top is hardcoded to 0, NOT topOffset, despite this component still
 * taking a topOffset prop. On every page except Home, this renders
 * nested inside its own page's `<section className="relative ...">` as
 * the first child — meaning position:absolute is captured by THAT
 * section as its containing block, not the viewport. That section
 * already starts at the correct position via ordinary document flow
 * (pushed down by AppNav/NavBar's own height, same as any other
 * sibling) — so re-adding topOffset here on top of that would double
 * the offset (192px instead of 96px on every app-shell page). On Home,
 * the one page where this ISN'T nested in a relative section, topOffset
 * is 0 anyway, so top:0 is correct there too either way. topOffset is
 * still used below for height-class selection — .lighthouse-h-0 vs.
 * .lighthouse-h-96 — which is a real, page-dependent difference; it's
 * only the *position* math that no longer needs it.
 *
 * Size is the same, full-remaining-viewport-height formula everywhere
 * (--lighthouse-h in globals.css, via the .lighthouse-h-0 /
 * .lighthouse-h-96 class matching this page's topOffset) — no
 * mobile-specific shrink; width is now self-limiting via the max-width
 * fix above instead. Horizontal position: dead center on mobile, right:
 * 2% edge-anchored at md: (768px) and up — see .lighthouse-backdrop-x
 * in globals.css.
 *
 * `variant` is kept (rather than removing the prop and updating all 28
 * call sites) but doesn't affect anything here — full vs. soft is purely
 * a beam-intensity distinction, handled entirely in LighthouseBeam.tsx.
 */
export function LighthouseBackdrop({
  topOffset = 0,
  variant = "full",
}: {
  topOffset?: number;
  variant?: "full" | "soft";
}) {
  return (
    <div
      className={`pointer-events-none absolute z-10 lighthouse-backdrop-x ${topOffset === 96 ? "lighthouse-h-96" : "lighthouse-h-0"}`}
      style={{ top: 0, height: "var(--lighthouse-h)" }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 600"
        className="block h-full w-auto opacity-[0.16] sm:opacity-[0.18]"
        style={{ maxWidth: "100vw" }}
        fill="none"
      >
        {/* base skirt */}
        <path d="M130 560 L270 560 L258 518 L142 518 Z" fill="#8DA0B5" />

        {/* keeper's shed at the base */}
        <rect x="148" y="486" width="46" height="34" fill="#8DA0B5" />
        <rect x="163" y="498" width="12" height="22" fill="#080D16" opacity="0.4" />

        {/* tapered tower */}
        <path d="M172 148 L142 518 L258 518 L228 148 Z" fill="#8DA0B5" />

        {/* small window slits */}
        <rect x="193" y="230" width="7" height="20" fill="#080D16" opacity="0.4" />
        <rect x="191" y="330" width="8" height="22" fill="#080D16" opacity="0.4" />
        <rect x="189" y="430" width="9" height="24" fill="#080D16" opacity="0.4" />

        {/* gallery walkway + railing */}
        <rect x="158" y="140" width="84" height="9" fill="#8DA0B5" />
        <g stroke="#8DA0B5" strokeWidth="2">
          <line x1="164" y1="140" x2="164" y2="126" />
          <line x1="176" y1="140" x2="176" y2="126" />
          <line x1="188" y1="140" x2="188" y2="126" />
          <line x1="200" y1="140" x2="200" y2="126" />
          <line x1="212" y1="140" x2="212" y2="126" />
          <line x1="224" y1="140" x2="224" y2="126" />
          <line x1="236" y1="140" x2="236" y2="126" />
        </g>
        <line x1="160" y1="126" x2="240" y2="126" stroke="#8DA0B5" strokeWidth="2" />

        {/* octagonal lamp room */}
        <path
          d="M180 126 L180 100 L190 88 L210 88 L220 100 L220 126 Z"
          fill="#8DA0B5"
        />
        {/* glazing bars, just faintly darker to read as glass */}
        <line x1="200" y1="88" x2="200" y2="126" stroke="#080D16" strokeWidth="1.5" opacity="0.4" />
        <line x1="182" y1="108" x2="218" y2="108" stroke="#080D16" strokeWidth="1.5" opacity="0.4" />

        {/* domed roof + finial */}
        <path d="M176 88 L200 54 L224 88 Z" fill="#8DA0B5" />
        <circle cx="200" cy="48" r="4" fill="#8DA0B5" />
      </svg>

      {/* the bright center light — now travels with the structure, not
          the viewport, per the fix requested */}
      <div className="lighthouse-glow" />
      <div className="lighthouse-lamp-core" />
    </div>
  );
}
