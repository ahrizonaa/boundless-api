import { MongoClient } from 'mongodb';
import { Utils } from './utils.js';
import { config } from 'dotenv';
import findConfig from 'find-config';

config({ path: findConfig('.env') as string });

const mongoClient: MongoClient = Utils.createMongoClient(
	process.env.MONGODB_CONNECTION_STRING as string
);

const connect = async (client: MongoClient) => {
	await client.connect();
};

await connect(mongoClient);

export { mongoClient };
