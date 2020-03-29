const ws = new WebSocket("ws://localhost:5000")
ws.onopen = () => {
    ws.send("from browser")
}

ws.onmessage =  (message) => {
    alert(message.data)
}
