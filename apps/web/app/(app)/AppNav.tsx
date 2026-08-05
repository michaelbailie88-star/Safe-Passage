import Link from "next/link";
import Image from "next/image";
import { SignOutButton } from "./SignOutButton";

export function AppNav({
  firstName,
  isAdmin,
}: {
  firstName?: string | null;
  isAdmin?: boolean;
}) {
  return (
    <header className="relative z-20 border-b border-storm-700/60 bg-storm-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="Safe Passage" width={32} height={32} className="h-8 w-8" />
          <span className="font-display text-lg font-semibold text-mist-50">
            Safe Passage
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-fog-300 md:flex">
          <Link href="/dashboard" className="transition hover:text-mist-100">
            Dashboard
          </Link>
          <Link href="/logbook" className="transition hover:text-mist-100">
            Logbook
          </Link>
          <Link href="/programs" className="transition hover:text-mist-100">
            Programs
          </Link>
          <Link href="/courses" className="transition hover:text-mist-100">
            Courses
          </Link>
          <Link href="/analytics" className="transition hover:text-mist-100">
            Analytics
          </Link>
          <Link href="/community" className="transition hover:text-mist-100">
            Community
          </Link>
          <Link href="/account" className="transition hover:text-mist-100">
            Account
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="text-beam-400 transition hover:text-beam-300"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {firstName && (
            <span className="hidden text-sm text-fog-300 sm:inline">
              Hi, {firstName}
            </span>
          )}
          <SignOutButton />
        </div>
      </div>

      {/* mobile nav row */}
      <nav className="flex items-center gap-4 overflow-x-auto border-t border-storm-700/60 px-6 py-2 text-xs text-fog-300 md:hidden">
        <Link href="/dashboard" className="shrink-0 transition hover:text-mist-100">
          Dashboard
        </Link>
        <Link href="/logbook" className="shrink-0 transition hover:text-mist-100">
          Logbook
        </Link>
        <Link href="/programs" className="shrink-0 transition hover:text-mist-100">
          Programs
        </Link>
        <Link href="/courses" className="shrink-0 transition hover:text-mist-100">
          Courses
        </Link>
        <Link href="/analytics" className="shrink-0 transition hover:text-mist-100">
          Analytics
        </Link>
        <Link href="/community" className="shrink-0 transition hover:text-mist-100">
          Community
        </Link>
        <Link href="/account" className="shrink-0 transition hover:text-mist-100">
          Account
        </Link>
        {isAdmin && (
          <Link href="/admin" className="shrink-0 text-beam-400 transition hover:text-beam-300">
            Admin
          </Link>
        )}
      </nav>
    </header>
  );
}
