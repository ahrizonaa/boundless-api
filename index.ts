import { IncomingMessage, Server } from 'http';
import { server, wss } from './server/server.js';
import internal from 'stream';
import WebSocket from 'ws';
import { config } from 'dotenv';
import findConfig from 'find-config';

config({ path: findConfig('.env') as string });

// nodejs https cert validation bug fix, not currently applicable
// import https from 'https';
// https.globalAgent.options.rejectUnauthorized = false;

const port: number = Number(process.env.PORT) || 8080;

const httpServer: Server = server.listen(port, () => {
	console.log(`Listening at port ${port}`);
});

httpServer.on(
	'upgrade',
	(request: IncomingMessage, socket: internal.Duplex, head: Buffer) => {
		wss.handleUpgrade(request, socket, head, (client: WebSocket) => {
			wss.emit('connection', client, request);
		});
	}
);
