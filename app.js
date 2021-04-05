canvas = document.querySelector("canvas")
canvas.width = innerWidth
canvas.height = innerHeight
ctx = canvas.getContext("2d", {alpha: false})

let centerX = canvas.width / 2
let centerY = canvas.height / 2

let pipeGap = 200
let pipeWidth = 50

let bird = {
	x: 300,
	y: centerY,
	radius: 10,
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
		this.draw()
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
	}
	drawBottom() {
		ctx.beginPath()
		ctx.fillRect(this.x, this.y + pipeGap, pipeWidth, canvas.height)
		ctx.fill()

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

	// draw pipes
	pipes.forEach((pipe, i) => {
		pipe.update()
		if(pipe.x + pipeWidth <= 0) {
			pipes.splice(i, 1)
		}

		ctx.strokeStyle = "red"
		ctx.beginPath()
		ctx.moveTo(bird.x, bird.y)
		ctx.lineTo(pipe.x, pipe.y)
		ctx.stroke()

		// check if the bird is touching the pipes
		if(pipe.x <= (bird.x - bird.radius) && pipe.x + pipeWidth >= bird.x + bird.radius) {
			//console.log("inside a pipe width")
			if((bird.y - bird.radius) <= pipe.x || bird.y + bird.radius >= pipe.y + pipeGap) {
				console.log("game over")
				resetGame()
			}
		}
	})
	//draw the bird
	bird.update()

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