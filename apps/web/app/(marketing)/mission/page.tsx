import type { Metadata } from "next";
import { Mission } from "../../components/Mission";

export const metadata: Metadata = {
  title: "Mission — Safe Passage",
  description:
    "To help men navigate life's storms through guidance, accountability, education, and brotherhood.",
};

export default function MissionPage() {
  return <Mission />;
}
