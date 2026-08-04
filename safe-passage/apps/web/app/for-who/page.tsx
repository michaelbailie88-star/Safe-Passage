import type { Metadata } from "next";
import { ForWho } from "../components/ForWho";

export const metadata: Metadata = {
  title: "Who It's For — Safe Passage",
  description: "Safe Passage is built for men aged 25–55, especially fathers.",
};

export default function ForWhoPage() {
  return <ForWho />;
}
