import type { Actions } from './$types';
import type { RegisterForm } from './+page';

import { fail } from '@sveltejs/kit';

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

		// Check if password and passwordConfirm match
		if (input.password !== input.passwordConfirm) {
            input.password = '';
            input.passwordConfirm = '';
            return fail(422, { error: 'Passwords do not match', data: input });
		}

		// Check if username is taken

		// Check if email is taken

		// Create user

		// Redirect to login page
	}
} satisfies Actions;
