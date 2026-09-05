"use client";

import { useState } from "react";
import { BrandSeal } from "../../components/BrandSeal";
import { PREMIUM_MONTHLY_PRICE_ID, PREMIUM_YEARLY_PRICE_ID } from "@/lib/stripe/price-ids";

const FREE_FEATURES = [
  "Daily check-ins",
  "Basic journaling",
  "Habit tracking",
  "Community access",
  "Resources",
];

const PREMIUM_FEATURES = [
  "Everything in Free",
  "All transformation programs, including Anchor",
  "Advanced analytics on your streaks and patterns",
  "Private community groups",
  "Full course library",
  "1-on-1 matching with a Guardian mentor",
  "Private Guardian-only community space",
  "Downloadable program workbooks (PDF)",
  "Early access to every new course",
  "Priority crisis resource routing",
];

function Check() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0">
      <path d="M4 10.5l4 4 8-9" stroke="#F2B84B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UpgradeView() {
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleUpgrade(priceId: string) {
    setLoadingPriceId(priceId);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoadingPriceId(null);
    }
  }

  return (
    <section className="bg-storm-gradient pb-24 pt-32 sm:pt-40">
      <div className="mx-4 sm:mx-auto max-w-4xl">
        {/* Header */}
        <div className="rise-in text-center">
          <BrandSeal className="mb-8" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            Upgrade
          </p>
          <h1 className="mt-4 font-display text-3xl italic leading-tight text-mist-50 sm:text-4xl">
            Storms don&rsquo;t wait.<br />Neither should you.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-base text-fog-300 sm:text-lg">
            Free gets you started. Premium is the full passage — every program,
            every course, and a Guardian in your corner.
          </p>
        </div>

        {error && (
          <p role="alert" className="mt-6 text-center text-sm text-red-400">
            {error}
          </p>
        )}

        {/* Plans */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {/* Free */}
          <div className="card-glow rise-in rise-d1 rounded-[2rem] border border-storm-700 bg-storm-800/40 p-8 backdrop-blur-xl">
            <h2 className="font-display text-lg italic text-mist-50">Free</h2>
            <p className="mt-2 text-3xl font-semibold text-mist-50">$0</p>
            <p className="mt-1 text-xs text-fog-500">Forever. No card required.</p>
            <ul className="mt-6 space-y-3 text-sm text-fog-300">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-8 rounded-xl border border-storm-700/70 bg-storm-900/50 px-4 py-3 text-xs leading-relaxed text-fog-400">
              A real start. When you&rsquo;re ready to go further, the beam is
              already on.
            </p>
          </div>

          {/* Premium */}
          <div className="card-glow rise-in rise-d2 relative rounded-[2rem] border border-beam-500/50 bg-beam-500/[0.06] p-8 shadow-[0_0_60px_-18px_rgba(242,184,75,0.4)] backdrop-blur-xl">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-beam-500 px-4 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#080D16]">
              Most chosen
            </span>
            <h2 className="font-display text-lg italic text-mist-50">Premium</h2>
            <p className="mt-2 text-3xl font-semibold text-mist-50">
              $6.67<span className="text-sm font-normal text-fog-300">/mo</span>
            </p>
            <p className="mt-1 text-xs text-fog-400">
              Billed yearly at $79.99 — or $9.99 month to month.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-mist-100">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => handleUpgrade(PREMIUM_YEARLY_PRICE_ID)}
                disabled={loadingPriceId !== null}
                className="relative z-40 rounded-full bg-[#E5A526] px-6 py-3.5 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B] disabled:opacity-60"
              >
                {loadingPriceId === PREMIUM_YEARLY_PRICE_ID
                  ? "Redirecting…"
                  : "Go yearly — $79.99/yr (save $40)"}
              </button>
              <button
                type="button"
                onClick={() => handleUpgrade(PREMIUM_MONTHLY_PRICE_ID)}
                disabled={loadingPriceId !== null}
                className="rounded-full border border-beam-500/40 px-6 py-3 text-sm font-medium text-beam-400 transition hover:bg-beam-500/10 disabled:opacity-60"
              >
                {loadingPriceId === PREMIUM_MONTHLY_PRICE_ID
                  ? "Redirecting…"
                  : "Go monthly — $9.99/mo"}
              </button>
            </div>
          </div>
        </div>

        {/* Assurance strip */}
        <div className="rise-in rise-d3 mx-auto mt-10 grid max-w-3xl gap-4 text-center sm:grid-cols-3">
          {[
            ["Cancel anytime", "Two clicks in your account page. No lock-in, no guilt trip."],
            ["Secure checkout", "Payments handled end-to-end by Stripe. We never see your card."],
            ["Built for men", "Every program written for the storms men actually carry."],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-2xl border border-storm-700/60 bg-storm-900/40 px-4 py-5"
            >
              <p className="font-display text-sm italic text-mist-50">{title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-fog-400">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
