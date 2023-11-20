<script>
	import '../app.css';
	import Footer from '../lib/components/footer.svelte';
</script>

<div class="flex flex-col min-h-screen">
	<div class=" m-8 mx-auto">
		<a href="/" class="text-center font-bold text-5xl">Papu</a>
	</div>
	<div class="m-8 mx-auto">
		<slot />
	</div>
	<div class="m-5 mx-auto">
		<Footer />
	</div>
</div>
