import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8000 });

interface User {
    socket: WebSocket;
    room: string;
}

let allSockets: User[] = [];

wss.on(`connection`, (socket) => {
    console.log(`SOCKET CONNECTED ....`);

    socket.on('message', (message) => {
        const strMessage = message.toString();
        const parsedMessage = JSON.parse(strMessage);

        if (parsedMessage.type === 'join') {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId,
            });
        }

        if (parsedMessage.type === 'chat') {
            const currentUserRoom = allSockets.find(
                (s) => (s.socket = socket)
            )?.room;

            allSockets.forEach((user) => {
                if (user.room === currentUserRoom) {
                    user.socket.send(parsedMessage.payload.message);
                }
            });
        }
    });

    socket.on('disconnect', () => {
        allSockets = allSockets.filter((s) => s.socket !== socket);
    });
    
});
