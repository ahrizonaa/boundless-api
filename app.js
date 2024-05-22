import { config } from 'dotenv';
config();

import { server, wss } from './server/server.js';
const port = process.env.port || 8080;

const httpServer = server.listen(port, () => {
	console.log(`http://localhost:${port}`);
});

httpServer.on('upgrade', (request, socket, head) => {
	wss.handleUpgrade(request, socket, head, (websocket) => {
		wss.emit('connection', websocket, request);
	});
});
