<script lang="ts">
	import { GripHorizontal, Trash2 } from 'lucide-svelte';
	import type { Exercise } from '$lib/types/customTypes';
	import { createEventDispatcher } from 'svelte';

	export let exercises: Exercise[];

	const dispatch = createEventDispatcher();
	const removeExercise = (exercise: Exercise) => {
		dispatch('removeExercise', { exercise });
	};
	const swapExercise = (indexOld: number, indexNew: number) => {
		dispatch('swapExercise', { indexOld, indexNew });
	};

	// handle drag events
	const handleDragStart = (e: DragEvent) => {
		if (e.currentTarget) {
			e.currentTarget.classList.add('opacity-50');
		}
	};
	const handleDragEnd = (e: DragEvent) => {
		if (e.currentTarget) {
			e.currentTarget.classList.remove('opacity-50');
		}
	};
	const handleDragDrop = (e: DragEvent) => {};
	const handleDragEnter = (e: DragEvent) => {
		if (e.currentTarget) {
			e.currentTarget.classList.add('translate-y-6');
		}
	};
	const handleDragLeave = (e: DragEvent) => {
		if (e.currentTarget) {
			e.currentTarget.classList.remove('translate-y-6');
		}
	};
</script>

<ul class="space-y-4">
	{#each exercises as exercise}
		<li
			draggable="true"
			on:dragstart={handleDragStart}
			on:dragend={handleDragEnd}
			on:drop={handleDragDrop}
			on:dragenter={handleDragEnter}
			on:dragleave={handleDragLeave}
			on:dragover|preventDefault|stopPropagation
		>
			<div
				class="w-full h-full flex flex-row justify-between items-stretch bg-zinc-900 rounded-md cursor-pointer"
			>
				<span class="px-4 py-2 flex justify-center items-center text-stone-50 text-4xl"
					><GripHorizontal /></span
				>
				<span class="px-4 py-2">
					<span class="block text-xl text-rose-500">{exercise.name}</span>
					<span class="block text-sm text-stone-50">{exercise.description}</span>
				</span>
				<button
					class="flex-none flex items-center justify-center w-16 rounded-r-md text-zinc-800 bg-rose-500"
					on:click={() => removeExercise(exercise)}
				>
					<span class="text-4xl">
						<Trash2 />
					</span>
				</button>
			</div>
		</li>
	{/each}
</ul>
