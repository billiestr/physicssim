 import { Circuit, Cursor, Node, Component, Bulb, componentAssets } from './classes.js'

const canvas = document.getElementById('main-canvas');
export const ctx = canvas.getContext('2d')
	
export const cursor = new Cursor()

// stores nodes, components and circuit related data and methods.
export const circuit = new Circuit()
circuit.initialiseCircuit()

const componentMenu = document.getElementById("component-menu")
const nodeInfo = document.getElementById("node-info")
const nodeMenu = document.getElementById("node-menu")
const resistanceInput = document.getElementById("resistance-input")
const resistanceInputContainer = document.getElementById("resistance-input-container")



document.getElementById("emf-input").onchange = ({target}) => {
	circuit.emf = parseFloat(target.value)
}
document.getElementById("r-input").onchange = ({target}) => {
	circuit.totalResistance -= circuit.components[0].resistance
	circuit.components[0].resistance = parseFloat(target.value)
	circuit.totalResistance += circuit.components[0].resistance
}




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

// detects when "ctrl-z" is pressed to remove the last added node
addEventListener("keyup", ({key, ctrlKey}) => {
	if (ctrlKey && key.toLowerCase() === "z") {
		circuit.removeLastNode()
		componentMenu.classList.remove("hidden")
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
		switch (newNodeType) {
			case "bulb":
				newNode = new Bulb(newNodePosition);
				break;
			case "resistor":
				let resistance;
					while  (isNaN(resistance) || resistance < 0) {
					resistance = parseFloat(prompt(
						"Enter a valid value for resistance. (this can be changed later)", "1"
					))
				} 
				newNode = new Component(newNodeType, newNodePosition, resistance);
				break;
			default:
				newNode = new Component(newNodeType, newNodePosition, 1);
				break;
		}
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
			if (cursor.activeNode !== node) {
				cursor.activeNode = node;
			} else if (node instanceof Component) {
				node.reverse()
			}
			return true;
		}
	}
}

// ran when the HTML canvas is clicked
canvas.addEventListener("click", () => {
	// if an component is clicked it is made active. If so the function returns early.
	if (
		checkArrayActive(circuit.nodes) || 
		checkArrayActive(circuit.components) || 
		circuit.isCompleted
	) {
		return;
	}
	
	// if nothing has been selected, it will attempt to place a node or component
	const newNodeRadius = cursor.heldComponent ? Component.RADIUS : Node.RADIUS;
	placeNewNode(cursor.heldComponent, cursor.position, newNodeRadius)
})




// updates the canvas, redraws nodes, selections and held components.
function draw() {
	ctx.fillStyle = "#665c70"
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

// used to round outputs to three decimals places
function round(number, decimalPlaces=3) {
	const multipler = 10**decimalPlaces
	return Math.round(number * multipler) / multipler
}

function titleCase(string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

let selectedResistor;
// main program loop ran each frame.
function loop() {
	draw()
	
	if (circuit.isCompleted) {
		circuit.update();
	}

	// if a node is selected and the circuit is complete, show menu
	if (circuit.isCompleted && cursor.activeNode) {
		const node = cursor.activeNode;
		// menu is shown
		nodeMenu.classList.toggle("hidden", false)

		if (node.type == "resistor") {
			selectedResistor
			if (node !== selectedResistor) {
				selectedResistor = node;
				resistanceInputContainer.classList.toggle("hidden", false);
				resistanceInput.value = node.resistance;
				resistanceInput.onchange = () => {
					circuit.totalResistance += parseFloat(resistanceInput.value) - node.resistance
					node.resistance = parseFloat(resistanceInput.value)
				}
			}
		} else {
			resistanceInputContainer.classList.toggle("hidden", true);
		}
		resistanceInputContainer.classList.toggle("hidden", node.type != "resistor")
		
		// if the node is a component give lots of detail, otherwise don't.
		switch (node.type) {
			case "cell":
				nodeInfo.innerHTML = `
					<h3>Cell Info</h3>
					emf: ${round(circuit.emf)} V<br>
					Voltage: ${round(node.potentialDifference)} V<br>
					Lost volts: ${round(node.potentialDifference+circuit.emf)} V<br>
					Current: ${round(circuit.current)} I<br>
					Resistance: ${round(node.resistance)} Ω<br>
					Power: ${round(circuit.current * node.potentialDifference)} W<br>
				`;
				break;
			case "resistor":
				nodeInfo.innerHTML = `
					<h3>Component Info</h3>
					Type: ${titleCase(node.type)}<br>
					Voltage: ${round(node.potentialDifference)} V<br>
					Current: ${round(circuit.current)} A<br>
					Power: ${round(circuit.current * node.potentialDifference)} W<br>
				`;
				break;
			case undefined:
				nodeInfo.innerHTML = `
					<h3>Node Info</h3><br>
					Current: ${round(circuit.current)}I
				`;
				break;
			default: 
				console.log("a", node.potentialDifference, node.resistance)
				nodeInfo.innerHTML = `
					<h3>Component Info</h3>
					Type: ${titleCase(node.type)}<br>
					Voltage: ${round(node.potentialDifference)} V<br>
					Current: ${round(circuit.current)} I<br>
					Resistance: ${round(node.resistance)} Ω<br>
					Power: ${round(circuit.current * node.potentialDifference)} W<br>
				`;
				break;
		}
		/*
		if (node instanceof Component) {
			nodeMenu.innerHTML = `
				Type: ${node.type}<br>
				Voltage: ${round(node.potentialDifference)}<br>
				Current: ${round(circuit.current)}<br>
				Resistance: ${round(node.resistance)}<br>
				Power: ${round(circuit.current * node.potentialDifference)}<br>
			`;
		} else {
			nodeMenu.innerHTML = `Type: Node<br>Current: ${round(circuit.current)}`
		}
		*/
	} else {
		nodeMenu.classList.toggle("hidden", true)
	}

	requestAnimationFrame(loop)
}
loop()