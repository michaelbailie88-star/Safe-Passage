import { BrandSeal } from "./BrandSeal";

type Action = { label: string; href: string };

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
  actions: Action[];
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

export function ResourcesContent() {
  return (
    <section className="bg-storm-gradient pb-24 pt-32 sm:pt-40">
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

          <ResourceGroup title="In Crisis Right Now">
            <Item
              name="988 Suicide & Crisis Lifeline (US & Canada)"
              description="24/7, free, confidential. Veterans: dial 988, then press 1. In Quebec, 988 routes to 1-866-APPELLE."
              actions={[
                { label: "Call 988", href: "tel:988" },
                { label: "Text 988", href: "sms:988" },
                { label: "Quebec: Call 1-866-277-3553", href: "tel:+18662773553" },
              ]}
            />
            <Item
              name="Safety Plan (SAMHSA / 988)"
              description="A short, fillable worksheet for writing down your own warning signs, coping strategies, and people to call before a crisis hits — designed to be filled out ahead of time, not in the moment."
              actions={[
                {
                  label: "Download PDF",
                  href: "https://www.samhsa.gov/sites/default/files/988-safety-plan.pdf",
                },
              ]}
            />
            <Item
              name="National Domestic Violence Hotline (US)"
              description="24/7, 200+ languages."
              actions={[
                { label: "Call 1-800-799-7233", href: "tel:+18007997233" },
                { label: "Text START to 88788", href: "sms:88788" },
                { label: "thehotline.org", href: "https://www.thehotline.org" },
              ]}
            />
            <Item
              name="Domestic Abuse Helpline for Men and Women (US)"
              description="Specifically staffed for male victims/survivors."
              actions={[{ label: "Call 1-888-743-5754", href: "tel:+18887435754" }]}
            />
            <Item
              name="VictimLink BC (Canada — BC & Yukon)"
              description="24/7, multilingual."
              actions={[{ label: "Call 1-800-563-0808", href: "tel:+18005630808" }]}
            />
            <Item
              name="ShelterSafe.ca (Canada)"
              description="National directory to find a shelter or transition house anywhere in Canada."
              actions={[{ label: "sheltersafe.ca", href: "https://www.sheltersafe.ca" }]}
            />
            <Item
              name="Findahelpline.com (International)"
              description="Directory of verified crisis lines in 175+ countries, searchable by topic."
              actions={[{ label: "findahelpline.com", href: "https://findahelpline.com" }]}
            />
            <Item
              name="Befrienders Worldwide (International)"
              description="Emotional support centers in 32+ countries."
              actions={[{ label: "befrienders.org", href: "https://www.befrienders.org" }]}
            />
          </ResourceGroup>

          <ResourceGroup title="Mental Health & Substance Use">
            <Item
              name="SAMHSA National Helpline (US)"
              description="24/7, free, confidential treatment referral. No insurance or diagnosis needed."
              actions={[{ label: "Call 1-800-662-4357", href: "tel:+18006624357" }]}
            />
            <Item
              name="NAMI HelpLine (US)"
              description="Guidance and support for mental health conditions."
              actions={[{ label: "Call 1-800-950-6264", href: "tel:+18009506264" }]}
            />
            <Item
              name="Psychology Today — Find a Therapist"
              description="Searchable therapist directory."
              actions={[
                {
                  label: "psychologytoday.com",
                  href: "https://www.psychologytoday.com/us/therapists",
                },
              ]}
            />
            <Item
              name="211 (US & Canada)"
              description="Local help for food, housing, counseling, and more."
              actions={[
                { label: "Call 211", href: "tel:211" },
                { label: "211.org (US)", href: "https://www.211.org" },
                { label: "211.ca (Canada)", href: "https://www.211.ca" },
              ]}
            />
            <Item
              name="Wellness Together Canada"
              description="Free federal mental health and substance use support."
              actions={[
                { label: "wellnesstogether.ca", href: "https://www.wellnesstogether.ca" },
              ]}
            />
            <Item
              name="Coping With Anger After a Difficult Event (SAMHSA)"
              description="A short tip sheet on anger as a normal reaction to a hard event — what it can look like physically, and concrete ways to work through it."
              actions={[
                {
                  label: "Download PDF",
                  href: "https://library.samhsa.gov/sites/default/files/pep19-01-01-002_0.pdf",
                },
              ]}
            />
          </ResourceGroup>

          <ResourceGroup title="Financial">
            <Item
              name="National Foundation for Credit Counseling (US)"
              description="Nonprofit budgeting, debt management, housing counseling."
              actions={[
                { label: "Call 1-800-388-2227", href: "tel:+18003882227" },
                { label: "nfcc.org", href: "https://www.nfcc.org" },
              ]}
            />
            <Item
              name="Credit Counselling Canada"
              description="National association of accredited nonprofit credit counselling agencies."
              actions={[
                {
                  label: "creditcounsellingcanada.ca",
                  href: "https://creditcounsellingcanada.ca",
                },
              ]}
            />
            <Item
              name="Make a Budget Worksheet (FTC / Consumer.gov)"
              description="A one-page fillable worksheet to track what you make and what you spend, so you can see the actual gap — the same one credit counselors use as a starting point."
              actions={[
                {
                  label: "Download PDF",
                  href: "https://www.bulkorder.ftc.gov/system/files/publications/pdf-1020-make-budget-worksheet.pdf",
                },
              ]}
            />
          </ResourceGroup>

          <ResourceGroup title="Legal">
            <Item
              name="LawHelp.org (US)"
              description="Free legal rights info, court forms, and referrals to nonprofit legal aid in every US state and territory."
              actions={[{ label: "lawhelp.org", href: "https://www.lawhelp.org" }]}
            />
            <Item
              name="Legal Services Corporation (US)"
              description="Their 'I Need Legal Help' tool finds a federally-funded legal aid office near you."
              actions={[{ label: "lsc.gov", href: "https://www.lsc.gov" }]}
            />
            <Item
              name="Legal Aid Canada"
              description="Organized by province — links to each province's legal aid program."
              actions={[{ label: "justice.gc.ca", href: "https://www.justice.gc.ca" }]}
            />
            <Item
              name="Canadian Bar Association Find-a-Lawyer"
              description="For those who don't qualify for legal aid but need a referral."
              actions={[{ label: "cba.org", href: "https://www.cba.org" }]}
            />
          </ResourceGroup>

          <ResourceGroup title="Fatherhood & Family">
            <Item
              name="National Fatherhood Initiative (US)"
              description="The country's largest fatherhood-focused nonprofit; free resources and research."
              actions={[{ label: "fatherhood.org", href: "https://www.fatherhood.org" }]}
            />
          </ResourceGroup>
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
