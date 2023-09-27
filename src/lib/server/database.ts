/*
    TODO: Common database interface ?? Maybe easy to switch to another database
    TODO: Add logger, middleware, and error handling
*/

import { env } from '$env/dynamic/private'

import { Db, MongoClient } from 'mongodb';

export class Database {
	//  Store database connection as a singleton
	private static _client: MongoClient;

	public static get client(): MongoClient {
		if (!Database._client) {
			this.connect();
			if (!Database._client) {
				throw new Error('Database is not connected');
			}
		}

		return Database._client;
	}

	// Connect to database
	public static async connect(): Promise<void> {
        console.log(env.CONNECTION_STRING);   

		if (!env.CONNECTION_STRING) {
			throw new Error('CONNECTION_STRING is not defined');
		}

		const client = new MongoClient(env.CONNECTION_STRING);

		Database._client = client;

		await client.connect();

		console.log('Connected to database');
	}

	// Get default database
	public static  db(): Db {
		return Database.client.db(env.DB_NAME);
	}
}
