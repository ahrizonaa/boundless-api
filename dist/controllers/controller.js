import { Router } from 'express';
import { Utils } from '../lib/utils.js';
import { twilioclient } from '../lib/twilioclient.js';
import { Logger } from '../lib/logger.js';
class Controller {
    router;
    mongoClient;
    utils;
    twilio;
    dbName;
    logger;
    constructor(mongoClient, dbName) {
        this.router = Router();
        this.mongoClient = mongoClient;
        this.dbName = dbName;
        this.utils = Utils;
        this.twilio = twilioclient;
        this.logger = new Logger(this.mongoClient, this.dbName);
    }
}
export { Controller };
