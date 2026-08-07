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
      <MarginQuote quote={pageQuotes.organizations.quote} author={pageQuotes.organizations.author} />
      <ForOrganizations />
    </>
  );
}
