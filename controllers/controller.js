import { Router } from 'express';
import { Utils } from '../lib/utils.js';
import { config } from 'dotenv';
import { twilioclient } from '../lib/twilioclient.js';
import { imagekitclient } from '../lib/imagekitclient.js';

class Controller extends Router {
	constructor(client, db) {
		super();
		config();
		this.utils = Utils;
		this.client = client;
		this.db = db;
		this.twilio = twilioclient;
		this.imagekitclient = imagekitclient;
	}

	db;
	client;
	utils;
	twilio;
	imagekitclient;
}

export { Controller };
