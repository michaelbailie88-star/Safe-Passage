import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AccountView } from "./AccountView";

export const metadata: Metadata = {
  title: "Account — Safe Passage",
};

export default async function AccountPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?redirectedFrom=/account");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, age, location, email, plan")
    .eq("id", user.id)
    .single();

  const { data: strikes } = await supabase
    .from("community_strikes")
    .select("level, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <AccountView
      userId={user.id}
      profile={{
        full_name: profile?.full_name ?? null,
        age: profile?.age ?? null,
        location: profile?.location ?? null,
        email: profile?.email ?? user.email ?? "",
        plan: profile?.plan ?? "free",
      }}
      strikes={strikes ?? []}
    />
  );
}
