"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The living storm: distant active lighthouse with a real sweeping beam,
 * rain layers, random lightning with synced thunder, heavy surf with
 * frequent crashes, and a ship horn every 30-45s. `full` adds the
 * lighthouse + waves (marketing pages); ambient mode (app shell) keeps
 * rain + lightning + sound only.
 * All audio is synthesized — no files. Off by default; toggle persisted.
 */
export function StormScene({ full = false }: { full?: boolean }) {
  const [on, setOn] = useState(false);
  const flashRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<{ ctx: AudioContext; stop: () => void; thunder: (big: boolean) => void } | null>(null);
  const onRef = useRef(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("sp-storm") === "on") setOn(true);
    } catch {}
  }, []);

  useEffect(() => {
    onRef.current = on;
  }, [on]);

  /* Lightning: random strikes every 9-22s, thunder follows the flash */
  useEffect(() => {
    let timer: number;
    let alive = true;
    const strike = () => {
      const el = flashRef.current;
      if (el) {
        el.classList.remove("ss-flash-go");
        void el.offsetWidth;
        el.classList.add("ss-flash-go");
      }
      if (audioRef.current) {
        const delay = 700 + Math.random() * 1400;
        window.setTimeout(() => audioRef.current?.thunder(Math.random() < 0.35), delay);
      }
      if (alive) timer = window.setTimeout(strike, 9000 + Math.random() * 13000);
    };
    timer = window.setTimeout(strike, 4000 + Math.random() * 5000);
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (on && !audioRef.current) startStorm();
    if (!on && audioRef.current) {
      audioRef.current.stop();
      audioRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);

  useEffect(() => () => audioRef.current?.stop(), []);

  function startStorm() {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 1;
    master.connect(ctx.destination);

    /* --- heavy surf: looped brown noise, swelling --- */
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.4;
    }
    const surf = ctx.createBufferSource();
    surf.buffer = buf;
    surf.loop = true;
    const surfLp = ctx.createBiquadFilter();
    surfLp.type = "lowpass";
    surfLp.frequency.value = 400;
    surfLp.Q.value = 0.4;
    const surfGain = ctx.createGain();
    surfGain.gain.value = 0.13;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.11;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.07;
    lfo.connect(lfoGain);
    lfoGain.connect(surfGain.gain);
    const lfo2 = ctx.createOscillator();
    lfo2.frequency.value = 0.07;
    const lfo2Gain = ctx.createGain();
    lfo2Gain.gain.value = 170;
    lfo2.connect(lfo2Gain);
    lfo2Gain.connect(surfLp.frequency);
    surf.connect(surfLp);
    surfLp.connect(surfGain);
    surfGain.connect(master);
    surf.start();
    lfo.start();
    lfo2.start();

    /* --- frequent crashing waves: every 3.5-6.5s --- */
    const crash = () => {
      const t = ctx.currentTime;
      const clen = Math.floor(ctx.sampleRate * 1.7);
      const cbuf = ctx.createBuffer(1, clen, ctx.sampleRate);
      const cd = cbuf.getChannelData(0);
      for (let i = 0; i < clen; i++) {
        const p = i / clen;
        cd[i] = (Math.random() * 2 - 1) * (p < 0.2 ? p * 5 : Math.pow(1 - p, 1.6));
      }
      const csrc = ctx.createBufferSource();
      csrc.buffer = cbuf;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 650 + Math.random() * 700;
      bp.Q.value = 0.6;
      const cg = ctx.createGain();
      cg.gain.setValueAtTime(0.0001, t);
      cg.gain.exponentialRampToValueAtTime(0.3, t + 0.22);
      cg.gain.exponentialRampToValueAtTime(0.0001, t + 1.7);
      csrc.connect(bp);
      bp.connect(cg);
      cg.connect(master);
      csrc.start();
      crashTimer = window.setTimeout(crash, 3000 + Math.random() * 2500);
    };
    let crashTimer = window.setTimeout(crash, 1500);

    /* --- ship horn: every 30-45s, a full 7-second distant moan --- */
    const horn = () => {
      const t = ctx.currentTime;
      const dur = 7;
      const hg = ctx.createGain();
      hg.gain.setValueAtTime(0.0001, t);
      hg.gain.exponentialRampToValueAtTime(0.11, t + 0.8);
      hg.gain.setValueAtTime(0.11, t + 4.4);
      hg.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      const hlp = ctx.createBiquadFilter();
      hlp.type = "lowpass";
      hlp.frequency.value = 320;
      hg.connect(hlp);
      hlp.connect(master);
      [98, 147.2, 196].forEach((f) => {
        const o = ctx.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = f;
        o.connect(hg);
        o.start(t);
        o.stop(t + dur + 0.2);
      });
      hornTimer = window.setTimeout(horn, 30000 + Math.random() * 15000);
    };
    let hornTimer = window.setTimeout(horn, 12000 + Math.random() * 8000);

    /* --- thunder: called shortly after each lightning flash --- */
    const thunder = (big: boolean) => {
      const t = ctx.currentTime;
      const dur = big ? 4.5 : 2.8;
      const tlen = Math.floor(ctx.sampleRate * dur);
      const tbuf = ctx.createBuffer(1, tlen, ctx.sampleRate);
      const td = tbuf.getChannelData(0);
      let l = 0;
      for (let i = 0; i < tlen; i++) {
        const p = i / tlen;
        const white = Math.random() * 2 - 1;
        l = (l + 0.04 * white) / 1.04;
        td[i] = l * 4 * (p < 0.06 ? p / 0.06 : Math.pow(1 - p, 1.25));
      }
      const tsrc = ctx.createBufferSource();
      tsrc.buffer = tbuf;
      const tlp = ctx.createBiquadFilter();
      tlp.type = "lowpass";
      tlp.frequency.setValueAtTime(big ? 220 : 150, t);
      tlp.frequency.exponentialRampToValueAtTime(55, t + dur);
      const tg = ctx.createGain();
      tg.gain.setValueAtTime(0.0001, t);
      tg.gain.exponentialRampToValueAtTime(big ? 0.4 : 0.26, t + 0.09);
      tg.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      tsrc.connect(tlp);
      tlp.connect(tg);
      tg.connect(master);
      tsrc.start();
      /* sub-rumble under it */
      const sub = ctx.createOscillator();
      sub.type = "sine";
      sub.frequency.setValueAtTime(48, t);
      sub.frequency.exponentialRampToValueAtTime(30, t + dur);
      const sg = ctx.createGain();
      sg.gain.setValueAtTime(0.0001, t);
      sg.gain.exponentialRampToValueAtTime(big ? 0.12 : 0.07, t + 0.15);
      sg.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      sub.connect(sg);
      sg.connect(master);
      sub.start(t);
      sub.stop(t + dur);
    };

    audioRef.current = {
      ctx,
      thunder,
      stop: () => {
        window.clearTimeout(crashTimer);
        window.clearTimeout(hornTimer);
        ctx.close().catch(() => {});
      },
    };
  }

  function toggle() {
    const next = !on;
    setOn(next);
    try {
      localStorage.setItem("sp-storm", next ? "on" : "off");
    } catch {}
  }

  return (
    <>
      {full && (
        <div className="ss-waves" aria-hidden="true">
          <span className="wave wave-1" />
          <span className="wave wave-2" />
          <span className="wave wave-3" />
        </div>
      )}

      {full && (
        <>
          {/* the real lighthouse lives in the global storm photo; these are
              its lamp glow and live sweeping beams, anchored to the fixed
              background so they align on every page */}
          <span className="hero-lamp" aria-hidden="true" />
          <span className="hero-beam" aria-hidden="true" />
          <span className="hero-beam hero-beam-low" aria-hidden="true" />
        </>
      )}

      <div className="ss-rain ss-rain-a" aria-hidden="true" />
      <div className="ss-rain ss-rain-b" aria-hidden="true" />
      <div ref={flashRef} className="ss-flash" aria-hidden="true" />

      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        className={`ss-sound ${on ? "ss-sound-on" : ""}`}
      >
        {on ? "Storm on" : "Storm off"}
      </button>
    </>
  );
}
