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

	function beep(lastBeep: boolean) {
		const normalBeep = new Audio(
			'data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU='
		);

		const finalBeep = () => {
			let A = new AudioContext();
			let o = A.createOscillator();
			o.connect(A.destination);
			o.start(0);
			setTimeout(() => o.stop(0), 900);
		};

		if (lastBeep) {
			finalBeep();
		} else {
			normalBeep.play();
		}
	}

	const tick = () => {
		remainingTime--;
		phaseTimer--;
		if (remainingTime <= 0) {
			clearInterval(timer);
		}
		if (currentPhase === 'rest' && phaseTimer < 0) {
			phaseTimer = $exerciseLength;
			currentPhase = 'exercise';
		} else if (currentPhase === 'exercise' && phaseTimer < 0) {
			phaseTimer = $restLength;
			currentPhase = 'rest';
			roundIndex++;
			activeExercise = workoutExercises[roundIndex];
		}

		if (phaseTimer < 4) {
			beep(phaseTimer === 0);
		}
	};

	let timer = setInterval(tick, 1000);

	let paused = false;
	const pauseHandler = () => {
		if (paused) {
			if (browser) {
				const el = document.getElementById('wa-progress');
				if (el) {
					el.style.animationPlayState = 'running';
				}
			}
			timer = setInterval(tick, 1000);
		} else {
			if (browser) {
				const el = document.getElementById('wa-progress');
				if (el) {
					el.style.animationPlayState = 'paused';
				}
			}
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
				disabled={remainingTime < 0}
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
	<div class="custom-height">
		<CircularProgress
			fullTime={currentPhase === 'rest' ? $restLength : $exerciseLength}
			remainingTime={phaseTimer}
		>
			<div class="text-3xl text-center">
				{#if remainingTime > 0}
					<div class="mb-6">{activeExercise.name}</div>
					<div><FormattedTime timeInSeconds={phaseTimer} /></div>
				{:else}
					Congratulations you finished the excercise
				{/if}
			</div>
		</CircularProgress>
	</div>
</div>

<style>
	.custom-height {
		height: calc(100lvh - 9.5rem);
	}
</style>
