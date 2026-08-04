import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders: middleware already protects this route, but a
  // Server Component should never trust that alone.
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <section className="bg-storm-gradient pb-24 pt-32 sm:pt-40">
      <div className="mx-4 sm:mx-auto max-w-lg rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
          The Lighthouse
        </p>
        <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
          You&rsquo;re signed in.
        </h1>
        <p className="mt-3 text-sm text-fog-300">{user.email}</p>
        <p className="mt-6 text-sm text-fog-300">
          This is a placeholder — the real dashboard (daily check-ins, habit
          tracking, goals, progress) is next.
        </p>
        <div className="mt-8">
          <SignOutButton />
        </div>
      </div>
    </section>
  );
}
