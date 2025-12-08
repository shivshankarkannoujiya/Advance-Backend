import { Server } from 'socket.io';

const createSocket = (server, state) => {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log(`Socket Connected: ${socket.id}`);

        // Send current state to the newly connected client
        socket.emit('sync-state', state);

        socket.on('checkbox-update', (data) => {
            state[data.index] = data.value;
            // Broadcast to all clients (including sender)
            io.emit('checkbox-update', data);
        });
    });

    return io;
};

export { createSocket };
