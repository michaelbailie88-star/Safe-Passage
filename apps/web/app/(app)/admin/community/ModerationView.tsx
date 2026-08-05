"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Report = {
  id: string;
  reporter_email: string;
  reported_email: string;
  reported_user_id: string;
  content_type: string;
  content_id: string;
  reason: string;
  created_at: string;
};

export function ModerationView({ initialReports }: { initialReports: Report[] }) {
  const [reports, setReports] = useState(initialReports);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleAction(
    report: Report,
    action: "dismiss" | "strike_1" | "strike_2" | "strike_3"
  ) {
    setBusyId(report.id);
    const supabase = createClient();

    if (action !== "dismiss") {
      const level = parseInt(action.split("_")[1], 10);
      // Insert the strike via a server route, since strikes require the
      // service-role client (regular users have no insert policy on
      // community_strikes at all, by design).
      await fetch("/api/admin/issue-strike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: report.reported_user_id,
          level,
          reason: report.reason,
        }),
      });
    }

    await supabase
      .from("community_reports")
      .update({ status: "reviewed", reviewed_at: new Date().toISOString() })
      .eq("id", report.id);

    setReports((prev) => prev.filter((r) => r.id !== report.id));
    setBusyId(null);
  }

  if (reports.length === 0) {
    return <p className="mt-6 text-center text-sm text-fog-500">No pending reports.</p>;
  }

  return (
    <div className="mt-6 space-y-4">
      {reports.map((report) => (
        <div key={report.id} className="rounded-2xl border border-storm-700 bg-storm-800/40 p-5 text-left">
          <p className="text-xs text-fog-500">
            Reported by <span className="text-fog-300">{report.reporter_email}</span> ·{" "}
            {new Date(report.created_at).toLocaleDateString()}
          </p>
          <p className="mt-1 text-sm text-mist-100">
            Content type: <span className="text-beam-400">{report.content_type}</span>
          </p>
          <p className="mt-1 text-sm text-mist-100">
            Reported user: <span className="text-beam-400">{report.reported_email}</span>
          </p>
          <p className="mt-3 rounded-xl border border-storm-700 bg-storm-900/60 p-3 text-sm text-fog-300">
            {report.reason}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busyId === report.id}
              onClick={() => handleAction(report, "dismiss")}
              className="rounded-full border border-storm-700 px-3 py-1.5 text-xs text-fog-300 hover:border-fog-500/50 disabled:opacity-50"
            >
              Dismiss
            </button>
            <button
              type="button"
              disabled={busyId === report.id}
              onClick={() => handleAction(report, "strike_1")}
              className="rounded-full bg-yellow-500/20 px-3 py-1.5 text-xs font-semibold text-yellow-400 hover:bg-yellow-500/30 disabled:opacity-50"
            >
              Issue Strike 1 (yellow)
            </button>
            <button
              type="button"
              disabled={busyId === report.id}
              onClick={() => handleAction(report, "strike_2")}
              className="rounded-full bg-orange-500/20 px-3 py-1.5 text-xs font-semibold text-orange-400 hover:bg-orange-500/30 disabled:opacity-50"
            >
              Issue Strike 2 (orange)
            </button>
            <button
              type="button"
              disabled={busyId === report.id}
              onClick={() => handleAction(report, "strike_3")}
              className="rounded-full bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/30 disabled:opacity-50"
            >
              Issue Strike 3 (red — bans)
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
