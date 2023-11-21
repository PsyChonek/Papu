import { Database } from "$lib/server/database";
import type { Order } from "$lib/types/order";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({request, url}) => {
    // Parse the request body as JSON
    const body = JSON.parse(await request.text()) as Order[];

    const collection = await Database.getCollection('orders');

    // Update or insert the order
    for (const order of body) {
        await collection.updateOne(
            { _id: order._id},
            { $set: order },
            { upsert: true }
        );
    }

    return new Response();
};