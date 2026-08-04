"use client";

import { useState } from "react";
import { BrandSeal } from "./BrandSeal";

// Interim capture destination until Supabase is connected. Change this to
// swap where early-access requests land — see the TODO below to replace
// the whole mailto approach with a real database insert once ready.
const EARLY_ACCESS_INBOX = "thelazycreatorco@gmail.com";

export function EarlyAccessForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;

    // TODO: once Supabase is connected, replace this with an insert into an
    // `early_access` table instead of a mailto link.
    const subject = encodeURIComponent("Safe Passage — Early Access Request");
    const body = encodeURIComponent(
      `Please add this email to the Safe Passage early access list:\n\n${email}`
    );
    window.location.href = `mailto:${EARLY_ACCESS_INBOX}?subject=${subject}&body=${body}`;

    setStatus("sent");
  }

  return (
    <section aria-labelledby="early-access-heading" className="bg-storm-gradient pb-24 pt-32 sm:pt-40">
      <div className="mx-4 sm:mx-auto max-w-lg rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
        <BrandSeal className="mb-8" />
        <h1
          id="early-access-heading"
          className="font-display text-2xl italic text-mist-50 sm:text-3xl"
        >
          Be first through the harbor.
        </h1>
        <p className="mt-3 text-sm text-fog-300">
          Leave your email and we&rsquo;ll let you know the moment Safe
          Passage opens its doors.
        </p>

        {status === "sent" ? (
          <p
            role="status"
            className="mt-8 rounded-full border border-signal-500/40 bg-signal-500/10 px-6 py-3 text-sm text-signal-400"
          >
            Thanks — your mail app should have opened with your request
            ready to send.
          </p>
        ) : (
          <form
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            onSubmit={handleSubmit}
          >
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-full border border-storm-700 bg-storm-800/60 px-5 py-3 text-sm text-mist-100 placeholder:text-fog-500 focus:border-beam-500"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-beam-500 px-6 py-3 text-sm font-semibold text-storm-950 transition hover:bg-beam-400"
            >
              Notify me
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
