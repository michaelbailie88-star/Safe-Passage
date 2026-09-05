// Encouragements shown in the page margins across the app.
// Not famous quotes — the words you'd actually want to hear in the moment
// each page is built for. `author` is intentionally empty; these speak as
// the platform itself, not as borrowed wisdom.
//
// (This file replaces the old public-domain quote pool, per the founder's
// direction: no quotes, only encouragement.)

export type PageKey =
  | "home"
  | "mission"
  | "platform"
  | "forWho"
  | "organizations"
  | "resources"
  | "dashboard"
  | "logbook"
  | "programsList"
  | "coursesList"
  | "analytics"
  | "community"
  | "account"
  | "programRebuild"
  | "programFatherhood"
  | "programPurpose"
  | "programRelationships"
  | "programConfidence"
  | "programFaith"
  | "courseRebuild"
  | "courseFatherhood"
  | "coursePurpose"
  | "courseRelationships"
  | "courseConfidence"
  | "courseFaith";

export const pageQuotes: Record<PageKey, { quote: string; author: string }> = {
  home: { quote: "You're still here, still looking. That's not nothing. That's the whole starting line.", author: "" },
  mission: { quote: "This was built for the man who thinks he's the only one going through it. You never were.", author: "" },
  platform: { quote: "Small steps, kept daily, carry a man further than grand plans abandoned by Friday.", author: "" },
  forWho: { quote: "If any of this sounds like your life, looking at this page already took guts. That's enough to begin.", author: "" },
  organizations: { quote: "Strong men aren't born into calm water. They're built in weather exactly like this.", author: "" },
  resources: { quote: "Checking the charts isn't weakness. Every good captain does it before the storm, not after.", author: "" },
  dashboard: { quote: "You showed up today. Streaks are built one showing-up at a time, and this one counts.", author: "" },
  logbook: { quote: "Honest pages, even messy ones, are how storms get mapped. Write it rough.", author: "" },
  programsList: { quote: "Pick one and start. A good plan begun beats a perfect plan postponed.", author: "" },
  coursesList: { quote: "Eight weeks from now you'll be glad you started today. So start today.", author: "" },
  analytics: { quote: "These numbers aren't a verdict on you. They're a compass heading. Steer by them.", author: "" },
  community: { quote: "Every man in here has sat exactly where you're sitting. Say something true.", author: "" },
  account: { quote: "The man on this account is worth the work. Keep going.", author: "" },
  programRebuild: { quote: "You didn't wait for the ground to stop shaking. You built anyway.", author: "" },
  programFatherhood: { quote: "Present beats perfect. Your kids need you, not a flawless version of you.", author: "" },
  programPurpose: { quote: "Purpose returns through usefulness. Do one useful thing today and watch.", author: "" },
  programRelationships: { quote: "Repair is a skill, not a personality trait. Every strong marriage has practiced it.", author: "" },
  programConfidence: { quote: "Doubt can ride along. It just doesn't get to drive anymore.", author: "" },
  programFaith: { quote: "You don't have to perform belief here. Honest seeking counts as seeking.", author: "" },
  courseRebuild: { quote: "Week by week. The foundation doesn't care about your pace, only your persistence.", author: "" },
  courseFatherhood: { quote: "Twenty focused minutes with them outweighs a distracted day.", author: "" },
  coursePurpose: { quote: "Direction comes back while you're moving, never while you're parked.", author: "" },
  courseRelationships: { quote: "One honest conversation, no scoreboard. Start there tonight.", author: "" },
  courseConfidence: { quote: "The voice saying you can't has a terrible track record. Look at you — still here.", author: "" },
  courseFaith: { quote: "Ask the hard question out loud. Faith that survives honesty is the kind that holds.", author: "" },
};
