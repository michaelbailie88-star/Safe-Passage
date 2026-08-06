import fs from "fs";
import path from "path";

export type BibleVerse = { verse: string; text: string };
export type BibleChapterData = { chapter: string; verses: BibleVerse[] };
export type BibleBookData = { book: string; chapters: BibleChapterData[] };

export function getBookData(slug: string): BibleBookData | null {
  try {
    const filePath = path.join(process.cwd(), "lib", "bible", "data", `${slug}.json`);
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as BibleBookData;
  } catch {
    return null;
  }
}

export function getChapterVerses(slug: string, chapterNum: number): BibleVerse[] | null {
  const book = getBookData(slug);
  if (!book) return null;
  const chapter = book.chapters.find((c) => Number(c.chapter) === chapterNum);
  return chapter ? chapter.verses : null;
}
