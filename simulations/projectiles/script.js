import * as drawShape from '../../utils/shape.js'
import { Vector } from '../../utils/vector.js'
import { Asset } from '../../utils/image.js'


const canvas = document.getElementById('canvas2');
const ctx = canvas.getContext('2d')

// number of pixels on the canvas
canvas.width = 600;
canvas.height = 500;
ctx.fillStyle = "gray";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const cannonBody = new Asset('../../assets/cannon-body.png', new Vector(202, 121))
const cannonCylinder = new Asset('../../assets/cannon-cylinder.png', new Vector(284, 73))

const assetsToLoad = [cannonBody, cannonCylinder]
assetsToLoad.forEach((asset) => {
	asset.image.onload = () => {loop();}
})
addEventListener("click", () => {loop()})

class Menu {
	constructor() {
		this._gravityInput = document.getElementById("gravity-input")
		this._xVelocityInput = document.getElementById("x-vel")
		this._yVelocityInput = document.getElementById("y-vel")
	}
	get gravity() {
		return this._gravityInput.value
	}
	get initialVelocity() {
		return new Vector(
			this._xVelocityInput.value,
			this._yVelocityInput.value
		)
	}
}
class Time {
	constructor() {
		this.lastTime = Date.now();
		this.deltaTime = 0;
	}
	resetDeltaTime() {
		const now = Date.now();
		this.deltaTime = (now - this.lastTime) / 1000;
		this.lastTime = now;
	}
}

const menu = new Menu()
const time = new Time()


function drawGraph(offset = [20, 20]) {
	const acceleration = -menu.gravity
	const vel = menu.initialVelocity

	// s = ut + 1/2at^2, s=0
	// t = -u +- sqrt(u^2) / 2a
	const landTime = 2 * vel.y / -acceleration;
	const finalDistance = landTime * vel.x
	const maximumHeight = vel.y * landTime / 2 + acceleration / 2 * landTime ** 2 / 4
	console.log(finalDistance, maximumHeight)
	drawShape.drawFunction(ctx, (horizontalDistance) => {
		const time = horizontalDistance / vel.x
		const height = vel.y * time - menu.gravity / 2 * time ** 2
		return height;
	}, { step: finalDistance / 100, end: finalDistance }, { offset, scale: [100, -100] })
}

function getProjectileCurve() {
	const acceleration = -menu.gravity
	const vel = menu.initialVelocity

	const height = (time) => {
		return vel.y * time - (menu.gravity / 2) * time ** 2
	}

	// s = ut + 1/2at^2, s=0
	// t = -u +- sqrt(u^2) / 2a
	const landTime = 2 * vel.y / -acceleration;
	const finalDistance = landTime * vel.x
	const maximumHeight = height(landTime / 2)

	return {
		finalDistance, maximumHeight, func: (offset, scale) => {
			drawShape.drawParametricFunction(ctx, (time) => {
				return new Vector(vel.x * time, height(time))
			}, { step: landTime / 100, end: landTime }, { offset, scale })
		}
	}

}


function drawGrid(maxHorizontal, maxVertical) {
	drawShape.drawLines(ctx, 0.1, maxHorizontal, maxVertical, 1, "vertical", 200)
	drawShape.drawLines(ctx, 0.1, maxVertical, maxHorizontal, 1, "horizontal", 200)
	drawShape.drawLines(ctx, 1, maxHorizontal, maxVertical, 5, "vertical", 200)
	drawShape.drawLines(ctx, 1, maxVertical, maxHorizontal, 5, "horizontal", 200)
}

//drawGraph()
let angle = -360
function loop() {
	const initialVelocity = menu.initialVelocity
	angle = -Math.atan2(initialVelocity.y, initialVelocity.x)
	ctx.fillStyle = "gray";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	
	time.resetDeltaTime()
	ctx.translate(10, 300)

	const { finalDistance, maximumHeight, func } = getProjectileCurve();
	const scale = 3 / (2 + Math.max(finalDistance, maximumHeight * 3))
	//console.log(scale)

	const cannonEnd = new Vector(
		170 + Math.cos(angle) * 150,
		40 + Math.sin(angle) * 150
	)

	console.log(finalDistance, maximumHeight)


	ctx.scale(scale, scale)
	ctx.translate(...cannonEnd.array())
	func(Vector.ZERO, new Vector(200, -200))
	drawGrid(finalDistance, maximumHeight, 200)
	ctx.translate(...cannonEnd.scale(-1).array())

	ctx.save()
	ctx.translate(170, 40)
	ctx.rotate(angle)
	cannonCylinder.draw(ctx, -120, -40)
	ctx.restore()
	cannonBody.draw(ctx, 10, 30)

	drawShape.circle(ctx, cannonEnd, 5, 'red')

	ctx.resetTransform()

	//drawGraph(cannonEnd.array())
	//requestAnimationFrame(loop)
	//setTimeout(() => { loop(); }, 1000)
}
loop()
