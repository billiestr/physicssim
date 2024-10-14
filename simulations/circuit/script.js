import { Vector } from '../../utils/vector.js'
import { Circuit, Cursor, Node, Component, Bulb, componentAssets } from './classes.js'

const canvas = document.getElementById('main-canvas');
export const ctx = canvas.getContext('2d')


	
const cursor = new Cursor()

// lists of all creates nodes and components in the canvas.
export const circuit = new Circuit()
circuit.initialiseCircuit()

// tells the program how to behave.
let mode = "default"



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
	circuit.nodes.forEach((node) => {
		node.checkHover(cursor.position)
	})
	circuit.components.forEach((component) => {
		component.checkHover(cursor.position)
	})
})

function placeNewNode(newNodeType, newNodePosition, newNodeRadius) {
	// any overlapping is checked for, if so the function will end early.
	const overlaps = circuit.nodes.some(node => node.checkOverlap(newNodePosition, newNodeRadius)) ||
		circuit.components.some(component => component.checkOverlap(newNodePosition, newNodeRadius))
	if (overlaps) { return; }

	let newNode;
	// the newNodeType parameter only has a value if the new node is a Component
	if (!newNodeType) {
		newNode = new Node(newNodePosition)
		circuit.nodes.push(newNode) // node is added to the list of nodes.
	} else {
		// the is a distinct class for bulbs, this is checked for.
		newNode = (newNodeType == "bulb") ? new Bulb(newNodePosition) :
			new Component(newNodeType, newNodePosition)
		circuit.components.push(newNode) // new component is added to list of components
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
	if (checkArrayActive(circuit.nodes) || checkArrayActive(circuit.components)) {
		return;
	}

	// if nothing has been selected, it will attempt to place a node or component
	const newNodeRadius = cursor.heldComponent ? Component.RADIUS : Node.RADIUS;
	placeNewNode(cursor.heldComponent, cursor.position, newNodeRadius)
})




// draws each component and node
function draw() {
	ctx.fillStyle = "green";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// draws a circle around a node if active
	if (cursor.activeNode) {
		cursor.activeNode.drawActive();
	}
	circuit.drawWires()
	// draws each node and component
	circuit.components.forEach(component => component.draw(ctx))
	circuit.nodes.forEach(node => node.draw())

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