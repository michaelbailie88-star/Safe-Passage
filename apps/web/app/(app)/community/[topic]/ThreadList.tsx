"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Thread = {
  id: string;
  title: string;
  content: string;
  display_name: string;
  created_at: string;
};

export function ThreadList({
  topicSlug,
  userId,
  displayName,
}: {
  topicSlug: string;
  userId: string;
  displayName: string;
}) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  async function loadThreads() {
    const supabase = createClient();
    const { data } = await supabase
      .from("community_threads")
      .select("id, title, content, display_name, created_at")
      .eq("topic_slug", topicSlug)
      .order("created_at", { ascending: false });
    setThreads(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicSlug]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setPosting(true);
    const supabase = createClient();
    await supabase.from("community_threads").insert({
      topic_slug: topicSlug,
      user_id: userId,
      display_name: displayName,
      title: title.trim(),
      content: content.trim(),
    });
    setTitle("");
    setContent("");
    setShowForm(false);
    setPosting(false);
    await loadThreads();
  }

  return (
    <div className="mt-10">
      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="relative z-40 rounded-full bg-[#E5A526] px-5 py-2 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B]"
        >
          Start a thread
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6 text-left"
        >
          <label htmlFor="thread-title" className="text-xs font-medium text-fog-300">
            Title
          </label>
          <input
            id="thread-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-full border border-storm-700 bg-storm-800/60 px-4 py-2 text-sm text-mist-100 focus:border-beam-500"
          />
          <label htmlFor="thread-content" className="mt-4 block text-xs font-medium text-fog-300">
            What's going on?
          </label>
          <textarea
            id="thread-content"
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-storm-700 bg-storm-800/60 px-4 py-3 text-sm text-mist-100 focus:border-beam-500"
          />
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={posting || !title.trim() || !content.trim()}
              className="relative z-40 rounded-full bg-[#E5A526] px-5 py-2 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B] disabled:opacity-50"
            >
              {posting ? "Posting…" : "Post thread"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full px-5 py-2 text-sm text-fog-400 hover:text-fog-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {loading && <p className="text-center text-sm text-fog-300">Loading threads…</p>}
        {!loading && threads.length === 0 && (
          <p className="text-center text-sm text-fog-500">
            No threads yet — start the first one.
          </p>
        )}
        {threads.map((thread) => (
          <Link
            key={thread.id}
            href={`/community/${topicSlug}/${thread.id}`}
            className="block rounded-2xl border border-storm-700 bg-storm-800/40 p-5 transition hover:border-fog-500/50"
          >
            <h3 className="font-display text-base italic text-mist-50">{thread.title}</h3>
            <p className="mt-1 text-xs text-fog-500">
              {thread.display_name} ·{" "}
              {new Date(thread.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="mt-2 line-clamp-2 text-sm text-fog-300">{thread.content}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
