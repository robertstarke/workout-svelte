<script lang="ts">
	import { ArrowLeft, ArrowUp, GripHorizontal, Trash2 } from 'lucide-svelte';
	import type { Exercise } from '$lib/types/customTypes';
	import CategoryColorIndicator from './CategoryColorIndicator.svelte';

	let {
		exercises,
		onremoveexercise,
		onswapexercise
	}: {
		exercises: Exercise[];
		onremoveexercise: (exercise: Exercise) => void;
		onswapexercise: (idOld: string, idNew: string) => void;
	} = $props();

	let draggedItemId = '';

	// handle drag events
	const handleDragStart = (e: DragEvent, exerciseId: string) => {
		draggedItemId = exerciseId;
		(e.currentTarget as HTMLElement).classList.add('opacity-50');

		let draggableElements = document.querySelectorAll('.draggable');
		draggableElements.forEach((element) => element.classList.add('disableChildPointerEvents'));
	};
	const handleDragEnd = (e: DragEvent) => {
		if (e.currentTarget) {
			(e.currentTarget as HTMLElement).classList.remove('opacity-50');
			let draggableElements = document.querySelectorAll('.draggable');
			draggableElements.forEach((element) =>
				element.classList.remove('disableChildPointerEvents', 'opacity-50')
			);
		}
	};
	const handleDragDrop = (_: DragEvent, exerciseId: string) => {
		onswapexercise(draggedItemId, exerciseId);
	};
	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
	};
	const handleDragEnter = (e: DragEvent) => {
		e.preventDefault();
		(e.currentTarget as HTMLElement).classList.add('opacity-50');
	};
	const handleDragLeave = (e: DragEvent) => {
		(e.currentTarget as HTMLElement).classList.remove('opacity-50');
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
				ondragstart={(e) => handleDragStart(e, exercise.id)}
				ondragend={handleDragEnd}
				ondrop={(e) => handleDragDrop(e, exercise.id)}
				ondragover={handleDragOver}
				ondragenter={handleDragEnter}
				ondragleave={handleDragLeave}
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
					onclick={() => onremoveexercise(exercise)}
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
