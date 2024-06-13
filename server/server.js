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

const hostControllerMap = {
	'boundless-api-ltlq6.ondigitalocean.app': defaultController,
	'api.nimbelwear.app': new NimblewearController(mongoClient, 'NimbelWear'),
	'api.jolloftkn.com': new JollofController(mongoClient, 'Jollof'),
	'api.nightowlvibes.app': null
};

server.set('json spaces', 4);
server.use(cors());
server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ extended: true, limit: '50mb' }));
server.use(express.static('public'));
server.use('/', defaultController);
server.use((req, res, next) => {
	const host = req.get('host');

	const controllerRouter = hostControllerMap[host] || defaultController;

	controllerRouter(req, res, next);
});
// server.use('/nimbelwear');
// server.use('/google', new GoogleSignInController(mongoClient, 'Storage'));
// server.use('/jollof', new JollofController(mongoClient, 'Jollof'));
// server.use('/core', new CoreController(mongoClient, 'Storage'));

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
