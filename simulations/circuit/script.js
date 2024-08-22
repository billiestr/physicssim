import * as drawShape from '../../utils/shape.js'
import { Vector } from '../../utils/vector.js'
import { Asset } from '../../utils/image.js'


const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d')


function resetCanvasResolution() {
    const rect = canvas.getBoundingClientRect();
	canvas.width = rect.width;
	canvas.height = rect.height;
}
resetCanvasResolution()

addEventListener("resize", resetCanvasResolution)


// number of pixels on the canvas
ctx.fillStyle = "green";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const nodeAsset = new Asset('../../assets/node.webp', new Vector(20, 20))

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return new Vector(x, y)
}

canvas.addEventListener("click", (event)=>{
	const {x, y} = getCursorPosition(canvas, event)
	nodeAsset.draw(ctx, x, y, 0, true)
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
	//requestAnimationFrame(loop)
	//setTimeout(() => { loop(); }, 1000)
}
loop()
