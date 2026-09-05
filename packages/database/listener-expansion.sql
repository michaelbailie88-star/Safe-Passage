-- ============================================================================
-- The Listener — content expansion pack (v2)
-- Adds new pre-written responses across everyday storm topics.
--
-- HOW TO RUN:
--   1. Supabase dashboard -> SQL Editor -> paste -> Run
--   2. Then visit /api/admin/listener/seed-embeddings once, signed in as admin,
--      to embed the new trigger phrases (safe to re-run; it only embeds what's
--      missing).
--
-- Schema note: matches listener_responses(response_text, category,
-- crisis_type, trigger_examples, is_active). Category 'general' keeps these
-- on the standard match threshold; crisis_type stays NULL so they never
-- masquerade as crisis routing. If your table's id has no default, add
-- gen_random_uuid() as the first column value.
-- ============================================================================

insert into listener_responses (response_text, category, crisis_type, trigger_examples, is_active) values

(
  'Feeling alone in it is one of the most common things men carry, and one of the least said out loud. Here''s the honest truth: isolation feels like protection, but it works like slow poison. You don''t have to fix it tonight. One small contact beats a perfect plan — one text, one post in the community, one honest sentence to one person. Start stupidly small. That counts.',
  'general',
  null,
  array[
    'I feel so alone',
    'nobody understands what I''m going through',
    'I have no one to talk to',
    'I feel isolated from everyone',
    'I''m dealing with this by myself',
    'no friends anymore'
  ],
  true
),

(
  'Anger that comes out of nowhere usually isn''t about the thing that set it off — it''s pressure with nowhere else to go. Underneath most anger is something softer: exhaustion, feeling unheard, grief, fear. Try this: name what you''re actually feeling under the anger, out loud, in plain words. It sounds too simple. It works because it moves the pressure from your fists to your words. The dashboard has a bad-habit tracker if the anger is turning into patterns you want to watch.',
  'general',
  null,
  array[
    'I''m angry all the time',
    'I keep losing my temper',
    'I snapped at my kids again',
    'I''m so angry and I don''t know why',
    'road rage is getting bad',
    'everything makes me furious lately'
  ],
  true
),

(
  'Marriage under strain is heavy in a way men rarely get permission to admit. Two true things at once: it may be really bad right now, AND most strained marriages have more left in them than the worst night suggests. Start with one conversation that isn''t about the fight — ten minutes, no scoreboard, just "how are we doing." If it''s past what talking can fix, that''s not failure; that''s when a couples counselor earns their keep. The Resources page has starting points either way.',
  'general',
  null,
  array[
    'my marriage is falling apart',
    'my wife and I keep fighting',
    'I think my marriage is over',
    'we barely talk anymore',
    'my relationship is under strain',
    'sleeping in separate rooms'
  ],
  true
),

(
  'Money stress sits on a man''s chest like nothing else — because it feels like it''s measuring you. It isn''t. A bank balance is a weather report, not a verdict on who you are. This week, do one concrete thing: write down what comes in and what goes out, on paper, no app needed. The number on paper is almost always less scary than the one in your head at 3 a.m. If it''s deeper than budgeting, the Resources page lists free nonprofit credit counselors who do this every day.',
  'general',
  null,
  array[
    'I''m drowning in debt',
    'money stress is killing me',
    'I can''t pay my bills',
    'I''m broke and ashamed',
    'financial pressure is crushing me',
    'behind on rent again'
  ],
  true
),

(
  'Job loss hits men in the identity before it hits the wallet. You didn''t just lose income — you lost the answer to "so what do you do?" Give yourself this week to actually feel it, then treat the search like a job with hours: mornings on applications, afternoons off, evenings with people. And say it plainly to someone: "I lost my job." Every man you admire has a story that starts exactly there.',
  'general',
  null,
  array[
    'I lost my job',
    'I got laid off today',
    'I got fired and I''m scared',
    'I can''t find work',
    'unemployed and feel worthless',
    'my company let me go'
  ],
  true
),

(
  'Fatherhood guilt — the feeling that you''re failing the people who need you most — usually means the opposite: men who don''t care don''t feel guilty. Your kids don''t need a perfect father. They need a present one who repairs when he messes up. Twenty focused minutes beats a distracted day. And the repair — "I''m sorry I snapped, that wasn''t about you" — teaches them more than never snapping ever could.',
  'general',
  null,
  array[
    'I feel like a bad father',
    'I''m failing my kids',
    'I yelled at my son and feel terrible',
    'I don''t know how to be a dad',
    'my kids deserve better than me',
    'fatherhood guilt is eating me up'
  ],
  true
),

