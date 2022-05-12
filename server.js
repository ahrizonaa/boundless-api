import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import expressJWT from 'express-jwt';
import { client, db } from './lib/client.js';

import {
	IndexController,
	AppsController,
	FeaturesController,
	AuthController,
	SettingsController,
	TimelineController,
} from './controllers/index.js';

// express restful app
const app = express();

if (false) {
	const liveReloadServer = livereload.createServer();
	liveReloadServer.server.once('connection', () => {
		setTimeout(() => {
			liveReloadServer.refresh('/');
		}, 100);
	});
	app.use(connectLiveReload());
}

app.set('json spaces', 4);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/', new IndexController(client, db));
app.use('/apps', new AppsController(client, db));
app.use('/features', new FeaturesController(client, db));
app.use('/auth', new AuthController(client, db));
app.use('/settings', new SettingsController(client, db));
app.use('/timeline', new TimelineController(client, db));

const port = process.env.port || 8080;
app.listen(port, () => {
	console.log(`http://localhost:${port}`);
});
