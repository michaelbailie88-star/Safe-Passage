import type { Metadata } from "next";
import { BrandSeal } from "../components/BrandSeal";

export const metadata: Metadata = {
  title: "Resources — Safe Passage",
  description: "Verified crisis, mental health, financial, and legal resources for men navigating hard seasons — US, Canada, and international.",
};

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
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-fog-300">
        {children}
      </div>
    </div>
  );
}

function Item({
  name,
  detail,
}: {
  name: string;
  detail: React.ReactNode;
}) {
  return (
    <p>
      <span className="font-semibold text-mist-100">{name}</span> — {detail}
    </p>
  );
}

export default function ResourcesPage() {
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
            Every organization and number below is real and verified.
            Safe Passage doesn&rsquo;t replace professional help — these
            are the people who can actually provide it.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          <ResourceGroup title="In Crisis Right Now">
            <Item
              name="988 Suicide & Crisis Lifeline (US & Canada)"
              detail="Call or text 988 — 24/7, free, confidential. Veterans: dial 988, then press 1. In Quebec, 988 routes to 1-866-277-3553 (1-866-APPELLE)."
            />
            <Item
              name="National Domestic Violence Hotline (US)"
              detail={
                <>
                  Call 1-800-799-7233, text START to 88788, or chat at{" "}
                  thehotline.org — 24/7, 200+ languages.
                </>
              }
            />
            <Item
              name="Domestic Abuse Helpline for Men and Women (US)"
              detail="Call 1-888-743-5754 — specifically staffed for male victims/survivors."
            />
            <Item
              name="VictimLink BC (Canada — BC & Yukon)"
              detail="Call 1-800-563-0808 — 24/7, multilingual."
            />
            <Item
              name="ShelterSafe.ca (Canada)"
              detail="National directory to find a shelter or transition house anywhere in Canada."
            />
            <Item
              name="Findahelpline.com (International)"
              detail="Directory of verified crisis lines in 175+ countries, searchable by topic."
            />
            <Item
              name="Befrienders Worldwide (International)"
              detail="befrienders.org — emotional support centers in 32+ countries."
            />
          </ResourceGroup>

          <ResourceGroup title="Mental Health & Substance Use">
            <Item
              name="SAMHSA National Helpline (US)"
              detail="Call 1-800-662-4357 — 24/7, free, confidential treatment referral. No insurance or diagnosis needed."
            />
            <Item
              name="NAMI HelpLine (US)"
              detail="Call 1-800-950-6264 — guidance and support for mental health conditions."
            />
            <Item
              name="Psychology Today — Find a Therapist"
              detail="psychologytoday.com/us/therapists — searchable therapist directory."
            />
            <Item
              name="211 (US & Canada)"
              detail="Call 211 or visit 211.org / 211.ca — local help for food, housing, counseling, and more."
            />
            <Item
              name="Wellness Together Canada"
              detail="wellnesstogether.ca — free federal mental health and substance use support."
            />
          </ResourceGroup>

          <ResourceGroup title="Financial">
            <Item
              name="National Foundation for Credit Counseling (US)"
              detail="Call 1-800-388-2227 or nfcc.org — nonprofit budgeting, debt management, housing counseling."
            />
            <Item
              name="Credit Counselling Canada"
              detail="creditcounsellingcanada.ca — national association of accredited nonprofit credit counselling agencies."
            />
          </ResourceGroup>

          <ResourceGroup title="Legal">
            <Item
              name="LawHelp.org (US)"
              detail="Free legal rights info, court forms, and referrals to nonprofit legal aid in every US state and territory."
            />
            <Item
              name="Legal Services Corporation (US)"
              detail="lsc.gov — their 'I Need Legal Help' tool finds a federally-funded legal aid office near you."
            />
            <Item
              name="Legal Aid Canada"
              detail="Organized by province — see justice.gc.ca for links to each province's legal aid program."
            />
            <Item
              name="Canadian Bar Association Find-a-Lawyer"
              detail="cba.org — for those who don't qualify for legal aid but need a referral."
            />
          </ResourceGroup>

          <ResourceGroup title="Fatherhood & Family">
            <Item
              name="National Fatherhood Initiative (US)"
              detail="fatherhood.org — the country's largest fatherhood-focused nonprofit; free resources and research."
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
