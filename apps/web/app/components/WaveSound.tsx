"use client";

import { useState, useRef, useEffect } from "react";

// Synthesized surf: looped brown noise through a lowpass whose cutoff and
// gain swell on a slow cycle, with an occasional brighter crash burst.
// No audio files, starts only on user toggle.
export function WaveSound() {
  const [on, setOn] = useState(false);
  const nodesRef = useRef<{ ctx: AudioContext; stop: () => void } | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem("sp-waves") === "on") setOn(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (on && !nodesRef.current) startSurf();
    if (!on && nodesRef.current) {
      nodesRef.current.stop();
      nodesRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);

  useEffect(() => () => nodesRef.current?.stop(), []);

  function startSurf() {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const now = ctx.currentTime;

    // Brown noise loop (4s)
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 420;
    lp.Q.value = 0.4;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.09, now);

    // Slow swell LFO on gain + filter, so it breathes like surf
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.09;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.06;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    const lfo2 = ctx.createOscillator();
    lfo2.frequency.value = 0.07;
    const lfo2Gain = ctx.createGain();
    lfo2Gain.gain.value = 160;
    lfo2.connect(lfo2Gain);
    lfo2Gain.connect(lp.frequency);

    src.connect(lp);
    lp.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    lfo.start();
    lfo2.start();

    // Occasional crash burst
    const crashTimer = window.setInterval(() => {
      if (Math.random() < 0.6) return;
      const t = ctx.currentTime;
      const clen = ctx.sampleRate * 1.4;
      const cbuf = ctx.createBuffer(1, clen, ctx.sampleRate);
      const cd = cbuf.getChannelData(0);
      for (let i = 0; i < clen; i++) cd[i] = (Math.random() * 2 - 1) * (1 - i / clen);
      const csrc = ctx.createBufferSource();
      csrc.buffer = cbuf;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 900 + Math.random() * 600;
      bp.Q.value = 0.8;
      const cg = ctx.createGain();
      cg.gain.setValueAtTime(0.0001, t);
      cg.gain.exponentialRampToValueAtTime(0.05, t + 0.35);
      cg.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
      csrc.connect(bp);
      bp.connect(cg);
      cg.connect(ctx.destination);
      csrc.start();
    }, 7000);

    nodesRef.current = {
      ctx,
      stop: () => {
        window.clearInterval(crashTimer);
        ctx.close().catch(() => {});
      },
    };
  }

  function toggle() {
    const next = !on;
    setOn(next);
    try {
      localStorage.setItem("sp-waves", next ? "on" : "off");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      className={`wave-sound ${on ? "wave-sound-on" : ""}`}
    >
      {on ? "Waves on" : "Waves off"}
    </button>
  );
}
