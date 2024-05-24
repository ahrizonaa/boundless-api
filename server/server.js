const server = express();

import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
	noServer: true
});

import express from 'express';
import cors from 'cors';
import { mongoClient } from '../lib/client.js';

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
server.use('/', new IndexController(mongoClient, 'Mydeas'));
server.use('/apps', new AppsController(mongoClient, 'Mydeas'));
server.use('/features', new FeaturesController(mongoClient, 'Mydeas'));
server.use('/users', new UserController(mongoClient, 'Mydeas'));
server.use('/settings', new SettingsController(mongoClient, 'Mydeas'));
server.use('/timeline', new TimelineController(mongoClient, 'Mydeas'));
server.use('/twilio', new TwilioController(mongoClient, 'Mydeas'));
server.use('/perks', new PerksController(mongoClient, 'Mydeas'));
server.use('/jollof', new JollofController(mongoClient, 'Mydeas'));

server.use('/nimbelwear', new NimblewearController(mongoClient, 'NimbelWear'));

server.use('/google', new GoogleSignInController(mongoClient, 'Storage'));

server.use('/jollof', new JollofController(mongoClient, 'Jollof'));

wss.on('connection', async function (ws) {
	console.log('new wss conneciton established');
	ws.on('message', async function (msgStr) {
		let payload = JSON.parse(msgStr.toString());
		payload['utc'] = new Date(Date.now()).toISOString();
		payload['protocol'] = 'wss';

		try {
			await this.mongoClient
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
