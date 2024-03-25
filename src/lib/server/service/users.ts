// Get user from database

import type { User } from "$lib/types/user";
import { Collection, ObjectId } from "mongodb";
import { Database } from "../database";

export const getUser = async (userId: string): Promise<User | null> => {
    const collection: Collection = await Database.getCollection('users');
    var user: User | null = (await collection.findOne({ _id: new ObjectId(userId) })) as User | null;
    return user;
};
