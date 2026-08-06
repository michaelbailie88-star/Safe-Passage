import type { Metadata } from "next";
import { TheSolution } from "../../components/TheSolution";
import { MarginQuote } from "../../components/MarginQuote";
import { pageQuotes } from "@/lib/pageQuotes";

export const metadata: Metadata = {
  title: "The Platform — Safe Passage",
  description:
    "The Lighthouse, The Logbook, The Crossing, The Watch, and The Beacon — five ways to find your footing.",
};

export default function PlatformPage() {
  return (
    <>
      <MarginQuote quote={pageQuotes.platform.upperLeft.quote} author={pageQuotes.platform.upperLeft.author} position="upper-left" />
        <MarginQuote quote={pageQuotes.platform.lowerLeft.quote} author={pageQuotes.platform.lowerLeft.author} position="lower-left" />
        <MarginQuote quote={pageQuotes.platform.right.quote} author={pageQuotes.platform.right.author} position="right" />
      <TheSolution />
    </>
  );
}
