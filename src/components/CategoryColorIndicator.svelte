<script lang="ts">
	import { getContext } from 'svelte';

	export let categories: string[];

	const categoryColorMap: Map<string, string> = getContext('categoryColorMap');

	const categoriesLength = categories.length;
	let colors = '';
	if (categoriesLength === 1) {
		const category: string = categories[0];
		const color: string = categoryColorMap.get(category) || '';
		colors = `${color}, ${color}`;
	} else {
		colors = categories.map((category: string) => categoryColorMap.get(category)).join(',');
	}
</script>

<span
	class="block flex-none w-full h-2 rounded-tl-md"
	style={`background: linear-gradient(to right, ${colors})`}
></span>

