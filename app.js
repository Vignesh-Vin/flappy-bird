canvas = document.querySelector("canvas")
canvas.width = innerWidth
canvas.height = innerHeight
ctx = canvas.getContext("2d", {alpha: false})

let centerX = canvas.width / 2
let centerY = canvas.height / 2

let pipeGap = 220
let pipeWidth = 70
let gameRunning = false

const birdImg = new Image()
birdImg.src = "./bird.png"

const pipeTopImg = new Image()
pipeTopImg.src = "./pipeTop.png"

const pipeBottomImg = new Image()
pipeBottomImg.src = "./pipeBottom.png"


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
		ctx.fillStyle = "blue"
		ctx.beginPath()
		ctx.fillRect(this.x, 0, pipeWidth, this.y)
		ctx.fill()
		ctx.drawImage(pipeTopImg, this.x, this.y - 1000, pipeWidth, 1000)
	}
	drawBottom() {
		ctx.beginPath()
		ctx.fillRect(this.x, this.y + pipeGap, pipeWidth, canvas.height)
		ctx.fill()
		ctx.drawImage(pipeBottomImg, this.x, this.y + pipeGap, pipeWidth, 1000)

	}
	update() {
		this.draw()
		this.drawBottom()

		this.x += -2
	}
}

// event listeners for keypress and mouse click
window.addEventListener("click", (e) => {
	bird.speed = -11
})
window.addEventListener("keypress", (e) => {
	bird.speed = -11
})

pipes = []
// Spawn pipes every one second
setInterval(() => {
	pipes.push(new Pipe(randomBetween(20, canvas.height - pipeGap)))
	//console.log(pipes.length)
}, 2000)

function animate() {
	requestAnimationFrame(animate)
	// Clear Canvas
	ctx.fillStyle = "#000000"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	//draw the bird
	ctx.drawImage(birdImg, bird.x  - bird.radius, bird.y - bird.radius )
	bird.update()

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
				resetGame()
			}
		}
	})
}
// Calling the animate function
animate()


function resetGame() {
	pipes = []
	bird.y = centerY
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

