"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BrandSeal } from "../../components/BrandSeal";
import { communityGuidelines } from "@/lib/community/guidelines";

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-fog-300">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-beam-400">–</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function GuidelinesGate({ userId }: { userId: string }) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleEnter() {
    setSaving(true);
    setError("");
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ community_guidelines_accepted_at: new Date().toISOString() })
      .eq("id", userId);

    if (updateError) {
      setError("Something went wrong. Try again.");
      setSaving(false);
      return;
    }

    router.refresh();
  }

  return (
    <section className="bg-storm-gradient pb-24 pt-16">
      <div className="mx-4 sm:mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12">
        <div className="text-center">
          <BrandSeal className="mb-8" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            Before you enter
          </p>
          <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
            This is a safe passage — for everyone here.
          </h1>
          <p className="mt-3 text-sm text-fog-300">
            Read this before joining The Watch. It only takes a minute, and
            it's what makes this community actually safe to be honest in.
          </p>
        </div>

        <div className="mt-8 space-y-6 text-left">
          <div>
            <h2 className="font-display text-base italic text-mist-50">
              Confidentiality — the most important rule
            </h2>
            <List items={communityGuidelines.confidentiality} />
          </div>

          <div>
            <h2 className="font-display text-base italic text-mist-50">
              Trust &amp; safety
            </h2>
            <List items={communityGuidelines.trustAndSafety} />
          </div>

          <div>
            <h2 className="font-display text-base italic text-mist-50">
              If someone is in crisis
            </h2>
            <List items={communityGuidelines.ifSomeoneIsInCrisis} />
          </div>

          <div>
            <h2 className="font-display text-base italic text-mist-50">
              How this community moderates itself
            </h2>
            <List items={communityGuidelines.selfModeration} />
          </div>
        </div>

        <div className="mt-8 border-t border-storm-700 pt-6">
          <label className="flex items-start gap-3 text-sm text-mist-100">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-storm-700 bg-storm-800/60 accent-beam-500"
            />
            <span>
              I agree to follow these guidelines, and I understand that what
              is shared in this community is confidential and will never
              leave it.
            </span>
          </label>

          {error && (
            <p role="alert" className="mt-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleEnter}
            disabled={!agreed || saving}
            className="relative z-40 mt-6 w-full rounded-full bg-[#E5A526] px-6 py-3 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B] disabled:opacity-50"
          >
            {saving ? "Entering…" : "I agree — take me in"}
          </button>
        </div>
      </div>
    </section>
  );
}
