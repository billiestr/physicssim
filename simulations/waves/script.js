const canvas = document.getElementById('projectile-canvas');
const ctx = canvas.getContext('2d')

canvas.width = 600;
canvas.height = 500;


let wavelength = 1
const slider = document.getElementById("wavelength-slider")
slider.oninput = function() {
	if (slider.value > 0) { wavelength = slider.value}
}

import * as drawShape from '/utils/shape.js'

drawShape.circle(ctx, {x: canvas.width /2, y: canvas.height /2}, canvas.height /2.3)

function sine(degreeAngle) {
	return Math.sin((degreeAngle*(Math.PI/180))/wavelength)
}

let i = 0;
function loop() {
	ctx.fillStyle = "gray";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	drawShape.drawFunction(
		ctx, x => sine(x+i), {},
		{colour:'blue', offset:[0, 250], scale: [1, 50]}
	)
	drawShape.drawFunction(
		ctx, x => sine(x-i), {},
		{colour:'red', offset:[0, 250], scale: [1, 50]}
	)
	drawShape.drawFunction(
		ctx, x => sine(x+i) + sine(x-i), {}, 
		{colour: 'purple', offset:[0, 250], scale: [1, 50]}
	)
	i++;
	requestAnimationFrame(loop)
}
loop()

console.log("yeah")
