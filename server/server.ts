import express, { Application, NextFunction } from 'express';
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

const indexController = new IndexController(
	mongoClient,
	''
) as unknown as Application;

const nimbelwearController: Application = new NimblewearController(
	mongoClient,
	'NimbelWear'
) as unknown as Application;
const jollofController: Application = new JollofController(
	mongoClient,
	'Jollof'
) as unknown as Application;

const nightowlController = null as unknown as Application;

const domainToApp: any = {
	'boundless-api-ltlq6.ondigitalocean.app': 'index',
	'api.nimbelwear.app': 'NimbelWear',
	'localhost:8102': 'NimbelWear',
	'api.jolloftkn.com': 'Jollof',
	'localhost:8101': 'Jollof',
	'api.nocturne-app.com': 'NightOwl',
	'localhost:8103': 'NightOwl'
};

const appToController: any = {
	index: indexController,
	NimbelWear: nimbelwearController,
	Jollof: jollofController,
	NightOwl: nightowlController
};

const commonRoutes: string[] = [
	'/finduser',
	'/signup',
	'/updateprofile',
	'/uploadphoto',
	'/unlinksocial'
];

server.set('json spaces', 4);
server.use(cors());
server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ extended: true, limit: '50mb' }));
server.use(express.static('public'));
server.use((req, res, next) => {
	let controller;
	const origin = req.headers.origin as string;
	const domain = origin
		.replace('https://', '')
		.replace('http://', '')
		.replace(/\/$/, '');
	const app = domainToApp[domain];
	req.query['application'] = app;


	if (commonRoutes.includes(req.originalUrl.toLowerCase())) {
		controller = indexController;
		console.log(
			`request [${req.originalUrl} ${req.method}] routing to Index controller`
		);
	} else {
		controller = appToController[domain] || indexController;
		console.log(
			`request [${req.originalUrl} ${req.method}] routing to ${domainToApp[domain]} controller`
		);
	}


	let router = controller.router as express.Router;
	router(req, res, next);
});
server.use('/', indexController.router as any);

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

console.log('Server Ready')

export { server, wss };
