/*
    TODO: Common database interface ?? Maybe easy to switch to another database
    TODO: Add logger, middleware, and error handling
*/

import { env } from '$env/dynamic/private'
import { Mongoose } from 'mongoose';
export class Database {
	
	public static Client(){
		if (!env.CONNECTION_STRING) throw new Error('MONGO_URI is not defined');

		const client = new Mongoose();
		client.connect(env.CONNECTION_STRING).then(() => {
			console.log('Database connected');
		}
		).catch((err) => {
			console.log(err);
		}
		);
		return client;
	}

	public static Db(dbName:string = env.DB_NAME)
	{
		return Database.Client().connection.useDb(dbName);	
	}
}
