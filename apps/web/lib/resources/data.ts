// Single source of truth for every crisis/support resource in the app.
// ResourcesContent.tsx renders this data for the public Resources page.
// The Listener's crisis-routing (listener_crisis_resources table) is
// seeded from this same data, keyed by `crisisTypes`, so a phone number
// or link only ever has to be updated in ONE place to update everywhere
// it's shown. Every href below is unchanged from the original hardcoded
// JSX — this is a pure extraction, not a content edit.

export type ResourceAction = { label: string; href: string };

export type ResourceItem = {
  /** Stable key, used as the React key and as the seed key for listener_crisis_resources. */
  key: string;
  name: string;
  description: string;
  actions: ResourceAction[];
  /**
   * Which Listener crisis_type(s) this resource should surface under.
   * Omitted entirely for resources that are informational/Resources-page-only
   * and not part of Listener's crisis escalation (e.g. the Bible link).
   */
  crisisTypes?: (
    | "suicide_self_harm"
    | "domestic_violence"
    | "substance_crisis"
    | "general_mental_health"
    | "anger_control"
    | "financial_crisis"
    | "legal_crisis"
  )[];
  /** ISO region this resource applies to. Defaults to ALL if omitted. */
  region?: "US" | "CA" | "ALL";
};

export type ResourceGroupData = {
  title: string;
  items: ResourceItem[];
};

