<script lang="ts">
	import { slide, fly, scale } from 'svelte/transition';
	import { defaultDuration, defaultEasing } from '.';

	export let duration = defaultDuration;

	const common = {
		duration,
		easing: defaultEasing,
		opacity: 1
	};
</script>

<!-- almost all transitions combined into one abomination -->
<div transition:slide={{ ...common, axis: 'x' }}>
	<div transition:slide={{ ...common, axis: 'y' }}>
		<div transition:fly={{ ...common, x: '-50%', y: '-50%' }}>
			<div transition:scale={{ ...common, start: 0 }} class="whitespace-nowrap">
				<slot />
			</div>
		</div>
	</div>
</div>
