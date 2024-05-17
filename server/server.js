const server = express();

import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
	noServer: true
});

import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import {
	client,
	db,
	espclient,
	nimblewearClient,
	googleClient,
	jollofClient
} from '../lib/client.js';

import {
	IndexController,
	AppsController,
	FeaturesController,
	UserController,
	SettingsController,
	TimelineController,
	TwilioController,
	PerksController,
	NimblewearController,
	GoogleSignInController,
	JollofController
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
server.use('/jollof', new JollofController(client, db));

server.use(
	'/nimbelwear',
	new NimblewearController(nimblewearClient, nimblewearClient.db('NimbelWear'))
);

server.use(
	'/google',
	new GoogleSignInController(googleClient, googleClient.db('Storage'))
);

server.use(
	'/google',
	new JollofController(jollofClient, jollofClient.db('Jollof'))
);

wss.on('connection', async function (ws) {
	console.log('new conneciton established');
	ws.on('message', async function (msgStr) {
		let payload = JSON.parse(msgStr.toString());
		payload['utc'] = new Date(Date.now()).toISOString();
		payload['protocol'] = 'wss';

		try {
			await espclient
				.db('ESP32SensorData')
				.collection('WebSocketDataFeed')
				.insertOne(payload);
		} catch (e) {
			console.log(e);
		}
	});

	ws.on('close', function () {
		console.log('closing client connection');
	});
});

export { server, wss };
