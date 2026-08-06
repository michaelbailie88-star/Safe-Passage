import { Hero } from "../components/Hero";
import { TheProblem } from "../components/TheProblem";
import { TrustStrip } from "../components/TrustStrip";
import { MarginQuote } from "../components/MarginQuote";
import { pageQuotes } from "@/lib/pageQuotes";

export default function HomePage() {
  return (
    <>
      <MarginQuote quote={pageQuotes.home.upperLeft.quote} author={pageQuotes.home.upperLeft.author} position="upper-left" />
        <MarginQuote quote={pageQuotes.home.lowerLeft.quote} author={pageQuotes.home.lowerLeft.author} position="lower-left" />
        <MarginQuote quote={pageQuotes.home.right.quote} author={pageQuotes.home.right.author} position="right" />
      <Hero />
      <TheProblem />
      <TrustStrip />
    </>
  );
}
