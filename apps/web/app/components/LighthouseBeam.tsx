/**
 * This renders ONLY the beam sweep now. The lamp glow and its bright
 * core moved back into LighthouseBackdrop, so the bright center light
 * stays fixed to the lighthouse structure and scrolls away with it —
 * the sweep itself is now ALSO position: absolute (previously fixed),
 * sharing the exact same containing block as LighthouseBackdrop (the
 * page's own <section className="relative ..."> — or the document root
 * on Home — which wraps that page's full content top-to-bottom). That's
 * the fix for the beam appearing as a disconnected, randomly-floating
 * streak once scrolled: as position: fixed it stayed glued to one spot
 * in the viewport regardless of scroll, while the lighthouse structure
 * (position: absolute) scrolled away underneath it — two different
 * coordinate systems. Now both share the same one, so the beam moves in
 * lockstep with its source at every scroll position, like a real beam
 * of light physically attached to the lamp.
 *
 * Reach: fixed at 150vmax (square, matching the width) — not stretched
 * to the literal bottom of the page. That was tried (top + bottom: 0 on
 * .beam-wrap, height: 100% on .beam) and reverted: conic-gradient's
 * color stops are purely angular, with no distance-based fade, so a
 * wedge stretched tall while staying the same width widens enormously
 * the farther it gets from the lamp — like a pie slice getting wider
 * away from its center. On a long page the wedge became so wide by
 * mid-page that only a slice of one of its two straight angled edges
 * was ever inside the viewport, reading as a hard-edged block or a flat
 * diagonal line instead of a beam, and vanishing in other places
 * entirely. 150vmax keeps the exact square proportions the wedge shape
 * was actually tuned for — generous reach on any realistic page, without
 * distorting it.
 *
 * .beam-wrap is a zero-size point (width: 0; height: 0) at the lamp's
 * true position, NOT stretched top-to-bottom. The glow, lamp-core, and
 * beam are all children centered on that SAME point (glow/lamp-core via
 * top:0/left:0 + translate(-50%, -50%); beam via top:0/left:50% +
 * translateX(-50%), since it extends outward rather than sitting
 * centered on the point) — one shared anchor, so all three pieces of
 * "the light" can never drift apart from each other, or from where the
 * (now identically-scrolling) lighthouse structure happens to currently
 * be.
 *
 *   lampTop = topOffset + lighthouseHeight * 0.178
 *
 * top still depends on topOffset (a runtime prop, 0 or 96), so it stays
 * as an inline calc() here.
 *
 * variant="full" (Home landing page, Dashboard only): the signature
 * dramatic sweep, unchanged, rendered above content. Position is now
 * identical to every other page — only intensity/stacking differs.
 *
 * variant="soft" (everywhere else): the same sweep, but dimmed and
 * rendered behind every card and content element on the page (via DOM
 * order, not a negative z-index — see .beam-wrap-soft in globals.css),
 * instead of overlaying/washing out text a user is actively reading.
 */
export function LighthouseBeam({
  topOffset = 0,
  variant = "full",
}: {
  topOffset?: number;
  variant?: "full" | "soft";
}) {
  const top = `calc(${topOffset}px + var(--lighthouse-h) * 0.178)`;
  const heightClass = topOffset === 96 ? "lighthouse-h-96" : "lighthouse-h-0";

  return (
    <div
      className={`${heightClass} lighthouse-beam-x ${variant === "soft" ? "beam-wrap beam-wrap-soft" : "beam-wrap"}`}
      style={{ top }}
      aria-hidden="true"
    >
      <div className={variant === "soft" ? "beam beam-soft" : "beam"} />
    </div>
  );
}
