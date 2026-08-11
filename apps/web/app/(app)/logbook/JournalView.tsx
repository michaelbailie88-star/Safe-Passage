"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Entry = {
  id: string;
  title: string | null;
  content: string;
  created_at: string;
};

function dateStringFrom(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function calculateStreak(entryDates: string[]): number {
  const uniqueDays = new Set(entryDates);
  let streak = 0;
  let cursor = dateStringFrom(new Date());
  while (uniqueDays.has(cursor)) {
    streak++;
    const prev = new Date(cursor);
    prev.setDate(prev.getDate() - 1);
    cursor = dateStringFrom(prev);
  }
  return streak;
}

export function JournalView({ userId }: { userId: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [streak, setStreak] = useState(0);

  async function loadEntries() {
    const supabase = createClient();
    const { data } = await supabase
      .from("journal_entries")
      .select("id, title, content, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setEntries(data ?? []);
    if (data) {
      setStreak(calculateStreak(data.map((e) => e.created_at.slice(0, 10))));
    }
    setLoading(false);
  }

  useEffect(() => {
    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!content.trim()) return;
    setSaving(true);
    setError("");

    const supabase = createClient();
    const { error: insertError } = await supabase.from("journal_entries").insert({
      user_id: userId,
      title: title.trim() || null,
      content: content.trim(),
    });

    if (insertError) {
      setError("Couldn't save your entry. Try again.");
    } else {
      setTitle("");
      setContent("");
      await loadEntries();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("journal_entries").delete().eq("id", id).eq("user_id", userId);
    await loadEntries();
  }

  return (
    <div className="mt-10 space-y-6">
      {!loading && streak > 0 && (
        <div className="flex justify-center">
          <span className="rounded-full border border-beam-500/40 bg-beam-500/10 px-4 py-1.5 text-xs font-semibold text-beam-400">
            🔥 {streak} day{streak === 1 ? "" : "s"} in a row
          </span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6 text-left"
      >
        <label htmlFor="entry-title" className="text-xs font-medium text-fog-300">
          Title (optional)
        </label>
        <input
          id="entry-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give it a title, or leave it blank"
          className="mt-2 w-full rounded-full border border-storm-700 bg-storm-800/60 px-4 py-2 text-sm text-mist-100 placeholder:text-fog-500 focus:border-beam-500"
        />

        <label htmlFor="entry-content" className="mt-4 block text-xs font-medium text-fog-300">
          What's on your mind?
        </label>
        <textarea
          id="entry-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          required
          className="mt-2 w-full rounded-2xl border border-storm-700 bg-storm-800/60 px-4 py-3 text-sm text-mist-100 placeholder:text-fog-500 focus:border-beam-500"
          placeholder="Write freely. This is just for you."
        />

        {error && (
          <p role="alert" className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving || !content.trim()}
          className="relative z-40 mt-4 rounded-full bg-[#E5A526] px-6 py-3 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B] disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save entry"}
        </button>
      </form>

      <div className="space-y-4">
        {loading && <p className="text-center text-sm text-fog-300">Loading your entries…</p>}

        {!loading && entries.length === 0 && (
          <p className="text-center text-sm text-fog-500">
            No entries yet — your first one is above.
          </p>
        )}

        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6 text-left"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                {entry.title && (
                  <h3 className="font-display text-base italic text-mist-50">
                    {entry.title}
                  </h3>
                )}
                <p className="text-xs text-fog-500">
                  {new Date(entry.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(entry.id)}
                className="shrink-0 text-xs text-fog-500 underline underline-offset-2 hover:text-red-400"
              >
                Delete
              </button>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-fog-300">
              {entry.content}
            </p>
            <p className="mt-4 flex items-center gap-2 border-t border-storm-700/60 pt-3 text-xs text-beam-400">
              <span aria-hidden="true">★</span>
              I know this wasn&apos;t easy to say — I commend you.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
