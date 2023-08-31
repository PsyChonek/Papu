import { writable, type Writable, type Updater } from 'svelte/store';
import { browser } from '$app/environment';

function createIban(): Writable<string | null> {
	const key = 'iban';

	const setLocalStorageIban = (iban: string | null) => {
		if (browser) {
			if (iban) localStorage.setItem(key, iban);
			else localStorage.removeItem(key);
		} else {
			console.warn('Could not set IBAN outside of browser');
		}
		return iban;
	};

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

	const { subscribe, update } = writable<string | null>(null, (set) => set(loadLocalStorageIban()));
	const updateIban = (f: Updater<string | null>) => update((oldIban) => setLocalStorageIban(f(oldIban)));

	return {
		subscribe,
		update: updateIban,
		set: (iban) => updateIban(() => iban?.toUpperCase().replace(/\s/g, "") ?? null),
	};
}

export const iban = createIban();
