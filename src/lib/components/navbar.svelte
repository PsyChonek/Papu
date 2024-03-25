<script lang="ts">
	import { isLoggedIn } from "$lib/stores";
</script>

<div>
	<div class="bg-slate-300 flex flex-row m-0 items-baseline p-2 gap-3 justify-center">
		<a class="border-2 border-orange-500 rounded-xl p-1" href="/">Orders</a>
		{#if $isLoggedIn}<a class="border-2 border-orange-500 rounded-xl p-1" href="/user">Account</a>{/if}
		{#if !$isLoggedIn}<a class="border-2 border-orange-500 rounded-xl p-1" href="/login">Login</a>{/if}
		{#if $isLoggedIn}<a class="border-2 border-orange-500 rounded-xl p-1" href="/logout">Logout</a>{/if}
	</div>
</div>
