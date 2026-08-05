export const COMMUNITY_TOPICS = [
  { slug: "rebuild", name: "Rebuild" },
  { slug: "fatherhood", name: "Fatherhood" },
  { slug: "purpose", name: "Purpose" },
  { slug: "relationships", name: "Relationships" },
  { slug: "confidence", name: "Confidence" },
  { slug: "faith", name: "Faith" },
] as const;

export const communityGuidelines = {
  confidentiality: [
    "What's said in this community stays in this community. Never repeat, screenshot, or share what another man shares here — anywhere else, for any reason.",
    "Speak from your own experience. Don't share someone else's story as if it were an open topic for discussion elsewhere.",
  ],
  trustAndSafety: [
    "This is a space to be honest, not to perform. Vulnerability is the point, not a weakness.",
    "No judgment. Every man here is mid-storm, mid-recovery, or helping someone who is.",
    "No harassment, hate speech, or targeting anyone based on who they are.",
    "No soliciting, selling, or self-promotion.",
    "No sharing anyone's personal identifying information — yours or anyone else's.",
  ],
  ifSomeoneIsInCrisis: [
    "This community is peer support, not emergency care. If you or someone else is in real danger, use the crisis resources on the Resources page — in the US and Canada, call or text 988, 24/7.",
    "If you see someone in real distress here, encourage them toward real help and report it so it can be followed up on — don't try to handle a crisis alone in a chat thread.",
  ],
  selfModeration: [
    "This community is moderated by the men in it living out these guidelines — not by constant policing.",
    "If something crosses a line, report it. Reports are reviewed, and a 3-strike system is in place for real violations.",
    "Strikes are private — visible only to you, never to anyone else in the community.",
  ],
};
