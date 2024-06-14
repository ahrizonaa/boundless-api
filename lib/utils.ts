import { MongoClient, MongoClientOptions, ServerApiVersion } from 'mongodb';

class Utils {
	static createMongoClient(connection_string: string) {
		const uri = connection_string;
		const options: MongoClientOptions = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverApi: ServerApiVersion.v1
		} as any;
		const client = new MongoClient(uri, options);
		return client;
	}
}

export { Utils };
