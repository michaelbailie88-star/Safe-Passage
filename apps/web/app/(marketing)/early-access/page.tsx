import type { Metadata } from "next";
import { EarlyAccessForm } from "../../components/EarlyAccessForm";

export const metadata: Metadata = {
  title: "Get Early Access — Safe Passage",
  description: "Be first through the harbor — get notified when Safe Passage opens its doors.",
};

export default function EarlyAccessPage() {
  return <EarlyAccessForm />;
}
