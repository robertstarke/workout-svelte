<script>
	import { flip } from 'svelte/animate';
	import { send, receive } from '../animation/exerciseTransition';

	export let exercises;
	export let selected = false;
</script>

<ul>
	{#each $exercises.filter((e) => e.selected === selected) as exercise (exercise.id)}
		<li
			class:selected
			in:receive={{ key: exercise.id }}
			out:send={{ key: exercise.id }}
			animate:flip={{ duration: 200 }}
		>
			<label for={exercise.id}>
				<input
					type="checkbox"
					checked={exercise.selected}
					id={exercise.id}
					name={selected ? 'selectedExercises' : 'exercises'}
					on:change={(e) => exercises.select(exercise, e.currentTarget.checked)}
				/>
				{exercise.name}
			</label>
		</li>
	{/each}
</ul>
