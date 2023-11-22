<script lang="ts">
	import { arraySum } from '$lib';
	import { generateKey } from '$lib/keys';
	import { orders, orderKeyStore } from '$lib/stores';
	import type { Order } from '$lib/types/order';
	import { slide } from 'svelte/transition';
	var showSideBar = true;

	function dateFormat(date: string): string {
		const d = new Date(date);
		return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
	}

	function timeFormat(date: string): string {
		const d = new Date(date);
		return `${d.getHours()}:${d.getMinutes()}`;
	}

	// Remove order from orders store
	function removeOrder(key: string) {
		orders.set($orders.filter((order) => order.key !== key));
	}

	function addOrder() {
		const order: Order = {
			_id: crypto.randomUUID(),
			key: generateKey(),
			date: new Date().toISOString(),
			other: 0,
			participants: [],
			discount: 0
		};
		orders.set([...$orders, order]);
	}

	function setActive(key: string) {
		orderKeyStore.set(key);
	}

	function orderOrdersByDate(a: Order, b: Order) {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	}
</script>

{#if showSideBar}
	<div class="bg-red-50 h-screen w-80 fixed left-0 top-0" transition:slide={{ duration: 300, axis: 'x' }}>
		<div class="flex flex-row justify-around m-5 items-baseline">
			<h1 class="font-bold text-xl">Orders</h1>
			<button on:click={() => (showSideBar = !showSideBar)} class="border-2 border-orange-500 rounded-xl p-1">⬅️</button>
		</div>

		<!-- Place reverse order -->
		{#each $orders.sort(orderOrdersByDate) as order}
			<div class="flex flex-row justify-between rounded-xl p-2 px-4 items-center gap-2">
				<button
					on:click={() => {
						setActive(order.key);
					}}
					class="flex flex-row justify-between bg-blue-100 border-blue-400 rounded-xl p-2 items-baseline grow"
				>
					<div>
						<p class="font-bold text-xl">{dateFormat(order.date)}</p>
						<p class="font-bold text-xl">{timeFormat(order.date)}</p>
					</div>
					<div>
						<p class="font-bold text-xl">{order.key}</p>
						<p class="font-bold text-xl">{arraySum(order.participants.map((participant) => participant.total))}</p>
					</div>
				</button>
				<!-- Only allow removing not active orders -->
				{#if order.key !== $orderKeyStore}
					<button on:click={() => removeOrder(order.key)} class="border-2 border-orange-500 rounded-xl p-1">🗑️</button>
				{/if}
				{#if order.key === $orderKeyStore}
					<button class="border-2 border-orange-500 rounded-xl p-1 items-center">✅</button>
				{/if}
			</div>
		{/each}

		<div class="flex flex-row justify-around m-5 items-baseline">
			<button on:click={() => addOrder()} class="border-2 border-orange-500 rounded-xl p-1">New order</button>
		</div>
	</div>
{/if}
{#if !showSideBar}
	<div class="h-screen w-30 fixed left-0 top-0" transition:slide={{ duration: 300, axis: 'x' }}>
		<div class="flex flex-row justify-around m-5 items-baseline">
			<button on:click={() => (showSideBar = !showSideBar)} class="border-2 border-orange-500 rounded-xl p-1">➡️</button>
		</div>
	</div>
{/if}
