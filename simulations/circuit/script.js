import * as drawShape from '../../utils/shape.js'
import { Vector } from '../../utils/vector.js'
import { Asset } from '../../utils/image.js'


const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d')

const nodes = []

let cursorPosition = Vector.ZERO;
addEventListener("mousemove", (event) => {
	cursorPosition = getCursorPosition(canvas, event)
})

class Node {
	constructor(position) {
		this.position = position;
		this._hovered = false;
		this._active = false;
	}
	overlaps(newNodePosition) {
		console.log(newNodePosition)
		return (this.position.distance(newNodePosition) < 20)
	}
	checkHover(mousePos) {
		this._hovered = (this.position.distance(mousePos) <= 10)
		return this._hovered
	}
	checkActive(){
		this._active = this._hovered;
		return this._active;
	}
	draw() {
		if (this._hovered) {
			drawShape.circle(ctx, this.position, 12, 'rgba(255, 10, 10, 0.5)')
		}
		if (this._active) {
			drawShape.circle(ctx, this.position, 11.5, 'rgb(170, 0, 0)')
		}
		nodeAsset.draw(ctx, this.position.x, this.position.y, 0, true)
	}
}

function resetCanvasResolution() {
    const rect = canvas.getBoundingClientRect();
	canvas.width = rect.width;
	canvas.height = rect.height;
	draw()
}
resetCanvasResolution()

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return new Vector(x, y)
}

addEventListener("resize", resetCanvasResolution)


const nodeAsset = new Asset('../../assets/node.webp', new Vector(20, 20))

function draw() {
	ctx.fillStyle = "green";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	nodes.forEach(node => node.draw())
}

canvas.addEventListener("click", (event)=>{
	nodes.forEach((node) => {node.checkActive(); node.checkActive();})
	const newNodePosition = getCursorPosition(canvas, event)
	if (nodes.every((node) => {
		return !(node.overlaps(newNodePosition))
	})) {
		nodes.push(new Node(newNodePosition))
	}
})

class Menu {
	constructor() {
		
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



/*function drawGrid(maxHorizontal, maxVertical) {
	drawLines(0.1, maxHorizontal, maxVertical, 1, "vertical", 200)
	drawLines(0.1, maxVertical, maxHorizontal, 1, "horizontal", 200)
	drawLines(1, maxHorizontal, maxVertical, 5, "vertical", 200)
	drawLines(1, maxVertical, maxHorizontal, 5, "horizontal", 200)
}*/

function loop() {
	nodes.forEach((node) => {
		node.checkHover(cursorPosition)
	})
	draw()
	requestAnimationFrame(loop)
	//setTimeout(() => { loop(); }, 1000)
}
loop()
