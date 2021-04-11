canvas = document.querySelector("canvas")
canvas.width = innerWidth
canvas.height = innerHeight
ctx = canvas.getContext("2d")

let centerX = canvas.width / 2
let centerY = canvas.height / 2

let pipeGap = 220
let pipeWidth = 70
let gameRunning = false
let inFocus = true


const sprites = new Image()
sprites.src = "./sprites.png"


let bird = {
	x: centerX,
	y: centerY,
	radius: 20,
	speed: 3,
	gravity: 0.5,
	maxSpeed: 8,
	draw: function() {
		ctx.fillStyle = "red"
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		ctx.fill()
	},
	update: function() {
		if (this.y >= canvas.height || this.y <= -20) gameOver()
		ctx.drawImage(sprites, 2 * pipeWidth, 0, 50, 35, bird.x - 25, bird.y - 20, 50, 40)
		//this.draw()
		if(this.speed <= this.maxSpeed) this.speed += this.gravity
		this.y += this.speed
	}
}

class Pipe {
	constructor(y) {
		this.y = y
		this.x = canvas.width
	}
	draw() {
		ctx.drawImage(sprites, pipeWidth, 0, pipeWidth, 1000, this.x, this.y - 1000, pipeWidth, 1000)
	}
	drawBottom() {
		ctx.drawImage(sprites, 0, 0, pipeWidth, 1000, this.x, this.y + pipeGap, pipeWidth, 1000)
	}
	update() {
		this.draw()
		this.drawBottom()

		this.x += -2
	}
}

bird.speed = 0
bird.gravity = 0

// event listeners for keypress and mouse click
window.addEventListener("click", (e) => {
	bird.gravity = 0.5
	bird.speed = -11
})
window.addEventListener("keypress", (e) => {
	bird.gravity = 0.5
	bird.speed = -11
})

pipes = []
// Spawn pipes every one second
setInterval(() => {
	pipes.push(new Pipe(randomBetween(20, canvas.height - pipeGap)))
}, 2000)

function animate() {
	requestAnimationFrame(animate)
	// Clear Canvas
	//ctx.fillStyle = "#000000"
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	// draw pipes
	pipes.forEach((pipe, i) => {
		pipe.update()
		if(pipe.x + pipeWidth <= 0) {
			pipes.splice(i, 1)
		}

		// check if the bird is touching the pipes
		if(bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipeWidth) {
			if(bird.y - bird.radius < pipe.y || bird.y + bird.radius > pipe.y + pipeGap) {
				console.log("Gameover zone")
				gameOver()
			}
		}
	})
	//draw the bird
	bird.update()
}
// Calling the animate function
animate()

function gameOver() {
	alert("Game Over")
	pipes = []
	bird.y = centerY
	bird.speed = 0
	bird.gravity = 0
}

// Misc. functions
function randomBetween(min, max){
return (Math.random() * (max - min) + min);
}

function debugLine(x1, y1, x2, y2) {
	ctx.strokeStyle = "red"
	ctx.beginPath()
	ctx.moveTo(x1, y1)
	ctx.lineTo(x2, y2)
	ctx.stroke()
}

