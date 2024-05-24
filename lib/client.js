import { Utils } from '../lib/utils.js';

const mongoClient = Utils.createMongoClient(
	process.env.MONGODB_CONNECTION_STRING
);

const connect = async (client) => {
	await client.connect();
};

await connect(mongoClient);

export { mongoClient };
