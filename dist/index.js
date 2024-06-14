import { server, wss } from './server/server.js';
import { config } from 'dotenv';
import findConfig from 'find-config';
config({ path: findConfig('.env') });
// nodejs https cert validation bug fix, not currently applicable
// import https from 'https';
// https.globalAgent.options.rejectUnauthorized = false;
const port = Number(process.env.PORT) || 8080;
const httpServer = server.listen(port, () => {
    console.log(`Listening at port ${port}`);
});
httpServer.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (client) => {
        wss.emit('connection', client, request);
    });
});
