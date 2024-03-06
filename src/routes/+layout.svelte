<script lang="ts">
	import '../app.css';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import type { Exercise, ExerciseStore } from '$lib/types/customTypes';
	import exerciseData from '$lib/data/exercises.json';

	// exercises list store
	const { subscribe, update, set } = writable(
		exerciseData.map((exercise: Exercise) => ({ ...exercise, selected: false }))
	);

	const exercises: ExerciseStore = {
		subscribe,
		set,
		update,
		select: (exercise: Exercise, selected: boolean): void => {
			update(($exercises) => [
				...$exercises.filter((e: Exercise) => e.id !== exercise.id),
				{ ...exercise, selected }
			]);
		}
	};

	setContext('exercises', exercises);
	setContext('exerciseLength', writable(45000));
	setContext('restLength', writable(15000));
	setContext('repetitions', writable(1));
	setContext('setOrCycle', writable('cycle'));
</script>

<slot />
