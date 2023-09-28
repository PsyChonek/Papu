import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import type { RegisterForm } from './+page';
import type { Validation } from '$lib/types/validation';
import { validateRegisterForm } from '$lib/validations/userValidation';
import { Database } from '$lib/server/database';
import crypto from 'crypto';
import type { User } from '$lib/types/user';
import { Collection, ObjectId } from 'mongodb';

export const actions = {
	register: async ({ request }) => {
		const formData = await request.formData();

		console.log(formData.get('username'));

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
			return fail(422, { data: input, errors: [{text: 'Invalid input', type: 'input'}]});
		}

		console.log('Validated');

		// Connect to database
		const collection: Collection = Database.getDb().collection('users');
		
		// Check if user already exists
		if(await collection.findOne({$or:[{username:input.username},{email:input.email}]}) != null) {
			return fail(422, { data: input, errors: [{text: 'User already exists', type: 'input'}] });
		}

		console.log('User does not exist');

		// Hash password
		var salt = (crypto as any).randomBytes(16).toString('hex');
		var hash = crypto.pbkdf2Sync(input.password, salt, 1000, 64, 'sha512').toString('hex');

		var user : User = {
			username: input.username,
			email: input.email,
			salt: salt,
			hash: hash,
			_id: new ObjectId()
		};

		console.log('Hashed password');

		// Insert user into database check if user inserted
		const result = await collection.insertOne(user)
		if (result.insertedId == null) {
			return fail(422, { data: input, errors: [{text: 'Failed to insert user', type: 'input'}] });
		}

		console.log('Inserted user');

		// Redirect to login page
		throw redirect(303, '/user/login');
	}
} satisfies Actions;
