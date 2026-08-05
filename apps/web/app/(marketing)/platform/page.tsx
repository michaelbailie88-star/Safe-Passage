import type { Metadata } from "next";
import { TheSolution } from "../../components/TheSolution";

export const metadata: Metadata = {
  title: "The Platform — Safe Passage",
  description:
    "The Lighthouse, The Logbook, The Crossing, The Watch, and The Beacon — five ways to find your footing.",
};

export default function PlatformPage() {
  return <TheSolution />;
}
