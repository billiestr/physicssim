import { Vector } from './vector.js';

export function sineWave(ctx, startPos, { stretchFactor = 1, offset = 0, colour = "black" } = {}) {
	drawFunction(ctx, (x) => {
		return Math.sin(x * Math.PI / 180)
	}, { start: offset }, { colour, offset: startPos, scale: [stretchFactor, 50] })
}


export function drawLines(ctx, spacing, maxDistance, lineLength, lineThickness, direction, scale) {
	// getLineStartPos generates a vector position to start drawing the line from
	// lineEndOffset is the offset from the start position to end each line.
	let getLineStartPos, lineEndOffset;

	// the line starts and offset are different depending on the direction of the lines.
	switch (direction) {
		case "horizontal":
			getLineStartPos = (index) => new Vector(0, -index * scale);
			lineEndOffset = new Vector((lineLength + 0.05) * scale, 0);
			break;
		case "vertical":
			getLineStartPos = (index) => new Vector(index * scale, 0);
			lineEndOffset = new Vector(0, -(lineLength + 0.05) * scale);
			break;
		default: return;
	}

	ctx.lineWidth = lineThickness // line thickness is set
	
	ctx.beginPath() // a path is created which each line will be added to
	for (let i = 0; i * spacing < maxDistance; i += 1) {
		const startLinePos = getLineStartPos(i * spacing)
		ctx.moveTo(...startLinePos.array())
		ctx.lineTo(...startLinePos.add(lineEndOffset).array())
	};
	ctx.stroke() // draws the path
}


// takes a function with an x parameter and draws in onto the canvas
export function drawFunction(
	ctx, func,
	{ start = 0, end = Infinity, maxlength = 600, step = 6 } = {},
	{ offset = [0, 0], scale = [1, 1], colour = "black", width = 3 } = {}
) {

	end = Math.min(end, ((maxlength - offset[0]) / scale[0]) + start)

	ctx.save() // stores the state of the current canvas style
	ctx.strokeStyle = colour;
	ctx.lineWidth = width;
	ctx.beginPath(); // creates a new path which will be drawn later

	let nextPoint = [offset[0], func(start) * scale[1] + offset[1]];
	for (let x = start; x <= end; x += step) {
		ctx.moveTo(...nextPoint);
		nextPoint = [(x - start) * scale[0] + offset[0], func(x) * scale[1] + offset[1]];
		ctx.lineTo(...nextPoint);
	}
	ctx.stroke();

	ctx.restore() // resets the canvas style to what was saved
}

export function drawParametricFunction(
	ctx, func,
	{ start = 0, end = 100, step = 6 } = {},
	{ offset = Vector.ZERO, scale = new Vector(1, 1), colour = "black", width = 3 } = {}
) {

	ctx.save()
	ctx.strokeStyle = colour;
	ctx.lineWidth = width;

	let nextPoint = offset.add(func(0).scale(...scale.array()))

	for (let t = start; t < end; t += step) {
		ctx.beginPath();
		ctx.moveTo(...nextPoint.array());
		nextPoint = offset.add(func(t).scale(...scale.array()))
		ctx.lineTo(...nextPoint.array());
		ctx.stroke();
	}
	ctx.beginPath();
	ctx.moveTo(...nextPoint.array());
	ctx.lineTo(...offset.add(func(end).scale(...scale.array())).array());

	ctx.stroke();

	ctx.restore()
}

export function line(ctx, point1, point2, colour = 'red') {
	ctx.save()
	ctx.strokeStyle = colour;
	// Start a new Path
	ctx.beginPath();
	ctx.moveTo(point1.x, point1.y);
	ctx.lineTo(point2.x, point2.y);

	// Draw the Path
	ctx.stroke();
	ctx.restore()
}

export function circle(ctx, pos, radius, colour = 'black') {
	ctx.save()
	ctx.beginPath()
	ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2, false)
	ctx.closePath()
	ctx.fillStyle = colour;
	ctx.fill()
	ctx.restore()
}