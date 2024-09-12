import * as drawShape from '../../utils/shape.js'
import { Vector } from '../../utils/vector.js'
import { Asset } from '../../utils/image.js'

const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d')

const componentAssets = {
	'bulb-on': new Asset("../../assets/lighton.png"),
	'bulb-off': new Asset("../../assets/lightoff.png"),
	'ammeter': new Asset("../../assets/ammeter.png"),
	'diode': new Asset("../../assets/diode.png")
}

class Component {
	constructor(type, resistance) {
		this.input = undefined;
		this.output = output;
	}
}

const nodes = []

let mode = "default"

const keyPressed = {
	shift: false
}

addEventListener("keyup", ({ key }) => {
	switch (key) {
		case "w":
			mode = mode != "drawWire" ? "drawWire" : "default"
			break;
		case "Escape":
			mode = "default"
			break;
	}
})

const cursor = {
	activeNode: null,
	position: Vector.ZERO,
	pressed: false,
	updatePosition: function (canvas, event) {
		const rect = canvas.getBoundingClientRect()
		const x = event.clientX - rect.left
		const y = event.clientY - rect.top
		this.position = new Vector(x, y);
	}
}

addEventListener("mousemove", (event) => {
	cursor.updatePosition(canvas, event)
	nodes.forEach((node) => {
		node.checkHover(cursor.position)
	})
})

class Node {
	constructor(position) {
		this.position = position;
		this._hovered = false;
		this._active = false;
	}
	overlaps(newNodePosition) {
		return (this.position.distance(newNodePosition) < 20)
	}
	checkHover(mousePos) {
		this._hovered = (this.position.distance(mousePos) <= 10)
		return this._hovered
	}
	checkActive() {
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

addEventListener("resize", resetCanvasResolution)


const nodeAsset = new Asset('../../assets/node.webp', new Vector(20, 20))


canvas.addEventListener("click", (event) => {
	if (keyPressed.shift) { return; }
	nodes.forEach((node) => { node.checkActive(); })
	const newNodePosition = cursor.position;
	if (nodes.every((node) => {
		return !(node.overlaps(newNodePosition))
	})) {
		const newNode = new Node(newNodePosition)
		newNode._hovered = true;
		nodes.push(newNode)
	}
})

canvas.addEventListener("mousedown", (event) => {})
canvas.addEventListener("mouseup", (event) => {})

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


function draw() {
	nodes.forEach(node => node.draw())
}

function loop() {
	ctx.fillStyle = "green";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	
	draw()
	
	requestAnimationFrame(loop)
	//setTimeout(() => { loop(); }, 1000)
}
loop()
