import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { BrandSeal } from "../../components/BrandSeal";
import { BackLink } from "../../components/BackLink";
import { bibleBooks, getBibleBook } from "@/lib/bible/books";

export function generateStaticParams() {
  return bibleBooks.map((b) => ({ book: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { book: string };
}): Promise<Metadata> {
  const book = getBibleBook(params.book);
  if (!book) return {};
  return { title: `${book.name} — The King James Bible — Safe Passage` };
}

export default function BibleBookPage({ params }: { params: { book: string } }) {
  const book = getBibleBook(params.book);
  if (!book) notFound();

  const chapters = Array.from({ length: book.chapterCount }, (_, i) => i + 1);

  return (
    <section className="bg-storm-gradient pb-24 pt-16">
      <div className="mx-auto max-w-3xl px-6">
        <BackLink href="/bible" label="Back to Bible" />
        <div className="mx-4 sm:mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12">
          <BrandSeal className="mb-6" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            {book.testament === "OT" ? "Old Testament" : "New Testament"}
          </p>
          <h1 className="mt-3 font-display text-2xl italic text-mist-50 sm:text-3xl">
            {book.name}
          </h1>
          <p className="mt-2 text-sm text-fog-300">
            {book.chapterCount} {book.chapterCount === 1 ? "chapter" : "chapters"}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-5 gap-3 sm:grid-cols-8 md:grid-cols-10">
          {chapters.map((ch) => (
            <Link
              key={ch}
              href={`/bible/${book.slug}/${ch}`}
              className="flex items-center justify-center rounded-lg border border-storm-700 bg-storm-800/40 py-3 text-sm text-mist-100 transition hover:border-beam-500/40"
            >
              {ch}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
