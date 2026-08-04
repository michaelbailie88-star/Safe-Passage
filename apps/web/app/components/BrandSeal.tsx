import Image from "next/image";

/**
 * The full emblem shown large, centered, at the top of a page's content.
 * Distinct from the small nav-bar mark: this is a deliberate "seal" moment
 * meant to be seen and felt, not just a utility icon.
 */
export function BrandSeal({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 scale-125 rounded-full bg-beam-500/20 blur-2xl"
        />
        <Image
          src="/logo.png"
          alt="Safe Passage"
          width={320}
          height={320}
          className="h-44 w-44 sm:h-64 sm:w-64 md:h-80 md:w-80"
          priority
        />
      </div>
    </div>
  );
}
