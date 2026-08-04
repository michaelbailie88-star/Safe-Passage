"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BrandSeal } from "../components/BrandSeal";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    const redirectedFrom = searchParams.get("redirectedFrom");
    router.push(redirectedFrom || "/dashboard");
    router.refresh();
  }

  return (
    <section className="bg-storm-gradient pb-24 pt-32 sm:pt-40">
      <div className="mx-4 sm:mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
        <BrandSeal className="mb-8" />
        <h1 className="font-display text-2xl italic text-mist-50 sm:text-3xl">
          Welcome back.
        </h1>
        <p className="mt-3 text-sm text-fog-300">Sign in to continue.</p>

        <form className="mt-8 flex flex-col gap-3 text-left" onSubmit={handleSubmit}>
          <label htmlFor="email" className="text-xs font-medium text-fog-300">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="rounded-full border border-storm-700 bg-storm-800/60 px-5 py-3 text-sm text-mist-100 placeholder:text-fog-500 focus:border-beam-500"
          />
          <label htmlFor="password" className="mt-2 text-xs font-medium text-fog-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="rounded-full border border-storm-700 bg-storm-800/60 px-5 py-3 text-sm text-mist-100 placeholder:text-fog-500 focus:border-beam-500"
          />

          {status === "error" && (
            <p role="alert" className="text-sm text-red-400">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="relative z-40 mt-4 rounded-full bg-[#E5A526] px-6 py-3 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B] disabled:opacity-60"
          >
            {status === "loading" ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-sm text-fog-300">
          Don&rsquo;t have an account?{" "}
          <Link href="/sign-up" className="text-beam-400 underline underline-offset-2">
            Create one
          </Link>
        </p>
      </div>
    </section>
  );
}
