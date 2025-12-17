import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [room, setRoom] = useState<string>('');
    const [joined, setJoined] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const roomRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000');
        setSocket(ws);

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'chat') {
                    setMessages((prev) => [...prev, data.payload.message]);
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        ws.onerror = (err) => {
            console.error('WebSocket error:', err);
        };

        return () => {
            ws.close();
        };
    }, []);

    const joinRoom = () => {
        const roomId = roomRef.current?.value.trim();
        if (!roomId || !socket) return;

        socket.send(
            JSON.stringify({
                type: 'join',
                payload: { roomId },
            })
        );

        setRoom(roomId);
        setJoined(true);
    };

    const sendMessage = () => {
        if (!socket || !joined) return;
        const msg = inputRef.current?.value.trim();
        if (!msg) return;

        socket.send(
            JSON.stringify({
                type: 'chat',
                payload: { message: msg },
            })
        );

        inputRef.current.value = '';
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (!joined) {
                joinRoom();
            } else {
                sendMessage();
            }
        }
    };

    return (
        <>
            <h1>CHAT APPLICATION</h1>

            {!joined ? (
                <div>
                    <h2>Join a Room</h2>
                    <input
                        ref={roomRef}
                        type="text"
                        placeholder="Enter room ID..."
                        onKeyDown={handleKeyDown}
                    />
                    <button onClick={joinRoom}>Join</button>
                </div>
            ) : (
                <div>
                    <h2>Room: {room}</h2>
                    <div>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Type a message..."
                            onKeyDown={handleKeyDown}
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>

                    <div>
                        <h3>Messages</h3>
                        <ul>
                            {messages.map((msg, idx) => (
                                <li key={idx}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}

export default App;
