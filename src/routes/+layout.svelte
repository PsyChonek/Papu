<script>
	import '../app.css';
	import Footer from '$lib/footer.svelte';
</script>

<div class="flex flex-col h-max justify-between h-screen items-center">
	<div>
		<h1 class="text-center font-bold text-5xl mt-10">Papu</h1>
	</div>
	<div>
		<slot />
	</div>
	<div>
		<Footer />
	</div>
</div>
