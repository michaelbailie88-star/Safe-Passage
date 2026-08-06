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
    <>
      <MarginQuote quote={pageQuotes.mission.upperLeft.quote} author={pageQuotes.mission.upperLeft.author} position="upper-left" />
        <MarginQuote quote={pageQuotes.mission.lowerLeft.quote} author={pageQuotes.mission.lowerLeft.author} position="lower-left" />
        <MarginQuote quote={pageQuotes.mission.right.quote} author={pageQuotes.mission.right.author} position="right" />
      <Mission />
    </>
  );
}
