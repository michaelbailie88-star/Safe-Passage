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
 * Reach: .beam-wrap sets top (the lamp's exact position, computed below)
 * and bottom: 0 (in globals.css) with no explicit height — an absolutely
 * positioned box with both top and bottom set has its height computed as
 * exactly the distance between them. Since the containing block is the
 * page's full content, that distance IS the true remaining page height
 * below the lamp, on every page, of every length — nothing guessed or
 * fixed. .beam then sets height: 100% to exactly fill that span, so the
 * sweep always runs the whole way down to the bottom of the page.
 *
 * Horizontal position: dead center on mobile, fixed there permanently.
 * At md: (768px) and up, restores the exact original formula — the
 * beam's zero-size anchor point sits wherever lands its center exactly
 * on the lamp's true position, right: 2% edge-anchored, unchanged from
 * every previous version of this file. This value never actually
 * depended on topOffset (only --lighthouse-h, itself already a CSS
 * variable), so it lives entirely in a static CSS class —
 * .lighthouse-beam-x in globals.css — instead of a JS template string.
 *
 * .beam-wrap is a zero-width point (width:0), stretched top-to-bottom
 * per above, at the lamp's true horizontal position. The glow, lamp-core,
 * and beam are all children centered on that SAME horizontal point (glow/
 * lamp-core via top:0/left:0 + translate(-50%, -50%); beam via top:0/
 * left:50% + translateX(-50%), since it extends outward rather than
 * sitting centered on the point) — one shared anchor, so all three
 * pieces of "the light" can never drift apart from each other, or from
 * where the (now identically-scrolling) lighthouse structure happens to
 * currently be.
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
