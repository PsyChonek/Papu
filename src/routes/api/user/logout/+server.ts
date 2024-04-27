import { logger } from '$lib/server/logger';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, url }) => {
	logger.debug('GET User->Logout -' + url.pathname);

	// Delete the cookies
	cookies.delete('token', { path: '/', secure: true, sameSite: 'strict' });
	cookies.delete('session', { path: '/', secure: true, sameSite: 'strict' });

	// Return a response redirect to the login page
	return new Response(null, {
		status: 303,
		headers: {
			Location: '/login'
		}
	});
};
