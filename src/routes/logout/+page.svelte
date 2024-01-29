<script lang="ts">
	import { onMount } from 'svelte';
	import { isLoggedIn } from '$lib/stores';

	onMount(async () => {
		const response = await fetch('/api/user/logout', { redirect: 'follow' });
		isLoggedIn.set(false);
		if (response.redirected) {
			window.location.href = response.url;
		}
	});
</script>
