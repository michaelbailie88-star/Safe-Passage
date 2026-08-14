import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Footer } from "../components/Footer";
import { AppNav } from "./AppNav";
import { ListenerWidget } from "./ListenerWidget";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders: middleware already protects this whole group, but
  // a layout should never trust that alone.
  if (!user) {
    redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, onboarding_completed, is_admin")
    .eq("id", user.id)
    .single();

  // New signups land here until they've told us who they are.
  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  const firstName = profile.full_name?.split(" ")[0];

  return (
    <>
      <AppNav firstName={firstName} isAdmin={profile.is_admin} />
      <main>{children}</main>
      <Footer />
      <ListenerWidget />
    </>
  );
}
