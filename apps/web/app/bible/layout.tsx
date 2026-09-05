import { createClient } from "@/lib/supabase/server";
import { AppNav } from "../(app)/AppNav";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";

// The Bible reader is intentionally reachable whether or not someone is
// signed in — same reasoning as /resources. The only thing that changes
// is which nav renders, so a signed-in user doesn't lose their app-shell
// context (Sign Out, Account, etc).
export default async function BibleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, is_admin")
      .eq("id", user.id)
      .single();

    return (
      <>
        <AppNav firstName={profile?.full_name?.split(" ")[0]} isAdmin={profile?.is_admin} />
        <main>{children}</main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
