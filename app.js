import { server, wss } from './server/server.js';
import { config } from 'dotenv';
config();

// nodejs https cert validation bug fix, not currently applicable
// import https from 'https';
// https.globalAgent.options.rejectUnauthorized = false;

const port = process.env.port || 8080;

const httpServer = server.listen(port, () => {
	console.log(`http://localhost:${port}`);
});

httpServer.on('upgrade', (request, socket, head) => {
	wss.handleUpgrade(request, socket, head, (websocket) => {
		wss.emit('connection', websocket, request);
	});
});
