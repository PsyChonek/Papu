import type { Actions } from './$types';
import type { RegisterForm } from './+page';
import { validateRegisterForm } from '$lib/validations/userValidation';

import { fail, redirect } from '@sveltejs/kit';

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

		var errors :string[] = [];

		console.log(input);

		// Validate input data
		errors = errors.concat(validateRegisterForm(input));

		if (errors.length > 0) {
			return fail(422, { errors: errors, data: input });
		}
		
		// Check if user already exists

		// Check if email is taken

		// Create user

		// Throw error if there are any
		if (errors.length > 0) {
			return fail(422, { errors: errors, data: input });
		}
		
		// Redirect to login page
		throw redirect(303, '/login');
	}
} satisfies Actions;
