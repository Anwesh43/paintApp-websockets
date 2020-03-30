const WebSocket = require('ws')
const port = 5000
const wss = new WebSocket.Server({port})
const clients = []
wss.on('connection', (ws) => {
    clients.push(ws)
    ws.on('message', (data) => {
        try {
            const msg = JSON.parse(data)
            clients.filter(socket => socket !== ws).forEach((socket) => {
                console.log(msg)
                socket.send(data)
            })
        } catch(e) {
            console.log(e)
        }
    })
})
