import type { Writable } from 'svelte/store';

export interface Exercise {
	id: string;
	name: string;
	description: string;
	categories: string[];
	selected: boolean;
	switchSides?: boolean;
}

export interface WorkoutSettings {
	exerciseLength: number;
	restLength: number;
	repetitions: number;
	setOrCycle: 'set' | 'cycle';
}

export interface ExerciseStore extends Writable<Exercise[]> {
	select: (exercise: Exercise, selected: boolean) => void;
	deselectAll: () => void;
}

export interface SelectedExerciseStore extends Writable<Exercise[]> {
	add: (exercise: Exercise) => void;
	remove: (exercise: Exercise) => void;
	removeAll: () => void;
	swap: (indexOld: number, indexNew: number) => void;
}

export interface WorkoutSettingsStore extends Writable<WorkoutSettings> {}
