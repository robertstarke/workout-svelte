<script lang="ts">
	export let fullTime: number;
	export let remainingTime: number;

	$: normalizedTime = (352 / fullTime) * remainingTime;
</script>

<div class="relative h-full flex justify-center items-stretch">
	<svg
		class="z-30 w-full h-full"
		width="128"
		height="128"
		viewBox="0 0 128 128"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle
			cx="64"
			cy="64"
			r="56"
			fill="none"
			class="stroke-current text-stone-500"
			stroke-width="3"
		></circle>
		<g class="origin-center transition-all duration-1000 ease-linear -rotate-90 transform">
			<circle
				cx="64"
				cy="64"
				r="56"
				fill="none"
				class="wa-progress stroke-current text-rose-500"
				stroke-width="3"
				stroke-dasharray="352"
				style="stroke-dashoffset: {normalizedTime};"
			></circle>
		</g>
	</svg>
	<!-- TODO animate-ping when on last 3 seconds -->
	<div
		class="absolute flex justify-center items-center aspect-square h-4/5 top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2 rounded-full"
	>
		<div
			class="z-20 flex justify-center items-center aspect-square h-full rounded-full bg-rose-300 overflow-hidden"
		>
			<slot />
		</div>
		<div
			class:wa-animate-ping={remainingTime < 4}
			class="z-10 absolute aspect-square h-full rounded-full bg-rose-500"
		></div>
	</div>
</div>

<style>
	.wa-animate-ping {
		animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
	}
	@keyframes ping {
		90%,
		100% {
			transform: scale(1.15);
			opacity: 0;
		}
	}
	.wa-progress {
		animation-name: move;
		animation-timing-function: linear;
	}

	@keyframes move {
		from {
			stroke-dashoffset: 352;
		}
		to {
			stroke-dashoffset: -10;
		}
	}
</style>
