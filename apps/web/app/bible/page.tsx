import type { Metadata } from "next";
import Link from "next/link";
import { BrandSeal } from "../components/BrandSeal";
import { bibleBooks } from "@/lib/bible/books";

export const metadata: Metadata = {
  title: "The King James Bible — Safe Passage",
  description:
    "The full King James Bible, Old and New Testament, free to read here or download from an external source.",
};

export default function BiblePage() {
  const ot = bibleBooks.filter((b) => b.testament === "OT");
  const nt = bibleBooks.filter((b) => b.testament === "NT");

  return (
    <section className="bg-storm-gradient pb-24 pt-32 sm:pt-40">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mx-4 sm:mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
          <BrandSeal className="mb-8" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            The Beacon
          </p>
          <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
            The King James Bible
          </h1>
          <p className="mt-3 text-sm text-fog-300">
            Old and New Testament, free to read here, book by book and
            chapter by chapter. Prefer reading elsewhere?{" "}
            <a
              href="https://www.biblegateway.com/versions/King-James-Version-KJV-Bible/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-40 text-beam-400 underline underline-offset-2 hover:text-beam-300"
            >
              Read it on BibleGateway
            </a>
            .
          </p>
        </div>

        <div className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            Old Testament
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {ot.map((book) => (
              <Link
                key={book.slug}
                href={`/bible/${book.slug}`}
                className="rounded-xl border border-storm-700 bg-storm-800/40 px-4 py-3 text-sm text-mist-100 transition hover:border-beam-500/40"
              >
                {book.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            New Testament
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {nt.map((book) => (
              <Link
                key={book.slug}
                href={`/bible/${book.slug}`}
                className="rounded-xl border border-storm-700 bg-storm-800/40 px-4 py-3 text-sm text-mist-100 transition hover:border-beam-500/40"
              >
                {book.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
