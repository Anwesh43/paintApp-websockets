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

    addPoint(x, y, cb) {
        points.push(new Point(x, y))
        cb()
    }

    draw(context) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / 90
        context.beginPath()
        points.forEach((point, index) => {
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
    touchHandler : TouchHandler = new TouchHandler()

    init() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
        this.wsHandler.addMessageHandler((msg) => {
            if (msg.type === "START") {
                const shape = new Shape()
                shape.addPoint(msg.x, msg.y)
                this.otherShapes.push(shape)
            } else {
                const shape = this.otherShapes[this.otherShapes.length - 1]
                shape.addPoint(x, y)
            }
        })
        this.touchHandler.handleDraw((x, y) => {
            const shape = new Shape()
            shape.addPoint(x, y)
            this.shapes.push(shape)
            const type = "START"
            this.wsHandler.send({x, y, type})
        }, () => {
            const shape = this.shapes[this.shapes.length - 1]
            shape.addPoint(x, y)
            const type = "MOVE"
            this.wsHandler.send({x, y, type})
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
    }
}

class WebsocketHandler {

    ws
    init() {
        this.ws = new WebSocket("http://localhost:5000")
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
        this.dom.onmousedown = (event) => {
            if (!this.down) {
                this.down = true
                const x = event.offsetX
                const y = event.offsetY
                downcb(x, y)
            }
        }

        this.dom.onmousemove = (event) => {
            if (this.down) {
                const x = event.offsetX
                const y = event.offsetY
                movecb(x, y)
            }
        }

        this.dom.onmouseup = () => {
            if (this.down) {
                this.down = false
            }
        }
    }
}
