import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import type { RegisterForm } from './+page';
import type { Validation } from '$lib/types/validation';
import { validateRegisterForm } from '$lib/validations/userValidation';
import { Database } from '$lib/server/database';
import crypto from 'crypto';
import type { User } from '$lib/types/user';
import { Collection, ObjectId } from 'mongodb';
import { logger } from '$lib/server/logger';
import { createToken, type Token } from '$lib/server/auth';
import { createSession } from '$lib/server/session';

export const actions = {
	register: async ({ request, cookies }) => {
		const formData = await request.formData();

		// Create form object
		let input: RegisterForm = {
			username: formData.get('username') as string,
			password: formData.get('password') as string,
			passwordConfirm: formData.get('passwordConfirm') as string,
			email: formData.get('email') as string
		};

		// Validate input data
		var clientValidation: Validation = validateRegisterForm(input);

		logger.debug(`User ${input.username}, email ${input.email} registration attempt`);

		if (!clientValidation.isValid) {
			return fail(422, { data: input, errors: [{ text: 'Invalid input', type: 'input' }] });
		}

		logger.debug(`User ${input.username}, email ${input.email} input valid`);

		const collection: Collection = await Database.getCollection('users');

		// Check if user already exists
		if ((await collection.findOne({ $or: [{ username: input.username }, { email: input.email }] })) != null) {
			logger.debug(`User ${input.username}, email ${input.email} already exists`);
			return fail(422, { data: input, errors: [{ text: 'User already exists', type: 'input' }] });
		}

		logger.debug(`User ${input.username}, email ${input.email} does not exist`);

		// Hash password
		var salt = (crypto as any).randomBytes(16).toString('hex');
		var hash = crypto.pbkdf2Sync(input.password, salt, 1000, 64, 'sha512').toString('hex');

		var user: User = {
			username: input.username,
			email: input.email,
			salt: salt,
			hash: hash,
			_id: new ObjectId(),
			created: new Date()
		};

		logger.debug(`User ${user.username}, email ${user.email} hashed`);

		// Insert user into database check if user inserted
		const result = await collection.insertOne(user);
		if (result.insertedId == null) {
			return fail(422, { data: input, errors: [{ text: 'Failed to insert user', type: 'input' }] });
		}

		logger.info(`User ${user.username}, email ${user.email}, userID ${user._id} registered`);

		const TokenPayload: Token = {
			sub: user._id.toString()
		};

		// Return session token
		const token = createToken(TokenPayload);

		// Store session token in cookie
		createSession(cookies, token);

		// Redirect to login page
		throw redirect(303, '/user');
	}
} satisfies Actions;
