import Link from "next/link";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mb-6 inline-flex items-center gap-1.5 text-sm text-fog-300 transition hover:text-mist-100"
    >
      <span aria-hidden="true">←</span>
      {label}
    </Link>
  );
}
