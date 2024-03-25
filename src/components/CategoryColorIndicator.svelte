<script lang="ts">
	export let categories: string[];

	const categoryColorMap: Map<string, string> = new Map<string, string>([
		['core', '#dc2626'],
		['arms', '#ca8a04'],
		['legs', '#65a30d'],
		['cardio', '#2563eb']
	]);

	const categoriesLength = categories.length;
	let colors = '';
	let style = '';
	if (categoriesLength === 1) {
		const category: string = categories[0];
		const color: string = categoryColorMap.get(category) || '';
		style = `background: ${color}`;
	} else {
		const fraction = 100 / categories.length;
		colors = categories.reduce((colorString: string, category: string, index: number) => {
			const start = fraction * index;
			const end = fraction * (index + 1);
			colorString = colorString + `${categoryColorMap.get(category)} ${start}% ${end}%`;
			if (index < categories.length - 1) {
				colorString = colorString + ',';
			}
			return colorString;
		}, '');
		style = `background: linear-gradient(to bottom, ${colors})`;
	}
</script>

<span class="block flex-none w-2 rounded-l-md" {style}></span>
