const WebSocket = require('ws')
const port = 5000
const wss = new WebSocket.Server({port})
wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        console.log(data)
        ws.send("welcome!!!")
    })
})
