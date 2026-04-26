export type Grade =
  | '7~8Q 20課題'
  | '5~6Q 25課題'
  | '4Q 30課題'
  | '3Q 30課題'
  | '2Q 30課題';

export type ProblemStatus = 'completed' | 'failed' | null;

export type ProblemSelectionMode = 'all' | 'range' | 'specific' | 'random';

export type TourSettings = {
  grade: Grade;
  maxTries: number;
  timeLimitMinutes: number;
  problemSelectionMode: ProblemSelectionMode;
  problemNumbers: number[];
};

export type ProblemResult = {
  problemNumber: number;
  tries: number;
  status: ProblemStatus;
};

export type TourHistory = {
  id: string;
  finishedAt: string;
  settings: TourSettings;
  results: ProblemResult[];
  elapsedSeconds: number;
  remainingSeconds: number;
};
