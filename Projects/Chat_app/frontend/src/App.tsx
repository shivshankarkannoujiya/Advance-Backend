import { useEffect, useRef, useState } from 'react';

type Message = {
    text: string;
    sender: 'me' | 'server';
};

const ROOM_ID = 'room-1';

const App = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    const wsRef = useRef<WebSocket | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000');
        wsRef.current = ws;

        ws.onopen = () => {
            ws.send(
                JSON.stringify({
                    type: 'join',
                    payload: { roomId: ROOM_ID },
                })
            );
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            setMessages((prev) => [
                ...prev,
                {
                    text: data.payload.message,
                    sender: 'server',
                },
            ]);
        };

        return () => ws.close();
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim() || !wsRef.current) return;

        wsRef.current.send(
            JSON.stringify({
                type: 'chat',
                payload: { message: input },
            })
        );

        setMessages((prev) => [...prev, { text: input, sender: 'me' }]);
        setInput('');
    };

    return (
        <div className="h-screen bg-slate-900 flex flex-col text-gray-200">
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto flex justify-center">
                <div className="w-full max-w-4xl px-4 py-6 space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`px-4 py-3 rounded-2xl max-w-[75%] shadow-sm
                                ${
                                    msg.sender === 'me'
                                        ? 'bg-indigo-500 text-white ml-auto'
                                        : 'bg-slate-800 text-gray-200'
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Input */}
            <div className="border-t border-slate-800 bg-slate-950">
                <div className="max-w-4xl mx-auto px-4 py-3 flex gap-3">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-800 rounded-full px-4 py-3
                                   text-gray-200 placeholder-gray-400
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-indigo-500 hover:bg-indigo-600
                                   text-white px-6 py-3 rounded-full
                                   active:scale-95 transition shadow"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
