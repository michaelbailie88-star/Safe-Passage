import type { Metadata } from "next";
import { SignUpForm } from "./SignUpForm";

export const metadata: Metadata = {
  title: "Create Your Account — Safe Passage",
  description: "Start with the free plan on Safe Passage.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