(
  'What you''re describing — going back to something you keep deciding to quit — is a loop, not a character flaw. Loops break with structure, not willpower: know your trigger times, change the environment at those times, and tell one person so the loop loses its favorite hiding place, secrecy. The bad-habit tracker on your dashboard was built for exactly this. Slip-ups are data, not verdicts.',
  'general',
  null,
  array[
    'I can''t stop watching porn',
    'I keep relapsing',
    'I have a habit I''m ashamed of',
    'I quit and then go back',
    'addiction keeps pulling me back in',
    'I''m fighting a compulsion'
  ],
  true
),

(
  'When your mind won''t shut off at night, it''s usually because the day never gave those thoughts a hearing. Try the unload: ten minutes before bed, write down everything circling — no structure, just dump it. Then one line: "tomorrow I will think about this at ___." It tells your brain the meeting is scheduled so it can stop shouting. If the nights stay brutal for weeks, that''s worth mentioning to a doctor; sleep is infrastructure, not luxury.',
  'general',
  null,
  array[
    'I can''t sleep',
    'my mind races at night',
    'I''m up at 3am every night worrying',
    'insomnia is wrecking me',
    'I can''t turn my brain off',
    'anxious thoughts keep me awake'
  ],
  true
),

(
  'Feeling like you''ve lost your purpose often shows up after a big role ends — the job, the marriage, the team, the routine. Purpose isn''t found by thinking harder; it comes back through usefulness. Small and useful beats grand and stuck. This week: do one useful thing for one person, daily. Mentoring, fixing something, showing up somewhere. Direction returns while you''re moving, not while you''re parked.',
  'general',
  null,
  array[
    'I feel like I have no purpose',
    'I don''t know what my life is for',
    'I feel empty inside',
    'what''s the point of all this',
    'I feel lost and directionless',
    'nothing I do matters'
  ],
  true
),

(
  'Making friends as a grown man is genuinely hard — nobody warns you that the built-in brotherhoods (school, teams, work crews) mostly disappear. The trick is that adult friendship forms through repeated side-by-side activity, not deep talks: a league, a gym class, a volunteer shift, the community right here in this app. Same place, same time, weekly. Six weeks of showing up and you''ll have the beginnings.',
  'general',
  null,
  array[
    'I don''t have any friends',
    'how do men even make friends',
    'I lost touch with everyone',
    'all my friendships faded',
    'I''m lonely but hate small talk',
    'no one ever calls me'
  ],
  true
),

(
  'Grief doesn''t follow a schedule, and it doesn''t care that people expect you to be over it by now. However long it''s been — it takes what it takes. The only real rule: grief needs somewhere to go. Talk about the person. Say their name. Write to them in your logbook if that''s what you''ve got. And if it''s swallowing whole weeks, a grief counselor or group is strength, not surrender.',
  'general',
  null,
  array[
    'someone I love died',
    'I can''t get over losing him',
    'grief is crushing me',
    'I lost my mom last year and I''m not okay',
    'I miss my brother so much',
    'death in the family'
  ],
  true
),

(
  'Burnout isn''t being tired — it''s running a system that takes more than it returns, for months. The fix isn''t a vacation (you''d return to the same system). It''s subtraction: one commitment dropped, one honest "no," one evening that belongs to you, defended like a meeting with your boss. Start there this week. The Anchor program''s week two is built exactly for rebuilding from empty.',
  'general',
  null,
  array[
    'I''m completely burned out',
    'I have nothing left to give',
    'work is draining me dry',
    'I''m exhausted all the time',
    'running on empty',
    'I can''t keep this pace up'
  ],
  true
),

(
  'Doubt doesn''t mean your faith is dying — it usually means it''s honest. Every man in the Bible you''d call faithful had a chapter full of questions. You don''t have to perform belief here. If you want to explore at your own pace, the faith pathway is optional and always open; if you just need to say "I''m not sure what I believe anymore" without getting preached at, this community can hold that too.',
  'general',
  null,
  array[
    'I''m doubting my faith',
    'I''m angry at God',
    'I don''t know if I believe anymore',
    'where is God in my suffering',
    'I feel far from God',
    'praying feels pointless lately'
  ],
  true
),

(
  'Noticing that the drinking has quietly become the coping — that noticing is the hard part, and you''re already doing it. You don''t have to label yourself anything tonight. Try a two-week experiment: no drinks Monday through Thursday, and track how the mornings feel. If weekends-only still keeps slipping bigger, or stopping feels scary, that''s real information — SAMHSA''s free line (1-800-662-4357) talks to guys at exactly that question, no commitment required.',
  'general',
  null,
  array[
    'I think I''m drinking too much',
    'I drink to cope with stress',
    'I need a beer to unwind every night',
    'worried about my drinking',
    'alcohol is my only escape',
    'I hide how much I drink'
  ],
  true
);

-- After running: visit /api/admin/listener/seed-embeddings once as admin.
