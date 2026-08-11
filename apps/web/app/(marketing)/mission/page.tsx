import type { Metadata } from "next";
import { Mission } from "../../components/Mission";
import { MarginQuote } from "../../components/MarginQuote";
import { pageQuotes } from "@/lib/pageQuotes";

export const metadata: Metadata = {
  title: "Mission — Safe Passage",
  description:
    "To help men navigate life's storms through guidance, accountability, education, and brotherhood.",
};

export default function MissionPage() {
  return (
    <Mission
      marginQuote={
        <MarginQuote quote={pageQuotes.mission.quote} author={pageQuotes.mission.author} cardWidthPx={768} />
      }
    />
  );
}
