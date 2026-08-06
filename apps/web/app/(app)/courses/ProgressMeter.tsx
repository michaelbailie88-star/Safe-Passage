import { commendationForPercent } from "@/lib/courses/progress";

export function ProgressMeter({
  completedWeeks,
  totalWeeks,
}: {
  completedWeeks: number;
  totalWeeks: number;
}) {
  const percent = Math.round((completedWeeks / totalWeeks) * 100);

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-fog-500">
        <span>
          Week {completedWeeks} of {totalWeeks}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-storm-700">
        <div
          className="h-full rounded-full bg-beam-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs italic text-fog-300">
        {commendationForPercent(percent)}
      </p>
    </div>
  );
}
