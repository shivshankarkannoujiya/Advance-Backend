import { WebSocketServer } from "ws";


const wss = new WebSocketServer({port: 8000})

wss.on(`connection`, function (socket) {
    console.log(`USER CONNECTED SUCCESSFULLY...`)

    socket.on(`message`, function (e) {
        if (e.toString() === "ping") {
            socket.send("pong")
        }
    })
})
