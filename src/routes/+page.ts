import { browser } from '$app/environment';
import type { PageLoad } from './$types';
import { orders, orderKeyStore, isLoggedIn, userId } from '$lib/stores';
import type { Order } from '$lib/types/order';
import { generateKey } from '$lib/keys';

export const load: PageLoad = async ({ parent, data, url, fetch }) => {
	isLoggedIn.set(data.isLoggedIn);

	let userData = null;

	// Check if token exists
	if (data.isLoggedIn && data.isLoggedIn != undefined) {
		userData = await fetch('/api/user/get', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(async (response) => {
			if (response.ok) {
				const data = await response.json();
				return data;
			} else {
				console.error('Error getting orders', response);
			}
		});

		userId.set(userData?._id);
	}

	// Load orders from local storage
	const response = localStorage.getItem('orders');
	if (response) {
		// Try to parse the response
		let serverOrders: Order[] = JSON.parse(data.orders) as Order[];
		let localOrders: Order[] = [];
		try {
			localOrders = JSON.parse(response) as Order[];
		} catch (e) {
			console.error('Error parsing orders', e);
		}

		// Merge the orders
		const mergedOrders: Order[] = [];

		if (serverOrders.length !== 0) {
			serverOrders.forEach((order) => {
				if (!mergedOrders.some((o) => o.key === order.key)) {
					mergedOrders.push(order);
				}
			});
		}

		if (localOrders.length !== 0) {
			localOrders.forEach((order) => {
				if (!mergedOrders.some((o) => o.key === order.key)) {
					mergedOrders.push(order);
				}
			});
		}

		orders.set(mergedOrders);
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
					const date = new Date(order.date);
					if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate()) {
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
					_id: null,
					key: generateKey(),
					date: new Date().toISOString(),
					other: 0,
					participants: [],
					discount: 0,
					ownerID: userData?._id ?? null,
					isDeleted: false
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
};
