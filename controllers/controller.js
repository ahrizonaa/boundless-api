import { Router } from 'express';
import { Utils } from '../lib/utils.js';
import { twilioclient } from '../lib/twilioclient.js';
import { imagekitclient } from '../lib/imagekitclient.js';
import { Logger } from '../lib/logger.js';

class Controller extends Router {
	mongoClient;
	db;
	utils;
	twilio;
	imagekitclient;

	constructor(mongoClient, dbName) {
		super();
		this.mongoClient = mongoClient;
		this.db = this.mongoClient.db(dbName);
		this.utils = Utils;
		this.twilio = twilioclient;
		this.imagekitclient = imagekitclient;
		this.logger = new Logger(this.db);
	}
}

export { Controller };
