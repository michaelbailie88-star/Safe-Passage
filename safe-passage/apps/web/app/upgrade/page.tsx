import type { Metadata } from "next";
import { UpgradeView } from "./UpgradeView";

export const metadata: Metadata = {
  title: "Upgrade to Premium — Safe Passage",
  description: "Transformation programs, advanced analytics, community groups, guided audio, and courses.",
};

export default function UpgradePage() {
  return <UpgradeView />;
}
