import { Utils } from '../lib/utils.js';
import { config } from 'dotenv';
config();
const client = Utils.getClient(process.env.MONGO_DB_CONNECTION_STRING_MYDEAS);
const espclient = Utils.getClient(process.env.MONGO_DB_CONNECTION_STRING_ESP32);
const nimblewearClient = Utils.getClient(
	process.env.MONGO_DB_CONNECTION_STRING_NIMBLEWEAR
);
const googleClient = Utils.getClient(
	process.env.MONGO_DB_CONNECTION_STRING_GOOGLE
);

const jollofClient = Utils.getClient(
	process.env.MONGO_DB_CONNECTION_STRING_JOLLOF
);

const connect = async (pClient) => {
	await pClient.connect();
};

await connect(client);
await connect(espclient);
await connect(jollofClient);
const db = client.db('Mydeas');

export { client, db, espclient, nimblewearClient, googleClient, jollofClient };
