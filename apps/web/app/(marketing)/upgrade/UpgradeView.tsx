"use client";

import { useState } from "react";
import { BrandSeal } from "../../components/BrandSeal";
import { PREMIUM_MONTHLY_PRICE_ID, PREMIUM_YEARLY_PRICE_ID } from "@/lib/stripe/price-ids";

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
      <div className="mx-4 sm:mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
        <BrandSeal className="mb-8" />
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
          Upgrade
        </p>
        <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
          Go further with Premium.
        </h1>

        {error && (
          <p role="alert" className="mt-6 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="mt-10 grid gap-6 text-left sm:grid-cols-2">
          <div className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6">
            <h2 className="font-display text-lg italic text-mist-50">Free</h2>
            <p className="mt-1 text-2xl font-semibold text-mist-50">$0</p>
            <ul className="mt-4 space-y-2 text-sm text-fog-300">
              <li>Daily check-ins</li>
              <li>Basic journaling</li>
              <li>Habit tracking</li>
              <li>Community access</li>
              <li>Resources</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-beam-500/40 bg-beam-500/5 p-6">
            <h2 className="font-display text-lg italic text-mist-50">Premium</h2>
            <p className="mt-1 text-2xl font-semibold text-mist-50">
              $9.99<span className="text-sm font-normal text-fog-300">/mo</span>
            </p>
            <p className="text-xs text-fog-400">or $79.99/year</p>
            <ul className="mt-4 space-y-2 text-sm text-fog-300">
              <li>Everything in Free</li>
              <li>Transformation programs</li>
              <li>Advanced analytics</li>
              <li>Community groups</li>
              <li>Courses</li>
              <li>1-on-1 matching with a Guardian mentor</li>
              <li>Private Guardian-only community space</li>
              <li>Downloadable program workbooks (PDF)</li>
              <li>Early access to new courses</li>
              <li>Priority crisis resource routing</li>
            </ul>

            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleUpgrade(PREMIUM_MONTHLY_PRICE_ID)}
                disabled={loadingPriceId !== null}
                className="relative z-40 rounded-full bg-[#E5A526] px-6 py-3 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B] disabled:opacity-60"
              >
                {loadingPriceId === PREMIUM_MONTHLY_PRICE_ID
                  ? "Redirecting…"
                  : "Upgrade monthly — $9.99/mo"}
              </button>
              <button
                type="button"
                onClick={() => handleUpgrade(PREMIUM_YEARLY_PRICE_ID)}
                disabled={loadingPriceId !== null}
                className="rounded-full border border-beam-500/40 px-6 py-3 text-sm font-medium text-beam-400 transition hover:bg-beam-500/10 disabled:opacity-60"
              >
                {loadingPriceId === PREMIUM_YEARLY_PRICE_ID
                  ? "Redirecting…"
                  : "Upgrade yearly — $79.99/yr"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
