<script>
	import { getContext } from 'svelte';
	import ExerciseList from '../components/ExerciseList.svelte';

	const exercises = getContext('exercises');
	$: selectedExercisesAmount = $exercises.filter((e) => e.selected).length;
	let exerciseLength = 45;
	let restLength = 15;
	let repetitions = 1;
	let setOrCycle = 'cycle';
	$: workoutLength =
		(exerciseLength + restLength) * selectedExercisesAmount * repetitions - restLength;
</script>

<section>
	<div>
		Total Workout Time: {Math.floor(workoutLength / 60)}min {#if workoutLength % 60 !== 0}{workoutLength %
				60}sec{/if}
	</div>
</section>
<section>
	<label for="exerciseLength">
		Exercise Length (in seconds) {exerciseLength}
		<input
			id="exerciseLength"
			type="range"
			step="5"
			min="10"
			max="180"
			bind:value={exerciseLength}
		/>
	</label>
	<label for="restLength">
		Rest Length (in seconds) {restLength}
		<input id="restLength" type="range" step="5" min="0" max="120" bind:value={restLength} />
	</label>
	<label for="repetitions">
		Repetitions {repetitions}
		<input id="repetitions" type="range" step="1" min="1" max="10" bind:value={repetitions} />
	</label>
	<div>
		Repetition Mode (Set or Cycle)
		<label for="set">
			Set
			<input type="radio" id="set" value="set" name="setOrCycle" bind:group={setOrCycle} />
		</label>
		<label for="cycle">
			Cycle
			<input type="radio" id="cycle" value="cycle" name="setOrCycle" bind:group={setOrCycle} />
		</label>
	</div>
</section>
<section class="flex flex-row gap-6">
	<div>
		<h2>Available exercises</h2>
		<ExerciseList {exercises} selected={false} />
	</div>

	<div>
		<h2>Selected exercises</h2>
		<ExerciseList {exercises} selected={true} />
	</div>
</section>
