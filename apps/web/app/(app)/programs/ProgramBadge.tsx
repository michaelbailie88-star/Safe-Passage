import Image from "next/image";

export function ProgramBadge({ programName }: { programName: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-beam-500/40 bg-beam-500/10 p-6 text-center">
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 scale-125 rounded-full bg-beam-500/25 blur-xl"
        />
        <Image src="/logo.png" alt="" width={72} height={72} className="h-16 w-16" />
      </div>
      <p className="mt-3 font-display text-base italic text-mist-50">Badge earned</p>
      <p className="mt-1 text-sm text-fog-300">{programName}</p>
    </div>
  );
}
