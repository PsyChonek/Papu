import type { Actions } from './$types';
import type { LoginForm } from './+page';
import { validateLoginForm } from '$lib/validations/userValidation';
import { fail, redirect } from '@sveltejs/kit';
import type { Validation } from '$lib/types/validation';
import { Database } from '$lib/server/database';
import type { User } from '$lib/types/user';
import crypto from 'crypto';
import { createToken, type Token } from '$lib/server/auth';
import { createSession } from '$lib/server/session';

export const actions = {
	register: async ({ request, cookies }) => {
		const formData = await request.formData();

		// Create form object
		let input: LoginForm = {
			username: formData.get('username') as string,
			password: formData.get('password') as string
		};

		// Validate input data
		var clientValidation: Validation = validateLoginForm(input);

		if (!clientValidation.isValid) {
			return fail(422, { data: input });
		}

		// Connect to database
		const collection = Database.client.db('papu').collection('users');

		// Find user with same username
		var user: User | null = (await collection.findOne({ username: input.username })) as User | null;
		if (user == null) {
			return fail(422, { data: input });
		}

		// Check if password is correct
		var hash = crypto.pbkdf2Sync(input.password, user.salt, 1000, 64, 'sha512').toString('hex');

		console.log(user._id?.toString());

		if (hash != user.hash) {
			return fail(422, { data: input });
		}

		// console.log(user._id?.id.toString());
		console.log(user._id?.toString());

		if (user._id == null) {
			return fail(422, { data: input });
		}

		const TokenPayload: Token = {
			sub: user._id.toString()
		};

		// Return session token
		const token = createToken(TokenPayload);

		// Store session token in cookie
		createSession(cookies, token);

		throw redirect(303, '/user');
	}
} satisfies Actions;
