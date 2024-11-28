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

	// We want to find a curve that "fits between" two straight line segments and smooths them off.
	// This means it must start with the first line as a tangent and end with the second line as a tangent.
	// The only thing we know is the radius we want.
	// The two lines are then "shortened" so that they meet the start and end of the curve.
	interpolateRadius(rad) {
		// the first step is to find the two lines we are interpolating between, checking that they are, indeed, lines
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

		// Then we need to identify the slopes of the two lines
		var th1 = s1.slopeAngle();
		var th2 = s2.slopeAngle();

		// We want to find the angle between the two lines, but (considered as vectors), the first is
		// "coming into" the junction, so we need to "flip" the angle
		var rth1 = ModAngle.add(th1, Math.PI);
		console.log("th1 =", th1, "th2 =", th2, "rth1", rth1);

		// A line bisecting the angle will be at the average angle of the two slopes
		var bisector = ModAngle.limit((rth1 + th2) / 2);
		console.log("bisector =", bisector);

		// Now, we need to find a circle whose center is in such a location that the
		// junction point (s1.toX, s1.toY) of the two lines in on the circle in such a way that the tangent
		// to the circle is perpendicular to the bisector.  To do this, we find the secant
		// of the angle between the two lines (the sign is immaterial because sec and cos are the same in both directions)
		var diff = (rth1-th2)/2;
		var ext = rad/Math.cos(diff);
		var cx = ModAngle.dp3(s1.toX + Math.cos(bisector)*ext);
		var cy = ModAngle.dp3(s1.toY + Math.sin(bisector)*ext);
		console.log("sec =", ext, "cx =", cx, "cy =", cy);

		// The curve wants to go between two radii, one of which is perpendicular to l1, and the other is perpendicular to l2
		// We also need to figure if we want the curve to go "clockwise" or "anti-clockwise"
		var dir = Math.PI/2; // 90º to be perpendicular
		if (bisector > 0) // if the bisector is negative, use -90º
			dir = -dir;
		var from = ModAngle.add(th1, dir);
		var to = ModAngle.add(th2, dir);
		var clock = ModAngle.limit(to-from) > 0;

		// Close, but no cigar.  This "circle" intersects with the junction point NOT with the start and end points we want.
		// We need it to have a smaller radius.  We can figure this out by identifying where (either of) the radius lines
		// intersects the original line, and thus figuring out the amount we need to shrink it.
		var rx = ModAngle.dp3(cx + Math.cos(from) * ext); // figure out where the radius to l1 ends with the current guess at the radius
		var ry = ModAngle.dp3(cy + Math.sin(from) * ext);

		var is = s1.intersect(cx, cy, rx, ry);
		console.log("intersect at", is);
		var pct = (is.x-cx)/(rx-cx);
		console.log("pct = ", pct);
		ext *= pct;

		// And thus the points at which the "circle" intersects the straight lines

		var sx = ModAngle.dp3(cx + Math.cos(from) * ext);
		var sy = ModAngle.dp3(cy + Math.sin(from) * ext);
		var dx = ModAngle.dp3(cx + Math.cos(to) * ext);
		var dy = ModAngle.dp3(cy + Math.sin(to) * ext);

		// Figure out what the curve will be
		var curve = new EuclidCurveSegment(this.currShape.last(), cx, cy, ext, from, to, clock, dx, dy, { bisector, from, to });

		// Adjust the previous line segment to match
		s1.toX = sx;
		s1.toY = sy;

		// splice this curve into the shape
		this.currShape.segments.splice(len-1, 0, curve);
	}

	render(to) {
		// for (var s of this.shapes) {
		// 	s.construct(to);
		// }
		for (var s of this.shapes) {
			s.render(to);
		}
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

	construct(to) {
		for (var s of this.segments) {
			s.construct(to);
		}
	}

	render(to) {
		for (var s of this.segments) {
			s.render(to);
		}
		to.done();
	}

	toString() {
		return this.segments.toString();
	}
}

class EuclidPoint {
	constructor(x, y) {
		this.toX = x;
		this.toY = y;
	}

	construct(to) {
	}

	render(to) {
		to.moveto(this.toX, this.toY);
	}
}

class EuclidLineSegment {
	constructor(prev, x, y) {
		this.start = prev;
		this.toX = x;
		this.toY = y;
		this.construction = { fx: prev.toX, fy: prev.toY, tx: x, ty: y };
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

	// where does this line intersect a line from (fx,fy) to (tx,ty)
	intersect(fx, fy, tx, ty) {
		var a = this.slope();
		var b = (ty-fy)/(tx-fx);
		var c = this.start.toY - a*this.start.toX;
		var d = ty-b*tx;
		console.log(a, c, b, d);
		var ix = (d-c) / (a-b);
		var iy = a*ix+c;
		console.log(ix, iy);
		return { x: ix, y: iy };
	}

	construct(to) {
		to.constructionLine(this.construction);
	}

	render(to) {
		to.lineto(this.toX, this.toY);
	}

	toString() {
		return "LineTo["+this.toX+","+this.toY+"]";
	}
}

class EuclidCurveSegment {
	constructor(prev, cx, cy, rad, from, to, clock, dx, dy, construction) {
		this.start = prev;
		this.cx = cx;
		this.cy = cy;
		this.rad = rad;
		this.from = from;
		this.to = to;
		this.clock = clock;
		this.toX = dx;
		this.toY = dy;
		this.construction = construction;
	}

	construct(to) {
		to.constructionCircle(this.cx, this.cy, this.rad, this.construction);
	}

	render(to) {
		to.curve(this.cx, this.cy, this.from, this.to, this.rad, this.clock, this.toX, this.toY);
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