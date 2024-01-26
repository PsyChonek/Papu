import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ url, request }) => {
	console.log('POST', url.pathname, request);
	return new Response();
};
