import Link from "next/link";
import Image from "next/image";

export function NavBar() {
  return (
    <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/" className="flex items-center gap-3">
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

      <nav className="hidden items-center gap-8 text-sm text-fog-300 md:flex">
        <Link href="/mission" className="transition hover:text-mist-100">
          Mission
        </Link>
        <Link href="/platform" className="transition hover:text-mist-100">
          The Platform
        </Link>
        <Link href="/for-who" className="transition hover:text-mist-100">
          Who It's For
        </Link>
        <Link href="/organizations" className="transition hover:text-mist-100">
          For Organizations
        </Link>
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
      </div>
    </header>
  );
}
