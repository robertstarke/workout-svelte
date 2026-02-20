<script lang="ts">
	import '../app.css';
	import { setContext } from 'svelte';
	import type {
		Exercise,
		ExerciseStore,
		SelectedExerciseStore,
		WorkoutSettingsStore,
		WorkoutSettings
	} from '$lib/types/customTypes';
	import exerciseData from '$lib/data/exercises.json';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	// exercises list store
	const exerciseArray: Exercise[] = JSON.parse(JSON.stringify(exerciseData)).map(
		(exercise: Exercise) => ({
			...exercise,
			selected: false
		})
	);

	let exerciseList = $state(exerciseArray);

	const exerciseStore: ExerciseStore = {
		get exercises() {
			return exerciseList;
		},
		select: (exercise: Exercise, selected: boolean): void => {
			const changeIndex = exerciseList.findIndex((e: Exercise) => e.id === exercise.id);
			exerciseList[changeIndex].selected = selected;
		},
		deselectAll: () => {
			exerciseList.forEach((e) => (e.selected = false));
		}
	};

	let selectedList: Exercise[] = $state([]);

	const selectedExerciseStore: SelectedExerciseStore = {
		get exercises() {
			return selectedList;
		},
		add: (exercise: Exercise): void => {
			selectedList.push(exercise);
		},
		remove: (exercise: Exercise): void => {
			const index = selectedList.findIndex((e) => e.id === exercise.id);
			if (index >= 0) {
				selectedList.splice(index, 1);
			}
		},
		removeAll: (): void => {
			selectedList.length = 0;
		},
		swap: (indexOld: number, indexNew: number): void => {
			selectedList.splice(indexNew, 0, selectedList.splice(indexOld, 1)[0]);
		}
	};

	const workoutSettingsDefaults: WorkoutSettings = {
		exerciseLength: 45000,
		restLength: 15000,
		repetitions: 1,
		setOrCycle: 'cycle'
	};

	let settingsState = $state(workoutSettingsDefaults);

	const workoutSettingsStore: WorkoutSettingsStore = {
		get settings() {
			return settingsState;
		}
	};

	setContext('exercises', exerciseStore);
	setContext('selectedExercises', selectedExerciseStore);
	setContext('workoutSettings', workoutSettingsStore);
</script>

<svelte:head>
	<script src="/DragDropTouch.js"></script>
</svelte:head>

{@render children()}
