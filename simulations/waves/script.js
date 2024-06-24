const canvas = document.getElementById('projectile-canvas');
const ctx = canvas.getContext('2d')
// number of pixels on the canvas
canvas.width = 600;
canvas.height = 500;

class Menu {
	constructor() {
		this._wavelength = 1;
		this._wavespeed = 1;
		this._wavelengthSlider = document.getElementById("wavelength-slider")
		this._wavelengthOutput = document.getElementById("wavelength-output")
		this._frequencySlider = document.getElementById("frequency-slider")
		this._frequencyOutput = document.getElementById("frequency-output")
		this._wavespeedSlider = document.getElementById("wavespeed-slider")
		this._wavespeedOutput = document.getElementById("wavespeed-output")
		this._wavelengthSlider.oninput = () => {
			const wavelength = this._wavelengthSlider.value
			if (wavelength > 0) { // prevents dividing by 0
				this.wavelength = wavelength
				this.frequency = this.wavespeed / wavelength
			}
		}
		this._frequencySlider.oninput = () => {
			const frequency = this._frequencySlider.value
			if (frequency > 0) { // prevents dividing by 0
				this.wavelength = this.wavespeed / frequency
				this.frequency = frequency
			}
		}
		this._wavespeedSlider.oninput = () => {
			const wavespeed = this._wavespeedSlider.value
			this.wavespeed = wavespeed
			this.frequency = wavespeed / this.wavelength
		
		}
	}
	get wavelength() { return this._wavelength}
	get wavespeed() { return this._wavespeed}
	set wavelength(value) {
		const wavelength = Math.round(value*100)/100
		this._wavelength = wavelength
		this._wavelengthOutput.innerText = wavelength
		this._wavelengthSlider.value = wavelength
	}
	set wavespeed(value) {
		const wavespeed = Math.round(value*100)/100
		this._wavespeed = wavespeed
		this._wavespeedOutput.innerText = wavespeed
	}
	set frequency(value) {
		const frequency = Math.round(value*100)/100
		this._frequencySlider.value = frequency
		this._frequencyOutput.innerText = frequency
	}
}
const menu = new Menu()

let wavelength = 1
let frequency = 1

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
const time = new Time()

/*
const slider = document.getElementById("wavelength-slider")
slider.oninput = function() {
	if (slider.value > 0) { wavelength = slider.value}
}
*/

import * as drawShape from '../../utils/shape.js'


function sine(degreeAngle) {
	return Math.sin((degreeAngle*(Math.PI/180))/menu.wavelength)
}
ctx.fillStyle = "gray";
ctx.fillRect(0, 0, canvas.width, canvas.height);


let offset = 0;
function loop() {
	time.resetDeltaTime()
	offset += menu.wavespeed * 360 * time.deltaTime
	ctx.fillStyle = "gray";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	drawShape.drawFunction(
		ctx, x => sine(x+offset), {},
		{colour:'blue', offset:[0, 250], scale: [1, 50]}
	)
	drawShape.drawFunction(
		ctx, x => sine(x-offset), {},
		{colour:'red', offset:[0, 250], scale: [1, 50]}
	)
	drawShape.drawFunction(
		ctx, x => sine(x+offset) + sine(x-offset), {}, 
		{colour: 'purple', offset:[0, 250], scale: [1, 50]}
	)
	requestAnimationFrame(loop)
}
loop()

console.log("yeah")
