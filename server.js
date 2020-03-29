const WebSocket = require('ws')
const wss = new WebSocket.Server({port : 3000})

process.stdin.resume()
wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        console.log(data)
    })
    ws.send("hello")
    process.stdin.on('data', (data) => {
        ws.send(data.toString())
    })
})

console.log("listening on port 3000")
