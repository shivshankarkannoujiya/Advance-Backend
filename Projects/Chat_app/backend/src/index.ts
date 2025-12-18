import { WebSocketServer, WebSocket } from 'ws';
import { randomUUID } from 'crypto';

const wss = new WebSocketServer({ port: 8000 });

interface User {
    id: string;
    socket: WebSocket;
    room: string;
}

let users: User[] = [];

wss.on('connection', (socket) => {
    const userId = randomUUID();

    socket.on('message', (data) => {
        let message;

        try {
            message = JSON.parse(data.toString());
        } catch {
            console.error('Invalid JSON received');
            return;
        }

        // JOIN ROOM
        if (message.type === 'join') {
            const roomId = message.payload?.roomId;
            if (!roomId) return;

            users.push({ id: userId, socket, room: roomId });

            console.log(`User ${userId} joined room ${roomId}`);
        }

        // CHAT MESSAGE
        if (message.type === 'chat') {
            const text = message.payload?.message;
            if (!text) return;

            const sender = users.find((u) => u.id === userId);
            if (!sender) return;

            const outgoingMessage = JSON.stringify({
                type: 'chat',
                payload: {
                    message: text,
                    senderId: userId,
                    timestamp: Date.now(),
                },
            });

            users.forEach((user) => {
                if (
                    user.room === sender.room &&
                    user.id !== userId && // 🚫 no echo
                    user.socket.readyState === WebSocket.OPEN
                ) {
                    user.socket.send(outgoingMessage);
                }
            });
        }
    });

    socket.on('close', () => {
        users = users.filter((u) => u.id !== userId);
        console.log(`User ${userId} disconnected`);
    });
});

