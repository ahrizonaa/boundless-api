import { MongoClient, ServerApiVersion } from 'mongodb';
class Utils {
    static createMongoClient(connection_string) {
        const uri = connection_string;
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverApi: ServerApiVersion.v1
        };
        const client = new MongoClient(uri, options);
        return client;
    }
}
export { Utils };
