import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { LighthouseBackdrop } from "../components/LighthouseBackdrop";
import { LighthouseBeam } from "../components/LighthouseBeam";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LighthouseBackdrop />
      <LighthouseBeam />
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
