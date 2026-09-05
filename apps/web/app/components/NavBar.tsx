"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/mission", label: "Mission" },
  { href: "/platform", label: "The Platform" },
  { href: "/for-who", label: "Who It's For" },
  { href: "/organizations", label: "For Organizations" },
];

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="nav-shell fixed inset-x-0 top-0 z-50">
      <div className={`nav-shell-bg ${scrolled ? "nav-shell-bg-on" : ""}`} aria-hidden="true" />
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src="/logo.png"
            alt="Safe Passage"
            width={40}
            height={40}
            priority
            className="h-10 w-10 drop-shadow-[0_0_14px_rgba(242,184,75,0.35)]"
          />
          <span className="font-display text-xl font-semibold tracking-tight text-mist-50 sm:text-2xl">
            Safe Passage
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="nav-link hidden sm:inline">
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-[#E5A526] px-5 py-2 text-sm font-semibold text-[#080D16] shadow-[0_0_24px_-6px_rgba(242,184,75,0.6)] transition hover:bg-[#F2B84B] hover:shadow-[0_0_34px_-6px_rgba(242,184,75,0.8)]"
          >
            Start free
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-storm-700 text-mist-100 md:hidden"
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
                <path d="M0 1H18M0 7H18M0 13H18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-nav-panel"
        className={`absolute left-0 right-0 top-full z-30 mx-4 mt-2 rounded-2xl border border-beam-500/20 bg-storm-950/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl transition md:hidden ${
          open ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-fog-300 transition hover:bg-storm-800/60 hover:text-mist-100"
            >
              {link.label}
            </Link>
          ))}
          <div className="my-1 border-t border-storm-700/60" />
          <Link
            href="/sign-in"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm text-fog-300 transition hover:bg-storm-800/60 hover:text-mist-100"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
