<script lang="ts">
	import type { Exercise } from '$lib/types/customTypes';
	import { CheckSquare, Square } from 'lucide-svelte';
	import CategoryColorIndicator from './CategoryColorIndicator.svelte';
	import { createEventDispatcher } from 'svelte';

	export let exercises: Exercise[];

	const dispatch = createEventDispatcher();
	const selectExercise = (exercise: Exercise, checked: boolean) => {
		dispatch('selectExercise', { exercise, checked });
	};
</script>

<ul
	class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4"
	style="grid-template-rows: masonry;"
>
	{#each exercises as exercise (exercise.id)}
		<li>
			<label
				for={exercise.id}
				class="pr-4 w-full flex flex-row gap-4 justify-stretch items-stretch bg-zinc-900 rounded-md cursor-pointer"
			>
				<input
					type="checkbox"
					class="hidden peer"
					checked={exercise.selected}
					id={exercise.id}
					name="exercises"
					on:change={(e) => selectExercise(exercise, e.currentTarget.checked)}
				/>
				<CategoryColorIndicator categories={exercise.categories} />
				<span class="flex-grow py-2 text-stone-50">
					<span class="block text-xl text-rose-500">{exercise.name}</span>
					<span class="block text-sm">{exercise.description}</span>
				</span>
				<span
					class="flex-none flex items-center justify-center rounded-r-md text-rose-500 peer-checked:text-lime-600"
				>
					<span class="text-4xl">
						{#if exercise.selected}
							<CheckSquare />
						{:else}
							<Square />
						{/if}
					</span>
				</span>
			</label>
		</li>
	{/each}
</ul>
