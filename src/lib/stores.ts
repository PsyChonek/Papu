import { writable, type Writable, type Updater } from 'svelte/store';
import { browser } from '$app/environment';
import type { Order } from './types/order';

function createIban(): Writable<string | null> {
	const key = 'iban';

	/**
	 * Sets the IBAN in local storage.
	 * @param iban - The IBAN string to set in local storage. If null, the key is removed from local storage.
	 * @returns The same IBAN string that was passed in.
	 */
	const setLocalStorageIban = (iban: string | null) => {
		if (browser) {
			if (iban) localStorage.setItem(key, iban);
			else localStorage.removeItem(key);
		} else {
			console.warn('Could not set IBAN outside of browser');
		}
		return iban;
	};

	/**
	 * Loads the IBAN from local storage.
	 * @returns The IBAN string loaded from local storage, or null if it was not found.
	 */
	const loadLocalStorageIban = () => {
		if (browser) {
			const iban = localStorage.getItem(key);
			console.log('IBAN loaded from local storage', iban);
			return iban;
		} else {
			console.warn('Could not load IBAN outside of browser');
			return null;
		}
	};

	/**
	 * A writable store that holds a string or null value, initialized with the value from local storage.
	 * @typeParam T - The type of the value held by the store.
	 * @returns An object containing the `subscribe` and `update` methods.
	 */
	const { subscribe, update } = writable<string | null>(null, (set) => set(loadLocalStorageIban()));

	/**
	 * Updates the IBAN in the store using the provided updater function and persists it in local storage.
	 * @param f - The updater function that takes the current IBAN string and returns the new IBAN string.
	 */
	const updateIban = (f: Updater<string | null>) => update((oldIban) => setLocalStorageIban(f(oldIban)));

	return {
		subscribe,
		update: updateIban,
		set: (iban) => updateIban(() => iban ?? null)
	};
}

export const iban = createIban();

// Create a writable store for the orders with update to store in local storage
function createOrders(): Writable<Order[]> {
	const key = 'orders';

	/**
	 * Sets the orders in local storage.
	 * @param orders - The orders to set in local storage.
	 * @returns The same orders that were passed in.
	 */
	const setLocalStorageOrders = (orders: Order[]) => {
		// console.log('Orders set in local storage', orders);

		if (browser) {
			delaySave(orders);
		} else {
			console.warn('Could not set orders outside of browser');
		}
		return orders;
	};

	// Debounce saving to local storage
	let timeout: any;
	/**
	 * Saves the orders to local storage after a delay.
	 * @param orders - The orders to save to local storage.
	 * @param delay - The delay in milliseconds before saving.
	 */
	const delaySave = (orders: Order[], delay = 1000) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			console.log('Orders saved to local storage', orders);
			localStorage.setItem(key, JSON.stringify(orders));
			timeout = null;
		}, delay);
	}

	/**
	 * Loads the orders from local storage.
	 * @returns The orders loaded from local storage, or an empty array if they were not found.
	 */
	const loadLocalStorageOrders = () => {
		if (browser) {
			const orders = JSON.parse(localStorage.getItem(key) ?? '[]');
			console.log('Orders loaded from local storage', orders);
			return orders;
		} else {
			console.warn('Could not load orders outside of browser');
			return [];
		}
	};

	/**
	 * A writable store that holds an array of orders, initialized with the value from local storage.
	 * @typeParam T - The type of the value held by the store.
	 * @returns An object containing the `subscribe` and `update` methods.
	 */
	const { subscribe, update } = writable<Order[]>([], (set) => set(loadLocalStorageOrders()));

	/**
	 * Updates the orders in the store using the provided updater function and persists them in local storage.
	 * @param f - The updater function that takes the current orders array and returns the new orders array.
	 */
	const updateOrders = (f: Updater<Order[]>) => update((oldOrders) => setLocalStorageOrders(f(oldOrders)));

	return {
		subscribe,
		update: updateOrders,
		set: (orders) => updateOrders(() => orders ?? [])
	};
}

export const orders = createOrders();

// Writable orderKeyStore, when set, will be saved to the URL and used to load the order
function createOrderKeyStore(): Writable<string> {
	const setSearchParams = (key: string) => {
		if (browser) {
			const url = new URL(window.location.href);
			if (key) {
				url.searchParams.set('key', key);
			} else {
				url.searchParams.delete('key');
			}
			window.history.replaceState({}, '', url.toString());
		} else {
			console.warn('Could not set order key outside of browser');
		}
		return key;
	};

	const { subscribe, set, update } = writable('');

	return {
		subscribe,
		set: (key) => set(setSearchParams(key)),
		update
	};
}

export const orderKeyStore = createOrderKeyStore();
