"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ReportButton({
  reportedUserId,
  contentType,
  contentId,
}: {
  reportedUserId: string;
  contentType: "message" | "thread" | "reply";
  contentId: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!reason.trim()) return;
    setSubmitting(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("community_reports").insert({
      reporter_id: user.id,
      reported_user_id: reportedUserId,
      content_type: contentType,
      content_id: contentId,
      reason: reason.trim(),
    });

    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return <span className="text-xs text-signal-400">Reported</span>;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-fog-500 underline underline-offset-2 hover:text-red-400"
      >
        Report
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2 rounded-xl border border-storm-700 bg-storm-900/60 p-3">
      <label htmlFor={`reason-${contentId}`} className="text-xs text-fog-300">
        Why are you reporting this?
      </label>
      <textarea
        id={`reason-${contentId}`}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={2}
        required
        className="rounded-lg border border-storm-700 bg-storm-800/60 px-3 py-2 text-xs text-mist-100 placeholder:text-fog-500 focus:border-beam-500"
        placeholder="Brief reason"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting || !reason.trim()}
          className="rounded-full bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/30 disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Submit report"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full px-3 py-1.5 text-xs text-fog-400 hover:text-fog-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
