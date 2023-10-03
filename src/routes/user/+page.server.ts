import { getUserIDFromToken, verifyToken } from '$lib/server/auth';
import { Database } from '$lib/server/database';
import { ObjectId } from 'bson';
import type { User } from '$lib/types/user';
import type { PageServerLoad } from './$types';
import type { Collection } from 'mongodb';

export const load = (async ({ cookies }) => {
	// Get user from session
	const token = cookies.get('token');

	if (token == null) {
		return {
			status: 401,
			error: 'Token not found'
		};
	}

	var userId: string = getUserIDFromToken(token);

	if (userId == null) {
		return {
			status: 401,
			error: 'Invalid token'
		};
	}

	const collection: Collection = await Database.getCollection('users');

	// Find user with same username
	var user: User | null = (await collection.findOne({ _id: new ObjectId(userId) })) as User | null;

	// Hack to remove ObjectId
	user = JSON.parse(JSON.stringify(user)); // Convert to JSON and back to remove ObjectId

	return {
		User: user
	};
}) satisfies PageServerLoad;
