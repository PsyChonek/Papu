<script lang="ts">
	import Footer from '$lib/components/footer.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	import { isLoggedIn } from '$lib/stores';
	isLoggedIn.update(() => data.isLoggedIn);
</script>

<div class="flex flex-col justify-between h-full">
	<div class="flex flex-row">
		<div class="flex flex-col gap-5 basis-full">
			<div id="settings" class="rounded-xl bg-gray-100 p-10 m-2 mx-auto">
				<h1 class="text-3xl font-bold text-center">Account</h1>
				<p class="text-gray-500">Account data stored in DB</p>
				<pre>{JSON.stringify(data, null, 2)}</pre>
			</div>
		</div>
	</div>
	<div>
		<Footer />
	</div>
</div>
