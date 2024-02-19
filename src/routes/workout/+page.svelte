<script lang="ts">
	import { getContext } from 'svelte';
	import type { ExerciseStore, Exercise } from '$lib/types/customTypes';
	import type { Writable } from 'svelte/store';

	const exercises: ExerciseStore = getContext('exercises');
	const exerciseLength: Writable<number> = getContext('exerciseLength');
	const restLength: Writable<number> = getContext('restLength');
	const repetitions: Writable<number> = getContext('repetitions');
	const setOrCycle: Writable<string> = getContext('setOrCycle');

	const selectedExercises: Exercise[] = $exercises.filter((e: Exercise) => e.selected);

	let workoutLength: number =
		($exerciseLength + $restLength) * selectedExercises.length * $repetitions;

	const tick = () => {
		workoutLength--;
	};
	let timer = setInterval(tick, 1000);

	let paused = false;
	const pauseHandler = () => {
		if (paused) {
			timer = setInterval(tick, 1000);
		} else {
			clearInterval(timer);
		}
		paused = !paused;
	};
</script>

<div class="p-8">
	<button
		on:click={pauseHandler}
		class="p-4 bg-rose-500 rounded-md text-zinc-800 hover:bg-rose-600 hover:text-zinc-900"
	>
		{#if paused}
			Continue
		{:else}
			Pause
		{/if}
	</button>
	<div>{workoutLength}</div>
</div>
