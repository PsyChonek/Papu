<script lang="ts">
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
