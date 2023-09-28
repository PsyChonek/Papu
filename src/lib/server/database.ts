import { env } from '$env/dynamic/private';
import { logger } from './logger';
import { MongoClient } from 'mongodb';

export class Database {
    private static clientInstance: MongoClient;

    public static getClientInstance(connectionString: string = env.CONNECTION_STRING): any {

        console.log("Connecting");

        if (!Database.clientInstance) {
            logger.info(`Connecting to database at ${connectionString}`);
            try {
                const client = new MongoClient(connectionString);
                client.connect();
                Database.clientInstance = client;
            } catch (error) {
                logger.error('Failed to connect to the database:', error);
                throw error;
            }
        }
        return Database.clientInstance;
    }

    public static getDb(dbName: string = env.DB_NAME) {
        logger.info(`Getting database ${dbName}`);
        const client = Database.getClientInstance();
        return client.db(dbName);
    }
}
