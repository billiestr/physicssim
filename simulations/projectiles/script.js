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
ctx.fillStyle = 'lightgray';
ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);

import * as drawShape from '/utils/shape.js'

drawShape.circle(ctx, {x: canvas.width /2, y: canvas.height /2}, canvas.height /2.3)

console.log("yeah")
