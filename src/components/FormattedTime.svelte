<script>
	export let timeInMs = 0;
	$: timeInSeconds = Math.ceil(timeInMs / 1000);
</script>

<span>
	{#if timeInSeconds / 3600 >= 1}{Math.floor(timeInSeconds / 3600)}h{/if}
	{#if (timeInSeconds % 3600) / 60 >= 1}{Math.floor((timeInSeconds % 3600) / 60)}m{/if}
	{#if timeInSeconds > 0}{timeInSeconds % 60}s{/if}
	{#if timeInSeconds === 0}0s{/if}
</span>
