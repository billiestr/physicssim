export class Vector {
	static get ZERO() {return new Vector(0, 0)}
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	array() {
		return [this.x, this.y]
	}
	copy() {
		return new Vector(this.x, this.y)
	}
	add(pos) {
		return new Vector(this.x+pos.x, this.y+pos.y);
	}
	add2(x, y=0) {
		return new Vector(this.x+x, this.y+y);
	}
	minus(pos) {
		return new Vector(this.x-pos.x, this.y-pos.y);
	}
	scale(factor) {
		return new Vector(this.x * factor, this.y * factor)
	}
	magnitude() {
		return Math.sqrt(this.x**2 + this.y**2)
	}
	distance(pos) {
		return this.minus(pos).magnitude()
	}
	normalise(length=1) {
    const magnitude = this.magnitude()
		if (magnitude == 0) {return this}
		return this.scale(length/magnitude)
	}
	dotProduct(vector) {
		return this.x * vector.x + this.y + vector.y
	}
	interpolate(vector, factor=0.5) {
		return this.add(vector.minus(this).scale(factor))
	}
	moveTowards(position, travelDistance) {
		// stops travelling past destination
		if (travelDistance > this.distance(position)) {return position}
		const movement = position.minus(this).normalise(travelDistance)
		return this.add(movement)
	}
}