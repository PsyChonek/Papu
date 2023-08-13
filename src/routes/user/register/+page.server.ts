import type { Actions } from './$types';
import type { RegisterForm } from './+page';
import { validateRegisterForm } from '$lib/validations/userValidation';

import { fail, redirect } from '@sveltejs/kit';
import type { Validation } from '$lib/types/validation';

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
		
		// Check if user already exists

		// Check if email is taken

		// Create user

	
		// Redirect to login page
		throw redirect(303, '/login');
	}
} satisfies Actions;
