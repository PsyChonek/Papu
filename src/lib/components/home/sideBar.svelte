<script lang="ts">
	import { generateKey } from '$lib/keys';
	import { orders } from '$lib/stores';
	import type { Order } from '$lib/types/order';
	var showSideBar = true;

	export let activeKey: string;

	function dateFormat(date: string): string {
		const d = new Date(date);
		return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
	}

	// Remove order from orders store
	function removeOrder(key: string) {
		orders.set($orders.filter((order) => order.key !== key));
	}

	function addOrder() {
		const order: Order = {
			key: generateKey(),
			date: new Date().toISOString(),
			total: 0,
			other: 0,
			participants: [],
			discount: 0
		};
		orders.set([...$orders, order]);
	}
</script>

{#if showSideBar}
	<div class="bg-red-50 h-screen w-80 fixed left-0 top-0">
		<div class="flex flex-row justify-around m-5 items-baseline">
			<h1 class="font-bold text-xl">Orders</h1>
			<button on:click={() => (showSideBar = !showSideBar)} class="border-2 border-orange-500 rounded-xl p-1">{showSideBar ? 'Hide' : 'Show'}</button>
		</div>

		{#each $orders as order}
			<div class="flex flex-row justify-between m-5 bg-blue-100 border-blue-400 rounded-xl p-2 items-baseline">
				<p class="font-bold text-xl">{dateFormat(order.date)}</p>
				<p class="font-bold text-xl">{order.total}</p>
				<!-- Only allow removing not active orders -->
				{#if order.key !== activeKey}
					<button on:click={() => removeOrder(order.key)} class="border-2 border-orange-500 rounded-xl p-1">Remove</button>
				{/if}
			</div>
		{/each}

		<div class="flex flex-row justify-around m-5 items-baseline">
			<button on:click={() => addOrder()} class="border-2 border-orange-500 rounded-xl p-1">New order</button>
		</div>
	</div>
{/if}
{#if !showSideBar}
	<button on:click={() => (showSideBar = !showSideBar)} class="left-10 top-10 fixed border-2 border-orange-500 rounded-xl p-1">{showSideBar ? 'Hide' : 'Show'}</button>
{/if}
