import { rebuild, fatherhood } from "./rebuild-fatherhood";
import { purpose, relationships } from "./purpose-relationships";
import { confidence, faith } from "./confidence-faith";
import type { Program } from "./types";

export type { Program, ProgramWeek } from "./types";

export const programs: Program[] = [
  rebuild,
  fatherhood,
  purpose,
  relationships,
  confidence,
  faith,
];

export function getProgram(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}
