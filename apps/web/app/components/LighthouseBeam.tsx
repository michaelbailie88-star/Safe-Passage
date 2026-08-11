/**
 * Horizontal position: dead center on mobile, fixed there permanently.
 * At md: (768px) and up, restores the exact original formula — the
 * beam's zero-size anchor point sits wherever lands its center exactly
 * on the lamp's true position, right: 2% edge-anchored, unchanged from
 * every previous version of this file. This value never actually
 * depended on topOffset (only --lighthouse-h, itself already a CSS
 * variable), so it now lives entirely in a static CSS class —
 * .lighthouse-beam-x in globals.css — instead of a JS template string.
 *
 * The beam's origin must land exactly on the lamp in LighthouseBackdrop,
 * sized by the SAME --lighthouse-h CSS variable as the backdrop (see
 * globals.css / LighthouseBackdrop.tsx) via the matching .lighthouse-h-0
 * / .lighthouse-h-96 class. Using that one shared variable — rather than
 * separate hardcoded formulas — is what guarantees the beam's origin and
 * the backdrop's actual size can never drift apart at any breakpoint.
 *
 * The lamp sits at the exact horizontal center of the backdrop SVG
 * (x=200 of a 400-wide viewBox) and 17.8% down from its top, so:
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
