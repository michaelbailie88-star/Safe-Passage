import type { ReactNode } from "react";
import { BrandSeal } from "./BrandSeal";
import { LighthouseBackdrop } from "./LighthouseBackdrop";
import { LighthouseBeam } from "./LighthouseBeam";
import { resourceGroups, type ResourceAction } from "@/lib/resources/data";

function ResourceGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-storm-700 bg-storm-800/40 p-6">
      <h2 className="font-display text-lg italic text-mist-50">{title}</h2>
      <div className="mt-3 space-y-5 text-sm leading-relaxed text-fog-300">
        {children}
      </div>
    </div>
  );
}

function Item({
  name,
  description,
  actions,
}: {
  name: string;
  description: string;
  actions: ResourceAction[];
}) {
  return (
    <div>
      <p className="font-semibold text-mist-100">{name}</p>
      <p className="mt-0.5">{description}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {actions.map((action) => (
          <a
            key={action.href}
            href={action.href}
            target={action.href.startsWith("http") ? "_blank" : undefined}
            rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="relative z-40 rounded-full border border-beam-500/40 bg-beam-500/10 px-4 py-1.5 text-xs font-semibold text-beam-400 transition hover:bg-beam-500/20"
          >
            {action.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function ResourcesContent({
  marginQuote,
  topOffset,
}: {
  marginQuote: ReactNode;
  topOffset: number;
}) {
  return (
    <section className="relative bg-storm-gradient pb-24 pt-32 sm:pt-40">
      <LighthouseBackdrop topOffset={topOffset} variant="soft" />
      <LighthouseBeam topOffset={topOffset} variant="soft" />
      {marginQuote}
      <div className="mx-auto max-w-4xl px-6">
        <div className="mx-4 sm:mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-12 sm:py-16">
          <BrandSeal className="mb-8" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal-400">
            The Beacon
          </p>
          <h1 className="mt-4 font-display text-2xl italic text-mist-50 sm:text-3xl">
            Resources
          </h1>
          <p className="mt-3 text-sm text-fog-300">
            Every organization and number below is real and verified, and
            every button is a live link — tap to call, text, visit, or
            download. Safe Passage doesn&rsquo;t replace professional
            help — these are the people who can actually provide it.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          <div className="rounded-2xl border border-beam-500/40 bg-beam-500/5 p-6">
            <h2 className="font-display text-lg italic text-mist-50">
              The King James Bible
            </h2>
            <p className="mt-1 text-xs uppercase tracking-wide text-beam-400">
              Old &amp; New Testament
            </p>
            <p className="mt-3 text-sm text-fog-300">
              Free to read here, book by book and chapter by chapter.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="/bible"
                className="relative z-40 rounded-full border border-beam-500/40 bg-beam-500/10 px-4 py-1.5 text-xs font-semibold text-beam-400 transition hover:bg-beam-500/20"
              >
                Read here
              </a>
              <a
                href="https://www.biblegateway.com/versions/King-James-Version-KJV-Bible/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-40 rounded-full border border-beam-500/40 bg-beam-500/10 px-4 py-1.5 text-xs font-semibold text-beam-400 transition hover:bg-beam-500/20"
              >
                biblegateway.com
              </a>
            </div>
          </div>

          {resourceGroups.map((group) => (
            <ResourceGroup key={group.title} title={group.title}>
              {group.items.map((item) => (
                <Item
                  key={item.key}
                  name={item.name}
                  description={item.description}
                  actions={item.actions}
                />
              ))}
            </ResourceGroup>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-fog-500">
          Safe Passage is a peer support and personal growth platform. It
          is not a substitute for professional mental healthcare, legal
          advice, or financial advice.
        </p>
      </div>
    </section>
  );
}
