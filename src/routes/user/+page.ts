import { isLoggedIn } from '$lib/stores';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	// Get user from session
	const userData = await fetch('/api/user/get', {
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

	isLoggedIn.set(userData?._id != null);

	return {
		User: userData
	};
}) satisfies PageLoad;
