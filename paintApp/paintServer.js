const WebSocket = require('ws')
const port = 5000
const wss = new WebSocket.Server({port})
wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        try {
            const msg = JSON.parse(data)
            ws.clients.forEach((socket) => {
                if (socket != ws) {
                    socket.send(JSON.stringify(msg))
                }
            })
        } catch(e) {

        }
    })
})
