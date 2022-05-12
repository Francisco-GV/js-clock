window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas-clock')
    const ctx = canvas.getContext('2d')

    const numberValues = ['1', '2', '3', '14', '4', '41', '42', '43', '15', '5', '51', '52'];

    const fontName = 'ancient-geek'

    const clockWidth = canvas.width
    const clockHeight = canvas.height

    const centerX = clockWidth / 2
    const centerY = clockHeight / 2

    const radius = clockWidth / 2

    let second
    let hour
    let minute

    function loop() {
        updateTime()
        draw()
    }

    function degreeToRadian(degree) {
        return degree * (Math.PI / 180)
    }

    function getPercent(total, percent) {
        return total / 100 * percent
    }

    function updateTime() {
        let currentDate = new Date()

        second = currentDate.getSeconds()
        hour = currentDate.getHours()
        minute = currentDate.getMinutes()
    }

    function drawHand(deg, length, width, tailLength, color) {
        // y = origin + radius * cos(a)
        // x = origin + radius * sin(a)

        // Se calcula el punto a partir de un circulo ficticio creado con un radio 'size'
        // Se restan 90 porque los radianes comienzan totalmente a la derecha del circulo 
        let x = centerX + length * Math.cos(degreeToRadian(deg - 90))
        let y = centerY + length * Math.sin(degreeToRadian(deg - 90))

        let invertX = centerX + tailLength * Math.cos(degreeToRadian(deg - 270))
        let invertY = centerY + tailLength * Math.sin(degreeToRadian(deg - 270))

        // Draw Line
        ctx.strokeStyle = color
        ctx.lineWidth = width
        ctx.lineCap = 'round'

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
        ctx.stroke()

        ctx.strokeStyle = color
        ctx.lineWidth = getPercent(width, 150)

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(invertX, invertY)
        ctx.stroke()

        ctx.lineCap = 'butt' // default
    }

    function drawLines(position, size, amount, width, color) {

        ctx.strokeStyle = color
        ctx.lineCap = 'square'
        let oldWidth = ctx.lineWidth

        ctx.lineWidth = width

        for (let i = 0; i < amount; i++) {
            let deg = 360 / amount * i;

            let x1 = centerX + position * Math.cos(degreeToRadian(deg - 90))
            let y1 = centerY + position * Math.sin(degreeToRadian(deg - 90))

            let x2 = centerX + (position - size) * Math.cos(degreeToRadian(deg - 90))
            let y2 = centerY + (position - size) * Math.sin(degreeToRadian(deg - 90))

            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()
        }

        ctx.lineWidth = oldWidth
        ctx.lineCap = 'butt' // default
    }

    function drawNumbers() {
        let fontSize = getPercent(radius, 10)

        ctx.font = fontSize + 'px ' + fontName
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'

        const position = getPercent(radius, 70)

        for (let i = 0; i < 12; i++) {

            let deg = 360 / 12 * i;

            let x = centerX + position * Math.cos(degreeToRadian(deg - 60))
            let y = centerY + position * Math.sin(degreeToRadian(deg - 60))

            ctx.lineWidth = 0.3
            ctx.fillText(numberValues[i], x, y)
        }
    }

    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // dibujar circulo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI) // 2π = 360°
        ctx.fill()

        // dibujar borde
        ctx.strokeStyle = 'darkRed'
        ctx.lineWidth = getPercent(radius, 2.1)
        ctx.beginPath()
        ctx.arc(centerX, centerY, getPercent(radius, 92), 0, 2 * Math.PI)
        ctx.stroke()

        // Dibujar manecillas
        let tailLength = getPercent(radius, 8)
        drawHand(360 / 60 * second, getPercent(radius, 65), getPercent(radius, 0.6), tailLength, 'white')
        drawHand(360 / 60 * minute, getPercent(radius, 50), getPercent(radius, 1),   tailLength, '#F5F5F5')
        drawHand(360 / 12 * hour,   getPercent(radius, 40), getPercent(radius, 1.4), tailLength, 'FFFAF0')

        // Dibujar punto central
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(centerX, centerY, getPercent(radius, 3), 0, 2 * Math.PI)
        ctx.fill()

        drawNumbers()
        drawLines(getPercent(radius, 90), getPercent(radius, 4), 60, getPercent(radius, 0.8), 'white')
        drawLines(getPercent(radius, 90), getPercent(radius, 8), 12, getPercent(radius, 1.6), 'white')
    }

    loop()
    setInterval(loop, 250)
})
