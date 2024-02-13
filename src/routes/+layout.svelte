<script>
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	import '../app.css';
	import excerciseData from '$lib/data/exercises.json';

	const excercises = writable(
		excerciseData.map((excercise) => ({ ...excercise, selectedForWorkout: false }))
	);
	setContext('excercises', excercises);
</script>

<slot />
