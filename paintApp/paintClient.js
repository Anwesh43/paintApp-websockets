const w = window.innerWidth
const h = window.innerHeight

class Point {

    x
    y
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class Shape {

    points = []

    addPoint(x, y) {
        this.points.push(new Point(x, y))
    }

    draw(context) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / 90
        context.beginPath()
        this.points.forEach((point, index) => {
            if (index == 0) {
                context.moveTo(point.x, point.y)
            } else {
                context.lineTo(point.x, point.y)
            }
        })
        context.stroke()
    }
}

class Stage {

    canvas = document.createElement('canvas')
    context
    shapes = []
    otherShapes = []
    wsHandler = new WebsocketHandler()
    touchHandler = new TouchHandler(this.canvas)

    init() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
        this.wsHandler.init()
        this.wsHandler.addMessageHandler((msg) => {
            if (msg.type === "START") {
                const shape = new Shape()
                shape.addPoint(msg.x, msg.y)
                this.otherShapes.push(shape)
            } else {
                const shape = this.otherShapes[this.otherShapes.length - 1]
                shape.addPoint(msg.x, msg.y)
            }
        })
        this.touchHandler.handleDraw((x, y) => {
            const shape = new Shape()
            shape.addPoint(x, y)
            this.shapes.push(shape)
            const type = "START"
            this.wsHandler.send({x, y, type})
        }, (x, y) => {
            const shape = this.shapes[this.shapes.length - 1]
            shape.addPoint(x, y)
            const type = "MOVE"
            this.wsHandler.send({x, y, type})
        })
        Loop.start(() => {
            this.render()
        })
    }

    render() {
        this.context.strokeStyle = '#4CAF50'
        this.shapes.forEach((shape) => {
            shape.draw(this.context)
        })
        this.context.strokeStyle = '#F44336'
        this.otherShapes.forEach((shape) => {
            shape.draw(this.context)
        })
    }

    handleTap() {
        this.canvas.onmousedown = (event) => {
            const x = event.offsetX
            const y = event.offsetY

        }
    }

    static create() {
        const stage = new Stage()
        stage.init()
        stage.render()
        stage.handleTap()
        return stage
    }
}

class WebsocketHandler {

    ws
    init() {
        this.ws = new WebSocket("ws://192.168.0.152:5000")
    }

    addMessageHandler(cb) {
        this.ws.onmessage = (msg) => {
            const data = msg.data
            try {
                const json = JSON.parse(data)
                cb(json)
            } catch(e) {

            }
        }
    }

    send(msg) {
        this.ws.send(JSON.stringify(msg))
    }
}

class TouchHandler {

    dom
    down = false
    constructor(dom) {
        this.dom = dom
    }

    handleDraw(downcb, movecb) {
        console.log(this.dom)
        window.onmousedown = (event) => {
            console.log("down")
            if (!this.down) {

                const x = event.offsetX
                const y = event.offsetY
                downcb(x, y)
                this.down = true
            }
        }

        window.onmousemove = (event) => {
            if (this.down) {
                const x = event.offsetX
                const y = event.offsetY
                movecb(x, y)
            }
        }

        window.onmouseup = () => {
            if (this.down) {
                this.down = false
            }
        }
    }
}

class Loop {

    static start(cb) {
        this.interval = setInterval(() => {
            cb()
        })
    }
}
