import { Router } from 'express';
import { Utils } from '../lib/utils.js';
import { config } from 'dotenv';

class Controller extends Router {
	constructor(client, db) {
		super();
		config();
		this.utils = Utils;
		this.client = client;
		this.db = db;
	}

	db;
	client;
	utils;
}

export { Controller };
