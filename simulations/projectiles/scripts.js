const canvas = document.getElementById('projectile-canvas');
const ctx = canvas.getContext('2d')
//ctx.imageSmoothingEnabled = false;

const startButton = document.getElementById("flappy-start")
const playButton = document.getElementById("flappy-play")
const scoreText = document.getElementById("flappy-score")
const highScoreText = document.getElementById("flappy-hscore")

const slider = document.getElementById("lifespan-slider")
slider.oninput = function() {}