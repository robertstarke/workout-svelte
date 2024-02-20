<script lang="ts">
	import type { ExerciseStore, Exercise } from '$lib/types/customTypes';
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import FormattedTime from '../../components/FormattedTime.svelte';
	import CircularProgress from '../../components/CircularProgress.svelte';
	import { X, Pause, Play } from 'lucide-svelte';

	const exercises: ExerciseStore = getContext('exercises');
	const exerciseLength: Writable<number> = getContext('exerciseLength');
	const restLength: Writable<number> = getContext('restLength');
	const repetitions: Writable<number> = getContext('repetitions');
	const setOrCycle: Writable<string> = getContext('setOrCycle');

	const selectedExercises: Exercise[] = $exercises.filter((e: Exercise) => e.selected);
	let workoutExercises: Exercise[] = selectedExercises;

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
	const fullTime: number = remainingTime;

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

	$: normalizedTime = (remainingTime / fullTime) * 100;
</script>

<div class="w-lvh">
	<div class="progressBar w-full h-6 bg-stone-400">
		<div
			class="h-full bg-rose-500 transition-all duration-1000 ease-linear"
			style="width: {normalizedTime}%;"
		></div>
	</div>
	<div class="h-32 flex flex-row justify-between items-center p-8">
		<a href="/" title="Back to setup" class="flex-none">
			<button
				class="aspect-square h-20 flex justify-center items-center p-4 bg-rose-500 rounded-md text-zinc-800 text-3xl hover:bg-rose-600 hover:text-zinc-900"
				><X size="40" /></button
			>
		</a>
		<div class="w-full text-3xl text-center">
			<FormattedTime timeInSeconds={remainingTime} />
		</div>
		<div class="flex-none">
			<button
				on:click={pauseHandler}
				disabled={remainingTime <= 0}
				class="aspect-square h-20 flex justify-center items-center p-4 bg-rose-500 rounded-md text-zinc-800 hover:bg-rose-600 hover:text-zinc-900 disabled:bg-stone-400 disabled:hover:text-zinc-800"
			>
				{#if paused}
					<Play size="40" />
				{:else}
					<Pause size="40" />
				{/if}
			</button>
		</div>
	</div>
	<div class="hidden flex-none">
		{#if remainingTime <= 0}
			<div>Congratulations you finished the workout</div>
		{/if}
		{currentPhase === 'rest' ? 'Next Exercise' : 'Current Exercise'}: {activeExercise?.name}
	</div>
	<div class="custom-height">
		<CircularProgress />
	</div>
</div>

<style>
	.custom-height {
		height: calc(100lvh - 9.5rem);
	}
</style>
