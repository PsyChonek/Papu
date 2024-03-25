import { verifyToken } from '$lib/server/auth';
import { logger } from '$lib/server/logger';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ url, cookies }) => {
	logger.debug('POST - Order->Get - '+ url.pathname);

	// validate token
	const token = cookies.get('token');
	if (!token || !verifyToken(token)) {
		return new Response('Unauthorized', { status: 401 });
	}
	return new Response();
};
