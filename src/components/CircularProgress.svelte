<div class="relative h-full flex justify-center items-stretch">
	<svg
		class="w-full h-full"
		width="128"
		height="128"
		viewBox="0 0 128 128"
		xmlns="http://www.w3.org/2000/svg"
	>
		<!-- Background Circle -->
		<circle
			cx="64"
			cy="64"
			r="32"
			fill="none"
			class="stroke-current text-stone-500"
			stroke-width="2"
		></circle>
		<!-- Progress Circle inside a group with rotation -->
		<g class="origin-center -rotate-90 transform">
			<circle
				cx="64"
				cy="64"
				r="32"
				fill="none"
				class="stroke-current text-rose-500"
				stroke-width="2"
				stroke-dasharray="100"
				stroke-dashoffset="0"
			></circle>
		</g>
	</svg>
	<!-- Percentage Text -->
	<div class="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
		<span class="text-center text-2xl font-bold text-gray-800 dark:text-white">72%</span>
	</div>
</div>
