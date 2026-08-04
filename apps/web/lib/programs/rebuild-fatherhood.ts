import type { Program } from "./types";

export const rebuild: Program = {
  slug: "rebuild",
  name: "Rebuild",
  tagline:
    "For men starting over after a major life collapse — divorce, job loss, addiction, identity crisis, or hitting bottom.",
  introNote:
    "If you're reading this wondering whether 8 weeks is enough — it took years to find real, lasting stability. Eight weeks won't undo years. But it's enough to change direction. It's enough to stop the freefall and start climbing. What you build in these 8 weeks isn't a finish line — it's a foundation. And a foundation is everything. One more thing before you start: failure in your past does not mean it's over. You have to get through the weeds to get to the flowers. A smooth sea never made a skilled sailor. Wherever you're starting from — your comeback is always greater than your setback.",
  weeks: [
    {
      weekNumber: 1,
      title: "Where You Are",
      mission: "Name the wreckage, honestly, without shame.",
      body: "This week isn't about fixing anything. It's about telling the truth — to yourself, first. Most men spend years avoiding an honest look at where they actually are, because looking feels like losing. It's the opposite. You can't rebuild a house without knowing which walls are actually standing.",
      tasks: [
        "Write one page, no editing, on exactly where you are right now — financially, emotionally, relationally. No filter.",
        "Identify the single hardest thing to admit on that page. Sit with it. Don't fix it yet.",
        "Complete a daily check-in each day this week (mood, one win, one honest struggle).",
      ],
      noteFromMichael:
        "I remember the page I couldn't finish writing — the one where I had to admit how bad it had actually gotten. I put it down three times before I finished it. That page didn't fix anything. But it was the first true thing I'd said to myself in a long time, and everything after started there. You're not behind. You're just finally looking.",
    },
    {
      weekNumber: 2,
      title: "What Actually Happened",
      mission: "Separate what you caused from what happened to you.",
      body: "Rebuilding gets stuck when everything gets lumped into one big story of \"everything fell apart.\" It didn't all fall apart the same way. Some of it you did. Some of it was done to you. Some of it was just storm — nobody's fault, still yours to survive.",
      tasks: [
        "List the major events of the collapse in order.",
        "Mark each one: caused by me / done to me / just happened.",
        "Notice which category you're most tempted to lie about, in either direction.",
      ],
      noteFromMichael:
        "I spent a long time either blaming myself for everything or blaming everyone else for everything. Neither one was true, and neither one helped me move. The real story was always more complicated — and more forgiving — than the version I was telling myself in the dark.",
    },
    {
      weekNumber: 3,
      title: "The Floor",
      mission: "Build one non-negotiable daily anchor.",
      body: "Before you can rebuild anything bigger, you need a floor that doesn't move. One thing, every day, no matter what — sleep, movement, one real meal, whatever it is for you. Not five things. One.",
      tasks: [
        "Choose one daily anchor and commit to it for 7 straight days.",
        "Track it daily — not to judge yourself, just to see the pattern.",
        "Notice what happens on the day you're most tempted to skip it. Do it anyway.",
      ],
      noteFromMichael:
        "Mine was getting out of bed by a set time, every day, even the days I had nowhere to be. It sounds small. It wasn't. It was the first proof I had that I could still keep a promise to myself.",
    },
    {
      weekNumber: 4,
      title: "Who's Still Here",
      mission: "Take honest inventory of the relationships still standing.",
      body: "Storms clear people out — some by their choice, some by yours, some just by distance and time. This week isn't about who you lost. It's about who's actually still in your corner right now, today.",
      tasks: [
        "List everyone who checked on you in the last 3 months, even once.",
        "Reach out to one of them this week — not to explain everything, just to reconnect.",
        "Identify one relationship worth actively rebuilding, and one worth letting go of for now.",
      ],
      noteFromMichael:
        "I was surprised by who stayed and who didn't. Some of the people I expected to be there weren't. Some of the people I'd almost forgotten were the ones who showed up. Don't assume you know your list until you actually look at it.",
    },
    {
      weekNumber: 5,
      title: "Money & Logistics",
      mission: "The practical rebuild — budget, housing, immediate obligations.",
      body: "This week is unglamorous and necessary. Storms don't just wreck you emotionally — they wreck your logistics. This week is about facing the practical mess directly instead of avoiding it because it's overwhelming.",
      tasks: [
        "Write down every current obligation — bills, debts, deadlines — in one place. (No judgment. Just a list.)",
        "Identify the single most urgent item and take one concrete step on it this week.",
        "If you're carrying real financial hardship, use the verified financial resources on the Safe Passage Resources page — you don't have to figure this out alone or from scratch.",
      ],
      noteFromMichael:
        "This was the week I most wanted to skip. Looking at the actual numbers felt worse than not knowing. It wasn't. Not knowing was worse — I just didn't realize it until I finally looked.",
    },
    {
      weekNumber: 6,
      title: "Grief Has a Shape",
      mission: "Process the loss without rushing past it.",
      body: "Whatever you lost — a marriage, a job, an identity, a version of your life you'd planned on — it's a real loss, and real losses need to be grieved, not just \"gotten over.\" Rushing grief doesn't make it faster. It just makes it come back later, usually worse.",
      tasks: [
        "Name specifically what you lost — not the whole collapse, but the actual, specific things.",
        "Let yourself feel it for real, even if just once this week, without trying to fix or minimize it.",
        "Talk to one person — a friend, a counselor, a group — about what you lost, out loud.",
      ],
      noteFromMichael:
        "I tried to skip this part for a long time. I thought moving fast meant I was strong. It just meant I was carrying grief I hadn't put down yet, and it showed up everywhere else instead — in my temper, my sleep, my patience with my kids. Grieving it directly was what actually let me put it down.",
    },
    {
      weekNumber: 7,
      title: "The New Baseline",
      mission: 'Define what "stable" looks like now — not before.',
      body: "You're not rebuilding the exact life you had. That life is gone. You're building a new one, and it gets to look different — sometimes smaller at first, sometimes better than before in ways you didn't expect.",
      tasks: [
        'Write down what "a good, stable week" looks like for you right now — realistically, not aspirationally.',
        "Compare it honestly to where you actually are today. Notice the gap without judging it.",
        "Pick one piece of that new baseline to start building this week.",
      ],
      noteFromMichael:
        'My "stable" now looks nothing like my "stable" five years ago. I used to think that meant I\'d failed. Now I know it just means I rebuilt something true instead of something borrowed.',
    },
    {
      weekNumber: 8,
      title: "First Steps Forward",
      mission: "One concrete goal for the next 90 days.",
      body: "This is where Rebuild ends and the rest of your life picks back up — not because you're \"fixed,\" but because you now have a floor to build from. This week is about pointing yourself forward with one real, specific goal.",
      tasks: [
        'Choose one 90-day goal — specific, not vague ("save $500" not "get better with money").',
        "Write down the first three steps toward it.",
        "Look back at Week 1's page. Read what you wrote. Notice how far you've actually come.",
      ],
      noteFromMichael:
        "Read that Week 1 page again. I mean it — actually go back and read it. When I did that with mine, that was the first moment I let myself believe the comeback was real. Not finished. Real. That's enough to keep going on.",
    },
  ],
};

