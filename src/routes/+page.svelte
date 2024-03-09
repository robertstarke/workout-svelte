<script lang="ts">
	import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { Circle, CheckCircle } from 'lucide-svelte';
	import type { Exercise, ExerciseStore, SelectedExerciseStore } from '$lib/types/customTypes';
	import type { Writable } from 'svelte/store';
	import ExerciseList from '../components/ExerciseList.svelte';
	import DraggableExerciseList from '../components/DraggableExerciseList.svelte';
	import FormattedTime from '../components/FormattedTime.svelte';

	const exercises: ExerciseStore = getContext('exercises');
	const selectedExercises: SelectedExerciseStore = getContext('selectedExercises');
	const exerciseLength: Writable<number> = getContext('exerciseLength');
	const restLength: Writable<number> = getContext('restLength');
	const repetitions: Writable<number> = getContext('repetitions');
	const setOrCycle: Writable<string> = getContext('setOrCycle');

	$: selectedExercisesAmount = $selectedExercises.length;
	$: workoutLength = ($exerciseLength + $restLength) * selectedExercisesAmount * $repetitions;

	const handleSelectExerciseEvent = (event: {
		detail: { exercise: Exercise; checked: boolean };
	}) => {
		const exercise: Exercise = event.detail.exercise;
		const checked: boolean = event.detail.checked;

		exercises.select(exercise, checked);

		if (checked) {
			selectedExercises.add(exercise);
		} else {
			selectedExercises.remove(exercise);
		}
	};
	const handleRemoveExerciseEvent = (event: { detail: { exercise: Exercise } }) => {
		const exercise = event.detail.exercise;
		exercises.select(exercise, false);
		selectedExercises.remove(exercise);
	};
	const handleSwapExerciseEvent = (event: { detail: { indexOld: number; indexNew: number } }) => {
		const indexOld: number = event.detail.indexOld;
		const indexNew: number = event.detail.indexNew;
		selectedExercises.swap(indexOld, indexNew);
	};
</script>

<div class="mx-auto p-8">
	<section class="mt-4 grid grid-cols-5 gap-8">
		<div class="col-start-2 col-span-3">
			<button
				class="block w-full p-4 bg-rose-500 rounded-md text-zinc-800 text-2xl disabled:bg-stone-400 transition-colors hover:bg-rose-600 hover:text-zinc-900"
				disabled={selectedExercisesAmount === 0}
			>
				{#if selectedExercisesAmount === 0}
					Select Exercises To Start
				{:else}
					<a href="/workout">Start Workout</a>
				{/if}
			</button>
		</div>
		<div class="col-span-1 col-start-2 row-start-2">
			<div class="block w-full p-4 bg-zinc-900 rounded-md text-4xl text-rose-500 text-center">
				<span class="block mb-2 text-2xl">Total Workout Time</span>
				<FormattedTime timeInMs={workoutLength} />
			</div>
			<div class="mt-4 flex flex-col gap-4">
				<label for="exerciseLength" class="flex flex-row items-center gap-4">
					<span class="w-28 p-4 bg-zinc-900 rounded-md text-4xl text-rose-500 text-center"
						>{$exerciseLength / 1000}s</span
					>
					<span class="flex flex-col">
						<span class="text-xl">Exercise Length</span>
						<input
							id="exerciseLength"
							type="range"
							step="5000"
							min="10000"
							max="180000"
							bind:value={$exerciseLength}
						/>
					</span>
				</label>
				<label for="restLength" class="flex flex-row items-center gap-4">
					<span class="w-28 p-4 bg-zinc-900 rounded-md text-4xl text-rose-500 text-center"
						>{$restLength / 1000}s</span
					>
					<span class="flex flex-col">
						<span class="text-xl">Rest Length</span>
						<input
							id="restLength"
							type="range"
							step="5000"
							min="5000"
							max="120000"
							bind:value={$restLength}
						/>
					</span>
				</label>
				<label for="repetitions" class="flex flex-row items-center gap-4">
					<span class="w-28 p-4 bg-zinc-900 rounded-md text-4xl text-rose-500 text-center"
						>{$repetitions}</span
					>
					<span class="flex flex-col">
						<span class="text-xl">Repetitions</span>
						<input
							id="repetitions"
							type="range"
							step="1"
							min="1"
							max="10"
							bind:value={$repetitions}
						/>
					</span>
				</label>
				{#if $repetitions > 1}
					<div transition:fade={{ duration: 200 }}>
						<div class="grid grid-cols-2 items-stretch justify-items-stretch gap-4">
							{#each ['set', 'cycle'] as repetition}
								<label
									for={repetition}
									class="flex flex-row justify-between items-stretch bg-zinc-900 rounded-md text-2xl text-rose-500 cursor-pointer"
								>
									<input
										type="radio"
										id={repetition}
										value={repetition}
										name="setOrCycle"
										bind:group={$setOrCycle}
										class="hidden peer"
									/>
									<span class="p-4">{repetition[0].toUpperCase()}{repetition.slice(1)}</span>
									<span
										class="flex-none flex items-center justify-center w-16 rounded-r-md bg-stone-400 text-zinc-800 peer-checked:bg-rose-500"
									>
										{#if $setOrCycle === repetition}
											<CheckCircle />
										{:else}
											<Circle />
										{/if}
									</span>
								</label>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
		<div class="grid grid-cols-subgrid col-span-2 justify-center gap-8">
			<div>
				<h2 class="mb-4 text-2xl text-zinc-800">Available Exercises</h2>
				<ExerciseList exercises={$exercises} on:selectExercise={handleSelectExerciseEvent} />
			</div>

			<div>
				<h2 class="mb-4 text-2xl text-zinc-800">Selected Exercises</h2>
				<DraggableExerciseList
					exercises={$selectedExercises}
					on:removeExercise={handleRemoveExerciseEvent}
					on:swapExercise={handleSwapExerciseEvent}
				/>
			</div>
		</div>
	</section>
</div>
