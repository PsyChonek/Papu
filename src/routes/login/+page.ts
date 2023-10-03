import type { PageLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageLoad;

export interface LoginForm {
	username: string;
	password: string;
}

export const prerender = false;
