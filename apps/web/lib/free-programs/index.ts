export type FreeProgram = {
  slug: string;
  name: string;
  tagline: string;
  tasks: string[];
};

export const freePrograms: FreeProgram[] = [
  {
    slug: "rebuild",
    name: "Rebuild",
    tagline: "A free taste of starting over — the full 8-week Course goes much deeper.",
    tasks: [
      "Write one honest page about where you are right now — no editing, no filter.",
      "List the major events of your collapse, in order.",
      "Mark each one: caused by me / done to me / just happened.",
      "Choose one daily non-negotiable and commit to it for 7 days.",
      "List everyone who checked on you in the last 3 months.",
      "Reach out to one person from that list this week.",
      "Write down every current financial or logistical obligation in one place.",
      "Take one concrete step on the most urgent item on that list.",
      "Name specifically what you lost — not the whole collapse, the actual things.",
      "Talk to one person about what you lost, out loud.",
      "Write down what \"a good, stable week\" looks like for you right now.",
      "Choose one 90-day goal and write the first three steps toward it.",
    ],
  },
  {
    slug: "fatherhood",
    name: "Fatherhood",
    tagline: "A free taste of the work — the full 8-week Course goes much deeper.",
    tasks: [
      "Write three things your father did that you want to repeat.",
      "Write three things you want to break from his example.",
      "Track your interactions with your kids for 3 days, honestly.",
      "Choose one small daily ritual with your kid(s) this week.",
      "Put your phone away for that ritual, every time.",
      "Write your non-negotiables for how you'll communicate about your kids.",
      "Notice one moment you disciplined on autopilot — write what you'd change.",
      "End one correction this week with connection, not just consequence.",
      "Ask an older child (or recall your own childhood) what actually stuck with them.",
      "Name one specific moment you got it wrong with your kid, honestly.",
      "Have one real conversation acknowledging that moment.",
      "Write a short letter to your future self about the father you're building toward.",
    ],
  },
  {
    slug: "purpose",
    name: "Purpose",
    tagline: "A free taste of the search — the full 8-week Course goes much deeper.",
    tasks: [
      "Write what \"purpose\" is supposed to feel like — then question where that idea came from.",
      "List five moments in your life you felt most like yourself.",
      "Find the pattern underneath those five moments.",
      "Write the sentence you're most afraid to write about what you want.",
      "Tell one trusted person that sentence out loud.",
      "List the expectations placed on you by family or culture around \"success.\"",
      "Compare that list honestly to what you actually value.",
      "Choose one small, purposeful action to repeat weekly.",
      "Do it once, this week, regardless of how it feels.",
      "Assess honestly: is your job your purpose, a means to it, or unrelated?",
      "Identify one purposeful action that has nothing to do with your job title.",
      "Write your current best answer to \"what am I here to do.\"",
    ],
  },
  {
    slug: "relationships",
    name: "Relationships",
    tagline: "A free taste of showing up better — the full 8-week Course goes much deeper.",
    tasks: [
      "Notice your default reaction in conflict this week.",
      "Trace that pattern back to where you likely learned it.",
      "In one real conversation, listen fully without planning your response.",
      "Reflect back what you heard before responding.",
      "Identify your go-to contempt move and name it honestly.",
      "Practice repairing within 24 hours of any conflict this week.",
      "Share one honest, unguarded feeling with someone you trust.",
      "Identify one boundary you've been avoiding setting.",
      "Set that boundary clearly, once, without over-explaining.",
      "Reach out to one friend you've let drift.",
      "Identify one regular rhythm with them you could actually sustain.",
      "Describe, in detail, the relationship you want a year from now.",
    ],
  },
  {
    slug: "confidence",
    name: "Confidence",
    tagline: "A free taste of the practice — the full 8-week Course goes much deeper.",
    tasks: [
      "Write your earliest memory of feeling \"not enough.\"",
      "Notice how much your current self-talk still echoes that moment.",
      "Notice one moment this week you performed confidence instead of feeling it.",
      "Choose one skill to genuinely get better at.",
      "Practice it deliberately at least 3 times this week.",
      "Notice your posture and voice in three different situations.",
      "Practice standing and speaking like you belong in the room.",
      "Identify your default reaction to failure.",
      "Build a 3-step recovery process for the next time you fail.",
      "Notice every time you compare yourself to someone else this week.",
      "Take one action toward what you're actually longing for underneath that comparison.",
      "Write what \"confident\" means to you now, compared to task one.",
    ],
  },
  {
    slug: "faith",
    name: "Faith",
    tagline: "A free, optional taste of this pathway — the full 8-week Course goes much deeper.",
    tasks: [
      "Write an honest letter to God about exactly where you are.",
      "Read Psalm 34:18 once a day this week.",
      "Write down one identity you've been carrying that isn't true anymore.",
      "Read 2 Corinthians 5:17 slowly.",
      "Set one specific daily time to pray, even five minutes.",
      "Bring one real worry to that prayer, unpolished.",
      "Identify your current storm, specifically and honestly.",
      "Read Isaiah 43:2, picturing yourself not alone in it.",
      "Identify one man you could be more honest with.",
      "Reach out to him this week, just to reconnect.",
      "Name one thing you've never actually confessed — to God or to yourself.",
      "Choose one sustainable faith practice to carry forward.",
    ],
  },
];

export function getFreeProgram(slug: string): FreeProgram | undefined {
  return freePrograms.find((p) => p.slug === slug);
}
