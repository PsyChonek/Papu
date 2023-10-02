import { env } from '$env/dynamic/private';
import { logger } from './logger';
import { MongoClient } from 'mongodb';

export class Database {
    private static clientInstance: MongoClient;

    public static getClientInstance(connectionString: string = env.CONNECTION_STRING): any {
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
        try{
            const client = Database.getClientInstance();
            return client.db(dbName);
        }
        catch(error){
            logger.error('Failed to get database:', error);
            throw error;
        }
    }
}
