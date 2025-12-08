import http from 'http';
import app from './app.js';
import { setupSocket } from './socket.js';

const PORT = process.env.PORT ?? 3000;

const httpServer = http.createServer(app);
setupSocket(httpServer);

httpServer.listen(PORT, () => {
    console.log(`Server is listeing at PORT:${PORT}`);
});
