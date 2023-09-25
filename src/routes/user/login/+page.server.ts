import type { Actions } from './$types';
import type { LoginForm } from './+page';
import { validateLoginForm } from '$lib/validations/userValidation';

import { fail, redirect } from '@sveltejs/kit';
import type { Validation } from '$lib/types/validation';
import { Database } from '$lib/server/database';
import type { User } from '$lib/types/user';

import crypto from 'crypto';
import { createToken } from '$lib/server/auth';

export const actions = {
	register: async ({ request }) => {
		const formData = await request.formData();

		// Create form object
		let input: LoginForm = {
			username: formData.get('username') as string,
			password: formData.get('password') as string,
		};

		// Validate input data
		var clientValidation : Validation = validateLoginForm(input);

		if (!clientValidation.isValid) {
			return fail(422, { data: input });
		}

		// Connect to database
		const collection = Database.client.db('papu').collection('users');

		// Find user with same username
		var user: User | null = await collection.findOne({ username: input.username }) as User | null;
		if (user == null) {
			return fail(422, { data: input });
		}

		// Check if password is correct
		var hash = crypto.pbkdf2Sync(input.password, user.salt, 1000, 64, 'sha512').toString('hex');
		
		if (hash != user.hash) {
			return fail(422, { data: input });
		}

		// Return session token
		const token = createToken({
			userID: user._id,
			userName: user.username,
			claims: user.claims
		});

		// Redirect to user page
		throw redirect(303, '/user');
	}
} satisfies Actions;
