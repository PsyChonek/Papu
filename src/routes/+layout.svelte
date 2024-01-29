<script lang="ts">
	import LeftSideBar from '$lib/components/home/leftSideBar.svelte';
	import Navbar from '$lib/components/navbar.svelte';
	import '../app.css';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
	import { isLoggedIn } from '$lib/stores';
	isLoggedIn.update(() => data.isLoggedIn);
</script>

<div class="flex flex-col h-full">
	<div class="">
		<Navbar />
	</div>
	<div class="h-full">
		<slot />
	</div>
</div>
