import { JWT_EXPIRE_MINUTES } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';

// Create a session
export function createSession(cookies: Cookies, token: string) {
	const sessionID = crypto.randomUUID();
	cookies.set('session', JSON.stringify({ sessionID }), {
		path: '/',
		expires: new Date(Date.now() + Number.parseInt(JWT_EXPIRE_MINUTES) * 60 * 1000),
		sameSite: 'lax',
		httpOnly: true
	});

	cookies.set('token', token, {
		path: '/',
		expires: new Date(Date.now() + Number.parseInt(JWT_EXPIRE_MINUTES) * 60 * 1000),
		sameSite: 'lax',
		httpOnly: true
	});
}

// Logout
export function logout(cookies: Cookies) {
	cookies.set('session', '', {
		path: '/',
		expires: new Date(Date.now() - 1),
		sameSite: 'lax',
		httpOnly: true
	});

	cookies.set('token', '', {
		path: '/',
		expires: new Date(Date.now() - 1),
		sameSite: 'lax',
		httpOnly: true
	});
}
