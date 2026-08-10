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
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
