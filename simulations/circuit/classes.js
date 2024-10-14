import * as drawShape from '../../utils/shape.js'
import { Vector } from '../../utils/vector.js'
import { Asset } from '../../utils/image.js'
import { circuit, ctx } from './script.js'

export class Circuit {
	constructor() {
		this.completed = false;
		this.components = []
		this.nodes = []
		this.order = []
		this.totalResistance = 0
		this.current = 0
	}
	initialiseCircuit() {
		this.components.push(new Component("battery", new Vector(405, 250), 0))
	}
	completeCircuit() {
		if (this.completed) { return false }
	}
	calculateResistance() {

	}
	addToOrder(node) {
		if (this.completed) { return }

		if (node instanceof Component) {
			this.totalResistance += node.resistance;
		}
		this.order.push(node)
	}
	drawWires() {
		let currentPoint = this.order[0];
		for (let i = 1; i < this.order.length - 1; i++) {
			const nextPoint = this.order[i + 1];
			if (
				currentPoint instanceof Component ||
				nextPoint instanceof Component
			) {
				i = i + 1
				currentPoint = this.order[i + 1];
				continue;
			}

			drawShape.line(ctx, currentPoint.position, nextPoint.position, "black");
			currentPoint = nextPoint;
		}
	}
}

// keeps track of selected circuit components and mouse position.
export class Cursor {
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
// image src for a node
const nodeAsset = new Asset('../../assets/circuit/node.webp', new Vector(20, 20))
// images srcs for each component
const componentSize = new Vector(65, 34)
export const componentAssets = {
	'battery': new Asset("../../assets/circuit/battery.png", componentSize),
	'bulb-on': new Asset("../../assets/circuit/lighton.png", componentSize),
	'bulb': new Asset("../../assets/circuit/lightoff.png", componentSize),
	'ammeter': new Asset("../../assets/circuit/ammeter.png", componentSize),
	'resistor': new Asset("../../assets/circuit/resistor.png", componentSize),
	'diode': new Asset("../../assets/circuit/diode.png", componentSize)
}

export class Node {
	static RADIUS = 10;
	constructor(position, addToOrder = true) {
		if (addToOrder) { circuit.addToOrder(this); }
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
export class Component extends Node {
	static RADIUS = 50;
	constructor(type, position, resistance) {
		// false so that the component isnt added to the list of other nodes.
		super(position, false)
		this.radius = Component.RADIUS // overides default node radius

		this.type = type // e.g. "resistor" or "ammeter"
		this.resisitance = resistance;

		this.nodeIn = new Node(this.position.add(new Vector(-32.5, 0)))
		circuit.addToOrder(this) // the component needs to be inbetween its two nodes in the circuit's order.
		this.nodeOut = new Node(this.position.add(new Vector(32.5, 0)))
		circuit.nodes.push(this.nodeIn, this.nodeOut)

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

// the bulb will have its own properties such as changing resistance and brightness
export class Bulb extends Component {
	constructor(position) {
		super("bulb", position, 1)
	}
}