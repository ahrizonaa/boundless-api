import { Router } from 'express';
import { Utils } from '../lib/utils.js';
import { twilioclient } from '../lib/twilioclient.js';
import { imagekitclient } from '../lib/imagekitclient.js';
import { Logger } from '../lib/logger.js';

class Controller extends Router {
	mongoClient;
	utils;
	twilio;
	imagekitclient;
	dbName;

	constructor(mongoClient, dbName) {
		super();
		this.mongoClient = mongoClient;
		this.dbName = dbName;
		this.utils = Utils;
		this.twilio = twilioclient;
		this.imagekitclient = imagekitclient;
		this.logger = new Logger(this.mongoClient, this.dbName);
	}
}

export { Controller };
