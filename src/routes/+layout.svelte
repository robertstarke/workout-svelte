<script lang="ts">
	import '../app.css';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import type { Exercise, ExerciseStore, SelectedExerciseStore } from '$lib/types/customTypes';
	import exerciseData from '$lib/data/exercises.json';

	// exercises list store
	const { subscribe, update, set } = writable(
		exerciseData.map((exercise) => ({ ...exercise, selected: false }))
	);

	const exercises: ExerciseStore = {
		subscribe,
		set,
		update,
		select: (exercise: Exercise, selected: boolean): void => {
			update(($exercises) => {
				let changeIndex = $exercises.findIndex((e: Exercise) => e.id === exercise.id);
				$exercises[changeIndex].selected = selected;
				return $exercises;
			});
		}
	};

	const { subscribe: subscribeSelected, update: updateSelected, set: setSelected } = writable([]);
	const selectedExercises: SelectedExerciseStore = {
		subscribeSelected,
		setSelected,
		updateSelected,
		//add: (exercise: Exercise) => {update(($selectedExercises) => $selectedExercises = [...$selectedExercises, exercise])},
		swap: (indexOld: number, indexNew: number) => {
			update(($selectedExercises) =>
				$selectedExercises.toSpliced(indexNew, 0, $selectedExercises.toSpliced(indexOld, 1)[0])
			);
		}
	};

	setContext('exercises', exercises);
	setContext('selectedExercises', selectedExercises);
	setContext('exerciseLength', writable(45));
	setContext('restLength', writable(15));
	setContext('repetitions', writable(1));
	setContext('setOrCycle', writable('cycle'));
</script>

<slot />
