<script>
	import { getContext } from 'svelte';

	const excercises = getContext('excercises');
</script>

{#each $excercises as excercise}
	<div>{excercise.name}</div>
{/each}
