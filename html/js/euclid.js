// I am attempting to reboot this by starting again from scratch
// and doing it more seriously, with like, you know, modularity and tests
// and stuff

class EuclidPlane {
	constructor() {
		this.currShape = null;
		this.shapes = [];
	}

	pathFrom(x, y) {
		this.currShape = new EuclidShape(x, y);
		this.shapes.push(this.currShape);
	}

	lineTo(x, y) {
		if (!this.currShape)
			throw new Error("there is no shape");
		this.currShape.add(new EuclidLineSegment(x,y));
	}

	// This requires us to have two consecutive line segments on the path, which therefore join at the destination
	// of the earlier one.  If we can figure out the angles they are travelling at, we can figure the angle we need to
	// turn through.  It is then a simple task of figuring out where the circle intersects the lines
	interpolateRadius(rad) {
		if (!this.currShape)
			throw new Error("there is no shape");
		var len = this.currShape.segments.length;
		if (len < 2)
			throw new Error("there must be two line segments");
		var s1 = this.currShape.segments[len-2];
		var s2 = this.currShape.segments[len-1];
		if (!(s1 instanceof EuclidLineSegment))
			throw new Error("segment 1 is not a line");
		if (!(s2 instanceof EuclidLineSegment))
			throw new Error("segment 2 is not a line");

		// All of this is hacked in here ...

		// Figure out what the curve will be
		var curve = new EuclidCurveSegment(rad, -Math.PI/2, 0, s1.toX, s1.toY+rad);
		// Adjust the line segments to match
		s1.toX -= rad;
		this.currShape.segments.splice(len-1, 0, curve);
	}
}

class EuclidShape {
	constructor(x, y) {
		this.startX = x;
		this.startY = y;
		this.segments = [];
	}

	add(segment) {
		this.segments.push(segment);
	}
}

class EuclidLineSegment {
	constructor(x, y) {
		this.toX = x;
		this.toY = y;
	}
}

class EuclidCurveSegment {
	constructor(rad, from, to, dx, dy) {
		this.rad = rad;
		this.from = from;
		this.to = to;
		this.toX = dx;
		this.toY = dy;
	}
}

export { EuclidPlane };