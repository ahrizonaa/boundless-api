import express, { Application } from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { mongoClient } from '../lib/mongoClient.js';
import {
	IndexController,
	NimblewearController,
	JollofController
} from '../controllers/index.js';

const server = express();

const wss: WebSocketServer = new WebSocketServer({
	noServer: true
});

const defaultController: Application = new IndexController(mongoClient, 'Mydeas') as unknown as Application

const nimbelwearController: Application = new NimblewearController(
	mongoClient,
	'NimbelWear'
) as unknown as Application
const jollofController: Application = new JollofController(mongoClient, 'Jollof') as unknown as Application

const hostControllerMap: any = {
	'boundless-api-ltlq6.ondigitalocean.app': defaultController,
	'api.nimbelwear.app': nimbelwearController,
	'api.jolloftkn.com': jollofController,
	'api.nightowlvibes.app': null as unknown as Application
};

server.set('json spaces', 4);
server.use(cors());
server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ extended: true, limit: '50mb' }));
server.use(express.static('public'));
server.use('/', defaultController.router as any);
server.use((req, res, next) => {
	const host = req.get('host') as string;

	const controller = hostControllerMap[host] || defaultController;

	controller.router(req, res, next);
});

wss.on('connection', async function (ws) {
	console.log('new wss conneciton established');
	ws.on('message', async function (msgStr) {
		let payload = JSON.parse(msgStr.toString());
		payload['utc'] = new Date(Date.now()).toISOString();
		payload['protocol'] = 'wss';

		try {
			await mongoClient
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
