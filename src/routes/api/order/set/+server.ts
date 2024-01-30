import { verifyToken } from '$lib/server/auth';
import { Database } from '$lib/server/database';
import { logger } from '$lib/server/logger';
import type { Order } from '$lib/types/order';
import type { RequestHandler } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export const POST: RequestHandler = async ({ request, url }) => {
	logger.debug('POST - Order->Set', url.pathname);


	// Parse the request body as JSON
	const body = JSON.parse(await request.text()) as Order[];

	const collection = await Database.getCollection('orders');

	// Update or insert the order
	for (const order of body) {
		order._id = new ObjectId(order._id);


		if (!ObjectId.isValid(order._id)) {
			order._id = new ObjectId();
		}

		for (const participant of order.participants) {
			if (!ObjectId.isValid(participant._id)) {
				participant._id = new ObjectId();
			}

			for (const item of participant.items) {
				if (!ObjectId.isValid(item._id)) {
					item._id = new ObjectId();
				}
			}
		}

		await collection.updateOne({ _id: order._id },  { $set: order },{ upsert: true });
	}

	// Return a 200 OK and body
	return new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
