"use client";

import { useState } from "react";
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

  return (
    <header className="relative z-20 mx-auto max-w-6xl px-6 py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src="/logo.png"
            alt="Safe Passage"
            width={44}
            height={44}
            priority
            className="h-11 w-11"
          />
          <span className="font-display text-2xl font-semibold tracking-tight text-mist-50 sm:text-3xl">
            Safe Passage
          </span>
        </Link>

        {/* Desktop nav — unchanged, untouched by the mobile menu below. Only
            renders at md: (768px) and up. */}
        <nav className="hidden items-center gap-8 text-sm text-fog-300 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-mist-100">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="hidden text-sm text-fog-300 transition hover:text-mist-100 sm:inline">
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full border border-beam-500/40 bg-beam-500/10 px-4 py-2 text-sm font-medium text-beam-400 transition hover:bg-beam-500/20"
          >
            Start free
          </Link>

          {/* Mobile menu toggle — only renders below md: (768px). Desktop
              never sees this button at all, not just a hidden state of it. */}
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

      {/* Mobile menu panel — solid/opaque background (not see-through over
          page content), absolutely positioned so it overlays rather than
          pushing content down, toggled via opacity/visibility/pointer-events
          so it's always in the DOM (no layout shift) but inert when closed.
          md:hidden unconditionally: even if `open` were somehow true at a
          desktop width, this never renders there. */}
      <div
        id="mobile-nav-panel"
        className={`absolute left-0 right-0 top-full z-30 mx-4 mt-2 rounded-2xl border border-storm-700 bg-storm-950 p-4 shadow-2xl shadow-black/40 transition md:hidden ${
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
