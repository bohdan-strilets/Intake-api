import { round } from './round';

export const normalizeCalories = (value: number): number => round(value, 0);

export const normalizeMacro = (value: number): number => round(value, 1);

export const normalizeWeight = (value: number): number => round(value, 0);
