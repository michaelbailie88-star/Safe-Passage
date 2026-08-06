import type { SupabaseClient } from "@supabase/supabase-js";

export type CourseProgressMap = Record<string, { completedWeeks: number }>;

// One batched query for all six courses' weekly-completion counts, rather
// than one query per card.
export async function getAllCourseProgress(
  supabase: SupabaseClient,
  userId: string
): Promise<CourseProgressMap> {
  const { data } = await supabase
    .from("program_progress")
    .select("program_slug, week_number")
    .eq("user_id", userId);

  const map: CourseProgressMap = {};
  for (const row of data ?? []) {
    const slug = row.program_slug as string;
    map[slug] = map[slug] ?? { completedWeeks: 0 };
    map[slug].completedWeeks += 1;
  }
  return map;
}

export function commendationForPercent(percent: number): string {
  if (percent === 0) return "Ready when you are.";
  if (percent < 25) return "You've started — that's the hardest part.";
  if (percent < 50) return "Real progress. Keep the momentum.";
  if (percent < 75) return "Past the halfway mark. This is you showing up.";
  if (percent < 100) return "Almost there. Don't stop now.";
  return "Complete. That took real commitment.";
}
