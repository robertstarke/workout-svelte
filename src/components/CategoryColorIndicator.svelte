<script lang="ts">
	let { categories }: { categories: string[] } = $props();

	const categoryColorMap: Map<string, string> = new Map<string, string>([
		['core', '#dc2626'],
		['arms', '#ca8a04'],
		['legs', '#65a30d'],
		['cardio', '#2563eb']
	]);

	let style = $derived.by(() => {
		if (categories.length === 1) {
			const color: string = categoryColorMap.get(categories[0]) || '';
			return `background: ${color}`;
		} else {
			const fraction = 100 / categories.length;
			const colors = categories.reduce((colorString: string, category: string, index: number) => {
				const start = fraction * index;
				const end = fraction * (index + 1);
				colorString = colorString + `${categoryColorMap.get(category)} ${start}% ${end}%`;
				if (index < categories.length - 1) {
					colorString = colorString + ',';
				}
				return colorString;
			}, '');
			return `background: linear-gradient(to bottom, ${colors})`;
		}
	});
</script>

<span class="block flex-none w-2 rounded-l-md" {style}></span>
