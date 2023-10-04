import { writable, type Writable, type Updater } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Creates a writable store for an IBAN string that is persisted in local storage.
 * @returns An object with `subscribe`, `update`, and `set` methods for interacting with the store.
 */
/**
 * Creates a writable store for an IBAN string that is persisted in local storage.
 * @returns An object containing the `subscribe`, `update`, and `set` methods.
 * @typeParam T - The type of the value held by the store.
 */
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
