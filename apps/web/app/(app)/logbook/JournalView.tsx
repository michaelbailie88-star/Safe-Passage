"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Entry = {
  id: string;
  title: string | null;
  content: string;
  created_at: string;
};

export function JournalView({ userId }: { userId: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadEntries() {
    const supabase = createClient();
    const { data } = await supabase
      .from("journal_entries")
      .select("id, title, content, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setEntries(data ?? []);
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
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="mt-10 space-y-6">
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
          </div>
        ))}
      </div>
    </div>
  );
}
