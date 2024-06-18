const canvas = document.getElementById('projectile-canvas');
const ctx = canvas.getContext('2d')
//ctx.imageSmoothingEnabled = false;

/*
const startButton = document.getElementById("flappy-start")
const playButton = document.getElementById("flappy-play")
const scoreText = document.getElementById("flappy-score")
const highScoreText = document.getElementById("flappy-hscore")

const slider = document.getElementById("lifespan-slider")
slider.oninput = function() {}*/
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
// Draw a rectangle to make the canvas visible
ctx.fillStyle = 'blue';
ctx.fillRect(0, 0, canvas.width, canvas.height);

import * as drawShape from '/utils/shape.js'

//drawShape.circle(ctx, {x: canvas.width /2, y: canvas.height /2}, canvas.height /2.3)

let i = 0;
let lastTime = Date.now()
function loop() {
	const now = Date.now()
	const deltaTime = (now-lastTime)/1000
	lastTime = now
	if (Math.random() > 0.95) {console.log(1/deltaTime)}
	ctx.fillStyle = 'blue';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	drawShape.sineWave(ctx, [10, 100], {offset:i})
	drawShape.sineWave(ctx, [10, 100], {offset:-i})
	drawShape.drawFunction(ctx, (x)=>{
		return Math.sin((x+i)*Math.PI/180)+Math.sin((x-i)*Math.PI/180)
	}, {}, {offset:[10, 100], scale: [1, 50]})
	i++;
	requestAnimationFrame(loop)
}
loop()

console.log("yeah")
