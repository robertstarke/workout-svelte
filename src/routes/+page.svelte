<script lang="ts">
	import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { Circle, CheckCircle, Shuffle, Square, CheckSquare } from 'lucide-svelte';
	import type {
		Exercise,
		ExerciseStore,
		SelectedExerciseStore,
		WorkoutSettingsStore
	} from '$lib/types/customTypes';
	import ExerciseList from '../components/ExerciseList.svelte';
	import DraggableExerciseList from '../components/DraggableExerciseList.svelte';
	import FormattedTime from '../components/FormattedTime.svelte';
	import CategoryColorIndicator from '../components/CategoryColorIndicator.svelte';
	import Fuse from 'fuse.js';

	const exercises: ExerciseStore = getContext('exercises');
	const selectedExercises: SelectedExerciseStore = getContext('selectedExercises');
	const workoutSettings: WorkoutSettingsStore = getContext('workoutSettings');
	let randomCount = 10;
	const allExerciseCategories = $exercises.reduce((categories: string[], exercise: Exercise) => {
		let exerciseCategories = exercise.categories;
		exerciseCategories.forEach((category: string) => {
			if (!categories.includes(category)) {
				categories.push(category);
			}
		});
		return categories;
	}, []);

	let categoriesForRandom = allExerciseCategories;

	$: fuse = new Fuse($exercises, {
		minMatchCharLength: 2,
		shouldSort: false,
		threshold: 0.2,
		keys: ['name', 'categories']
	});

	let query = '';
	let filteredExercises: Exercise[];

	$: if (query.length < 2) {
		filteredExercises = $exercises.filter((exercise: Exercise) =>
			exercise.categories.some((category: string) => categoriesForRandom.includes(category))
		);
	} else {
		filteredExercises = fuse.search(query).map((item) => item.item);
	}
	$: if (filteredExercises.length < randomCount) randomCount = filteredExercises.length;
	$: workoutLength =
		($workoutSettings.exerciseLength + $workoutSettings.restLength) *
		$selectedExercises.length *
		$workoutSettings.repetitions;

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
	const handleSwapExerciseEvent = (event: { detail: { idOld: string; idNew: string } }) => {
		const idOld: string = event.detail.idOld;
		const idNew: string = event.detail.idNew;
		const indexOld = $selectedExercises.findIndex((e: Exercise) => e.id === idOld);
		const indexNew = $selectedExercises.findIndex((e: Exercise) => e.id === idNew);
		selectedExercises.swap(indexOld, indexNew);
	};
	const handleRandomizeExercises = () => {
		exercises.deselectAll();
		selectedExercises.removeAll();
		const randomIndexes = [];
		while (randomIndexes.length < randomCount) {
			var r = Math.floor(Math.random() * filteredExercises.length);
			if (randomIndexes.indexOf(r) === -1) randomIndexes.push(r);
		}
		randomIndexes.forEach((exerciseIndex: number) => {
			const exercise: Exercise = filteredExercises[exerciseIndex];
			exercises.select(exercise, true);
			selectedExercises.add(exercise);
		});
	};
</script>

