import type { Metadata } from "next";
import { LighthouseBackdrop } from "./components/LighthouseBackdrop";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Safe Passage — The Lighthouse for Men Navigating Life's Storms",
  description:
    "Safe Passage is a mission-driven platform helping men navigate life's storms through mental wellness, fatherhood support, accountability, and personal growth.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >
      <body>
        <LighthouseBackdrop />
        <div className="beam-wrap" aria-hidden="true">
          <div className="beam" />
        </div>
        <NavBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
