import { browser } from '$app/environment';
import type { PageLoad } from './$types';
import { orders, orderKeyStore } from '$lib/stores';
import type { Order } from '$lib/types/order';
import { generateKey } from '$lib/keys';

export const load = (async ({ url }) => {
	// Try to load orders from the server
	// const response = await fetch('/api/orders');

	// Load orders from local storage
	const response = localStorage.getItem('orders');
	if (response) {
		// Try to parse the response
		let data: Order[] = [];
		try {
			data = JSON.parse(response);
		} catch (e) {
			console.error('Error parsing orders', e);
		}

		orders.set(data);
	}

	var orderKey: string | null = null;

	if (browser) {
		orderKey = url.searchParams.get('key');

		// Check if the order key is valid
		if (orderKey) {
			orders.subscribe((orders) => {
				let found = false;
				orders.forEach((order) => {
					if (order.key === orderKey) {
						found = true;
					}
				});
				if (!found) {
					orderKey = null;
				}
			});
		}

		if (!orderKey) {
			// Look for an existing order key from today
			const today = new Date();
			orders.subscribe((orders) => {
				orders.forEach((order) => {
					if (order.date && order.date === today.toDateString()) {
						orderKey = order.key;
					}
				});
			});

			// If there is an order key, save it to the URL
			if (orderKey) {
				url.searchParams.set('key', orderKey);
			}
		}

		if (!orderKey) {
			// Generate a new order
			orders.update((orders) => {
				const order: Order = {
					key: generateKey(),
					date: new Date().toDateString(),
					total: 0,
					other: 0,
					participants: [],
					discount: 0
				};
				orders.push(order);
				return orders;
			});

			// Get the key from the new order
			orders.subscribe((orders) => {
				const order = orders[orders.length - 1];
				orderKey = order.key;
			});

			// If there is an order key, save it to the URL
			if (orderKey) {
				url.searchParams.set('key', orderKey);
			}
		}

		if (orderKey) {
			orderKeyStore.set(orderKey);
		}
	}

	return {};
}) satisfies PageLoad;
