<script>
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	import '../app.css';
	import exerciseData from '$lib/data/exercises.json';

	const { subscribe, update } = writable(
		exerciseData.map((exercise) => ({ ...exercise, selected: false }))
	);

	const exercises = {
		subscribe,
		select: (exercise, selected) => {
			update(($exercises) => [
				...$exercises.filter((e) => e.id !== exercise.id),
				{ ...exercise, selected }
			]);
		}
	};

	setContext('exercises', exercises);
</script>

<slot />
