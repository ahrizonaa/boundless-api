import { MongoClient, ServerApiVersion } from 'mongodb';

class Utils {
    static getClient() {
        // mongodb connection string
        const uri = "mongodb+srv://lily:fuckmedaddy@girlcode-db-cluster.1pkaf.mongodb.net/GirlCode?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        return client;
    }
}



export { Utils }