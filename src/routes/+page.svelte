<script>
	import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import ExerciseList from '../components/ExerciseList.svelte';

	const exercises = getContext('exercises');
	let exerciseLength = 45;
	let restLength = 15;
	let repetitions = 1;
	let setOrCycle = 'cycle';

	$: selectedExercisesAmount = $exercises.filter((e) => e.selected).length;
	$: workoutLength = (exerciseLength + restLength) * selectedExercisesAmount * repetitions;
</script>

<div class="mx-auto p-8 max-w-screen-lg">
	<section>
		<div class="flex flex-col gap-4 items-center">
			<button
				class="w-80 p-4 bg-rose-500 rounded-md text-zinc-800 text-2xl disabled:bg-stone-400 transition-colors hover:bg-rose-600 hover:text-zinc-900"
				disabled={selectedExercisesAmount === 0}>Start Workout</button
			>
			<span class="block w-80 p-4 bg-zinc-900 rounded-md text-4xl text-rose-500 text-center">
				<span class="block mb-2 text-2xl">Total Workout Time</span>
				{#if workoutLength / 3600 >= 1}{Math.floor(workoutLength / 3600)}h{/if}
				{#if workoutLength % 3600 !== 0}{Math.floor((workoutLength % 3600) / 60)}m{/if}
				{#if workoutLength % 60 !== 0}{workoutLength % 60}s{/if}
				{#if workoutLength === 0}N/A{/if}
			</span>
		</div>
	</section>
	<section class="mt-4 flex flex-col gap-4">
		<label for="exerciseLength" class="flex flex-row justify-center items-center gap-4">
			<span class="w-28 p-4 bg-zinc-900 rounded-md text-4xl text-rose-500 text-center"
				>{exerciseLength}s</span
			>
			<span class="flex flex-col">
				<span class="text-xl">Exercise Length</span>
				<input
					id="exerciseLength"
					type="range"
					step="5"
					min="10"
					max="180"
					bind:value={exerciseLength}
				/>
			</span>
		</label>
		<label for="restLength" class="flex flex-row justify-center items-center gap-4">
			<span class="w-28 p-4 bg-zinc-900 rounded-md text-4xl text-rose-500 text-center"
				>{restLength}s</span
			>
			<span class="flex flex-col">
				<span class="text-xl">Rest Length</span>
				<input id="restLength" type="range" step="5" min="0" max="120" bind:value={restLength} />
			</span>
		</label>
		<label for="repetitions" class="flex flex-row justify-center items-center gap-4">
			<span class="w-28 p-4 bg-zinc-900 rounded-md text-4xl text-rose-500 text-center"
				>{repetitions}</span
			>
			<span class="flex flex-col">
				<span class="text-xl">Repetitions</span>
				<input id="repetitions" type="range" step="1" min="1" max="10" bind:value={repetitions} />
			</span>
		</label>
		{#if repetitions > 1}
			<div transition:fade={{ duration: 200 }}>
				<div class="flex flex-row justify-center items-stretch justify-items-stretch gap-4">
					<label
						for="set"
						class="p-4 bg-zinc-900 rounded-md text-3xl text-rose-500 text-center cursor-pointer has-[:checked]:bg-rose-500 has-[:checked]:text-zinc-800"
					>
						<input
							type="radio"
							id="set"
							value="set"
							name="setOrCycle"
							bind:group={setOrCycle}
							class="hidden"
						/>
						Set
					</label>
					<label
						for="cycle"
						class="p-4 bg-zinc-900 rounded-md text-3xl text-rose-500 text-center cursor-pointer has-[:checked]:bg-rose-500 has-[:checked]:text-zinc-800"
					>
						<input
							type="radio"
							id="cycle"
							value="cycle"
							name="setOrCycle"
							bind:group={setOrCycle}
							class="hidden"
						/>
						Cycle
					</label>
				</div>
			</div>
		{/if}
	</section>
	<section class="flex flex-row justify-center gap-6 mt-6">
		<div>
			<h2>Available exercises</h2>
			<ExerciseList {exercises} selected={false} />
		</div>

		<div>
			<h2>Selected exercises</h2>
			<ExerciseList {exercises} selected={true} />
		</div>
	</section>
</div>
