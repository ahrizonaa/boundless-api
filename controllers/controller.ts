import { Router } from 'express';
import { Utils } from '../lib/utils.js';
import { twilioclient } from '../lib/twilioclient.js';
import { Logger } from '../lib/logger.js';
import { MongoClient } from 'mongodb';

class Controller {
	router: Router;
	mongoClient: MongoClient;
	utils: Utils;
	twilio: any;
	dbName: string;
	logger: Logger;

	constructor(mongoClient: MongoClient, dbName: string) {
		this.router = Router();
		this.mongoClient = mongoClient;
		this.dbName = dbName;
		this.utils = Utils;
		this.twilio = twilioclient;
		this.logger = new Logger(this.mongoClient, this.dbName);
	}
}

export { Controller };
