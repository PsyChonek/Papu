<script>
	import Navbar from '$lib/components/navbar.svelte';
	import '../app.css';
	import Footer from '../lib/components/footer.svelte';
</script>

<div class="flex flex-col min-h-screen">
	<div class="">
		<Navbar />
	</div>
	<div class="">
		<slot />
	</div>
	<div class="absolute bottom-0 w-full">
		<Footer />
	</div>
</div>
