/**
 * This renders ONLY the beam sweep now. The lamp glow and its bright
 * core moved back into LighthouseBackdrop, so the bright center light
 * stays fixed to the lighthouse structure and scrolls away with it —
 * only the sweep itself remains position: fixed, ambient, and
 * independent of scroll.
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
 * .beam-wrap is a zero-size point (width:0; height:0) at the lamp's true
 * position. The glow, lamp-core, and beam are all children centered on
 * that SAME point (glow/lamp-core via top:0/left:0 + translate(-50%,
 * -50%); beam via top:0/left:50% + translateX(-50%), since it extends
 * outward rather than sitting centered on the point) — one shared
 * anchor, so all three pieces of "the light" can never drift apart from
 * each other, or from where the (now separately-scrolling) lighthouse
 * structure happens to currently be.
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
