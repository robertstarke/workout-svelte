<script lang="ts">
	import type { ExerciseStore, Exercise } from '$lib/types/customTypes';
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	const exercises: ExerciseStore = getContext('exercises');
	const exerciseLength: Writable<number> = getContext('exerciseLength');
	const restLength: Writable<number> = getContext('restLength');
	const repetitions: Writable<number> = getContext('repetitions');
	const setOrCycle: Writable<string> = getContext('setOrCycle');

	const selectedExercises: Exercise[] = $exercises.filter((e: Exercise) => e.selected);
	let workoutExercises: Exercise[] = selectedExercises;
	// TODO handle repetitions

	// handle empty exercises e.g. after reload
	// TODO persists selected exercises in local or session storage
	if (browser && selectedExercises.length === 0) {
		goto('/');
	}

	if ($repetitions > 1) {
		const helperArray = Array($repetitions).fill('');
		if ($setOrCycle === 'set') {
			workoutExercises = selectedExercises.flatMap((exercise: Exercise) =>
				helperArray.map(() => exercise)
			);
		} else if ($setOrCycle === 'cycle') {
			workoutExercises = helperArray.flatMap(() => [...selectedExercises]);
		}
	}

	let remainingTime: number =
		($exerciseLength + $restLength) * selectedExercises.length * $repetitions;

	let currentPhase = 'rest';
	let phaseTimer = $restLength;
	let roundIndex = 0;
	let activeExercise = workoutExercises[0];

	const tick = () => {
		remainingTime--;
		phaseTimer--;
		if (remainingTime <= 0) {
			clearInterval(timer);
		}
		if (currentPhase === 'rest' && phaseTimer <= 0) {
			phaseTimer = $exerciseLength;
			currentPhase = 'exercise';
		} else if (currentPhase === 'exercise' && phaseTimer <= 0) {
			phaseTimer = $restLength;
			currentPhase = 'rest';
			roundIndex++;
			activeExercise = workoutExercises[roundIndex];
		}
	};

	let timer = setInterval(tick, 200);

	let paused = false;
	const pauseHandler = () => {
		if (paused) {
			timer = setInterval(tick, 200);
		} else {
			clearInterval(timer);
		}
		paused = !paused;
	};
</script>

<div class="p-8">
	<div>Time left in workout: {remainingTime}</div>
	{#if remainingTime <= 0}
		<div>Congratulations you finished the workout</div>
	{:else}
		<div>{currentPhase}</div>
		<div>
			{currentPhase === 'rest' ? 'Next Exercise' : 'Current Exercise'}: {activeExercise.name}
		</div>
		<div>Time: {phaseTimer}</div>
		<div>Round: {roundIndex}</div>
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
	{/if}
</div>
