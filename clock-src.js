window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas-clock')
    const ctx = canvas.getContext('2d')

    const numberValues = ['1', '2', '3', '14', '4', '41', '42', '43', '15', '5', '51', '52']

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

    function degToRad(a) {
        return a * (Math.PI / 180)
    }

    function pct(percentage, total = radius) {
        return total / 100 * percentage
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
        let x = centerX + length * Math.cos(degToRad(deg - 90))
        let y = centerY + length * Math.sin(degToRad(deg - 90))

        let invertX = centerX + tailLength * Math.cos(degToRad(deg - 270))
        let invertY = centerY + tailLength * Math.sin(degToRad(deg - 270))

        // Draw Line
        ctx.strokeStyle = color
        ctx.lineWidth = width
        ctx.lineCap = 'round'

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
        ctx.stroke()

        ctx.strokeStyle = color
        ctx.lineWidth = pct(150, width)

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
            let deg = (360 / amount * i) - 90

            let x1 = centerX + position * Math.cos(degToRad(deg))
            let y1 = centerY + position * Math.sin(degToRad(deg))

            let x2 = centerX + (position - size) * Math.cos(degToRad(deg))
            let y2 = centerY + (position - size) * Math.sin(degToRad(deg))

            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()
        }

        ctx.lineWidth = oldWidth
        ctx.lineCap = 'butt' // default
    }

    function drawNumbers() {
        let fontSize = pct(10)

        ctx.font = fontSize + 'px ' + fontName
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'

        const position = pct(70)

        for (let i = 1; i <= 12; i++) {

            let deg = (360 / 12 * i) - 90

            let x = centerX + position * Math.cos(degToRad(deg))
            let y = centerY + position * Math.sin(degToRad(deg))

            ctx.lineWidth = 0.3
            ctx.fillText(numberValues[i - 1], x, y)
        }
    }

    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // dibujar circulo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI) // 2?? = 360??
        ctx.fill()

        // dibujar borde
        ctx.strokeStyle = 'darkRed'
        ctx.lineWidth = pct(2.1)
        ctx.beginPath()
        ctx.arc(centerX, centerY, pct(92), 0, 2 * Math.PI)
        ctx.stroke()

        // Dibujar manecillas
        let tailLength = pct(8)
        drawHand(360 / 60 * second, pct(65), pct(0.6), tailLength, 'white')
        drawHand(360 / 60 * minute, pct(50), pct(1),   tailLength, '#F5F5F5')
        drawHand(360 / 12 * hour,   pct(40), pct(1.4), tailLength, 'FFFAF0')

        // Dibujar punto central
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(centerX, centerY, pct(3), 0, 2 * Math.PI)
        ctx.fill()

        drawNumbers()
        drawLines(pct(90), pct(4), 60, pct(0.8), 'white')
        drawLines(pct(90), pct(8), 12, pct(1.6), 'white')
    }

    setTimeout(setInterval, 
        1000 - new Date().getMilliseconds(), 
        loop, 1000)
})
