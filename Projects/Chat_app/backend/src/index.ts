import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8000 });

interface User {
    socket: WebSocket;
    room: string;
}

let allSockets: User[] = [];

wss.on(`connection`, (socket) => {
    
    socket.on('message', (message) => {
        let parsedMessage;

        try {
            parsedMessage = JSON.parse(message.toString());
        } catch {
            console.error('Invalid JSON');
            return;
        }

        if (parsedMessage.type === 'join') {
            const roomId = parsedMessage.payload?.roomId;
            if (!roomId) return;

            console.log(`User joined room: ${roomId}`);

            const existingUser = allSockets.find((s) => s.socket === socket);

            if (existingUser) {
                existingUser.room = roomId;
            } else {
                allSockets.push({ socket, room: roomId });
            }
        }

        if (parsedMessage.type === 'chat') {
            const messageText = parsedMessage.payload?.message;
            if (!messageText) return;

            const currentUserRoom = allSockets.find(
                (s) => s.socket === socket
            )?.room;

            if (!currentUserRoom) return;

            allSockets.forEach((user) => {
                if (user.room === currentUserRoom) {
                    user.socket.send(messageText);
                }
            });
        }
    });

    socket.on('close', () => {
        allSockets = allSockets.filter((s) => s.socket !== socket);
        console.log('User disconnected');
    });
});
