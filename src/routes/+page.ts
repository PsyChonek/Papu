import { browser } from '$app/environment';
import type { PageLoad } from './$types';
import { orders } from '$lib/stores';
import type { Order } from '$lib/types/order';
import { generateKey } from '$lib/keys';

export const load = (async ({ url }) => {
	// Try to load orders from the server
	// const response = await fetch('/api/orders');

	// Load orders from local storage
	if (browser) {
		const response = localStorage.getItem('orders');
		if (response) {
			const data = JSON.parse(response);
			orders.set(data);
		}
	}

	const activeOrderKey = url.searchParams.get('key');

	var ordersData: Order[] = [];
	orders.subscribe((orders) => {
		ordersData = orders;
	});

	// If there is an active order, do nothing, otherwise set today's date as the active order, if there is one, or create a new one
	if (!activeOrderKey) {
		const today = new Date();

		const activeOrder = ordersData.find((order) => {
			const orderDate = new Date(order.date);
			return orderDate.getFullYear() === today.getFullYear() && orderDate.getMonth() === today.getMonth() && orderDate.getDate() === today.getDate();
		});

		if (activeOrder) {
			url.searchParams.set('key', activeOrder.key);
		} else {
			console.log('Creating new order');
			const newOrder: Order = {
				key: generateKey(),
				date: today.toISOString(),
				total: 0,
				other: 0,
				discount: 0,
				participants: []
			};
			ordersData.push(newOrder);
			orders.set(ordersData);
			url.searchParams.set('id', newOrder.key);
		}
	}

	return {};
}) satisfies PageLoad;
