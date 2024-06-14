import { MongoClient } from "mongodb";

export class Logger {
	mongoClient;
	dbName;
	constructor(mongoClient: MongoClient, dbName: string) {
		this.mongoClient = mongoClient;
		this.dbName = dbName;
	}

	async log(log: any) {
		return await this.mongoClient
			.db(this.dbName)
			.collection('Logs')
			.insertOne(log);
	}

	async info(log: any) {
		log = {
			...log,
			type: 'info',
			serverDatetime: new Date().toISOString()
		};
		return await this.mongoClient
			.db(this.dbName)
			.collection('Logs')
			.insertOne(log);
	}

	async debug(log: any) {
		log = {
			...log,
			type: 'debug',
			serverDatetime: new Date().toISOString()
		};
		return await this.mongoClient
			.db(this.dbName)
			.collection('Logs')
			.insertOne(log);
	}

	async error(log: any) {
		log = {
			...log,
			type: 'error',
			serverDatetime: new Date().toISOString()
		};
		return await this.mongoClient
			.db(this.dbName)
			.collection('Logs')
			.insertOne(log);
	}
}
