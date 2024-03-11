<script lang="ts">
	import { GripHorizontal, Trash2 } from 'lucide-svelte';
	import type { Exercise } from '$lib/types/customTypes';
	import { createEventDispatcher } from 'svelte';

	export let exercises: Exercise[];

	const dispatch = createEventDispatcher();
	const removeExercise = (exercise: Exercise) => {
		dispatch('removeExercise', { exercise });
	};
	const swapExercise = (idOld: string, idNew: string) => {
		dispatch('swapExercise', { idOld, idNew });
	};

	let draggedItem = null;
	let draggedItemId = '';

	// handle drag events
	const handleDragStart = (e: DragEvent, exerciseId: string) => {
		draggedItem = e.currentTarget;
		draggedItemId = exerciseId;
		e.dataTransfer.dropEffect = 'move';
		e.currentTarget.classList.add('opacity-50');
	};
	const handleDragEnd = (e: DragEvent) => {
		draggedItem = null;
		if (e.currentTarget) {
			e.currentTarget.classList.remove('opacity-50');
		}
	};
	const handleDragDrop = (e: DragEvent, exerciseId: string) => {
		swapExercise(draggedItemId, exerciseId);
	};
	const handleDragOver = (e: DragEvent) => {
		// visual swap
	};
	const handleDragEnter = (e: DragEvent) => {
		// visual swap
	};
	const handleDragLeave = (e: DragEvent) => {
		// visual swap
	};
</script>

<ul class="space-y-4">
	{#each exercises as exercise}
		<li
			draggable="true"
			on:dragstart={(e) => handleDragStart(e, exercise.id)}
			on:dragend={handleDragEnd}
			on:drop={(e) => handleDragDrop(e, exercise.id)}
			on:dragenter|preventDefault={handleDragEnter}
			on:dragleave|preventDefault={handleDragLeave}
			on:dragover|preventDefault={handleDragOver}
		>
			<div
				class="w-full h-full flex flex-row justify-stretch items-stretch bg-zinc-900 rounded-md cursor-pointer"
			>
				<span class="px-4 py-2 flex-none flex justify-center items-center text-stone-50 text-4xl"
					><GripHorizontal /></span
				>
				<span class="flex-grow block px-4 py-2">
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
