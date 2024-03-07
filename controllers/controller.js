import { Router } from 'express';
import { Utils } from '../lib/utils.js';
import { config } from 'dotenv';
import { twilioclient } from '../lib/twilioclient.js';
import { imagekitclient } from '../lib/imagekitclient.js';
import { Logger } from '../lib/logger.js';

class Controller extends Router {
	db;
	client;
	utils;
	twilio;
	imagekitclient;

	connectClient = async (client) => {
		await client.connect();
	};

	constructor(client, db) {
		super();
		config();
		this.utils = Utils;
		this.client = client;
		this.db = db;
		this.twilio = twilioclient;
		this.imagekitclient = imagekitclient;
		this.logger = new Logger(client, db);
		this.connectClient(this.client);
	}
}

export { Controller };
