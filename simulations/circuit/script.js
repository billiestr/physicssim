import * as drawShape from '../../utils/shape.js'
import { Vector } from '../../utils/vector.js'
import { Asset } from '../../utils/image.js'

const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d')

const componentSize = new Vector(65, 34)
const componentAssets = {
	'battery': new Asset("../../assets/circuit/battery.png", componentSize),
	'bulb-on': new Asset("../../assets/circuit/lighton.png", componentSize),
	'bulb': new Asset("../../assets/circuit/lightoff.png", componentSize),
	'ammeter': new Asset("../../assets/circuit/ammeter.png", componentSize),
	'resistor': new Asset("../../assets/circuit/resistor.png", componentSize),
	'diode': new Asset("../../assets/circuit/diode.png", componentSize)
}

canvas.addEventListener("click", (event) => {
	if (cursor.heldComponent) {
		const newComponent = new Component(cursor.heldComponent, 
																			cursor.position)
		components.push(newComponent)
		cursor.heldComponent = null;
		return;
	}
	components.forEach((component) => {
		if (component.clickCheck(cursor.position)) {
			cursor.activeNode = component
		}
	})
	nodes.forEach((node) => { node.checkActive(); })
	const newNodePosition = cursor.position;
	if (nodes.every((node) => {
		return !(node.overlaps(newNodePosition))
	}) && components.every((component) => {
		return !(component.overlaps(newNodePosition))
	})) {
		const newNode = new Node(newNodePosition)
		newNode._hovered = true;
		nodes.push(newNode)
	}
})


const nodes = []
const components = []

for (const component of ["bulb", "ammeter", "resistor", "diode"]) {
	document.getElementById(component).onclick = () => {
		cursor.heldComponent = component;
	}
}

const cursor = {
	activeNode: null,
	position: Vector.ZERO,
	pressed: false,
	heldComponent: null,
	updatePosition: function (canvas, event) {
		const rect = canvas.getBoundingClientRect()
		const x = event.clientX - rect.left
		const y = event.clientY - rect.top
		this.position = new Vector(x, y);
	}
}

const nodeOrder = {
	list: [],
	draw: function (ctx) {
		let currentPoint = this.list[0];
		for (let i = 1; i < this.list.length-1; i++) {
			const nextPoint = this.list[i+1];
			console.log(currentPoint)
			if (currentPoint instanceof Component ||
				nextPoint instanceof Component) {
					i = i + 1
					currentPoint = this.list[i+1]; 
					continue;
				}
				
			drawShape.line(ctx, currentPoint.position, nextPoint.position, "black");
			currentPoint = nextPoint;
		}
	}
}

const nodeAsset = new Asset('../../assets/circuit/node.webp', new Vector(20, 20))
class Node {
	constructor(position) {
		nodeOrder.list.push(this)
		this.position = position;
		this.next = null;
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
class Component {
	constructor(type, position, resistance) {
		this.position = position;
		this.nodeOne = new Node(this.position.add(new Vector(-32.5, 0)))
		nodeOrder.list.push(this)
		this.nodeTwo = new Node(this.position.add(new Vector(32.5, 0)))

		this.type = type
		this.resisitance = resistance;
		
		nodes.push(this.nodeOne, this.nodeTwo)
		
	}
	clickCheck(clickPosition) {
		return ((Math.abs(this.position.x - clickPosition.x) < 32.5) &&
			(Math.abs(this.position.y - clickPosition.y) < 17));
	}
	overlaps(position) {
		return (this.position.distance(position) < 65)
	}
	draw(ctx) {
		componentAssets[this.type].draw(ctx, ...this.position.array(), 0, true)
	}
}
components.push(new Component("battery", new Vector(405, 250), 0))

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
			cursor.heldComponent = null;
			break;
	}
})



addEventListener("mousemove", (event) => {
	cursor.updatePosition(canvas, event)
	nodes.forEach((node) => {
		node.checkHover(cursor.position)
	})
})



function resetCanvasResolution() {
	const rect = canvas.getBoundingClientRect();
	canvas.width = rect.width;
	canvas.height = rect.height;
}
resetCanvasResolution()

addEventListener("resize", resetCanvasResolution)

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
	if (cursor.activeNode) {
		drawShape.circle(ctx, cursor.activeNode.position, 20, 'rgba(200, 0, 0, 0.1)')
	}
	nodes.forEach(node => node.draw())
	components.forEach(component => component.draw(ctx))

	if (cursor.heldComponent) {
		componentAssets[cursor.heldComponent].draw(ctx, ...cursor.position.add2(-32.5, -16).array())
	}
	nodeOrder.draw(ctx)
}

function loop() {
	ctx.fillStyle = "green";
	ctx.fillRect(0, 0, canvas.width, canvas.height);


	
	draw()
	
	requestAnimationFrame(loop)
}
loop()