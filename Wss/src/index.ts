import { WebSocketServer } from "ws";

const wss = new WebSocketServer({port: 8000})

// EG: Event handler
// wss.on("connection", function (socket) {
//     console.log(`User connected !!`, socket)
//     socket.send("Hello Ji")
// })

// TODO: Every 5 second send the current price of `sol` to `client`
// NOTE: SERVER => <sending msg> => CLIENT
wss.on("connection", function (socket) {


    console.log(`User connected successfully !!`)
    setInterval(() => {
        socket.send(`Current price of sol is: ${Math.random()}`)
    }, 500)


    // TODO: Handle `current<socket>: client` send msg to Server
    socket.on("message", function (e) {
        
        // console.log(e)
        // NOTE: e: <Buffer msg comming>
        // TODO: Convert into string
        const strMessage = e.toString()
        console.log(strMessage)
    })

})

