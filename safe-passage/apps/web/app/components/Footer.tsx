export function Footer() {
  return (
    <footer className="border-t border-storm-700/60 bg-storm-950 py-12">
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-center text-xs leading-relaxed text-fog-500">
          Safe Passage is a peer support and personal growth platform. It is
          not a substitute for professional mental healthcare. If you or
          someone you know is in crisis, help is available right now — in
          the US and Canada, call or text{" "}
          <a href="tel:988" className="text-beam-400 underline underline-offset-2">
            988
          </a>{" "}
          to reach the Suicide &amp; Crisis Lifeline, 24/7.
        </p>
        <p className="mt-6 text-center text-xs text-fog-500">
          &copy; {new Date().getFullYear()} Safe Passage. The mission is the
          destination.
        </p>
      </div>
    </footer>
  );
}
