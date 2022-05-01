import { MongoClient, ServerApiVersion } from "mongodb";

class Utils {
  static getClient() {
    // mongodb connection string
    const uri = process.env.MONGO_DB_CONNECTION_STRING;
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
    return client;
  }
}

export { Utils };
