/**
 * The beam's origin (top: 17.8%) is calibrated for a lighthouse that spans
 * the full viewport (topOffset 0). When the lighthouse is offset down (e.g.
 * in the app shell, to clear the header), the lamp's actual position shifts
 * to topOffset + 17.8% of the *remaining* height below that offset — this
 * mixes px and vh units, so it has to be a calc() expression, not a plain
 * percentage.
 *
 * variant="full" (Home landing page, Dashboard only): the signature
 * dramatic sweep, unchanged, rendered above content.
 *
 * variant="soft" (everywhere else): the same sweep, but dimmed and pushed
 * to a negative z-index so it renders behind every card and content
 * element on the page, instead of overlaying/washing out text a user is
 * actively trying to read or interact with.
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

  return (
    <div
      className={variant === "soft" ? "beam-wrap beam-wrap-soft" : "beam-wrap"}
      style={{ top }}
      aria-hidden="true"
    >
      <div className={variant === "soft" ? "beam beam-soft" : "beam"} />
    </div>
  );
}
