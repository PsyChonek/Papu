import type { Actions } from './$types';
import type { LoginForm } from './+page';
import { validateLoginForm } from '$lib/validations/userValidation';

import { fail, redirect } from '@sveltejs/kit';
import type { Validation } from '$lib/types/validation';

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

        // TODO: Login user

		// Redirect to login page
		throw redirect(303, '/');
	}
} satisfies Actions;
