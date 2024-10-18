import { Vector } from '../../utils/vector.js'
import { Circuit, Cursor, Node, Component, Bulb, componentAssets } from './classes.js'

const canvas = document.getElementById('main-canvas');
export const ctx = canvas.getContext('2d')
	
export const cursor = new Cursor()

// stores nodes, components and circuit related data and methods.
export const circuit = new Circuit()
circuit.initialiseCircuit()

const componentMenu = document.getElementById("component-menu")
const nodeMenu = document.getElementById("node-menu")


// HTML Component Buttons are linked to their respective component
for (const component of ["bulb", "ammeter", "resistor", "diode"]) {
	document.getElementById(component).onclick = () => {
		cursor.heldComponent = component;
	}
}

document.getElementById("complete-circuit-button").onclick = () => {
	circuit.completeCircuit()
	componentMenu.classList.add("hidden")
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
			new Component(newNodeType, newNodePosition, 1)
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
	if (checkArrayActive(circuit.nodes) || checkArrayActive(circuit.components) || circuit.isCompleted) {
		return;
	}
	
	// if nothing has been selected, it will attempt to place a node or component
	const newNodeRadius = cursor.heldComponent ? Component.RADIUS : Node.RADIUS;
	placeNewNode(cursor.heldComponent, cursor.position, newNodeRadius)
})




// updates the canvas, redraws nodes, selections and held components.
function draw() {
	ctx.fillStyle = "green";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// draws a circle around a node if active
	if (cursor.activeNode) {
		cursor.activeNode.drawActive();
	}

	// draws wires, components, and nodes
	circuit.draw()

	// draws the component held by the cursor
	if (cursor.heldComponent) {
		componentAssets[cursor.heldComponent].draw(ctx, ...cursor.position.add2(-32.5, -16).array())
	}
}

// used to round inputs to two decimals places
function twoDP(number) {
	return Math.round(number * 100) / 100
}

// main program loop ran each frame.
function loop() {
	draw()
	
	if (circuit.isCompleted) {
		circuit.update();
	}
	
	if (circuit.isCompleted && cursor.activeNode) {
		const node = cursor.activeNode;
		nodeMenu.classList.toggle("hidden", false)
		if (node instanceof Component) {
			nodeMenu.innerHTML = `
				Type: ${node.type}<br>
				Voltage: ${twoDP(node.potentialDifference)}<br>
				Current: ${twoDP(circuit.current)}<br>
				Resistance: ${twoDP(node.resistance)}<br>
				Power: ${twoDP(node.potentialDifference * circuit.current)}<br>
			`;
		} else {
			nodeMenu.innerHTML = `Type: Node<br>Current: ${twoDP(circuit.current)}`
		}
	} else {
		nodeMenu.classList.toggle("hidden", true)
	}

	requestAnimationFrame(loop)
}
loop()