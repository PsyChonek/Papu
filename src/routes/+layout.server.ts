import { verifyToken } from '$lib/server/auth';
import type { LayoutServerLoad } from './$types';

export const load = (async (cookies) => {
	const token = cookies.cookies.get('token');
	var isLoggedIn;

	if (token && verifyToken(token)) {
		isLoggedIn = true;
	} else {
		isLoggedIn = false;
		cookies.cookies.delete('token', { path: '/', secure: true, sameSite: 'strict' });
		cookies.cookies.delete('session', { path: '/', secure: true, sameSite: 'strict' });
	}

	return { isLoggedIn };
}) satisfies LayoutServerLoad;
