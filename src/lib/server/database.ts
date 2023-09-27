/*
    TODO: Common database interface ?? Maybe easy to switch to another database
    TODO: Add logger, middleware, and error handling
*/

import { env } from '$env/dynamic/private';
import { MongoClient } from 'mongodb';
import { logger } from './logger';

export class Database {
	public static Client(connectionString: string = env.CONNECTION_STRING) {
		logger.info(`Connecting to database at ${connectionString}`);

		const client = new MongoClient(connectionString);
		client.connect();
		return client;
	}

	public static Db(dbName: string = env.DB_NAME) {
		logger.info(`Getting database ${dbName}`);
		
		return Database.Client().db(dbName);
	}
}
