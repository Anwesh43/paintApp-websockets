const WebSocket = require('ws')
const ws = new WebSocket("ws://localhost:3000")

const keepSendingMessages = () => {
    let i = 0
    setInterval(() => {
        ws.send(`msg:${i}`)
        i++
    }, 1000)
}


ws.on('open', () => {
    console.log("connected")
})

ws.on('message', (data) => {
    console.log(data)
    if (data.trim().replace("\n", "") === "start") {
        keepSendingMessages()
    } else {
        ws.send("hola")
    }
})
