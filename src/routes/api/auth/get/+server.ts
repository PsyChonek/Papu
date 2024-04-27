/**
 * Check if user is logged in
 */
import type { RequestHandler } from '@sveltejs/kit';
import { logger } from '$lib/server/logger';
import { verifyToken } from '$lib/server/auth';

export const GET: RequestHandler = async ({ request, url, cookies }) => {
	logger.debug('GET - Auth->Get - ' + url.pathname);

	// Get user from session
	const token = cookies.get('token');
	if (!token || !verifyToken(token)) {
		return new Response(JSON.stringify({ isAuth: false }), { status: 200, headers: { 'Content-Type': 'application/json' } });
	}

	return new Response(JSON.stringify({ isAuth: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
