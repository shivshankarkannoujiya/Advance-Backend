import { app, appState } from './app.js';
import http from 'http';
import { createSocket } from './socket.js';

const PORT = process.env.PORT ?? 3000;
const httpServer = http.createServer(app);
createSocket(httpServer, appState);

httpServer.listen(PORT, () => {
    console.log(`Server is listening at PORT:${PORT}`);
});