<div class="min-w-96 mx-auto">
	<section
		class="h-auto md:h-lvh px-8 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 overflow-auto md:overflow-hidden"
	>
		<div class="relative pt-32 md:pt-0 overflow-auto md:overflow-scroll">
			<div
				class="z-20 fixed top-0 md:relative md:top-auto w-[calc(100%-4rem)] md:w-full py-8 bg-white"
			>
				<button
					class="block w-full bg-rose-500 rounded-md text-zinc-800 text-2xl disabled:bg-stone-400 transition-colors hover:bg-rose-600 hover:text-zinc-900"
					disabled={$selectedExercises.length === 0}
				>
					{#if $selectedExercises.length === 0}
						<span class="block p-4">Select Exercises</span>
					{:else}
						<a class="block p-4" href="./workout" title="Start workout with selected exercises">
							Start Workout
						</a>
					{/if}
				</button>
			</div>
			<div class="block w-full p-4 bg-zinc-900 rounded-md text-4xl text-rose-500 text-center">
				<span class="block mb-2 text-2xl">Total Workout Time</span>
				<FormattedTime timeInMs={workoutLength} />
			</div>
			<div class="mt-4 flex flex-col gap-4">
				<label for="exerciseLength" class="flex flex-row items-center gap-4">
					<span
						class="flex-none w-24 px-3 py-2 bg-zinc-900 rounded-md text-3xl text-rose-500 text-center"
						>{$workoutSettings.exerciseLength / 1000}s</span
					>
					<span class="flex-auto flex flex-col">
						<span class="text-xl">Exercise Length</span>
						<input
							id="exerciseLength"
							class="w-full"
							type="range"
							step="5000"
							min="10000"
							max="180000"
							bind:value={$workoutSettings.exerciseLength}
						/>
					</span>
				</label>
				<label for="restLength" class="flex flex-row items-center gap-4">
					<span
						class="flex-none w-24 px-3 py-2 bg-zinc-900 rounded-md text-3xl text-rose-500 text-center"
						>{$workoutSettings.restLength / 1000}s</span
					>
					<span class="flex-auto flex flex-col">
						<span class="text-xl">Rest Length</span>
						<input
							id="restLength"
							class="w-full"
							type="range"
							step="5000"
							min="5000"
							max="120000"
							bind:value={$workoutSettings.restLength}
						/>
					</span>
				</label>
				<label for="repetitions" class="flex flex-row items-center gap-4">
					<span
						class="flex-none w-24 px-3 py-2 bg-zinc-900 rounded-md text-3xl text-rose-500 text-center"
						>{$workoutSettings.repetitions}</span
					>
					<span class="flex-auto flex flex-col">
						<span class="text-xl">Repetitions</span>
						<input
							id="repetitions"
							class="w-full"
							type="range"
							step="1"
							min="1"
							max="10"
							bind:value={$workoutSettings.repetitions}
						/>
					</span>
				</label>
				{#if $workoutSettings.repetitions > 1}
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
										bind:group={$workoutSettings.setOrCycle}
										class="hidden peer"
									/>
									<span class="p-4">{repetition[0].toUpperCase()}{repetition.slice(1)}</span>
									<span
										class="flex-none flex items-center justify-center w-16 rounded-r-md bg-stone-400 text-zinc-800 peer-checked:bg-rose-500"
									>
										{#if $workoutSettings.setOrCycle === repetition}
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
				<div class="mt-8">
					<h2 class="text-2xl">Randomize exercises</h2>
					<label for="randomizer" class="mt-4 flex flex-row items-center gap-4">
						<span class="w-full flex flex-col">
							<span class="text-xl">Amount of exercises</span>
							<input
								id="randomizer"
								class="w-full"
								type="range"
								step="1"
								min="0"
								max={filteredExercises.length}
								bind:value={randomCount}
							/>
						</span>
					</label>
					<button
						class="w-full mt-4 px-4 py-2 flex flex-row gap-4 justify-center items-center bg-rose-500 rounded-md text-2xl text-zinc-900 hover:bg-rose-400 hover:text-zinc-800 disabled:bg-stone-400"
						on:click={handleRandomizeExercises}
						disabled={randomCount === 0}
					>
						<span class="flex-none flex flex-row justify-center items-center"><Shuffle /></span>
						<span class="">Randomize {randomCount} Exercises</span>
					</button>
				</div>

				<div class="mt-8 pb-8">
					<h2 class="text-2xl">Search and Filters</h2>
					<label for="search" class="hidden">Search Exercises</label>
					<input
						id="search"
						type="text"
						bind:value={query}
						placeholder="Search exercises"
						class="w-full mt-4 px-3 py-2 border border-zinc-900 rounded-md active:ring-2 focus:ring-2"
					/>
					<div class="mt-4 flex flex-row gap-3 flex-wrap">
						{#each allExerciseCategories as category}
							<label
								for={category}
								class="pr-3 flex flex-row justify-stretch items-stretch gap-3 rounded-md bg-zinc-900 cursor-pointer"
							>
								<input
									class="hidden peer"
									type="checkbox"
									id={category}
									name={category}
									bind:group={categoriesForRandom}
									value={category}
								/>
								<CategoryColorIndicator categories={[category]} />
								<span class="py-2 flex-grow text-xl text-rose-500 text-center">{category}</span>
								<span
									class="py-2 flex-none flex justify-center items-center rounded-r-md peer-checked:text-lime-600 text-rose-500"
								>
									{#if categoriesForRandom.includes(category)}
										<CheckSquare />
									{:else}
										<Square />
									{/if}
								</span>
							</label>
						{/each}
					</div>
				</div>
			</div>
		</div>
		<div
			class="relative pb-8 col-span-1 xl:col-span-2 2xl:col-span-3 overflow-auto md:overflow-scroll"
		>
			<h2 class="md:fixed w-full pt-8 pb-4 bg-white text-2xl text-zinc-800">All Exercises</h2>
			<div class="pt-0 md:pt-20">
				<ExerciseList exercises={filteredExercises} on:selectExercise={handleSelectExerciseEvent} />
			</div>
		</div>
		<div class="relative pb-8 overflow-auto md:overflow-scroll">
			<h2 class="block md:fixed w-full pt-8 pb-4 bg-white text-2xl text-zinc-800">
				Selected Exercises
			</h2>
			<div class="pt-0 md:pt-20">
				<DraggableExerciseList
					exercises={$selectedExercises}
					on:removeExercise={handleRemoveExerciseEvent}
					on:swapExercise={handleSwapExerciseEvent}
				/>
			</div>
		</div>
	</section>
</div>
