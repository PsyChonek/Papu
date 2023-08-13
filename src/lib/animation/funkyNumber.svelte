<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { defaultEasing, defaultDuration } from '.';
	import { formatFloat } from '$lib';

	export let value: number;

	const animatedValue = tweened(value, {
		duration: defaultDuration,
		easing: defaultEasing
	});

	$: animatedValue.set(value);
</script>

{formatFloat($animatedValue)}
