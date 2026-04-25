import type { Grade } from '../../types';

type GradeOption = {
  value: Grade;
  color: string;
  contrastColor: string;
};

export const gradeOptions: GradeOption[] = [
  { value: '7~8Q 20課題', color: '#f48ab6', contrastColor: '#ffffff' },
  { value: '5~6Q 25課題', color: '#67c7e8', contrastColor: '#12313a' },
  { value: '4Q 30課題', color: '#f1d44b', contrastColor: '#332b0b' },
  { value: '3Q 30課題', color: '#f1913d', contrastColor: '#ffffff' },
  { value: '2Q 30課題', color: '#df4b3f', contrastColor: '#ffffff' },
];

export const getGradeOption = (grade: Grade) =>
  gradeOptions.find((gradeOption) => gradeOption.value === grade) ?? gradeOptions[0];

export const problemsByGrade: Record<Grade, number[]> = {
  '7~8Q 20課題': Array.from({ length: 20 }, (_, index) => index + 1),
  '5~6Q 25課題': Array.from({ length: 25 }, (_, index) => index + 1),
  '4Q 30課題': Array.from({ length: 30 }, (_, index) => index + 1),
  '3Q 30課題': Array.from({ length: 30 }, (_, index) => index + 1),
  '2Q 30課題': Array.from({ length: 30 }, (_, index) => index + 1),
};
