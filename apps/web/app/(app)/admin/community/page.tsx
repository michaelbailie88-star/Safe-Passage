import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BackLink } from "../../../components/BackLink";
import { ModerationView } from "./ModerationView";

export const metadata: Metadata = {
  title: "Community Moderation — Admin — Safe Passage",
};

export default async function AdminCommunityPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?redirectedFrom=/admin/community");
  }

  const { data: requester } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!requester?.is_admin) {
    redirect("/dashboard");
  }

  const admin = createAdminClient();

  const { data: pendingReports } = await admin
    .from("community_reports")
    .select("id, reporter_id, reported_user_id, content_type, content_id, reason, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  const userIds = new Set<string>();
  (pendingReports ?? []).forEach((r) => {
    userIds.add(r.reporter_id);
    userIds.add(r.reported_user_id);
  });

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, email")
    .in("id", [...userIds]);

  const emailById = new Map((profiles ?? []).map((p) => [p.id, p.email]));

  const reports = (pendingReports ?? []).map((r) => ({
    id: r.id,
    reporter_email: emailById.get(r.reporter_id) ?? "Unknown",
    reported_email: emailById.get(r.reported_user_id) ?? "Unknown",
    reported_user_id: r.reported_user_id,
    content_type: r.content_type,
    content_id: r.content_id,
    reason: r.reason,
    created_at: r.created_at,
  }));

  return (
    <section className="bg-storm-gradient pb-24 pt-16">
      <div className="mx-auto max-w-3xl px-6">
        <BackLink href="/admin" label="Back to Admin" />
        <div className="mx-4 sm:mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            Admin
          </p>
          <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
            Community reports.
          </h1>
          <p className="mt-3 text-sm text-fog-300">
            {reports.length} pending
          </p>
        </div>

        <ModerationView initialReports={reports} />
      </div>
    </section>
  );
}
