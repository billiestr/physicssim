import {Vector} from './vector.js';

export function sineWave(ctx, startPos, {stretchFactor=1, offset=0,colour="black"}={}) {
	drawFunction(ctx, (x) => {
		return Math.sin(x*Math.PI/180)
	}, {start:offset}, {colour, offset:startPos, scale: [stretchFactor, 50]})
}

export function drawLines(ctx, spacing, maxDistance, lineLength, lineWidth, direction, scale) {
	let startLine;
	let endLine;
	if (direction == "horizontal") {
		startLine = i => new Vector(0, -i * scale);
		endLine = new Vector((lineLength + 0.05) * scale, 0)
	} else if (direction == "vertical") {
		startLine = i => new Vector(i * scale, 0)
		endLine = new Vector(0, -(lineLength + 0.05) * scale)
	} else { return }
	ctx.lineWidth = lineWidth
	ctx.beginPath()
	for (let i = 0; i * spacing < maxDistance; i += 1) {
		const startLinePos = startLine(i*spacing)
		ctx.moveTo(...startLinePos.array())
		ctx.lineTo(...startLinePos.add(endLine).array())
	};
	ctx.stroke()
}

export function drawFunction(
	ctx, func, 
	{start=0, end=Infinity, maxlength=600, step=6}={}, 
	{offset=[0, 0], scale=[1,1], colour="black", width=3}={}
	) {
	
	end = Math.min(end, ((maxlength-offset[0])/scale[0]) + start)
	
	ctx.save()
	ctx.strokeStyle = colour;
	ctx.lineWidth = width;
	ctx.beginPath();
	
	let nextPoint = [offset[0], func(start) * scale[1] + offset[1]];
	for (let x = start; x <= end; x+=step) {
		ctx.moveTo(...nextPoint);
		nextPoint = [(x-start) * scale[0] + offset[0], func(x) * scale[1] +offset[1]];
		ctx.lineTo(...nextPoint);
	}
	ctx.stroke();
	
	ctx.restore()
}

export function drawParametricFunction(
	ctx, func, 
	{start=0, end=100, step=6}={}, 
	{offset=Vector.ZERO, scale=new Vector(1,1), colour="black", width=3}={}
	) {

	ctx.save()
	ctx.strokeStyle = colour;
	ctx.lineWidth = width;

	let nextPoint = offset.add(func(0).scale(...scale.array()))
	
	for (let t = start; t < end; t+=step) {
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

export function line(ctx, point1, point2, colour='red') {
	ctx.save()
	ctx.strokeStyle  = colour;
	// Start a new Path
	ctx.beginPath();
	ctx.moveTo(point1.x, point1.y);
	ctx.lineTo(point2.x, point2.y);

	// Draw the Path
	ctx.stroke();
	ctx.restore()
}

export function circle(ctx, pos, radius, colour='black') {
	ctx.save()
	ctx.beginPath()
	ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2, false)
	ctx.closePath()
	ctx.fillStyle = colour;
	ctx.fill()
	ctx.restore()
}