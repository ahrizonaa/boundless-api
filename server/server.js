const server = express();

import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import expressJWT from 'express-jwt';
import { client, db } from '../lib/client.js';

import {
	IndexController,
	AppsController,
	FeaturesController,
	UserController,
	SettingsController,
	TimelineController,
	TwilioController,
	PerksController,
} from '../controllers/index.js';

server.set('json spaces', 4);
server.use(cors());
server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ extended: true, limit: '50mb' }));
server.use(express.static('public'));

server.use('/', new IndexController(client, db));
server.use('/apps', new AppsController(client, db));
server.use('/features', new FeaturesController(client, db));
server.use('/users', new UserController(client, db));
server.use('/settings', new SettingsController(client, db));
server.use('/timeline', new TimelineController(client, db));
server.use('/twilio', new TwilioController(client, db));
server.use('/perks', new PerksController(client, db));

export { server };
