import { verifyToken } from '$lib/server/auth';
import { Database } from '$lib/server/database';
import { logger } from '$lib/server/logger';
import { RequestHandler } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export const DELETE: RequestHandler = async ({ url, request, cookies, route, params }) => {
	logger.debug('DELETE - Order->Delete - ' + url.pathname);
	const { slug } = params;

	// validate token
	const token = cookies.get('token');
	if (!token || !verifyToken(token)) {
		return new Response('Unauthorized', { status: 401 });
	}

	const orderId = slug;

	const collection = await Database.getCollection('orders');
	const order = await collection.findOne({ _id: new ObjectId(orderId) });

	if (!order) {
		return new Response('Order not found', { status: 404 });
	}

	await collection.updateOne({ _id: new ObjectId(orderId) }, { $set: { isDeleted: true } });

	return new Response('Order deleted', { status: 200 });
};
