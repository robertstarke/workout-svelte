<script lang="ts">
	import '../app.css';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import type { Exercise, ExerciseStore, SelectedExerciseStore } from '$lib/types/customTypes';
	import exerciseData from '$lib/data/exercises.json';

	// exercises list store
	const exerciseArray: Exercise[] = JSON.parse(JSON.stringify(exerciseData)).map(
		(exercise: Exercise) => ({
			...exercise,
			selected: false
		})
	);
	const exerciseWritable = writable(exerciseArray);
	const exercises: ExerciseStore = {
		subscribe: exerciseWritable.subscribe,
		set: exerciseWritable.set,
		update: exerciseWritable.update,
		select: (exercise: Exercise, selected: boolean): void => {
			exerciseWritable.update(($exercises): Exercise[] => {
				let changeIndex = $exercises.findIndex((e: Exercise) => e.id === exercise.id);
				$exercises[changeIndex].selected = selected;
				return $exercises;
			});
		},
		deselectAll: () => {
			exerciseWritable.update(($exercises) =>
				$exercises.map((e: Exercise) => ({ ...e, selected: false }))
			);
		}
	};

	const selectedExerciseArray: Exercise[] = [];
	const selectedWritable = writable(selectedExerciseArray);
	const selectedExercises: SelectedExerciseStore = {
		subscribe: selectedWritable.subscribe,
		set: selectedWritable.set,
		update: selectedWritable.update,
		add: (exercise: Exercise): void => {
			selectedWritable.update(($selectedExercises): Exercise[] => [
				...$selectedExercises,
				exercise
			]);
		},
		remove: (exercise: Exercise): void => {
			selectedWritable.update(($selectedExercises): Exercise[] => {
				const index = $selectedExercises.findIndex((e) => e.id === exercise.id);
				if (index >= 0) {
					return $selectedExercises.toSpliced(index, 1);
				}
				return $selectedExercises;
			});
		},
		removeAll: (): void => {
			selectedWritable.update((): Exercise[] => []);
		},
		swap: (indexOld: number, indexNew: number): void => {
			selectedWritable.update(($selectedExercises): Exercise[] => {
				$selectedExercises.splice(indexNew, 0, $selectedExercises.splice(indexOld, 1)[0]);
				return $selectedExercises;
			});
		}
	};

	const categoryColorMap: Map<string, string> = new Map<string, string>([
		['core', '#dc2626'],
		['arms', '#ca8a04'],
		['legs', '#65a30d'],
		['cardio', '#2563eb']
	]);

	setContext('exercises', exercises);
	setContext('selectedExercises', selectedExercises);
	setContext('exerciseLength', writable(45000));
	setContext('restLength', writable(15000));
	setContext('repetitions', writable(1));
	setContext('setOrCycle', writable('cycle'));
	setContext('categoryColorMap', categoryColorMap);
</script>

<slot />
