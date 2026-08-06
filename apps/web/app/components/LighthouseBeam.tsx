/**
 * The beam's origin (top: 17.8%) is calibrated for a lighthouse that spans
 * the full viewport (topOffset 0). When the lighthouse is offset down (e.g.
 * in the app shell, to clear the header), the lamp's actual position shifts
 * to topOffset + 17.8% of the *remaining* height below that offset — this
 * mixes px and vh units, so it has to be a calc() expression, not a plain
 * percentage.
 */
export function LighthouseBeam({ topOffset = 0 }: { topOffset?: number }) {
  const top =
    topOffset === 0 ? "17.8%" : `calc(${topOffset}px + (100vh - ${topOffset}px) * 0.178)`;

  return (
    <div className="beam-wrap" style={{ top }} aria-hidden="true">
      <div className="beam" />
    </div>
  );
}
