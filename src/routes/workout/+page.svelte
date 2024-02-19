<script>
	import { getContext } from 'svelte';

	const exercises = getContext('exercises');
	const exerciseLength = getContext('exerciseLength');
	const restLength = getContext('restLength');
	const repetitions = getContext('repetitions');
	const setOrCycle = getContext('setOrCycle');

	const selectedExercises = $exercises.filter((exercise) => exercise.selected);

	const workoutLength = ($exerciseLength + $restLength) * selectedExercises.length * $repetitions;
</script>
