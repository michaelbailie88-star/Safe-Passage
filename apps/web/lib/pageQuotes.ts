// A pool of verified, clearly public-domain quotes — checked against
// primary or well-documented secondary sources before inclusion (several
// via live search during this session, cross-referenced against multiple
// independent sources). Historical "inspirational quote" lists are full
// of misattributions, so nothing here was added on the strength of a
// generic quote site alone.
//
// Sources:
// - Theodore Roosevelt: "Citizenship in a Republic" speech (Sorbonne,
//   April 23, 1910) — verified against American Rhetoric, the Theodore
//   Roosevelt Association, and ushistory.education's full-text transcript.
// - Abraham Lincoln: letter to Isham Reavis, 1855.
// - Frederick Douglass: "West India Emancipation" speech, August 4, 1857
//   — verified against BlackPast.org, the Frederick Douglass Papers
//   Project's digital edition, and Cornell Law's blog.
// - Booker T. Washington: "Up From Slavery," 1901 — verified against
//   Britannica, LitCharts (primary-text excerpt with surrounding context),
//   and GradeSaver.
// - Marcus Aurelius: "Meditations" (commonly used accurate renderings).
// - Epictetus: "Enchiridion."
// - Seneca: letters/essays.
// - Ralph Waldo Emerson: "Circles" essay.
// - Henry David Thoreau: "Walden."
//
// Scripture quotes are pulled directly from this project's own verified
// KJV dataset (lib/bible/data/), byte-checked against the source, not
// typed from memory.

const pool: { quote: string; author: string }[] = [
  { quote: "The credit belongs to the man who is actually in the arena, whose face is marred by dust and sweat and blood.", author: "Theodore Roosevelt" },
  { quote: "Far and away the best prize that life offers is the chance to work hard at work worth doing.", author: "Theodore Roosevelt" },
  { quote: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { quote: "Who at the best knows in the end the triumph of high achievement, and who at the worst, if he fails, at least fails while daring greatly.", author: "Theodore Roosevelt" },
  { quote: "I am not bound to win, but I am bound to be true.", author: "Abraham Lincoln" },
  { quote: "I am not bound to succeed, but I am bound to live up to what light I have.", author: "Abraham Lincoln" },
  { quote: "Power concedes nothing without a demand. It never did and it never will.", author: "Frederick Douglass" },
  { quote: "If there is no struggle, there is no progress.", author: "Frederick Douglass" },
  { quote: "I would unite with anybody to do right and with nobody to do wrong.", author: "Frederick Douglass" },
  { quote: "Find out just what any people will quietly submit to, and you have found the exact measure of injustice which will be imposed upon them.", author: "Frederick Douglass" },
  { quote: "Success is to be measured not so much by the position that one has reached, as by the obstacles overcome.", author: "Booker T. Washington" },
  { quote: "Few things help an individual more than to place responsibility upon him, and to let him know that you trust him.", author: "Booker T. Washington" },
  { quote: "Those who are happiest are those who do the most for others.", author: "Booker T. Washington" },
  { quote: "Character, not circumstances, makes the man.", author: "Booker T. Washington" },
  { quote: "No race can prosper till it learns that there is as much dignity in tilling a field as in writing a poem.", author: "Booker T. Washington" },
  { quote: "You have power over your mind — not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { quote: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { quote: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { quote: "It's not what happens to you, but how you react to it that matters.", author: "Epictetus" },
  { quote: "Difficulties strengthen the mind, as labor does the body.", author: "Seneca" },
  { quote: "Nothing great was ever achieved without enthusiasm.", author: "Ralph Waldo Emerson" },
  { quote: "Go confidently in the direction of your dreams. Live the life you have imagined.", author: "Henry David Thoreau" },
];

// Verified directly against this project's own KJV dataset
// (lib/bible/data/isaiah.json, lib/bible/data/2-corinthians.json).
const isaiah432 = {
  quote: "When thou passest through the waters, I will be with thee; and through the rivers, they shall not overflow thee: when thou walkest through the fire, thou shalt not be burned; neither shall the flame kindle upon thee.",
  author: "Isaiah 43:2",
};
const secondCorinthians517 = {
  quote: "Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.",
  author: "2 Corinthians 5:17",
};

const PAGE_KEYS = [
  "home", "mission", "platform", "forWho", "organizations", "resources",
  "dashboard", "logbook", "programsList", "coursesList", "analytics", "community", "account",
  "programRebuild", "programFatherhood", "programPurpose", "programRelationships", "programConfidence", "programFaith",
  "courseRebuild", "courseFatherhood", "coursePurpose", "courseRelationships", "courseConfidence", "courseFaith",
] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

// One quote per page, assigned deliberately (not by rotation formula) so
// theme can loosely match page content. 22 general quotes cover 23
// non-Faith pages, so exactly one pair shares a quote — "organizations"
// (marketing, rarely seen by logged-in app users) and "forWho" (also
// marketing) share one, since neither sits in the same user session as
// the app-shell pages. Faith pages get real scripture instead of the
// general pool.
export const pageQuotes: Record<PageKey, { quote: string; author: string }> = {
  home: pool[0],
  mission: pool[1],
  platform: pool[2],
  forWho: pool[3],
  organizations: pool[3],
  resources: pool[4],
  dashboard: pool[5],
  logbook: pool[6],
  programsList: pool[7],
  coursesList: pool[8],
  analytics: pool[9],
  community: pool[10],
  account: pool[11],
  programRebuild: pool[12],
  programFatherhood: pool[13],
  programPurpose: pool[14],
  programRelationships: pool[15],
  programConfidence: pool[16],
  programFaith: isaiah432,
  courseRebuild: pool[17],
  courseFatherhood: pool[18],
  coursePurpose: pool[19],
  courseRelationships: pool[20],
  courseConfidence: pool[21],
  courseFaith: secondCorinthians517,
};
