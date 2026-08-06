import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { BrandSeal } from "../../../components/BrandSeal";
import { BackLink } from "../../../components/BackLink";
import { bibleBooks, getBibleBook, getAdjacentBooks } from "@/lib/bible/books";
import { getChapterVerses } from "@/lib/bible/getChapter";

export function generateStaticParams() {
  return bibleBooks.flatMap((b) =>
    Array.from({ length: b.chapterCount }, (_, i) => ({
      book: b.slug,
      chapter: String(i + 1),
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { book: string; chapter: string };
}): Promise<Metadata> {
  const book = getBibleBook(params.book);
  if (!book) return {};
  return { title: `${book.name} ${params.chapter} — The King James Bible — Safe Passage` };
}

export default function BibleChapterPage({
  params,
}: {
  params: { book: string; chapter: string };
}) {
  const book = getBibleBook(params.book);
  if (!book) notFound();

  const chapterNum = Number(params.chapter);
  if (!Number.isInteger(chapterNum) || chapterNum < 1 || chapterNum > book.chapterCount) {
    notFound();
  }

  const verses = getChapterVerses(params.book, chapterNum);
  if (!verses) notFound();

  const hasPrevChapter = chapterNum > 1;
  const hasNextChapter = chapterNum < book.chapterCount;
  const { prev: prevBook, next: nextBook } = getAdjacentBooks(book.slug);

  return (
    <section className="bg-storm-gradient pb-24 pt-16">
      <div className="mx-auto max-w-2xl px-6">
        <BackLink href={`/bible/${book.slug}`} label={`Back to ${book.name}`} />
        <div className="mx-4 sm:mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12">
          <BrandSeal className="mb-6" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            The King James Bible
          </p>
          <h1 className="mt-3 font-display text-2xl italic text-mist-50 sm:text-3xl">
            {book.name} {chapterNum}
          </h1>
        </div>

        <div className="mt-10 space-y-4 rounded-2xl border border-storm-700 bg-storm-800/40 p-6 text-left sm:p-10">
          {verses.map((v) => (
            <p key={v.verse} className="text-sm leading-relaxed text-fog-200">
              <span className="mr-2 font-mono text-xs text-beam-400">{v.verse}</span>
              {v.text}
            </p>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between text-sm">
          {hasPrevChapter ? (
            <Link
              href={`/bible/${book.slug}/${chapterNum - 1}`}
              className="relative z-40 rounded-full border border-storm-700 bg-storm-800/40 px-4 py-2 text-mist-100 transition hover:border-beam-500/40"
            >
              ← {book.name} {chapterNum - 1}
            </Link>
          ) : prevBook ? (
            <Link
              href={`/bible/${prevBook.slug}/${prevBook.chapterCount}`}
              className="relative z-40 rounded-full border border-storm-700 bg-storm-800/40 px-4 py-2 text-mist-100 transition hover:border-beam-500/40"
            >
              ← {prevBook.name} {prevBook.chapterCount}
            </Link>
          ) : (
            <span />
          )}

          {hasNextChapter ? (
            <Link
              href={`/bible/${book.slug}/${chapterNum + 1}`}
              className="relative z-40 rounded-full border border-storm-700 bg-storm-800/40 px-4 py-2 text-mist-100 transition hover:border-beam-500/40"
            >
              {book.name} {chapterNum + 1} →
            </Link>
          ) : nextBook ? (
            <Link
              href={`/bible/${nextBook.slug}/1`}
              className="relative z-40 rounded-full border border-storm-700 bg-storm-800/40 px-4 py-2 text-mist-100 transition hover:border-beam-500/40"
            >
              {nextBook.name} 1 →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </section>
  );
}
