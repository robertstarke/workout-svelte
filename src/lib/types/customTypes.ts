import type { Writable } from 'svelte/store';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  categories: string[];
  selected: boolean;
}

export interface ExerciseStore extends Writable<Exercise[]> {
  select: (exercise: Exercise, selected: boolean) => void;
}

export interface SelectedExerciseStore extends Writable<Exercise[]> {
  add: (exercise: Exercise) => void;
  remove: (exercise: Exercise) => void;
  swap: (indexOld: number, indexNew: number) => void;
}
