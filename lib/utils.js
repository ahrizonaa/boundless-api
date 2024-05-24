import { MongoClient, ServerApiVersion } from 'mongodb';

class Utils {
	static createMongoClient(connection_string) {
		const uri = connection_string;
		const client = new MongoClient(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverApi: ServerApiVersion.v1
		});
		return client;
	}
}

export { Utils };
