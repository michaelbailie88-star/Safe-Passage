"use client";

import { useState } from "react";
import Link from "next/link";

type DropdownItem = { label: string; href: string };

export function NavDropdown({
  label,
  href,
  items,
}: {
  label: string;
  href: string;
  items: DropdownItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link href={href} className="transition hover:text-mist-100">
        {label}
      </Link>
      {open && (
        <div className="absolute left-1/2 top-full z-30 w-56 -translate-x-1/2 pt-2">
          <div className="rounded-2xl border border-storm-700 bg-storm-900/95 p-2 shadow-2xl backdrop-blur-xl">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-3 py-2 text-sm text-fog-300 transition hover:bg-storm-800 hover:text-mist-100"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