export const fatherhood: Program = {
  slug: "fatherhood",
  name: "Fatherhood",
  tagline:
    "For dads — present, distant, divorced, or working to become present again.",
  introNote:
    "You don't need to have been a perfect father to start this. You just need to be willing to look honestly at the father you've been, and the one you want to be. That willingness is the whole program.",
  weeks: [
    {
      weekNumber: 1,
      title: "The Dad You Had",
      mission: "Understand how your own father shaped your model — for better or worse.",
      body: "Every man carries a template for fatherhood, whether he chose it or not. Some of what your father gave you is worth keeping. Some of it you're still unlearning. This week is about seeing the template clearly before you decide what to do with it.",
      tasks: [
        "Write down three things your father did that you want to repeat, and three you want to break.",
        "Notice where you've already repeated a pattern you didn't choose consciously.",
        "If your father wasn't present, write honestly about what that absence taught you — good and bad.",
      ],
      noteFromMichael:
        "I had to sit with the fact that some of what I was doing as a dad wasn't really mine — it was inherited, on autopilot. Seeing that clearly was uncomfortable. It was also the first step toward actually choosing, instead of just repeating.",
    },
    {
      weekNumber: 2,
      title: "The Dad You're Being",
      mission: "An honest, non-judgmental self-audit.",
      body: "Not who you think you are. Not who you wish you were. Who you're actually being, day to day, right now.",
      tasks: [
        "Track your actual interactions with your kids for 7 days — not just the good moments, all of them.",
        "Ask yourself after each one: present or distracted? Patient or short?",
        "Pick one pattern you notice and name it honestly, without spiraling into shame.",
      ],
      noteFromMichael:
        "This week is hard because it's just data, no judgment allowed yet. I remember seeing how much of my \"time\" with my kids was really me being in the room, not actually with them. That noticing changed more than any lecture ever could have.",
    },
    {
      weekNumber: 3,
      title: "Presence Over Perfection",
      mission: "Build small, consistent acts that build real trust.",
      body: "Kids don't remember the one big gesture nearly as much as they remember whether you showed up, over and over, in small ways.",
      tasks: [
        "Choose one small daily ritual with your kid(s) — five minutes, undistracted, every day this week.",
        "Put your phone away for it. All the way away.",
        "Notice what changes in your kid's behavior toward you by day 7.",
      ],
      noteFromMichael:
        "My kids didn't need grand gestures from me. They needed me to actually be there for the small stuff, consistently. That was harder than any big gesture would have been — and it mattered more.",
    },
    {
      weekNumber: 4,
      title: "Co-Parenting Without War",
      mission: "Communication that protects the kids, even when the relationship with their other parent is hard.",
      body: "If this doesn't apply to you, use this week to strengthen communication with your partner about parenting instead.",
      tasks: [
        "Write down your non-negotiables for how you'll communicate about your kids, regardless of how the other parent communicates.",
        "Practice one difficult co-parenting conversation using only kid-focused language — no old relationship grievances.",
        "Identify one thing you can stop doing that puts your kids in the middle, even unintentionally.",
      ],
      noteFromMichael:
        "The hardest discipline I had to learn was keeping my kids out of the conflict that wasn't theirs to carry. I didn't always get it right. But every time I chose their peace over being right, it was worth it.",
    },
    {
      weekNumber: 5,
      title: "Discipline vs. Connection",
      mission: "Correct behavior without losing the relationship.",
      body: "Discipline that only punishes teaches fear. Discipline that also explains and connects teaches judgment. This week is about the difference.",
      tasks: [
        "Notice one moment this week where you disciplined on autopilot, and ask what you could've said differently.",
        'Practice explaining the "why" behind one boundary you set, in language your kid can actually understand.',
        "End one disciplinary moment with connection — a hug, a check-in, confirmation that your love isn't conditional on their behavior.",
      ],
      noteFromMichael:
        "I used to discipline the way I was disciplined — fast, final, no explanation. Learning to connect after correcting didn't make me softer. It made my kids trust me more, not less.",
    },
    {
      weekNumber: 6,
      title: "What Kids Actually Remember",
      mission: "Understand the difference between big gestures and daily rhythm.",
      tasks: [
        "Ask an older child, or think back to your own childhood, about what actually stuck — usually it's not what you'd expect.",
        "Identify your family's current daily/weekly rhythm. Is it something worth remembering?",
        "Adjust one small piece of that rhythm this week to make it more intentional.",
      ],
      noteFromMichael:
        "I used to think the vacations and the big days were what would matter most. What actually mattered was whether I showed up the same way on the boring Tuesdays. That's the part nobody warns you about.",
    },
    {
      weekNumber: 7,
      title: "Repair",
      mission: "Rebuild trust after being absent, harsh, or unreliable.",
      body: "Every father gets this wrong sometimes. What matters isn't never failing — it's whether you repair it.",
      tasks: [
        "Identify one specific moment you got it wrong with your kid(s).",
        "Have an actual conversation acknowledging it — age-appropriate, real, no over-explaining or making it about your guilt.",
        "Notice that repair doesn't require perfection — it requires honesty.",
      ],
      noteFromMichael:
        "I had to learn that apologizing to my kids didn't make me less of a father. It made me a father they could actually trust, because they saw me own it instead of pretend it didn't happen.",
    },
    {
      weekNumber: 8,
      title: "The Long Game",
      mission: "Fatherhood as a decades-long practice, not a fixed state.",
      tasks: [
        "Write a short letter to your future self, to be read in one year, about the father you're building toward.",
        "Choose one ongoing practice from this program to keep going after Week 8 ends.",
        "Look back at Week 1. Notice what's already shifted.",
      ],
      noteFromMichael:
        "Fatherhood isn't a test you pass once. It's something you keep choosing, every day, for the rest of your life. The comeback isn't a single moment — it's a direction you keep walking in.",
    },
  ],
};
