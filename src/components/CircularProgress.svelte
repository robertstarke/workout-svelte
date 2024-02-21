<script lang="ts">
	import { browser } from '$app/environment';

	export let fullTime: number;
	export let remainingTime: number;

	$: if (browser && remainingTime === fullTime) {
		const el = document.getElementById('wa-progress');
		if (el) {
			if (el.style.animationName == 'progress-1') {
				el.style.animation = `progress-2 ${fullTime}s linear`;
			} else {
				el.style.animation = `progress-1 ${fullTime}s linear`;
			}
		}
	}
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
		<g class="origin-center -rotate-90 transform">
			<circle
				id="wa-progress"
				cx="64"
				cy="64"
				r="56"
				fill="none"
				class="stroke-current text-rose-500"
				stroke-width="3"
				stroke-dasharray="352"
				stroke-dashoffset="352"
				style="animation: progress-1 {fullTime}s linear;"
			></circle>
		</g>
	</svg>
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

	@keyframes -global-progress-1 {
		from {
			stroke-dashoffset: 352;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
	@keyframes -global-progress-2 {
		from {
			stroke-dashoffset: 352;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
