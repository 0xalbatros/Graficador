export default class Grafica {
    constructor(id, escala) {
        this.ctx = document.getElementById(id).getContext("2d")
        this.width = document.getElementById(id).width
        this.height = document.getElementById(id).height
        this.posX = 1
        this.posY = 1
        this.escala = escala
        this.offsetX = this.width / 2
        this.offsetY = this.height / 2
    }

    createArc(
        x,
        y,
        radio,
        startAngle,
        endAngle,
        counterClockwise,
        color,
        lineWidth
    ) {
        let start = (startAngle / 180) * Math.PI
        let end = (endAngle / 180) * Math.PI
        this.ctx.beginPath()
        this.ctx.arc(
            this.offsetX + x,
            this.offsetY - y,
            radio * this.escala,
            start,
            end,
            counterClockwise
        )
        this.ctx.lineWidth = lineWidth
        this.ctx.strokeStyle = color
        this.ctx.stroke()
        this.ctx.closePath()
    }

    createRect(x, y, width, height, fillColor, strokeColor, border) {
        this.ctx.beginPath()
        this.ctx.lineWidth = border
        this.ctx.fillStyle = fillColor
        this.ctx.strokeStyle = strokeColor
        this.ctx.fillRect(x, y, width, height)
        this.ctx.strokeRect(x,y, width, height)
        this.ctx.fill()
        this.ctx.closePath()
    }

    planoCartesiano() {
        //cuadricula
        let lineas = this.width / this.escala
        for (let i = 0; i < lineas + 1; ++i) {
            this.ctx.lineWidth = 1
            this.ctx.strokeStyle = "gray"
            this.ctx.moveTo(i * this.escala, this.posY)
            this.ctx.lineTo(i * this.escala, i + this.height)
            this.ctx.stroke()
            this.ctx.moveTo(this.posX, i * this.escala)
            this.ctx.lineTo(this.posX + this.width, i * this.escala)
            this.ctx.stroke()
        }
        //Interseccion (0,0)
        this.ctx.beginPath()
        this.ctx.lineWidth = 2
        this.ctx.strokeStyle = "red"
        this.ctx.moveTo(this.posX * (this.width / 2), this.posY)
        this.ctx.lineTo(this.posX * (this.width / 2), this.posY + this.height)
        this.ctx.stroke()
        this.ctx.moveTo(this.posX, this.posY * (this.height / 2))
        this.ctx.lineTo(this.posX + this.width, this.posY * (this.height / 2))
        this.ctx.stroke()

        //Numeros
        this.ctx.beginPath()
        this.ctx.fillStyle= "Black"
        for (let i = 0; i < lineas; ++i) {
            if (this.escala <= 30) {
                if (i % 2 != 0) {
                    if (lineas / 2 - i == 0) {
                        continue
                    }
                    this.ctx.font = "10px serif"
                    this.ctx.fillText(
                        `${lineas / 2 - i}`,
                        (this.posX * this.width) / 2 + 3,
                        this.posY + i * this.escala + 3
                    )
                    this.ctx.font = "10px serif"
                    this.ctx.fillText(
                        `${-lineas / 2 + i}`,
                        this.posX + i * this.escala - 6,
                        (this.posY * this.width) / 2 + 9
                    )
                }
            } else {
                if (lineas / 2 - i == 0) {
                    continue
                }
                this.ctx.font = "20px serif"
                this.ctx.fillText(
                    `${lineas / 2 - i}`,
                    (this.posX * this.width) / 2 + 5,
                    this.posY + i * this.escala - 5
                )
                this.ctx.font = "20px serif"
                this.ctx.fillText(
                    `${-lineas / 2 + i}`,
                    this.posX + i * this.escala + 5,
                    (this.posY * this.width) / 2 - 5
                )
            }
        }
    }

    trazar(func, puntos, cantidad, color) {
        try {
            this.ctx.beginPath()
            for (let i = -puntos; i <= puntos; i += cantidad) {
                i = parseFloat(i.toFixed(2))
                let y = eval(func.replace(/x/g, "i")) * this.escala
                let x = i * this.escala
                if (isNaN(y) || y === Infinity || Math.abs(y) > Math.abs((puntos*2)*this.escala)){
                    continue 
                } else if (y == undefined){
                    throw new Error("Error en la expresión")
                } else{
                    this.ctx.arc(
                        this.offsetX + x,
                        this.offsetY - y,
                        0.1,
                        0,
                        360,
                        true
                        )
                    }
                }
            this.ctx.strokeStyle = color
            this.ctx.fillStyle = color
            this.ctx.stroke()
            console.log("Exito")
            return color
        } catch (error) {
            return error
        }
    }
}