export class Logger {
	mongoClient = null;
	db = null;
	constructor(client, db) {
		this.client = client;
		this.db = db;
	}

	log(log) {
		this.db.collection('Logs').insertOne(log);
	}

	info(log) {
		log = {
			...log,
			type: 'info',
			serverDatetime: new Date().toISOString()
		};
		this.db.collection('Logs').insertOne(log);
	}

	debug(log) {
		log = {
			...log,
			type: 'debug',
			serverDatetime: new Date().toISOString()
		};
		this.db.collection('Logs').insertOne(log);
	}

	error(log) {
		log = {
			...log,
			type: 'error',
			serverDatetime: new Date().toISOString()
		};
		this.db.collection('Logs').insertOne(log);
	}
}
