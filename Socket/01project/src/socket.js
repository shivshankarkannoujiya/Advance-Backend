import { Server } from 'socket.io';


const setupSocket = (server) => {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log(`Socket Connected: ${socket.id}`);
        socket.on('message', (msg) => {
            // Broadcast to all clients (including sender) for now
            io.emit('server-broadcast-msg', msg);
        });
    });

    return io;
};

export { setupSocket };
