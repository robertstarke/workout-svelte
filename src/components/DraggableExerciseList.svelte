<script lang="ts">
	import { ArrowLeft, ArrowUp, GripHorizontal, Trash2 } from 'lucide-svelte';
	import type { Exercise } from '$lib/types/customTypes';
	import { createEventDispatcher } from 'svelte';
	import CategoryColorIndicator from './CategoryColorIndicator.svelte';

	export let exercises: Exercise[];

	const dispatch = createEventDispatcher();
	const removeExercise = (exercise: Exercise) => {
		dispatch('removeExercise', { exercise });
	};
	const swapExercise = (idOld: string, idNew: string) => {
		dispatch('swapExercise', { idOld, idNew });
	};

	let draggedItemId = '';

	// handle drag events
	const handleDragStart = (e: DragEvent, exerciseId: string) => {
		draggedItemId = exerciseId;
		e.currentTarget.classList.add('opacity-50');

		let draggableElements = document.querySelectorAll('.draggable');
		draggableElements.forEach((element) => element.classList.add('disableChildPointerEvents'));
	};
	const handleDragEnd = (e: DragEvent) => {
		if (e.currentTarget) {
			e.currentTarget.classList.remove('opacity-50');
			let draggableElements = document.querySelectorAll('.draggable');
			draggableElements.forEach((element) =>
				element.classList.remove('disableChildPointerEvents', 'opacity-50')
			);
		}
	};
	const handleDragDrop = (_: DragEvent, exerciseId: string) => {
		swapExercise(draggedItemId, exerciseId);
	};
	const handleDragOver = () => {};
	const handleDragEnter = (e: DragEvent) => {
		e.currentTarget.classList.add('opacity-50');
		// visual swap
	};
	const handleDragLeave = (e: DragEvent) => {
		e.currentTarget.classList.remove('opacity-50');
	};
</script>

{#if exercises.length === 0}
	<div class="flex flex-row gap-2 justify-center items-center text-xl">
		<span class="md:hidden flex-none"><ArrowUp /></span>
		<span class="hidden md:inline flex-none"><ArrowLeft /></span> Select exercises to start workout
	</div>
{:else}
	<ul class="grid grid-cols-1 gap-4">
		{#each exercises as exercise (exercise.id)}
			<li
				draggable="true"
				on:dragstart={(e) => handleDragStart(e, exercise.id)}
				on:dragend={handleDragEnd}
				on:drop={(e) => handleDragDrop(e, exercise.id)}
				on:dragover|preventDefault={handleDragOver}
				on:dragenter|preventDefault={handleDragEnter}
				on:dragleave|preventDefault={handleDragLeave}
				class="draggable pr-4 w-full flex flex-row gap-4 justify-stretch items-stretch bg-zinc-900 rounded-md cursor-pointer transition-all"
			>
				<CategoryColorIndicator categories={exercise.categories} />

				<span class="py-2 flex-none flex justify-center items-center text-stone-50 text-4xl"
					><GripHorizontal /></span
				>
				<span class="flex-grow block py-2">
					<span class="block text-xl text-rose-500">{exercise.name}</span>
					<span class="block text-sm text-stone-50">{exercise.description}</span>
				</span>
				<button
					class="flex-none flex items-center justify-center rounded-r-md text-rose-500"
					on:click={() => removeExercise(exercise)}
				>
					<span class="text-4xl">
						<Trash2 />
					</span>
				</button>
			</li>
		{/each}
	</ul>
{/if}

<style>
	:global(.draggable.disableChildPointerEvents *) {
		pointer-events: none;
	}
</style>
