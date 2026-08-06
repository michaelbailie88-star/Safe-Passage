export function LighthouseBackdrop({ topOffset = 0 }: { topOffset?: number }) {
  return (
    <div
      className="pointer-events-none fixed z-10"
      style={{ right: "-15%", top: topOffset, bottom: 0 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 600"
        className="block h-full w-auto max-w-none opacity-[0.16] sm:opacity-[0.18]"
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

      {/* brighter light — the source the beam sweeps from */}
      <div className="lighthouse-glow" />
      <div className="lighthouse-lamp-core" />
    </div>
  );
}
