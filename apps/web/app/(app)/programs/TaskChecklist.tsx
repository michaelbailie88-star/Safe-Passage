"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { FreeProgram } from "@/lib/free-programs";
import { ProgramBadge } from "./ProgramBadge";

export function TaskChecklist({
  program,
  userId,
}: {
  program: FreeProgram;
  userId: string;
}) {
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [pendingTask, setPendingTask] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("program_task_progress")
      .select("task_number")
      .eq("user_id", userId)
      .eq("program_slug", program.slug)
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          setError("Couldn't load your progress. Try refreshing.");
        } else if (data) {
          setCompletedTasks(new Set(data.map((row) => row.task_number)));
        }
        setLoading(false);
      });
  }, [program.slug, userId]);

  async function toggleTask(taskNumber: number) {
    setPendingTask(taskNumber);
    setError("");
    const supabase = createClient();
    const isDone = completedTasks.has(taskNumber);

    if (isDone) {
      const { error: deleteError } = await supabase
        .from("program_task_progress")
        .delete()
        .eq("user_id", userId)
        .eq("program_slug", program.slug)
        .eq("task_number", taskNumber);

      if (deleteError) {
        setError("Couldn't update. Try again.");
      } else {
        setCompletedTasks((prev) => {
          const next = new Set(prev);
          next.delete(taskNumber);
          return next;
        });
      }
    } else {
      const { error: insertError } = await supabase
        .from("program_task_progress")
        .insert({ user_id: userId, program_slug: program.slug, task_number: taskNumber });

      if (insertError) {
        setError("Couldn't update. Try again.");
      } else {
        setCompletedTasks((prev) => new Set(prev).add(taskNumber));
      }
    }
    setPendingTask(null);
  }

  const totalTasks = program.tasks.length;
  const isComplete = completedTasks.size >= totalTasks;

  return (
    <div className="mt-10 space-y-4">
      {loading && <p className="text-center text-sm text-fog-300">Loading your progress…</p>}
      {error && (
        <p role="alert" className="text-center text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading && (
        <p className="text-center text-sm text-fog-300">
          {completedTasks.size} of {totalTasks} tasks complete
        </p>
      )}

      {isComplete && !loading && <ProgramBadge programName={program.name} />}

      {!loading &&
        program.tasks.map((task, i) => {
          const taskNumber = i + 1;
          const done = completedTasks.has(taskNumber);
          return (
            <button
              key={taskNumber}
              type="button"
              onClick={() => toggleTask(taskNumber)}
              disabled={pendingTask === taskNumber}
              className={`flex w-full items-start gap-3 rounded-xl border px-5 py-4 text-left text-sm transition disabled:opacity-60 ${
                done
                  ? "border-signal-500/40 bg-signal-500/10 text-signal-400"
                  : "border-storm-700 bg-storm-800/40 text-mist-100 hover:border-fog-500/50"
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                  done ? "border-signal-400 bg-signal-500/20" : "border-fog-500"
                }`}
              >
                {done && "✓"}
              </span>
              <span>
                <span className="mr-2 font-mono text-xs text-fog-500">
                  {String(taskNumber).padStart(2, "0")}
                </span>
                {task}
              </span>
            </button>
          );
        })}
    </div>
  );
}
