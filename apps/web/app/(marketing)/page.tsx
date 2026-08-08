import { Hero } from "../components/Hero";
import { TheProblem } from "../components/TheProblem";
import { TrustStrip } from "../components/TrustStrip";
import { MarginQuote } from "../components/MarginQuote";
import { pageQuotes } from "@/lib/pageQuotes";

export default function HomePage() {
  return (
    <>
      <MarginQuote quote={pageQuotes.home.quote} author={pageQuotes.home.author} cardWidthPx={768} />
      <Hero />
      <TheProblem />
      <TrustStrip />
    </>
  );
}
