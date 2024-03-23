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

<ul class="space-y-4">
	{#each exercises as exercise (exercise.id)}
		<li>
			<label
				for={exercise.id}
				class="w-full h-full flex flex-row justify-between items-stretch bg-zinc-900 rounded-md cursor-pointer"
			>
				<input
					type="checkbox"
					class="hidden peer"
					checked={exercise.selected}
					id={exercise.id}
					name="exercises"
					on:change={(e) => selectExercise(exercise, e.currentTarget.checked)}
				/>
				<span class="w-full flex flex-col justify-stretch items-stretch">
					<CategoryColorIndicator categories={exercise.categories} />
					<span class="w-full px-4 py-2 text-stone-50">
						<span class="block text-xl text-rose-500">{exercise.name}</span>
						<span class="block text-sm">{exercise.description}</span>
					</span>
				</span>
				<span
					class="flex-none flex items-center justify-center w-16 rounded-r-md bg-stone-400 text-zinc-800 peer-checked:bg-rose-500"
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
