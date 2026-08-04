import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign In — Safe Passage",
  description: "Sign in to your Safe Passage account.",
};

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
