// Load orders from database

import type { Order } from '$lib/types/order';
import { Collection, ObjectId } from 'mongodb';
import { Database } from '../database';

export const loadOrderUser = async (userId: string): Promise<Order[]> => {
	const collection: Collection = await Database.getCollection('orders');

	// Filter out orders in state isDeleted=true

	const orders: Order[] | null = (await collection.find({ ownerID: new ObjectId(userId), isDeleted: false }).toArray()) as Order[];
	return orders ?? [];
};
