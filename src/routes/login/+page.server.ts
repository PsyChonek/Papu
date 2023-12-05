import type { Actions } from './$types';
import type { LoginForm, RegisterForm } from './+page';
import { validateLoginForm, validateRegisterForm } from '$lib/validations/userValidation';
import { fail, redirect } from '@sveltejs/kit';
import type { Validation } from '$lib/types/validation';
import { Database } from '$lib/server/database';
import type { User } from '$lib/types/user';
import crypto from 'crypto';
import { createToken, type Token } from '$lib/server/auth';
import { createSession } from '$lib/server/session';
import { logger } from '$lib/server/logger';
import { ObjectId, type Collection } from 'mongodb';

export const actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();

		// Create form object
		let input: LoginForm = {
			username: formData.get('username') as string,
			password: formData.get('password') as string
		};

		// Validate input data
		var clientValidation: Validation = validateLoginForm(input);

		if (!clientValidation.isValid) {
			logger.debug(`User ${input.username} login attempt failed`);
			return fail(422, { data: input, loginErrors: [{ text: 'Invalid input', type: 'input' }] });
		}

		var collection: Collection;
		// Connect to database
		try {
			collection = await Database.getCollection('users');
		} catch (error) {
			logger.error('Failed to connect to database:', error);
			return fail(500, { data: input, loginErrors: [{ text: 'Failed to connect to database', type: 'input' }] });
		}

		// Find user with same username
		var user: User | null = (await collection.findOne({ username: input.username })) as User | null;
		if (user == null) {
			logger.debug(`User ${input.username} does not exist`);
			return fail(422, { data: input, loginErrors: [{ text: 'User does not exist', type: 'input' }] });
		}

		// Check if password is correct
		var hash = crypto.pbkdf2Sync(input.password, user.salt, 1000, 64, 'sha512').toString('hex');

		if (hash != user.hash) {
			logger.debug(`User ${input.username} incorrect password`);
			input.password = '';
			return fail(422, { data: input, loginErrors: [{ text: 'Incorrect password', type: 'input' }] });
		}

		const TokenPayload: Token = {
			sub: user._id.toString()
		};

		// Return session token
		const token = createToken(TokenPayload);

		// Store session token in cookie
		createSession(cookies, token);

		logger.info(`User ${user.username}, email ${user.email}, userID ${user._id} logged in`);

		throw redirect(303, '/user');
	},
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
			input.password = '';
			input.passwordConfirm = '';
			return fail(422, { data: input, registerErrors: [{ text: 'Invalid input', type: 'input' }] });
		}

		logger.debug(`User ${input.username}, email ${input.email} input valid`);

		const collection: Collection = await Database.getCollection('users');

		// Check if user already exists
		if ((await collection.findOne({ $or: [{ username: input.username }, { email: input.email }] })) != null) {
			logger.debug(`User ${input.username}, email ${input.email} already exists`);
			input.password = '';
			input.passwordConfirm = '';
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
			input.password = '';
			input.passwordConfirm = '';
			return fail(422, { data: input, registerErrors: [{ text: 'Failed to insert user', type: 'input' }] });
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