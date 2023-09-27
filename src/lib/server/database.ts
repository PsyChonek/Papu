import { env } from '$env/dynamic/private';
import { logger } from './logger';
import { MongoClient } from 'mongodb';

export class Database {
    private static clientInstance: MongoClient;

    public static async getClientInstance(connectionString: string = env.CONNECTION_STRING): Promise<MongoClient> {
        if (!Database.clientInstance) {
            logger.info(`Connecting to database at ${connectionString}`);
            try {
                const client = new MongoClient(connectionString);
                await client.connect();
                Database.clientInstance = client;
            } catch (error) {
                logger.error('Failed to connect to the database:', error);
                throw error;
            }
        }
        return Database.clientInstance;
    }

    public static async getDb(dbName: string = env.DB_NAME) {
        logger.info(`Getting database ${dbName}`);
        const client = await Database.getClientInstance();
        return client.db(dbName);
    }
}
