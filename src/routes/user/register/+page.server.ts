import type { PageServerLoad, Actions } from './$types';
import type { Form } from './+page';

import { fail } from '@sveltejs/kit';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	register: async ({request}) => {
        const formData = await request.formData();

        // Create form object
        let form: Form = {
            username: formData.get('username') as string,
            password: formData.get('password') as string,
            passwordConfirm: formData.get('passwordConfirm') as string,
            email: formData.get('email') as string,
        };

		// Check if password and passwordConfirm match
        if (form.password !== form.passwordConfirm) {
            return fail(400, {passwordConfirm: 'Passwords do not match'});
        }

        // Check if username is taken

        // Check if email is taken

        // Create user

        // Redirect to login page
	}
} satisfies Actions;
