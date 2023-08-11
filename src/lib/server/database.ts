/*
    TODO: Common database interface ?? Maybe easy to switch to another database
    TODO: Add logger, middleware, and error handling
*/

import { MongoClient } from "mongodb";

export class Database {
    //  Store database connection as a singleton
    private static _client: MongoClient;

    // Connect to database

    public static async connect(): Promise<void> {
        const uri = process.env.CONNECTION_STRING;
        if (!uri) {
            throw new Error('CONNECTION_STRING is not defined');
        }

        const client = new MongoClient(uri);

        Database._client = client;

        await client.connect();

        console.log('Connected to database');
    }
}