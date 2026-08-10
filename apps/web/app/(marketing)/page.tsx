import { Hero } from "../components/Hero";
import { TheProblem } from "../components/TheProblem";
import { TrustStrip } from "../components/TrustStrip";
import { MarginQuote } from "../components/MarginQuote";
import { LighthouseBeam } from "../components/LighthouseBeam";
import { LighthouseBackdrop } from "../components/LighthouseBackdrop";
import { pageQuotes } from "@/lib/pageQuotes";

export default function HomePage() {
  return (
    <>
      <LighthouseBackdrop variant="full" />
      <LighthouseBeam variant="full" />
      <Hero
        marginQuote={
          <MarginQuote quote={pageQuotes.home.quote} author={pageQuotes.home.author} cardWidthPx={768} />
        }
      />
      <TheProblem />
      <TrustStrip />
    </>
  );
}
