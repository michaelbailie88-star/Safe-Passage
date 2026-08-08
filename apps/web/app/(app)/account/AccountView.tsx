"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  full_name: string | null;
  age: number | null;
  location: string | null;
  email: string;
  plan: string;
};

type Strike = { level: number; created_at: string };

const STRIKE_COLORS: Record<number, { bg: string; text: string; label: string }> = {
  1: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Strike 1" },
  2: { bg: "bg-orange-500/20", text: "text-orange-400", label: "Strike 2" },
  3: { bg: "bg-red-500/20", text: "text-red-400", label: "Strike 3" },
};

export function AccountView({
  userId,
  profile,
  strikes,
  marginQuote,
}: {
  userId: string;
  profile: Profile;
  strikes: Strike[];
  marginQuote: ReactNode;
}) {
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [age, setAge] = useState(profile.age?.toString() ?? "");
  const [location, setLocation] = useState(profile.location ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim() || null,
        age: age ? parseInt(age, 10) : null,
        location: location.trim() || null,
      })
      .eq("id", userId);

    if (updateError) {
      setError("Couldn't save your changes. Try again.");
    } else {
      setSaved(true);
    }
    setSaving(false);
  }

  const isPremium = profile.plan === "premium";

  return (
    <section className="relative bg-storm-gradient pb-24 pt-16">
      {marginQuote}
      <div className="mx-4 sm:mx-auto max-w-lg">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12">
          <p className="text-center font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            Account
          </p>
          <h1 className="mt-4 text-center font-display text-2xl italic text-mist-50 sm:text-3xl">
            Your details.
          </h1>

          <div className="mt-6 flex items-center justify-between rounded-2xl border border-storm-700 bg-storm-800/40 p-4">
            <div>
              <p className="text-sm text-mist-100">{profile.email}</p>
              <span
                className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  isPremium ? "bg-beam-500/20 text-beam-400" : "bg-storm-700 text-fog-300"
                }`}
              >
                {isPremium ? "Premium" : "Free plan"}
              </span>
            </div>
            {!isPremium && (
              <Link
                href="/upgrade"
                className="relative z-40 rounded-full bg-[#E5A526] px-4 py-2 text-xs font-semibold text-[#080D16] transition hover:bg-[#F2B84B]"
              >
                Upgrade
              </Link>
            )}
          </div>

          {strikes.length > 0 && (
            <div className="mt-4 rounded-2xl border border-storm-700 bg-storm-800/40 p-4">
              <p className="text-xs uppercase tracking-wide text-fog-500">
                Community standing — visible only to you
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {strikes.map((s, i) => {
                  const c = STRIKE_COLORS[s.level];
                  return (
                    <span
                      key={i}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${c.bg} ${c.text}`}
                    >
                      {c.label}
                    </span>
                  );
                })}
              </div>
              {strikes.length >= 3 && (
                <p className="mt-2 text-xs text-red-400">
                  Community access has been removed after 3 strikes.
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSave} className="mt-6 flex flex-col gap-3 text-left">
            <label htmlFor="full_name" className="text-xs font-medium text-fog-300">
              Name
            </label>
            <input
              id="full_name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-full border border-storm-700 bg-storm-800/60 px-5 py-3 text-sm text-mist-100 placeholder:text-fog-500 focus:border-beam-500"
            />

            <label htmlFor="age" className="mt-2 text-xs font-medium text-fog-300">
              Age
            </label>
            <input
              id="age"
              type="number"
              min={13}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="rounded-full border border-storm-700 bg-storm-800/60 px-5 py-3 text-sm text-mist-100 placeholder:text-fog-500 focus:border-beam-500"
            />

            <label htmlFor="location" className="mt-2 text-xs font-medium text-fog-300">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
              className="rounded-full border border-storm-700 bg-storm-800/60 px-5 py-3 text-sm text-mist-100 placeholder:text-fog-500 focus:border-beam-500"
            />

            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}
            {saved && (
              <p role="status" className="text-sm text-signal-400">
                Saved.
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="relative z-40 mt-4 rounded-full bg-[#E5A526] px-6 py-3 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B] disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
