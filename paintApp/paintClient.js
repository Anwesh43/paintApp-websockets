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
    init() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
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
