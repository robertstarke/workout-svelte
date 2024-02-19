<script lang="ts">
	import '../app.css';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	import exerciseData from '$lib/data/exercises.json';

	// exercises list store
	const { subscribe, update } = writable(
		exerciseData.map((exercise) => ({ ...exercise, selected: false }))
	);

	const exercises = {
		subscribe,
		select: (exercise, selected: boolean) => {
			update(($exercises) => [
				...$exercises.filter((e) => e.id !== exercise.id),
				{ ...exercise, selected }
			]);
		}
	};

	setContext('exercises', exercises);
	setContext('exerciseLength', writable(45));
	setContext('restLength', writable(15));
	setContext('repetitions', writable(1));
	setContext('setOrCycle', writable('cycle'));
</script>

<slot />
