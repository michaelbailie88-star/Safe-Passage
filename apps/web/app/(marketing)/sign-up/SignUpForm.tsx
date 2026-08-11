"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BrandSeal } from "../../components/BrandSeal";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const supabase = createClient();

    // Best-effort — if this fails or returns nulls (e.g. running locally,
    // off Vercel), signup still proceeds normally with no location set.
    let country: string | null = null;
    let city: string | null = null;
    try {
      const geoRes = await fetch("/api/geo");
      const geo = await geoRes.json();
      country = geo.country;
      city = geo.city;
    } catch {
      // ignore — signup continues without location data
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { country, city },
      },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    setStatus("sent");
  }

  return (
    <section className="bg-storm-gradient pb-24 pt-32 sm:pt-40">
      <div className="mx-4 sm:mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
        <BrandSeal className="mb-8" />
        <h1 className="font-display text-2xl italic text-mist-50 sm:text-3xl">
          Create your account.
        </h1>
        <p className="mt-3 text-sm text-fog-300">
          Start with the free plan — daily check-ins, journaling, habit
          tracking, and community access.
        </p>

        {status === "sent" ? (
          <p
            role="status"
            className="mt-8 rounded-2xl border border-signal-500/40 bg-signal-500/10 px-6 py-4 text-sm text-signal-400"
          >
            Check your email for a confirmation link to finish setting up
            your account.
          </p>
        ) : (
          <form className="mt-8 flex flex-col gap-3 text-left" onSubmit={handleSubmit}>
            <label htmlFor="email" className="text-xs font-medium text-fog-300">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="rounded-full border border-storm-700 bg-storm-800/60 px-5 py-3 text-sm text-mist-100 placeholder:text-fog-500 focus:border-beam-500"
            />
            <label htmlFor="password" className="mt-2 text-xs font-medium text-fog-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="rounded-full border border-storm-700 bg-storm-800/60 px-5 py-3 text-sm text-mist-100 placeholder:text-fog-500 focus:border-beam-500"
            />

            {status === "error" && (
              <p role="alert" className="text-sm text-red-400">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="relative z-40 mt-4 rounded-full bg-[#E5A526] px-6 py-3 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B] disabled:opacity-60"
            >
              {status === "loading" ? "Creating account…" : "Create account"}
            </button>
          </form>
        )}

        <p className="mt-8 text-sm text-fog-300">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-beam-400 underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
