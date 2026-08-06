import type { Metadata } from "next";
import { ForWho } from "../../components/ForWho";
import { MarginQuote } from "../../components/MarginQuote";
import { pageQuotes } from "@/lib/pageQuotes";

export const metadata: Metadata = {
  title: "Who It's For — Safe Passage",
  description: "Safe Passage is built for men aged 25–55, especially fathers.",
};

export default function ForWhoPage() {
  return (
    <>
      <MarginQuote quote={pageQuotes.forWho.upperLeft.quote} author={pageQuotes.forWho.upperLeft.author} position="upper-left" />
        <MarginQuote quote={pageQuotes.forWho.lowerLeft.quote} author={pageQuotes.forWho.lowerLeft.author} position="lower-left" />
        <MarginQuote quote={pageQuotes.forWho.right.quote} author={pageQuotes.forWho.right.author} position="right" />
      <ForWho />
    </>
  );
}
