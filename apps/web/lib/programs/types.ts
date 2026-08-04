export type ProgramWeek = {
  weekNumber: number;
  title: string;
  mission: string;
  body?: string;
  scripture?: { text: string; reference: string }[];
  story?: string;
  tasks: string[];
  noteFromMichael: string;
};

export type Program = {
  slug: string;
  name: string;
  tagline: string;
  introNote: string;
  weeks: ProgramWeek[];
};
