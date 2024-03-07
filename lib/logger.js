export class Logger {
	mongoClient = null;
	db = null;
	constructor(client, db) {
		this.client = client;
		this.db = db;
	}

	async log(log) {
		return await this.db.collection('Logs').insertOne(log);
	}

	async info(log) {
		log = {
			...log,
			type: 'info',
			serverDatetime: new Date().toISOString()
		};
		return await this.db.collection('Logs').insertOne(log);
	}

	async debug(log) {
		log = {
			...log,
			type: 'debug',
			serverDatetime: new Date().toISOString()
		};
		return await this.db.collection('Logs').insertOne(log);
	}

	async error(log) {
		log = {
			...log,
			type: 'error',
			serverDatetime: new Date().toISOString()
		};
		return await this.db.collection('Logs').insertOne(log);
	}
}
