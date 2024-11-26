// I am attempting to reboot this by starting again from scratch
// and doing it more seriously, with like, you know, modularity and tests
// and stuff

class EuclidPlane {
	constructor() {
		this.currShape = null;
		this.shapes = [];
	}

	pathFrom(x, y) {
		this.currShape = new EuclidShape(new EuclidPoint(x, y));
		this.shapes.push(this.currShape);
	}

	lineTo(x, y) {
		if (!this.currShape)
			throw new Error("there is no shape");
		this.currShape.add(new EuclidLineSegment(this.currShape.last(), x,y));
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
		var s1 = this.currShape.last(1);
		var s2 = this.currShape.last(0);
		if (!(s1 instanceof EuclidLineSegment))
			throw new Error("segment 1 is not a line");
		if (!(s2 instanceof EuclidLineSegment))
			throw new Error("segment 2 is not a line");

		// All of this is hacked in here ...

		var th1 = s1.slopeAngle();
		var th2 = s2.slopeAngle();

		// Figure out what the curve will be
		var curve = new EuclidCurveSegment(this.currShape.last(), rad, ModAngle.add(th1, -Math.PI/2), ModAngle.add(th2, -Math.PI/2), s1.toX, s1.toY+rad);
		// Adjust the line segments to match
		s1.toX -= rad;
		this.currShape.segments.splice(len-1, 0, curve);
	}
}

class EuclidShape {
	constructor(initial) {
		this.segments = [initial];
	}

	add(segment) {
		this.segments.push(segment);
	}

	last(back) {
		if (Number.isInteger(back))
			back++;
		else
			back = 1;
		return this.segments[this.segments.length-back];
	}
}

class EuclidPoint {
	constructor(x, y) {
		this.toX = x;
		this.toY = y;
	}
}

class EuclidLineSegment {
	constructor(prev, x, y) {
		this.start = prev;
		this.toX = x;
		this.toY = y;
	}

	slope() {
		var dx = this.toX - this.start.toX;
		var dy = this.toY - this.start.toY;
		var slope = dy / dx;
		console.log("slope =", slope);
		return slope;
	}

	slopeAngle() {
		var th1 = Math.atan2(this.toY - this.start.toY, this.toX - this.start.toX);
		console.log("theta =", th1);

		// TODO: need to consider |th1| > Math.PI/2
		return th1;
	}
}

class EuclidCurveSegment {
	constructor(prev, rad, from, to, dx, dy) {
		this.start = prev;
		this.rad = rad;
		this.from = from;
		this.to = to;
		this.toX = dx;
		this.toY = dy;
	}
}

class ModAngle {
	static limit(angle) {
		while (angle > Math.PI)
			angle -= 2*Math.PI;
		while (angle <= -Math.PI)
			angle += 2*Math.PI;
		return angle;
	}

	static add(angle, delta) {
		return this.limit(angle+delta);
	}
}

export { EuclidPlane };