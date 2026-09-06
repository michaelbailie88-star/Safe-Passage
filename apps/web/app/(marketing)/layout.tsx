import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { StormScene } from "../components/StormScene";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="storm-stars" aria-hidden="true" />
      <StormScene full />
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
