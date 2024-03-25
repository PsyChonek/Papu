<script lang="ts">
	import { quadInOut } from 'svelte/easing';
	import { arraySum } from '$lib';
	import { generateKey } from '$lib/keys';
	import { orders, orderKeyStore, userId } from '$lib/stores';
	import type { Order } from '$lib/types/order';
	import { fade, slide, type SlideParams } from 'svelte/transition';
	import { enhance } from '$app/forms';

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
		const orderIdToDelete = $orders.find((order) => order.key === key)?._id;

		if (orderIdToDelete) {
			// Send delete request to server
			fetch(`/api/order/delete/${orderIdToDelete}`, {
				method: 'DELETE'
			});
		}

		orders.set($orders.filter((order) => order.key !== key));
	}

	function addOrder() {
		const order: Order = {
			_id: null,
			key: generateKey(),
			date: new Date().toISOString(),
			other: 0,
			participants: [],
			discount: 0,
			ownerID: $userId,
			isDeleted: false
		};

		orders.set([...$orders, order]);
	}

	function setActive(key: string) {
		orderKeyStore.set(key);
	}

	function orderOrdersByDate(a: Order, b: Order) {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	}

	const fadeIn: SlideParams = {
		delay: 100,
		duration: 100,
		axis: 'x',
		easing: quadInOut
	};

	const fadeOut: SlideParams = {
		delay: 0,
		duration: 100,
		axis: 'x',
		easing: quadInOut
	};
</script>

{#if showSideBar}
	<div class="bg-red-50 h-full" in:slide={fadeIn} out:slide={fadeOut}>
		<div class="flex flex-row justify-around p-5 items-baseline">
			<h1 class="font-bold text-xl">Orders</h1>
			<button on:click={() => (showSideBar = !showSideBar)} class="border-2 border-orange-500 rounded-xl p-1">⬅️</button>
		</div>

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
{:else}
	<div class="" in:fade={fadeIn} out:fade={fadeOut}>
		<div class="flex flex-row m-5 items-baseline">
			<button on:click={() => (showSideBar = !showSideBar)} class="border-2 border-orange-500 rounded-xl p-1">➡️</button>
		</div>
	</div>
{/if}
