import type { Actions } from './$types';
import type { RegisterForm } from './+page';
import { validateRegisterForm } from '$lib/validations/userValidation';

import { fail, redirect } from '@sveltejs/kit';
import type { Validation } from '$lib/types/validation';
import { Database } from '$lib/server/database';
import type { User } from '$lib/types/user';

import crypto from 'crypto';

export const actions = {
	register: async ({ request }) => {
		const formData = await request.formData();

		// Create form object
		let input: RegisterForm = {
			username: formData.get('username') as string,
			password: formData.get('password') as string,
			passwordConfirm: formData.get('passwordConfirm') as string,
			email: formData.get('email') as string
		};

		// Validate input data
		var clientValidation : Validation = validateRegisterForm(input);

		if (!clientValidation.isValid) {
			return fail(422, { data: input });
		}

		// Connect to database
		const collection = Database.db().collection('users');
		
		// Check if user already exists
		if(await collection.findOne({$or:[{username:input.username},{email:input.email}]}) != null) {
			return fail(422, { data: input });
		}

		// Hash password
		var salt = crypto.randomBytes(16).toString('hex');
		var hash = crypto.pbkdf2Sync(input.password, salt, 1000, 64, 'sha512').toString('hex');

		var user : User = {
			username: input.username,
			email: input.email,
			salt: salt,
			hash: hash
		};

		// Insert user into database
		collection.insertOne(user).then((result) => {
			if (!result) {
				return fail(422, { data: input });
			}
		});

		// Redirect to login page
		throw redirect(303, '/user/login');
	}
} satisfies Actions;
