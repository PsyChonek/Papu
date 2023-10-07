<script lang="ts">
	import { orders } from '$lib/stores';
	var showSideBar = true;

	function dateFormat(date: string): string {
		const d = new Date(date);
		return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
	}
</script>

{#if showSideBar}
	<div class="bg-red-50 h-screen w-80 fixed left-0 top-0">
		<div class="flex flex-row justify-around m-5 items-baseline">
			<h1 class="font-bold text-xl">Orders</h1>
			<button on:click={() => (showSideBar = !showSideBar)} class="border-2 border-orange-500 rounded-xl p-1">{showSideBar ? 'Hide' : 'Show'}</button>
		</div>
		{#each $orders as order}
			<div class="flex flex-row justify-between m-5 bg-blue-100 border-blue-400 rounded-xl p-2">
				<p class="font-bold text-xl">{dateFormat(order.date)}</p>
				<p class="font-bold text-xl">{order.total}</p>
			</div>
		{/each}
	</div>
{/if}
{#if !showSideBar}
		<button on:click={() => (showSideBar = !showSideBar)} class="left-10 top-10 fixed border-2 border-orange-500 rounded-xl p-1">{showSideBar ? 'Hide' : 'Show'}</button>
{/if}
