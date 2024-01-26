import { getUserIDFromToken } from '$lib/server/auth';
import { Database } from '$lib/server/database';
import type { User } from '$lib/types/user';
import { Collection, ObjectId } from 'mongodb';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, url, cookies }) => {
	console.log('GET', url.pathname);
	// Get user from session
	const token = cookies.get('token');

	if (token == null) {
		return new Response(JSON.stringify({ status: 401, error: 'Invalid token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
	}

	var userId: string = getUserIDFromToken(token);

	if (userId == null) {
		return new Response(JSON.stringify({ status: 401, error: 'Invalid token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
	}

	const collection: Collection = await Database.getCollection('users');

	// Find user with same username
	var user: User | null = (await collection.findOne({ _id: new ObjectId(userId) })) as User | null;

	return new Response(JSON.stringify(user), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
