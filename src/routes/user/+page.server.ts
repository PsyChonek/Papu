import { env } from '$env/dynamic/private';
import { getUserIDFromToken, verifyToken } from '$lib/server/auth';
import { logger } from '$lib/server/logger';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	// Get user from session
	const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTExZWFiMWI3ZTEzM2RlODgyZWUwZGQiLCJpYXQiOjE2OTU4MDkxMjEsImV4cCI6MTcxMTU3NzEyMSwiaXNzIjoicGFwdSJ9.LsU1C2GLJOgL4esNxsNoPldQl4V-0d7ybanpkUgcbYI';

	logger.info('Token: ' + token);
	logger.info('JWT_SECRET: ' + env.JWT_SECRET)
	if (token == null) {
		return { user: null };
	}

	var userId: string = getUserIDFromToken(token);

	logger.info('User ID: ' + userId);

	// // Load user data
	// var user: User | null = (await Database.Db().collection('users').findOne({ _id: new ObjectId(userId) })) as User | null;
	// user =  JSON.parse(JSON.stringify(user)) // Convert to JSON and back to remove ObjectId

	return { User: { _id: userId } };
}) satisfies PageServerLoad;
