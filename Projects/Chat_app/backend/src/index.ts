import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8000 });

// Key: roomId, Value: Set of WebSockets
const rooms = new Map<string, Set<WebSocket>>();

wss.on('connection', (socket) => {
    let currentRoom: string | null = null;

    socket.on('message', (msg) => {
        try {
            const parsedMsg = JSON.parse(msg.toString());

            // --- JOIN LOGIC ---
            if (parsedMsg.type === 'join') {
                const roomId = parsedMsg.payload.roomId;
                currentRoom = roomId;

                if (!rooms.has(roomId)) {
                    rooms.set(roomId, new Set());
                }
                rooms.get(roomId)?.add(socket);
                console.log(`User joined room: ${roomId}`);
            }

            // --- CHAT LOGIC ---
            if (parsedMsg.type === 'chat' && currentRoom) {
                const messageData = JSON.stringify({
                    type: 'chat',
                    payload: { message: parsedMsg.payload.message },
                });

                // Only iterate through users in THIS specific room
                rooms.get(currentRoom)?.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(messageData);
                    }
                });
            }
        } catch (e) {
            console.error('Parse error');
        }
    });

    // --- CLEANUP ---
    socket.on('close', () => {
        if (currentRoom && rooms.has(currentRoom)) {
            rooms.get(currentRoom)?.delete(socket);

            // Delete the room if it's empty to save memory
            if (rooms.get(currentRoom)?.size === 0) {
                rooms.delete(currentRoom);
            }
        }
    });
});
