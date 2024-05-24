export class Logger {
	mongoClient;
	dbName;
	constructor(mongoClient, dbName) {
		this.mongoClient = mongoClient;
		this.dbName = dbName;
	}

	async log(log) {
		return await this.mongoClient
			.db(this.dbName)
			.collection('Logs')
			.insertOne(log);
	}

	async info(log) {
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

	async debug(log) {
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

	async error(log) {
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
