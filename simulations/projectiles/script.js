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

// cannon image assets
const cannonBody = new Asset('../../assets/cannon-body.png', new Vector(202, 121))
const cannonCylinder = new Asset('../../assets/cannon-cylinder.png', new Vector(284, 73))

// redraws the canvas when each asset is loaded, otherwise it may be missing
const assetsToLoad = [cannonBody, cannonCylinder]
assetsToLoad.forEach((asset) => {
	asset.image.onload = () => { loop(); }
})

// redraws the canvas each time an input is changed.
addEventListener("input", () => { loop() })

class Menu {
	constructor() {
		this._gravityInput = document.getElementById("gravity-input")
		this._xVelocityInput = document.getElementById("x-vel")
		this._yVelocityInput = document.getElementById("y-vel")

		this._distanceOutput = document.getElementById('final-distance')
		this._heightOutput = document.getElementById('max-height')
	}
	// retrieve input values from the HTML document
	get gravity() {
		return this._gravityInput.value
	}
	get initialVelocity() {
		return new Vector(
			this._xVelocityInput.value,
			this._yVelocityInput.value
		)
	}
	// update the output spans in the HTML document
	set maximumHeight(value) {
		// rounds the value to 2 d.p.
		this._heightOutput.innerText = Math.round(value * 100) / 100
	}
	set finalDistance(value) {
		// rounds the value to 2 d.p.
		this._distanceOutput.innerText = Math.round(value * 100) / 100
	}
}

// initialises menu object
const menu = new Menu()

// UNUSED VERSION OF GRAPH DRAWING, NON PARAMETRIC
function drawGraph(offset = [20, 20]) {
	const acceleration = -menu.gravity
	const vel = menu.initialVelocity

	// s = ut + 1/2at^2, s=0
	// t = -u +- sqrt(u^2) / 2a
	const landTime = 2 * vel.y / -acceleration;
	const finalDistance = landTime * vel.x
	const maximumHeight = vel.y * landTime / 2 + acceleration / 2 * landTime ** 2 / 4

	menu.landTime = landTime;
	menu.finalDistance = finalDistance;

	console.log(finalDistance, maximumHeight)
	drawShape.drawFunction(ctx, (horizontalDistance) => {
		const time = horizontalDistance / vel.x
		const height = vel.y * time - menu.gravity / 2 * time ** 2
		return height;
	}, { step: finalDistance / 100, end: finalDistance }, { offset, scale: [100, -100] })
}

// calculates the projectile motion of the object and returns a function to draw it.
function getProjectileCurve() {
	// values inputted by user
	const acceleration = -menu.gravity
	const vel = menu.initialVelocity

	const height = (time) => {
		return vel.y * time - (menu.gravity / 2) * time ** 2
	}

	// s = ut + 1/2at^2, s=0
	// t = -u +- sqrt(u^2) / 2a

	// By rearranging the SUVAT formula: s = ut + 1/2at^2, s=0,
	// you get t = -2u/a
	const landTime = -2 * vel.y / acceleration;
	const finalDistance = vel.x * landTime // distance = speed * time
	const maximumHeight = height(landTime / 2) // maximum height is reached halfway through

	// updates span values on the HTML document
	menu.finalDistance = finalDistance;
	menu.maximumHeight = maximumHeight;

	const positionFunction = (time) => {
		return new Vector(vel.x * time, height(time))
	}

	// returns an object with the final distance, maximum height, and a function to draw the curve.
	return {
		finalDistance, maximumHeight,
		curveFunction: (offset, scale) => {
			drawShape.drawParametricFunction(
				ctx, positionFunction, 
				{ step: landTime / 100, end: landTime }, 
				{ offset, scale }
			)
		}
	}

}

// draws a grid of horizontal and vertical lines
function drawGrid(maxHorizontal, maxVertical) {
	if (maxHorizontal < 0) { return } // dont draw grid if horizontal velocity is negative

	// if too many lines 
	if (Math.max(maxHorizontal, maxVertical) >= 1000) {return}

	
	// thin lines drawn every 0.1 metres
	drawShape.drawLines(ctx, 0.1, maxHorizontal, maxVertical, 1, "vertical", 200)
	drawShape.drawLines(ctx, 0.1, maxVertical, maxHorizontal, 1, "horizontal", 200)
	// thicker lines drawn every 1 metre
	drawShape.drawLines(ctx, 1, maxHorizontal, maxVertical, 5, "vertical", 200)
	drawShape.drawLines(ctx, 1, maxVertical, maxHorizontal, 5, "horizontal", 200)
}

function loop() {
	const initialVelocity = menu.initialVelocity;
	const cannonCylinderAngle = -Math.atan2(initialVelocity.y, initialVelocity.x) 
	
	// position of the cannon end or mouth is calculated:
	const cannonEnd = new Vector(
		170 + Math.cos(cannonCylinderAngle) * 150,
		40 + Math.sin(cannonCylinderAngle) * 150
	)


	// object returned is deconstructed into 3 constants
	const { finalDistance, maximumHeight, curveFunction } = getProjectileCurve();

	// resets the canvas to grey
	ctx.fillStyle = "gray";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.translate(10, 300) // moves the cannon to the bottom

	// scale to draw the cannon, grid and curve in order to fit it on the screen.
	const scale = 3 / (2 + Math.max(finalDistance, maximumHeight * 3))
	ctx.scale(scale, scale)

	// draws the grid and curve at the cannon end position
	ctx.translate(...cannonEnd.array())
	curveFunction(Vector.ZERO, new Vector(200, -200))
	drawGrid(finalDistance, maximumHeight, 200)
	ctx.translate(...cannonEnd.scale(-1).array())

	// draw cannon cylinder at correct angle
	ctx.save()
	ctx.translate(170, 40)
	ctx.rotate(cannonCylinderAngle)
	cannonCylinder.draw(ctx, -120, -40)
	ctx.restore()
	//draw cannon body
	cannonBody.draw(ctx, 10, 30)

	//drawShape.circle(ctx, cannonEnd, 5, 'red') // TESTING

	// resets all changes to the canvas' context
	ctx.resetTransform()
}
loop()