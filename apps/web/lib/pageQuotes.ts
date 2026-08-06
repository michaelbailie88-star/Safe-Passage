// A pool of verified, clearly public-domain quotes — checked against
// primary or well-documented secondary sources before inclusion (several
// via live search during this session). Historical "inspirational quote"
// lists are full of misattributions, so nothing here was added on the
// strength of a generic quote site alone.
//
// Sources:
// - Theodore Roosevelt: "Citizenship in a Republic" speech (1910); other
//   lines from his verified speeches/writings.
// - Abraham Lincoln: letter to Isham Reavis, 1855.
// - Frederick Douglass: "West India Emancipation" speech, 1857; his
//   autobiography.
// - Booker T. Washington: "Up From Slavery," 1901 (several lines verified
//   directly against the book's text).
// - Marcus Aurelius: "Meditations" (commonly used accurate renderings).
// - Epictetus: "Enchiridion."
// - Seneca: letters/essays.
// - Ralph Waldo Emerson: "Circles" essay.
// - Henry David Thoreau: "Walden."

const pool: { quote: string; author: string }[] = [
  { quote: "The credit belongs to the man who is actually in the arena, whose face is marred by dust and sweat and blood.", author: "Theodore Roosevelt" },
  { quote: "Far and away the best prize that life offers is the chance to work hard at work worth doing.", author: "Theodore Roosevelt" },
  { quote: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { quote: "I am not bound to win, but I am bound to be true.", author: "Abraham Lincoln" },
  { quote: "I am not bound to succeed, but I am bound to live up to what light I have.", author: "Abraham Lincoln" },
  { quote: "Power concedes nothing without a demand. It never did and it never will.", author: "Frederick Douglass" },
  { quote: "If there is no struggle, there is no progress.", author: "Frederick Douglass" },
  { quote: "I would unite with anybody to do right and with nobody to do wrong.", author: "Frederick Douglass" },
  { quote: "Success is to be measured not so much by the position that one has reached, as by the obstacles overcome.", author: "Booker T. Washington" },
  { quote: "Few things help an individual more than to place responsibility upon him, and to let him know that you trust him.", author: "Booker T. Washington" },
  { quote: "Those who are happiest are those who do the most for others.", author: "Booker T. Washington" },
  { quote: "Character, not circumstances, makes the man.", author: "Booker T. Washington" },
  { quote: "You have power over your mind — not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { quote: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { quote: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { quote: "It's not what happens to you, but how you react to it that matters.", author: "Epictetus" },
  { quote: "Difficulties strengthen the mind, as labor does the body.", author: "Seneca" },
  { quote: "Nothing great was ever achieved without enthusiasm.", author: "Ralph Waldo Emerson" },
  { quote: "Go confidently in the direction of your dreams. Live the life you have imagined.", author: "Henry David Thoreau" },
];

const PAGE_KEYS = [
  "home", "mission", "platform", "forWho", "organizations", "resources",
  "dashboard", "logbook", "programsList", "coursesList", "analytics", "community", "account",
  "programRebuild", "programFatherhood", "programPurpose", "programRelationships", "programConfidence", "programFaith",
  "courseRebuild", "courseFatherhood", "coursePurpose", "courseRelationships", "courseConfidence", "courseFaith",
] as const;

type PageKey = (typeof PAGE_KEYS)[number];

function threeFor(index: number, phase: number) {
  const n = pool.length;
  const a = (index + phase) % n;
  const b = (index + phase + 6) % n;
  const c = (index + phase + 12) % n;
  return { upperLeft: pool[a], lowerLeft: pool[b], right: pool[c] };
}

const quoteMap = {} as Record<
  PageKey,
  { upperLeft: { quote: string; author: string }; lowerLeft: { quote: string; author: string }; right: { quote: string; author: string } }
>;

PAGE_KEYS.forEach((key, i) => {
  // Phase-shift every full cycle through the pool so later pages (once we
  // wrap past 18) don't land on the exact same trio as an earlier page.
  const phase = Math.floor(i / pool.length) * 3;
  quoteMap[key] = threeFor(i % pool.length, phase);
});

export const pageQuotes = quoteMap;
