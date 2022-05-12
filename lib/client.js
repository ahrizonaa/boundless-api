import { Utils } from '../lib/utils.js';
import { config } from 'dotenv';
config();
const client = Utils.getClient();

const connect = async () => {
	await client.connect();
};

await connect();
let db = client.db('IdeaCollab');

export { client, db };
