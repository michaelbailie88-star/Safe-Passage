/**
 * The beam's origin must land exactly on the lamp in LighthouseBackdrop,
 * which is now right: 2% on every page (unified — see
 * LighthouseBackdrop.tsx), fixed, full viewport height *minus topOffset*,
 * natural width from its 400:600 viewBox aspect ratio. The lamp sits at
 * the exact horizontal center of that SVG (x=200 of a 400-wide viewBox),
 * so:
 *
 *   lampHeight = 100vh - topOffset
 *   lampWidth  = lampHeight * (400 / 600)
 *   lampCenterFromLeft = 100% - 2% - (lampWidth / 2)
 *
 * top: 17.8% is calibrated the same way — as a fraction of the lamp's
 * OWN height below topOffset, not the full viewport, which is why it's
 * already a calc() mixing px and vh for non-zero topOffset.
 *
 * Both top and left are computed here (not in static CSS) specifically
 * because they depend on topOffset, which is a runtime prop.
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
  const top =
    topOffset === 0 ? "17.8%" : `calc(${topOffset}px + (100vh - ${topOffset}px) * 0.178)`;

  const left =
    topOffset === 0
      ? "calc(100% - 2% - 33.3333vh)"
      : `calc(100% - 2% - (100vh - ${topOffset}px) * 0.333333)`;

  return (
    <div
      className={variant === "soft" ? "beam-wrap beam-wrap-soft" : "beam-wrap"}
      style={{ top, left }}
      aria-hidden="true"
    >
      <div className={variant === "soft" ? "beam beam-soft" : "beam"} />
    </div>
  );
}
