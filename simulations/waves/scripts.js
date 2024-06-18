const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d')

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
// Draw a rectangle to make the canvas visible
ctx.fillStyle = 'blue';
ctx.fillRect(0, 0, canvas.width, canvas.height);

import * as drawShape from '/utils/shape.js'

//drawShape.circle(ctx, {x: canvas.width /2, y: canvas.height /2}, canvas.height /2.3)

let i = 0;
function loop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawShape.sineWave(ctx, [10, 100], {offset:i})
	drawShape.sineWave(ctx, [10, 200], {offset:-i})
	drawShape.drawFunction(ctx, (x)=>{
		return Math.sin((x+i)*Math.PI/180)+Math.sin((x-i)*Math.PI/180)
	}, {}, {offset:[10, 200], scale: [1, 50]})
	i++;
	requestAnimationFrame(loop)
}
loop()

console.log("yeah")
