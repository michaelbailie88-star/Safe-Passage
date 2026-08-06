"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { FreeProgram } from "@/lib/free-programs";
import { ProgramBadge } from "./ProgramBadge";

type TaskState = {
  response: string;
  status: "not_started" | "draft" | "submitted";
  saving: boolean;
  justSaved: "" | "draft" | "submitted";
  error: string;
};

export function TaskChecklist({
  program,
  userId,
}: {
  program: FreeProgram;
  userId: string;
}) {
  const [taskStates, setTaskStates] = useState<Record<number, TaskState>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("program_task_progress")
      .select("task_number, response, status")
      .eq("user_id", userId)
      .eq("program_slug", program.slug)
      .then(({ data, error }) => {
        if (error) {
          setLoadError("Couldn't load your progress. Try refreshing.");
        } else {
          const next: Record<number, TaskState> = {};
          program.tasks.forEach((_, i) => {
            const taskNumber = i + 1;
            const row = data?.find((r) => r.task_number === taskNumber);
            next[taskNumber] = {
              response: row?.response ?? "",
              status: (row?.status as TaskState["status"]) ?? "not_started",
              saving: false,
              justSaved: "",
              error: "",
            };
          });
          setTaskStates(next);
        }
        setLoading(false);
      });
  }, [program.slug, program.tasks, userId]);

  function updateResponse(taskNumber: number, value: string) {
    setTaskStates((prev) => ({
      ...prev,
      [taskNumber]: { ...prev[taskNumber], response: value },
    }));
  }

  async function saveTask(taskNumber: number, status: "draft" | "submitted") {
    const current = taskStates[taskNumber];
    if (status === "submitted" && !current.response.trim()) {
      setTaskStates((prev) => ({
        ...prev,
        [taskNumber]: { ...prev[taskNumber], error: "Write something before submitting." },
      }));
      return;
    }

    setTaskStates((prev) => ({
      ...prev,
      [taskNumber]: { ...prev[taskNumber], saving: true, error: "", justSaved: "" },
    }));

    const supabase = createClient();
    const { error } = await supabase.from("program_task_progress").upsert(
      {
        user_id: userId,
        program_slug: program.slug,
        task_number: taskNumber,
        response: current.response.trim(),
        status,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,program_slug,task_number" }
    );

    setTaskStates((prev) => ({
      ...prev,
      [taskNumber]: {
        ...prev[taskNumber],
        saving: false,
        status: error ? prev[taskNumber].status : status,
        error: error ? "Couldn't save. Try again." : "",
        justSaved: error ? "" : status,
      },
    }));

    if (!error) {
      setTimeout(() => {
        setTaskStates((prev) => ({
          ...prev,
          [taskNumber]: { ...prev[taskNumber], justSaved: "" },
        }));
      }, 3000);
    }
  }

  const totalTasks = program.tasks.length;
  const submittedCount = Object.values(taskStates).filter(
    (t) => t.status === "submitted"
  ).length;
  const isComplete = submittedCount >= totalTasks;

  return (
    <div className="mt-10 space-y-4">
      {loading && <p className="text-center text-sm text-fog-300">Loading your progress…</p>}
      {loadError && (
        <p role="alert" className="text-center text-sm text-red-400">
          {loadError}
        </p>
      )}

      {!loading && (
        <p className="text-center text-sm text-fog-300">
          {submittedCount} of {totalTasks} tasks submitted
        </p>
      )}

      {isComplete && !loading && <ProgramBadge programName={program.name} />}

      {!loading &&
        program.tasks.map((task, i) => {
          const taskNumber = i + 1;
          const state = taskStates[taskNumber];
          if (!state) return null;
          const isSubmitted = state.status === "submitted";

          return (
            <div
              key={taskNumber}
              className={`rounded-xl border p-5 text-left transition ${
                isSubmitted
                  ? "border-signal-500/40 bg-signal-500/10"
                  : "border-storm-700 bg-storm-800/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                    isSubmitted
                      ? "border-signal-400 bg-signal-500/20 text-signal-400"
                      : state.status === "draft"
                      ? "border-beam-500/60 text-beam-400"
                      : "border-fog-500 text-fog-400"
                  }`}
                >
                  {isSubmitted ? "✓" : String(taskNumber).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-mist-100">{task}</p>

                  <label htmlFor={`task-${taskNumber}`} className="sr-only">
                    Your response to task {taskNumber}
                  </label>
                  <textarea
                    id={`task-${taskNumber}`}
                    value={state.response}
                    onChange={(e) => updateResponse(taskNumber, e.target.value)}
                    rows={3}
                    placeholder="Do the work here — write your response..."
                    className="mt-3 w-full rounded-xl border border-storm-700 bg-storm-900/60 px-3 py-2 text-sm text-mist-100 placeholder:text-fog-500 focus:border-beam-500"
                  />

                  {state.error && (
                    <p role="alert" className="mt-1 text-xs text-red-400">
                      {state.error}
                    </p>
                  )}
                  {state.justSaved === "draft" && (
                    <p role="status" className="mt-1 text-xs text-beam-400">
                      ✓ Draft saved — pick this up anytime.
                    </p>
                  )}
                  {state.justSaved === "submitted" && (
                    <p role="status" className="mt-1 text-xs text-signal-400">
                      ✓ Submitted and verified.
                    </p>
                  )}

                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveTask(taskNumber, "draft")}
                      disabled={state.saving || !state.response.trim()}
                      className="rounded-full border border-storm-700 px-3 py-1.5 text-xs font-medium text-fog-300 transition hover:border-fog-500/50 disabled:opacity-50"
                    >
                      Save draft
                    </button>
                    <button
                      type="button"
                      onClick={() => saveTask(taskNumber, "submitted")}
                      disabled={state.saving}
                      className="relative z-40 rounded-full bg-[#E5A526] px-3 py-1.5 text-xs font-semibold text-[#080D16] transition hover:bg-[#F2B84B] disabled:opacity-50"
                    >
                      {isSubmitted ? "Update submission" : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
