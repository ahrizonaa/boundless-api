import { Router } from "express";
import { Utils } from "../lib/utils.js";
import { config } from "dotenv";
import { twilioclient } from "../lib/twilioclient.js";

class Controller extends Router {
  constructor(client, db) {
    super();
    config();
    this.utils = Utils;
    this.client = client;
    this.db = db;
    this.twilio = twilioclient;
  }

  db;
  client;
  utils;
  twilio;
}

export { Controller };
