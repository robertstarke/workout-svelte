<script lang="ts">
	import type { ExerciseStore, Exercise } from '$lib/types/customTypes';
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import FormattedTime from '../../components/FormattedTime.svelte';
	import { X, Pause, Play } from 'lucide-svelte';

	// Stores
	const selectedExercises: ExerciseStore = getContext('selectedExercises');
	const exerciseLength: Writable<number> = getContext('exerciseLength');
	const restLength: Writable<number> = getContext('restLength');
	const repetitions: Writable<number> = getContext('repetitions');
	const setOrCycle: Writable<string> = getContext('setOrCycle');

	let workoutExercises = $selectedExercises || [];

	if ($repetitions > 1) {
		const helperArray = Array($repetitions).fill('');
		if ($setOrCycle === 'set') {
			workoutExercises = workoutExercises.flatMap((exercise: Exercise) =>
				helperArray.map(() => exercise)
			);
		} else if ($setOrCycle === 'cycle') {
			workoutExercises = helperArray.flatMap(() => [...workoutExercises]);
		}
	}

	const size = 128;
	const trackWidth = 3;
	const indicatorWidth = 3;
	let intervalLength: number = $restLength;
	let paused: boolean = false;
	let phase: string = 'rest';
	let activeExerciseIndex: number = 0;
	const fullTime: number = ($exerciseLength + $restLength) * workoutExercises.length;
	let remainingTime: number = fullTime;

	const center = size / 2;
	const radius = center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth);
	const dashArray = 2 * Math.PI * radius;
	let dashOffset = dashArray;

	// Animations
	const animationFrames = [{ strokeDashoffset: dashArray }, { strokeDashoffset: 0 }];
	const restAnimationOptions = { id: 'restA', duration: $restLength };
	const exerciseAnimationOptions = { id: 'exerciseA', duration: $exerciseLength };

	// Audio Beeps
	const beep = (frequency: number = 1240, duration: number = 0.2) => {
		if (browser) {
			const audioContext = new AudioContext();
			const beeper = audioContext.createOscillator();
			beeper.frequency.value = frequency;
			beeper.connect(audioContext.destination);
			beeper.start();
			beeper.stop(audioContext.currentTime + duration);
		}
	};

	// tick callback
	const intervalCallback = () => {
		if (paused || !activeExercise) {
			clearInterval(interval);
			return;
		}

		if (intervalLength <= 3000 && intervalLength % 1000 === 0) {
			if (intervalLength < 1000) {
				beep(540, 0.5);
			} else {
				beep();
			}
		}

		if (intervalLength <= 0) {
			clearInterval(interval);

			if (phase === 'exercise' && activeExerciseIndex === workoutExercises.length - 1) {
				return;
			}

			if (phase === 'rest') {
				phase = 'exercise';
				intervalLength = $exerciseLength;
			} else {
				phase = 'rest';
				intervalLength = $restLength;
				activeExerciseIndex++;
			}

			interval = setInterval(intervalCallback, 100);
		}

		if (phase === 'exercise' && activeExercise && intervalLength === $exerciseLength / 2) {
			beep(850, 0.3);
		}

		intervalLength = intervalLength - 100;
		remainingTime = remainingTime - 100;
	};

	let interval = setInterval(intervalCallback, 100);

	$: if (browser) {
		if (navigator.wakeLock !== undefined) {
			navigator.wakeLock.request('screen').then((lock) => {
				setTimeout(() => lock.release(), fullTime);
			});
		}

		const indicatorElement = document.getElementById('wa-indicator');

		let restAnimation = indicatorElement?.animate(animationFrames, restAnimationOptions);
		let exerciseAnimation = indicatorElement?.animate(animationFrames, exerciseAnimationOptions);
		restAnimation?.cancel();
		exerciseAnimation?.cancel();
		let animation = restAnimation;

		animation = phase === 'rest' ? restAnimation : exerciseAnimation;

		if (animation) {
			animation.currentTime = intervalLength;
		}
	}

	if (browser && workoutExercises.length === 0) {
		clearInterval(interval);
		goto('./');
	}

	$: activeExercise = workoutExercises[activeExerciseIndex || 0];

	$: normalizedTime = ((remainingTime - 1000) / fullTime) * 100;

	const handleBackButton = () => {
		clearInterval(interval);
		goto('./');
	};

	const handlePauseButton = () => {
		if (paused) {
			interval = setInterval(intervalCallback, 100);
		} else {
			clearInterval(interval);
		}
		paused = !paused;
	};
</script>

<div class="min-w-96 w-lvw bg-zinc-800">
	<div class="progressBar w-full h-6">
		<div
			class="h-full bg-rose-500 transition-all duration-1000 ease-linear"
			style="width: {normalizedTime}%;"
		></div>
	</div>
	<div class="h-32 flex flex-row justify-between items-center p-8">
		<a href="./" title="Back to setup" class="flex-none">
			<button
				class="flex-none aspect-square h-20 flex justify-center items-center p-4 bg-rose-500 rounded-md text-zinc-800 text-3xl hover:bg-rose-600 hover:text-zinc-900"
				on:click={handleBackButton}
			>
				<X size="40" />
			</button>
		</a>
		<div class="w-full text-3xl text-rose-500 text-center">
			<FormattedTime timeInMs={remainingTime} />
		</div>
		<div class="flex-none">
			<button
				on:click={handlePauseButton}
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
		<div class="relative h-full flex justify-center items-stretch">
			<svg
				class="z-30 w-auto h-full -rotate-90"
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle
					id="wa-track"
					cx={center}
					cy={center}
					r={radius}
					fill="none"
					class:text-lime-500={phase === 'rest'}
					class:text-rose-500={phase === 'exercise'}
					class="stroke-current fill-transparent"
					stroke-width={trackWidth}
				></circle>
				<circle
					id="wa-indicator"
					cx={center}
					cy={center}
					r={radius}
					fill="none"
					class="stroke-current fill-transparent"
					class:text-rose-500={phase === 'rest'}
					class:text-lime-500={phase === 'exercise'}
					stroke-width={indicatorWidth}
					stroke-linecap="round"
					stroke-dasharray={dashArray}
					stroke-dashoffset={dashOffset}
				></circle>
				<circle
					id="wa-inner-ping"
					cx={center}
					cy={center}
					r={radius - 8}
					class="transform origin-center"
					class:fill-rose-500={phase === 'rest'}
					class:fill-lime-500={phase === 'exercise'}
					class:wa-animate-ping={intervalLength <= 3000}
				></circle>
				<circle
					id="wa-inner"
					cx={center}
					cy={center}
					r={radius - 8}
					class:fill-rose-300={phase === 'rest'}
					class:fill-lime-300={phase === 'exercise'}
				></circle>
			</svg>
			<div
				class="z-40 absolute flex justify-center items-center aspect-square top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2 rounded-full"
			>
				<div class="text-3xl text-center">
					{#if remainingTime > 0}
						{#if phase === 'rest'}
							<div class="mb-2">Rest</div>
							<div class="mb-6 text-2xl">Next: {activeExercise.name}</div>
						{:else}
							<div class="mb-6">{activeExercise.name}</div>
						{/if}
						<div><FormattedTime timeInMs={intervalLength} /></div>
					{:else}
						Done! Good Job!
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.custom-height {
		height: calc(100lvh - 9.5rem);
	}

	.wa-animate-ping {
		animation: ping 1s cubic-bezier(0.39, 0.58, 0.57, 1) infinite;
	}

	@keyframes ping {
		75%,
		100% {
			transform: scale(1.15);
			opacity: 0;
		}
	}
</style>
