import { getUserIDFromToken, verifyToken } from '$lib/server/auth';
import { Database } from '$lib/server/database';
import type { User } from '$lib/types/user';
import { ObjectId } from 'mongodb';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	// Get user from session
	const token = cookies.get('token');
	if (token == null) {
		return { user: null };
	}

	var userId: string = getUserIDFromToken(token);

	// Load user data
	var user: User | null = (await Database.db().collection('users').findOne({ _id: new ObjectId(userId) })) as User | null;
	user =  JSON.parse(JSON.stringify(user)) // Convert to JSON and back to remove ObjectId

	return {user};
}) satisfies PageServerLoad;
