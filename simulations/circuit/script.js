import * as drawShape from '../../utils/shape.js'
import { Vector } from '../../utils/vector.js'
import { Asset } from '../../utils/image.js'

const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d')

// lists of all creates nodes and components in the canvas.
const nodes = []
const components = []

// tells the program how to behave.
let mode = "default"

// image src for a node
const nodeAsset = new Asset('../../assets/circuit/node.webp', new Vector(20, 20))
// images srcs for each component
const componentSize = new Vector(65, 34)
const componentAssets = {
	'battery': new Asset("../../assets/circuit/battery.png", componentSize),
	'bulb-on': new Asset("../../assets/circuit/lighton.png", componentSize),
	'bulb': new Asset("../../assets/circuit/lightoff.png", componentSize),
	'ammeter': new Asset("../../assets/circuit/ammeter.png", componentSize),
	'resistor': new Asset("../../assets/circuit/resistor.png", componentSize),
	'diode': new Asset("../../assets/circuit/diode.png", componentSize)
}

// HTML Component Buttons are linked to their respective component
for (const component of ["bulb", "ammeter", "resistor", "diode"]) {
	document.getElementById(component).onclick = () => {
		cursor.heldComponent = component;
	}
}

// resizes the canvas to match the display size
function resetCanvasResolution() {
	const rect = canvas.getBoundingClientRect();
	canvas.width = rect.width;
	canvas.height = rect.height;
}
resetCanvasResolution()
// runs each time the window is resized
addEventListener("resize", resetCanvasResolution)

// detects when "Escape" is pressed to remove the held component
addEventListener("keyup", ({ key }) => {
	switch (key) {
		case "Escape":
			mode = "default"
			cursor.heldComponent = null;
			break;
	}
})

// updates the cursor position and checks for hover updates.
addEventListener("mousemove", (event) => {
	cursor.updatePosition(canvas, event)
	nodes.forEach((node) => {
		node.checkHover(cursor.position)
	})
	components.forEach((component) => {
		component.checkHover(cursor.position)
	})
})

function placeNewNode(newNodeType, newNodePosition, newNodeRadius) {
	// any overlapping is checked for, if so the function will end early.
	const overlaps = nodes.some(node => node.checkOverlap(newNodePosition, newNodeRadius)) ||
		components.some(component => component.checkOverlap(newNodePosition, newNodeRadius))
	if (overlaps) { return; }

	let newNode;
	// the newNodeType parameter only has a value if the new node is a Component
	if (!newNodeType) {
		newNode = new Node(newNodePosition)
		nodes.push(newNode) // node is added to the list of nodes.
	} else {
		// the is a distinct class for bulbs, this is checked for.
		newNode = (newNodeType == "bulb") ? new Bulb(newNodePosition) :
			new Component(newNodeType, newNodePosition)
		components.push(newNode) // new component is added to list of components
		cursor.heldComponent = null; // held component is removed from cursor
	}
	// the new node will detect whether the cursor is over it.
	newNode.checkHover(cursor.position)
	cursor.activeNode = null;
}

// checks each node in an array to see if it has been clicked.
// if so, it updates the cursors activeNode property.
function checkArrayActive(arr) {
	for (const node of arr) { 
		if (node.checkActive()) { 
			cursor.activeNode = node;
			return true; 
		} 
	}
}

// ran when the HTML canvas is clicked
canvas.addEventListener("click", () => {
	// if an component is clicked it is made active. If so the function returns early.
	if (checkArrayActive(nodes) || checkArrayActive(components)) {
		return;
	}

	// if nothing has been selected, it will attempt to place a node or component
	const newNodeRadius = cursor.heldComponent ? Component.RADIUS : Node.RADIUS;
	placeNewNode(cursor.heldComponent, cursor.position, newNodeRadius)
})

// keeps track of selected circuit components and mouse position.
class Cursor {
	constructor() {
		this.activeNode = null;
		this.position = Vector.ZERO;
		this.heldComponent = null;
	}
	updatePosition(canvas, event) {
		// the mouse position is calculated relative to the canvas.
		const rect = canvas.getBoundingClientRect()
		const x = event.clientX - rect.left
		const y = event.clientY - rect.top
		this.position = new Vector(x, y);
	}
}
const cursor = new Cursor()


class Node {
	static RADIUS = 10;
	constructor(position) {
		this.position = position;
		this.radius = Node.RADIUS
		this._hovered = false;
	}
	// used when a new component or node is added
	checkOverlap(newNodePosition, otherRadius = 10) {
		return (this.position.distance(newNodePosition) < this.radius + otherRadius)
	}
	// checks whether the cursor is over the node
	checkHover(mousePos) {
		this._hovered = this.checkOverlap(mousePos, 0)
		return this._hovered;
	}
	checkActive() {
		// runs when clicked, if it is being hovered over then it will become the active node.
		return this._hovered;
	}
	drawActive() {
		drawShape.circle(ctx, this.position, 12, 'rgb(200, 54, 54)');
	}
	draw() {
		// visually shows the user whether the node is active/hovered over.
		if (this._hovered) {
			drawShape.circle(ctx, this.position, 13, 'rgba(186, 54, 54, 0.6)')
		}
		// draws the node image
		nodeAsset.draw(ctx, this.position.x, this.position.y, 0, true)
	}
}

// builds upon a node, has resistance, types other new properties.
class Component extends Node {
	static RADIUS = 50;
	constructor(type, position, resistance) {
		super(position)
		this.radius = Component.RADIUS // overides default node radius

		this.type = type // e.g. "resistor" or "ammeter"
		this.resisitance = resistance;

		this.nodeIn = new Node(this.position.add(new Vector(-32.5, 0)))
		this.nodeOut = new Node(this.position.add(new Vector(32.5, 0)))
		nodes.push(this.nodeIn, this.nodeOut)

	}
	clickCheck(clickPosition) {
		return ((Math.abs(this.position.x - clickPosition.x) < 32.5) &&
			(Math.abs(this.position.y - clickPosition.y) < 17));
	}
	drawActive() {
		drawShape.circle(ctx, this.position, this.radius, 'rgba(186, 54, 54, 0.7)')
	}
	draw(ctx) {
		if (this._hovered) {
			drawShape.circle(ctx, this.position, this.radius, 'rgba(186, 54, 54, 0.3)')
		}
		componentAssets[this.type].draw(ctx, ...this.position.array(), 0, true)
	}
}
components.push(new Component("battery", new Vector(405, 250), 0))

// the bulb will have its own properties such as changing resistance and brightness
class Bulb extends Component {
	constructor(position) {
		super("bulb", position, 1)
	}
}

// draws each component and node
function draw() {
	ctx.fillStyle = "green";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// draws a circle around a node if active
	if (cursor.activeNode) {
		cursor.activeNode.drawActive();
	}
	// draws each node and component
	components.forEach(component => component.draw(ctx))
	nodes.forEach(node => node.draw())

	// draws the component held by the cursor
	if (cursor.heldComponent) {
		componentAssets[cursor.heldComponent].draw(ctx, ...cursor.position.add2(-32.5, -16).array())
	}
}

// main program loop ran each frame.
function loop() {
	draw()

	requestAnimationFrame(loop)
}
loop()