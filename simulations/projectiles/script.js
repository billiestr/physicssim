const canvas = document.getElementById('projectile-canvas');
const ctx = canvas.getContext('2d')
//ctx.imageSmoothingEnabled = false;

/*
const startButton = document.getElementById("flappy-start")
const playButton = document.getElementById("flappy-play")
const scoreText = document.getElementById("flappy-score")
const highScoreText = document.getElementById("flappy-hscore")
*/
canvas.width = 600;
canvas.height = 500;
// Draw a rectangle to make the canvas visible
ctx.fillStyle = 'blue';
ctx.fillRect(0, 0, canvas.width, canvas.height);

import * as drawShape from '../../utils/shape.js'

drawShape.circle(ctx, {x: canvas.width /2, y: canvas.height /2}, canvas.height /2.3)

