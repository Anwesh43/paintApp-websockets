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
