import { CONNECTION_STRING, DB_NAME } from '$env/static/private';
import { logger } from './logger';
import { Collection, MongoClient } from 'mongodb';

export class Database {
    private static clientInstance: MongoClient;

    public static async getClientInstance(connectionString: string = CONNECTION_STRING) {
        if (!Database.clientInstance) {
            logger.info(`Connecting to database at ${connectionString}`);
            try {
                const client = new MongoClient(connectionString);
                await client.connect();
                Database.clientInstance = client;
                logger.info('Connected to database');
            } catch (error) {
                logger.error('Failed to connect to the database:', error);
                throw error;
            }
        }
        return Database.clientInstance;
    }

    public static async getDb(dbName: string = DB_NAME) {
        try{
            const client = await Database.getClientInstance();
            return client.db(dbName);
        }
        catch(error){
            logger.error('Failed to get database:', error);
            throw error;
        }
    }

    public static async getCollection(collectionName: string, dbName: string = DB_NAME) {
        try{
            const db = await Database.getDb(dbName);
            return db.collection(collectionName);
        }
        catch(error){
            logger.error('Failed to get collection:', error);
            throw error;
        }
    }
}
