import { getUserIDFromToken, verifyToken } from '$lib/server/auth';
import { loadOrderUser } from '$lib/server/service/orders';
import type { Order } from '$lib/types/order';
import type { PageServerLoad } from './$types';
import { SendSlackMessage } from '$lib/server/messenger';
import type { Participant } from '$lib/types/participant';

export const load = (async (cookies) => {
	const token = cookies.cookies.get('token');
	var isLoggedIn: boolean = false;
	var orders: Order[] = [];

	if (token && verifyToken(token)) {
		isLoggedIn = true;
		const userId: string = getUserIDFromToken(token);
		orders = await loadOrderUser(userId);
	} else {
		isLoggedIn = false;
		cookies.cookies.delete('token', { path: '/', secure: true, sameSite: 'strict' });
		cookies.cookies.delete('session', { path: '/', secure: true, sameSite: 'strict' });
	}

	return { isLoggedIn: isLoggedIn, orders: JSON.stringify(orders) };
}) satisfies PageServerLoad;

export const actions = {
	sendToSlack: async ({ request }) => {
		const formData = await request.formData();
		const participants = formData.get('participants') as string;

		// Create image with participants
		SendSlackMessage('image', participants);
	}
};
