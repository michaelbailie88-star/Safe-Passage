import type { Program } from "./types";

// Anchor — the flagship on-ramp program. Four weeks, built for the man
// who just arrived and doesn't know where to start. Deliberately small
// daily actions; momentum over intensity.
export const anchor: Program = {
  slug: "anchor",
  name: "Anchor",
  tagline: "Four weeks to steady ground.",
  introNote:
    "You don't need to fix your whole life this month. You need one steady point that doesn't move when everything else does. Anchor is that point — four weeks of small, non-negotiable actions that hold when the weather turns.",
  weeks: [
    {
      weekNumber: 1,
      title: "Name the Storm",
      mission: "Say plainly what you're actually carrying.",
      body:
        "Most men never say it out loud. This week is not about fixing anything — it's about naming it. A storm you can name is a storm you can navigate. Vague dread shrinks when it gets specific.",
      story:
        "A fisherman doesn't pretend the water is calm when it isn't. He reads it, calls it what it is, and then works with reality. That honesty isn't weakness — it's the first skill of every man who makes it home.",
      tasks: [
        "Write down the one thing weighing on you most. One sentence. No editing.",
        "Do a daily check-in every day this week, even if the answer is 'fine'.",
        "Tell The Listener one true sentence about your week.",
        "Take one 15-minute walk with no phone. Notice what your mind keeps circling.",
      ],
      noteFromMichael:
        "Week one feels too simple. That's the point. Men quit programs that demand a new personality by Tuesday. This one just asks you to be honest. — M",
    },
    {
      weekNumber: 2,
      title: "Drop Anchor",
      mission: "Build one daily non-negotiable that holds in bad weather.",
      body:
        "Motivation is weather. Discipline is an anchor. This week you pick ONE small daily action — so small it's almost embarrassing — and you do it every single day, especially on the bad days. Ten pushups. Making the bed. Five lines in the logbook. The action matters less than the keeping of it.",
      tasks: [
        "Choose your one daily non-negotiable. Write it in your logbook.",
        "Do it every day. Miss once? Never miss twice.",
        "Track it in the habit tracker and watch the streak start.",
        "Before bed, note one moment the anchor held — however small.",
      ],
      noteFromMichael:
        "The streak you'll build this week is not about the pushups. It's proof you can still trust your own word. That proof is what everything else gets built on. — M",
    },
    {
      weekNumber: 3,
      title: "Man the Lighthouse",
      mission: "Reconnect with one person. Lighthouses exist for others.",
      body:
        "Isolation feels like strength and acts like rot. This week you make one deliberate move toward another human — a text, a call, a coffee, a post in the community. Not a confession. Just contact. Ships don't survive storms alone, and neither do men.",
      tasks: [
        "Reach out to one person you've gone quiet on. One line is enough.",
        "Post once in the community — a win, a question, anything true.",
        "Read two other men's posts and reply to one.",
        "Write in your logbook: who would you call at 2 a.m.? If no one, that's this week's real work.",
      ],
      noteFromMichael:
        "Every man in this community has sat where you're sitting. The first message is the hardest rep of the whole program. Do it badly if you have to. — M",
    },
    {
      weekNumber: 4,
      title: "Chart the Passage",
      mission: "Turn four weeks of steadiness into a heading.",
      body:
        "An anchor holds you in the storm; a chart takes you out of it. This week you look at what actually worked — the check-ins, the anchor habit, the contact — and choose what carries forward. Then you pick your next program. Passage is a direction, not a destination.",
      tasks: [
        "Review your month: check-ins, streak, logbook entries. Write down what changed.",
        "Decide what becomes permanent: your anchor habit stays or gets upgraded.",
        "Choose your next program and start week one.",
        "Write a note to the man who starts Anchor next month. Post it in the community.",
      ],
      noteFromMichael:
        "Four weeks ago you were drifting. Now you have a habit that holds, one person reconnected, and a heading. That's not nothing — that's everything this program promised. Proud of you. — M",
    },
  ],
};
