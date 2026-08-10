import type { Metadata } from "next";
import { ForWho } from "../../components/ForWho";
import { MarginQuote } from "../../components/MarginQuote";
import { LighthouseBeam } from "../../components/LighthouseBeam";
import { pageQuotes } from "@/lib/pageQuotes";

export const metadata: Metadata = {
  title: "Who It's For — Safe Passage",
  description: "Safe Passage is built for men aged 25–55, especially fathers.",
};

export default function ForWhoPage() {
  return (
    <>
      <LighthouseBeam variant="soft" />
      <ForWho
        marginQuote={
          <MarginQuote quote={pageQuotes.forWho.quote} author={pageQuotes.forWho.author} cardWidthPx={672} />
        }
      />
    </>
  );
}
