import express, { Application, NextFunction } from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { mongoClient } from '../lib/mongoClient.js';
import {
	CommonController,
	NimblewearController,
	JollofController
} from '../controllers/index.js';

const server = express();

server.set('json spaces', 4);
server.use(cors());
server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ extended: true, limit: '50mb' }));
server.use(express.static('public'));

const wss: WebSocketServer = new WebSocketServer({
	noServer: true
});

const commonController = new CommonController();

const nimbelwearController = new NimblewearController();
const jollofController = new JollofController();

const nightowlController = null;

const domainToApp: any = {
	'boundless-api-ltlq6.ondigitalocean.app': 'index',
	'api.nimbelwear.app': 'NimbelWear',
	'localhost:8102': 'NimbelWear',
	'api.jolloftkn.com': 'Jollof',
	'localhost:8101': 'Jollof',
	'api.nocturne-app.com': 'NightOwl',
	'localhost:8103': 'NightOwl',
	'capacitor://localhost': 'NimbelWear'
};

server.use((req, res, next) => {
	let forwardedHost = req.headers['x-forwarded-host'];
	let host = req.get('host');

	console.log({ forwardedHost, host });

	const origin = req.headers.origin as string;
	const domain = origin
		.replace('https://', '')
		.replace('http://', '')
		.replace(/\/$/, '');
	const app: string = domainToApp[domain];
	req.query['application'] = app;

	console.log({ origin, domain, app });

	if (!app) {
		res
			.status(500)
			.send(
				'No app matched domain.  Are you running locally with correct port?'
			);
	}
	next();
});

server.use((req, res, next) => {
	if (!req.originalUrl.toLowerCase().includes('common')) {
		let app = req.query['application'] as string;
		let newurl = '/' + app.toLowerCase() + req.url;
		console.log('[url transform]', req.url + ' -> ' + newurl);
		req.url = newurl;
	}
	next();
});

server.use('/nimbelwear', nimbelwearController.router);
server.use('/jollof', jollofController.router);
server.use('/common', commonController.router as any);

server.use('/', (req, res) => {
	res.sendFile(process.cwd() + '/public/index.html');
});

server.use((req, res) => {
	res.status(404).send(`${req.originalUrl} not found`);
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

console.log('Server Ready');

export { server, wss };
