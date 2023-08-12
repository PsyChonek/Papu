import type { PageLoad } from './user/register/$types';

export const load = (async () => {
    return {};
}) satisfies PageLoad;

export interface Form {
    username: string;
    password: string;
    passwordConfirm: string;
    email: string;
    error?: string;
}