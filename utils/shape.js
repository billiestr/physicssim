export function sineWave(ctx, startPos, {stretchFactor=1, offset=0,colour="black"}={}) {
	drawFunction(ctx, (x) => {
		return Math.sin(x*Math.PI/180)
	}, {start:offset}, {colour, offset:startPos, scale: [stretchFactor, 50]})
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