import { getUserIDFromToken, verifyToken } from '$lib/server/auth';
import { Database } from '$lib/server/database';
import type { User } from '$lib/types/user';
import { Collection, ObjectId } from 'mongodb';
import type { RequestHandler } from '@sveltejs/kit';
import { logger } from '$lib/server/logger';
import { getUser } from '$lib/server/service/users';

export const GET: RequestHandler = async ({ url, cookies }) => {
	logger.debug('GET - User->Get', url.pathname);
	// Get user from session
	const token = cookies.get('token');
	if (!token || !verifyToken(token)) {
		return new Response('Unauthorized', { status: 401 });
	}

	var userId: string = getUserIDFromToken(token);

	if (userId == null) {
		return new Response(JSON.stringify({ status: 401, error: 'Invalid token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
	}

	const user = await getUser(userId);

	return new Response(JSON.stringify(user), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
