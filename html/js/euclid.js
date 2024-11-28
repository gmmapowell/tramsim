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

		// Figure out what the angles of the two lines are currently
		var th1 = s1.slopeAngle();
		var th2 = s2.slopeAngle();

		// The first line is "coming into" the junction, so we need to flip the angle to be the angle
		// that a ray would be "leaving" the junction before we can do vector maths.
		var rth1 = ModAngle.add(th1, Math.PI);
		console.log("th1 =", th1, "th2 =", th2, "rth1", rth1);

		// Now figure out what the angle will be of the line bisecting these
		var bisector = ModAngle.limit((rth1 + th2) / 2);
		// var bisector = ModAngle.add((th1 + th2)/2, addOn);
		console.log("bisector =", bisector);

		// I think it's diff I want, and I deffo want secant, because
		// I want 1 when the lines are on the same slope (I think of this as "0")
		// I want root(2) when they are perpendicular (I think of this as "90")
		// I want to panic when the do a U-turn (I think of this as "180")
		var diff = (rth1-th2)/2;
		console.log("bs =", diff, 1/Math.cos(diff));

		// Then (somehow) we can figure out what the center of the imaginary circle will be
		var ext = rad/Math.cos(diff);
		console.log("ext =", ext, 1);
		var cx = ModAngle.dp3(s1.toX + Math.cos(bisector)*ext);
		var cy = ModAngle.dp3(s1.toY + Math.sin(bisector)*ext);
		console.log("cx =", cx, "cy =", cy);

		// Calculate the start and end angles for the curve
		var dir = Math.PI/2;
		if (bisector > 0)
			dir = -dir;
		var from = ModAngle.add(th1, dir);
		var to = ModAngle.add(th2, dir);

		// And thus the points at which the "circle" intersects the straight lines

		var sx = ModAngle.dp3(cx + Math.cos(from) * rad);
		var sy = ModAngle.dp3(cy + Math.sin(from) * rad);
		var dx = ModAngle.dp3(cx + Math.cos(to) * rad);
		var dy = ModAngle.dp3(cy + Math.sin(to) * rad);

		// Figure out what the curve will be
		var curve = new EuclidCurveSegment(this.currShape.last(), rad, from, to, dx, dy);

		// Adjust the previous line segment to match
		s1.toX = sx;
		s1.toY = sy;

		// splice this curve into the shape
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

	static dp3(num) {
		return Math.round(num*1000)/1000.0;
	}
}

export { EuclidPlane };