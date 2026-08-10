import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AppNav } from "../(app)/AppNav";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { LighthouseBackdrop } from "../components/LighthouseBackdrop";
import { LighthouseBeam } from "../components/LighthouseBeam";
import { MarginQuote } from "../components/MarginQuote";
import { pageQuotes } from "@/lib/pageQuotes";
import { ResourcesContent } from "../components/ResourcesContent";

export const metadata: Metadata = {
  title: "Resources — Safe Passage",
  description:
    "Verified crisis, mental health, financial, and legal resources for men navigating hard seasons — US, Canada, and international.",
};

export default async function ResourcesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // This page is intentionally reachable whether or not someone is signed
  // in — crisis resources should never require an account. The only thing
  // that changes is which nav renders, so a signed-in user doesn't lose
  // their app-shell context (Sign Out, Account, etc).
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, is_admin")
      .eq("id", user.id)
      .single();

    return (
      <>
        <LighthouseBackdrop topOffset={96} variant="soft" />
        <LighthouseBeam topOffset={96} variant="soft" />
        <AppNav firstName={profile?.full_name?.split(" ")[0]} isAdmin={profile?.is_admin} />
        <main>
          <ResourcesContent
            marginQuote={
              <MarginQuote quote={pageQuotes.resources.quote} author={pageQuotes.resources.author} cardWidthPx={672} />
            }
          />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <LighthouseBackdrop topOffset={0} variant="soft" />
      <LighthouseBeam topOffset={0} variant="soft" />
      <NavBar />
      <main>
        <ResourcesContent
          marginQuote={
            <MarginQuote quote={pageQuotes.resources.quote} author={pageQuotes.resources.author} cardWidthPx={672} />
          }
        />
      </main>
      <Footer />
    </>
  );
}
