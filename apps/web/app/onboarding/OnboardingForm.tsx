"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BrandSeal } from "../components/BrandSeal";

export function OnboardingForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fullName.trim()) return;
    setSaving(true);
    setError("");

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        age: age ? parseInt(age, 10) : null,
        location: location.trim() || null,
        onboarding_completed: true,
      })
      .eq("id", userId);

    if (updateError) {
      setError("Something went wrong saving that. Try again.");
      setSaving(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <section className="bg-storm-gradient flex min-h-screen items-center justify-center px-6 py-16">
      <div className="mx-4 w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12">
        <BrandSeal className="mb-8" />
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
          Welcome
        </p>
        <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
          Let&rsquo;s get you set up.
        </h1>
        <p className="mt-3 text-sm text-fog-300">
          Just a few details so this feels like yours.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 text-left">
          <label htmlFor="full_name" className="text-xs font-medium text-fog-300">
            What should we call you?
          </label>
          <input
            id="full_name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            className="rounded-full border border-storm-700 bg-storm-800/60 px-5 py-3 text-sm text-mist-100 placeholder:text-fog-500 focus:border-beam-500"
          />

          <label htmlFor="age" className="mt-2 text-xs font-medium text-fog-300">
            Age <span className="text-fog-500">(optional)</span>
          </label>
          <input
            id="age"
            type="number"
            min={13}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 34"
            className="rounded-full border border-storm-700 bg-storm-800/60 px-5 py-3 text-sm text-mist-100 placeholder:text-fog-500 focus:border-beam-500"
          />

          <label htmlFor="location" className="mt-2 text-xs font-medium text-fog-300">
            Location <span className="text-fog-500">(optional)</span>
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

          <button
            type="submit"
            disabled={saving || !fullName.trim()}
            className="relative z-40 mt-4 rounded-full bg-[#E5A526] px-6 py-3 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Continue to your dashboard"}
          </button>
        </form>
      </div>
    </section>
  );
}
