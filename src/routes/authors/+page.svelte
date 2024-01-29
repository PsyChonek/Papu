<script lang="ts">
	import Footer from '$lib/components/footer.svelte';
</script>

<div class="flex flex-col justify-between h-full">
	<div class="flex flex-col gap-10 mx-auto">
		<h1 class="text-center font-bold text-4xl mt-10">Authors</h1>

		<div class="flex flex-col gap-6 m-2 items-center">
			<div class="flex flex-row items-center justify-evenly gap-6">
				<a href="https://vazacdaniel.com/" class="hover:scale-150 text-center font-bold text-2xl text-blue-600">Daniel Vazač</a>
			</div>
			<div class="flex flex-row items-center justify-evenly gap-6">
				<h1 class="font-bold mr-auto text-2xl">Ondřej Matura</h1>
			</div>
		</div>
	</div>
	<div>
		<Footer />
	</div>
</div>
