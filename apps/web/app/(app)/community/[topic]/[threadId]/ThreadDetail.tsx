"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ReportButton } from "../../ReportButton";

type Reply = {
  id: string;
  user_id: string;
  display_name: string;
  content: string;
  created_at: string;
};

export function ThreadDetail({
  threadId,
  userId,
  displayName,
}: {
  threadId: string;
  userId: string;
  displayName: string;
}) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  async function loadReplies() {
    const supabase = createClient();
    const { data } = await supabase
      .from("community_thread_replies")
      .select("id, user_id, display_name, content, created_at")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });
    setReplies(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadReplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    const supabase = createClient();
    await supabase.from("community_thread_replies").insert({
      thread_id: threadId,
      user_id: userId,
      display_name: displayName,
      content: content.trim(),
    });
    setContent("");
    setPosting(false);
    await loadReplies();
  }

  return (
    <div className="mt-6 space-y-3">
      {loading && <p className="text-center text-sm text-fog-300">Loading replies…</p>}

      {!loading && replies.length === 0 && (
        <p className="text-center text-sm text-fog-500">No replies yet.</p>
      )}

      {replies.map((reply) => (
        <div key={reply.id} className="rounded-2xl border border-storm-700 bg-storm-800/40 p-5">
          <p className="text-xs font-semibold text-signal-400">{reply.display_name}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-fog-300">{reply.content}</p>
          {reply.user_id !== userId && (
            <div className="mt-2">
              <ReportButton reportedUserId={reply.user_id} contentType="reply" contentId={reply.id} />
            </div>
          )}
        </div>
      ))}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-storm-700 bg-storm-800/40 p-5"
      >
        <label htmlFor="reply-content" className="text-xs font-medium text-fog-300">
          Reply
        </label>
        <textarea
          id="reply-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          required
          className="mt-2 w-full rounded-2xl border border-storm-700 bg-storm-800/60 px-4 py-3 text-sm text-mist-100 focus:border-beam-500"
        />
        <button
          type="submit"
          disabled={posting || !content.trim()}
          className="relative z-40 mt-3 rounded-full bg-[#E5A526] px-5 py-2 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B] disabled:opacity-50"
        >
          {posting ? "Posting…" : "Post reply"}
        </button>
      </form>
    </div>
  );
}
