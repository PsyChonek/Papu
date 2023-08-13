import type { PageLoad } from "./$types";

export const load = (async () => {
    return {};
}) satisfies PageLoad;
    
export interface RegisterForm {
    username: string;
    password: string;
    passwordConfirm: string;
    email: string;
}

export const prerender = false;
