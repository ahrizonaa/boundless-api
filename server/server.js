import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { mongoClient } from '../lib/mongoClient.js';
import {
	IndexController,
	NimblewearController,
	GoogleSignInController,
	JollofController,
	CoreController
} from '../controllers/index.js';

const server = express();

const wss = new WebSocketServer({
	noServer: true
});

const defaultController = new IndexController(mongoClient, 'Mydeas');
const nimbelwearController = new NimblewearController(
	mongoClient,
	'NimbelWear'
);
const jollofController = new JollofController(mongoClient, 'Jollof');

const hostControllerMap = {
	'boundless-api-ltlq6.ondigitalocean.app': jollofController,
	'api.nimbelwear.app': nimbelwearController,
	'api.jolloftkn.com': jollofController,
	'api.nightowlvibes.app': null
};

server.set('json spaces', 4);
server.use(cors());
server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ extended: true, limit: '50mb' }));
server.use(express.static('public'));
// server.use('/', defaultController);
server.use((req, res, next) => {
	const host = req.get('host');

	const controller = hostControllerMap[host] || defaultController;

	controller(req, res, next);
});

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
