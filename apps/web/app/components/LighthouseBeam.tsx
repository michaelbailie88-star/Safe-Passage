/**
 * The beam's origin must land exactly on the lamp in LighthouseBackdrop,
 * which is right: 2% on every page, fixed, sized by the SAME
 * --lighthouse-h CSS variable as the backdrop (see globals.css /
 * LighthouseBackdrop.tsx) via the matching .lighthouse-h-0 /
 * .lighthouse-h-96 class. Using that one shared variable — rather than
 * two separate hardcoded formulas — is what guarantees the beam's origin
 * and the backdrop's actual size can never drift apart at any
 * breakpoint, including the mobile-specific size introduced by this fix.
 *
 * The lamp sits at the exact horizontal center of the backdrop SVG
 * (x=200 of a 400-wide viewBox) and 17.8% down from its top, so:
 *
 *   lampTop  = topOffset + lighthouseHeight * 0.178
 *   lampLeft = 100% - 2% - (lighthouseHeight * 400/600 / 2)
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
  const left = "calc(100% - 2% - var(--lighthouse-h) * 0.333333)";
  const heightClass = topOffset === 96 ? "lighthouse-h-96" : "lighthouse-h-0";

  return (
    <div
      className={`${heightClass} ${variant === "soft" ? "beam-wrap beam-wrap-soft" : "beam-wrap"}`}
      style={{ top, left }}
      aria-hidden="true"
    >
      <div className={variant === "soft" ? "beam beam-soft" : "beam"} />
    </div>
  );
}