export const resourceGroups: ResourceGroupData[] = [
  {
    title: "In Crisis Right Now",
    items: [
      {
        key: "988-lifeline",
        name: "988 Suicide & Crisis Lifeline (US & Canada)",
        description:
          "24/7, free, confidential. Veterans: dial 988, then press 1. In Quebec, 988 routes to 1-866-APPELLE.",
        actions: [
          { label: "Call 988", href: "tel:988" },
          { label: "Text 988", href: "sms:988" },
          { label: "Quebec: Call 1-866-277-3553", href: "tel:+18662773553" },
        ],
        crisisTypes: ["suicide_self_harm"],
      },
      {
        key: "samhsa-safety-plan",
        name: "Safety Plan (SAMHSA / 988)",
        description:
          "A short, fillable worksheet for writing down your own warning signs, coping strategies, and people to call before a crisis hits — designed to be filled out ahead of time, not in the moment.",
        actions: [
          {
            label: "Download PDF",
            href: "https://www.samhsa.gov/sites/default/files/988-safety-plan.pdf",
          },
        ],
        crisisTypes: ["suicide_self_harm"],
      },
      {
        key: "ndvh",
        name: "National Domestic Violence Hotline (US)",
        description: "24/7, 200+ languages.",
        actions: [
          { label: "Call 1-800-799-7233", href: "tel:+18007997233" },
          { label: "Text START to 88788", href: "sms:88788" },
          { label: "thehotline.org", href: "https://www.thehotline.org" },
        ],
        crisisTypes: ["domestic_violence"],
        region: "US",
      },
      {
        key: "domestic-abuse-helpline-men",
        name: "Domestic Abuse Helpline for Men and Women (US)",
        description: "Specifically staffed for male victims/survivors.",
        actions: [{ label: "Call 1-888-743-5754", href: "tel:+18887435754" }],
        crisisTypes: ["domestic_violence"],
        region: "US",
      },
      {
        key: "victimlink-bc",
        name: "VictimLink BC (Canada — BC & Yukon)",
        description: "24/7, multilingual.",
        actions: [{ label: "Call 1-800-563-0808", href: "tel:+18005630808" }],
        crisisTypes: ["domestic_violence"],
        region: "CA",
      },
      {
        key: "sheltersafe-ca",
        name: "ShelterSafe.ca (Canada)",
        description: "National directory to find a shelter or transition house anywhere in Canada.",
        actions: [{ label: "sheltersafe.ca", href: "https://www.sheltersafe.ca" }],
        crisisTypes: ["domestic_violence"],
        region: "CA",
      },
      {
        key: "findahelpline",
        name: "Findahelpline.com (International)",
        description: "Directory of verified crisis lines in 175+ countries, searchable by topic.",
        actions: [{ label: "findahelpline.com", href: "https://findahelpline.com" }],
        crisisTypes: ["suicide_self_harm", "domestic_violence", "substance_crisis", "general_mental_health"],
      },
      {
        key: "befrienders",
        name: "Befrienders Worldwide (International)",
        description: "Emotional support centers in 32+ countries.",
        actions: [{ label: "befrienders.org", href: "https://www.befrienders.org" }],
        crisisTypes: ["suicide_self_harm", "general_mental_health"],
      },
    ],
  },
  {
    title: "Mental Health & Substance Use",
    items: [
      {
        key: "samhsa-national-helpline",
        name: "SAMHSA National Helpline (US)",
        description: "24/7, free, confidential treatment referral. No insurance or diagnosis needed.",
        actions: [{ label: "Call 1-800-662-4357", href: "tel:+18006624357" }],
        crisisTypes: ["substance_crisis"],
        region: "US",
      },
      {
        key: "nami-helpline",
        name: "NAMI HelpLine (US)",
        description: "Guidance and support for mental health conditions.",
        actions: [{ label: "Call 1-800-950-6264", href: "tel:+18009506264" }],
        crisisTypes: ["general_mental_health"],
        region: "US",
      },
      {
        key: "psychology-today",
        name: "Psychology Today — Find a Therapist",
        description: "Searchable therapist directory.",
        actions: [
          {
            label: "psychologytoday.com",
            href: "https://www.psychologytoday.com/us/therapists",
          },
        ],
        crisisTypes: ["general_mental_health"],
      },
      {
        key: "211",
        name: "211 (US & Canada)",
        description: "Local help for food, housing, counseling, and more.",
        actions: [
          { label: "Call 211", href: "tel:211" },
          { label: "211.org (US)", href: "https://www.211.org" },
          { label: "211.ca (Canada)", href: "https://www.211.ca" },
        ],
        crisisTypes: ["general_mental_health", "financial_crisis"],
      },
      {
        key: "wellness-together-canada",
        name: "Wellness Together Canada",
        description: "Free federal mental health and substance use support.",
        actions: [{ label: "wellnesstogether.ca", href: "https://www.wellnesstogether.ca" }],
        crisisTypes: ["general_mental_health", "substance_crisis"],
        region: "CA",
      },
      {
        key: "samhsa-anger-tip-sheet",
        name: "Coping With Anger After a Difficult Event (SAMHSA)",
        description:
          "A short tip sheet on anger as a normal reaction to a hard event — what it can look like physically, and concrete ways to work through it.",
        actions: [
          {
            label: "Download PDF",
            href: "https://library.samhsa.gov/sites/default/files/pep19-01-01-002_0.pdf",
          },
        ],
        crisisTypes: ["anger_control"],
      },
    ],
  },
  {
    title: "Financial",
    items: [
      {
        key: "nfcc",
        name: "National Foundation for Credit Counseling (US)",
        description: "Nonprofit budgeting, debt management, housing counseling.",
        actions: [
          { label: "Call 1-800-388-2227", href: "tel:+18003882227" },
          { label: "nfcc.org", href: "https://www.nfcc.org" },
        ],
        crisisTypes: ["financial_crisis"],
        region: "US",
      },
      {
        key: "credit-counselling-canada",
        name: "Credit Counselling Canada",
        description: "National association of accredited nonprofit credit counselling agencies.",
        actions: [
          { label: "creditcounsellingcanada.ca", href: "https://creditcounsellingcanada.ca" },
        ],
        crisisTypes: ["financial_crisis"],
        region: "CA",
      },
      {
        key: "ftc-budget-worksheet",
        name: "Make a Budget Worksheet (FTC / Consumer.gov)",
        description:
          "A one-page fillable worksheet to track what you make and what you spend, so you can see the actual gap — the same one credit counselors use as a starting point.",
        actions: [
          {
            label: "Download PDF",
            href: "https://www.bulkorder.ftc.gov/system/files/publications/pdf-1020-make-budget-worksheet.pdf",
          },
        ],
        crisisTypes: ["financial_crisis"],
      },
    ],
  },
  {
    title: "Legal",
    items: [
      {
        key: "lawhelp-org",
        name: "LawHelp.org (US)",
        description:
          "Free legal rights info, court forms, and referrals to nonprofit legal aid in every US state and territory.",
        actions: [{ label: "lawhelp.org", href: "https://www.lawhelp.org" }],
        crisisTypes: ["legal_crisis"],
        region: "US",
      },
      {
        key: "lsc-gov",
        name: "Legal Services Corporation (US)",
        description: "Their 'I Need Legal Help' tool finds a federally-funded legal aid office near you.",
        actions: [{ label: "lsc.gov", href: "https://www.lsc.gov" }],
        crisisTypes: ["legal_crisis"],
        region: "US",
      },
      {
        key: "legal-aid-canada",
        name: "Legal Aid Canada",
        description: "Organized by province — links to each province's legal aid program.",
        actions: [{ label: "justice.gc.ca", href: "https://www.justice.gc.ca" }],
        crisisTypes: ["legal_crisis"],
        region: "CA",
      },
      {
        key: "cba-find-a-lawyer",
        name: "Canadian Bar Association Find-a-Lawyer",
        description: "For those who don't qualify for legal aid but need a referral.",
        actions: [{ label: "cba.org", href: "https://www.cba.org" }],
        crisisTypes: ["legal_crisis"],
        region: "CA",
      },
    ],
  },
  {
    title: "Fatherhood & Family",
    items: [
      {
        key: "national-fatherhood-initiative",
        name: "National Fatherhood Initiative (US)",
        description: "The country's largest fatherhood-focused nonprofit; free resources and research.",
        actions: [{ label: "fatherhood.org", href: "https://www.fatherhood.org" }],
        region: "US",
      },
    ],
  },
];
