import type { Metadata } from "next";
import { ForOrganizations } from "../../components/ForOrganizations";
import { MarginQuote } from "../../components/MarginQuote";
import { pageQuotes } from "@/lib/pageQuotes";

export const metadata: Metadata = {
  title: "For Organizations — Safe Passage",
  description:
    "Churches, employers, and organizations who partner with Safe Passage to support the men in their care.",
};

export default function OrganizationsPage() {
  return (
    <>
      <MarginQuote quote={pageQuotes.organizations.upperLeft.quote} author={pageQuotes.organizations.upperLeft.author} position="upper-left" />
        <MarginQuote quote={pageQuotes.organizations.lowerLeft.quote} author={pageQuotes.organizations.lowerLeft.author} position="lower-left" />
        <MarginQuote quote={pageQuotes.organizations.right.quote} author={pageQuotes.organizations.right.author} position="right" />
      <ForOrganizations />
    </>
  );
}
