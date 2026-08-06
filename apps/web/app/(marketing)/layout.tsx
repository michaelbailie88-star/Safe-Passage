import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { LighthouseBackdrop } from "../components/LighthouseBackdrop";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LighthouseBackdrop />
      <div className="beam-wrap" aria-hidden="true">
        <div className="beam" />
      </div>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
