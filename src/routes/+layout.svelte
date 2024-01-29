<script>
	import LeftSideBar from '$lib/components/home/leftSideBar.svelte';
	import Navbar from '$lib/components/navbar.svelte';
	import '../app.css';
</script>

<div class="flex flex-col h-full">
	<div class="">
		<Navbar />
	</div>
	<div class="h-full">
		<slot />
	</div>
</div>
