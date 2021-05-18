// The initial plan is to model the city by using a graph of nodes and edges
// All streets run in segments (edges) between intersections (nodes).  In this sense, no edges should cross.
// The model is a set of nodes and edges, enhanced to know that the edges have width and the nodes are "intersections"
// We can then manipulate this to find all the junctions and correctly recalibrate
// We can then draw this onto a canvas at any level of scale on demand.

// This model assumes the world is incredibly flat.  There are no hills, bridges or tunnels in the city plan.

// I have taken the "technical" decision to experiment with "class" syntax for this project

class Graph {
	// Width and height are the size of the city, assuming it is a rectangle for ease ...
	// Contrariwise, to make it complicated, the "Y" value goes from "bottom" to "top" (South to North) which is the opposite of canvas
	constructor(wid, ht) {
		this.wid = wid;
		this.ht = ht;
		this.nodes = [];
		this.edges = [];
		this.track = [];
	}

	road(from, to, kind) {
		// from and to are both nodes
		// ensure we have them
		// add an edge between them
		// The "kind" tells us the width/importance/curvature of the road
		from = this.ensureNode(from);
		to = this.ensureNode(to);
		this.ensureEdge(from, to, kind);
	}

	circus(center, radius) {
		// a circus is a circular intersection at a particular point of a given size
		center = this.ensureNode(center);
		center.specificKind(new Circus(radius));
	}

	intersection(center) {
		// a circus is a circular intersection at a particular point of a given size
		center = this.ensureNode(center);
		if (!center.kind)
			center.specificKind(new Intersection());
		return center;
	}

	renderInto(canvas, centerX, centerY, scale) {
		// render the city into the canvas making the point (centerX, centerY) in CITY coordinates be in the center of the canvas
		// the scale factor is in canvas pixels per city coordinate dimensional units
		// e.g. if the city is 2000m x 1800m and the canvas is 600 x 400, then you could say centerX = 1000, centerY = 900, scale = 1
		// and the whole canvas would be filled with city X values from 700 to 1300 and Y from 700 to 1100.

		var render = new Render(canvas.getContext("2d"), canvas.width, canvas.height, centerX, centerY, scale);
		// var offset = 0;
		var self = this;
		for (var i=0;i<this.edges.length;i++) {
			(function(j) {
				// setTimeout(() => 
					render.edge(self.edges[j])
				// , offset++*500);
			})(i);
		}
		for (var i=0;i<this.nodes.length;i++) {
			(function(j) {
				// setTimeout(() => 
				render.node(self.nodes[j])
				// , offset++*500);
			})(i);
		}
		for (var i=0;i<this.track.length;i++) {
			this.track[i].render(render);
		}
	}

	ensureNode(n) {
		for (var i=0;i<this.nodes.length;i++) {
			var cn = this.nodes[i];
			if (cn.x == n.x && cn.y == n.y)
				return cn;

			// TODO: we should not allow a new node to be "too close" to an existing node
			// but return a close one
		}
		this.nodes.push(n);
		return n;
	}

	ensureEdge(from, to, kind) {
		for (var i=0;i<this.edges.length;i++) {
			var ce = this.edges[i];
			if (ce.from == from && ce.to == to)
				return;
		}
		this.edges.push(new Edge(from, to, kind));
	}

	edgesAt(node) {
		var ret = [];
		for (var i=0;i<this.edges.length;i++) {
			var edge = this.edges[i];
			if (edge.from == node || edge.to == node)
				ret.push(edge);
		}
		return ret;
	}

	// When constructing the track, we require the user to be VERY much more precise about where it is going
	// - to the nearest millimetre.  This is the middle of the track, obvs.
	tramFrom(fx, fy) {
		return new TramBuilder(this.track, fx, fy);
	}
}

class Node {
	// TODO: I think a node will need to collect a list of things that intersect here
	// Then it can figure out how to render itself properly
	// Also, some nodes may be specifically intended to be squares or circuses
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.kind = null;
		this.caps = [];
	}

	specificKind(what) {
		this.kind = what;
	}

	renderWith(r) {
		if (this.kind && this.kind.renderWith) {
			this.kind.renderWith(this, r);
		} else {
			r.renderLines(this.caps);
		}
	}

	cap(l, r) {
		this.caps.push([l.x, l.y, r.x, r.y]);
	}

	toString() {
		return (this.kind?this.kind.toString():"") + "["+ this.x +"," + this.y +"]";
	}
}

class Edge {
	constructor(from, to, kind) {
		this.from = from;
		this.to = to;
		this.kind = kind;
	}

	rightLine(arriving) {
		if (arriving == this.from)
			return this.lineWith(1, -1);
		else
			return this.lineWith(1, 1);
	}

	leftLine(arriving) {
		if (arriving == this.from)
			return this.lineWith(-1, -1);
		else
			return this.lineWith(-1, 1);
	}

	rightEndsAt(arriving, posn) {
		if (arriving == this.from)
			this.fromRight = posn;
		else
			this.toRight = posn;
	}

	leftEndsAt(arriving, posn) {
		if (arriving == this.from)
			this.fromLeft = posn;
		else
			this.toLeft = posn;
	}

	lines() {
		return [ [ this.fromLeft.x, this.fromLeft.y, this.toRight.x, this.toRight.y ], [ this.fromRight.x, this.fromRight.y, this.toLeft.x, this.toLeft.y ]];
	}

	lineWith(lr, dir) {
		var wid = this.kind.width;
		var dx, dy, to;
		if (dir == 1) {
			to = this.to;
			dx = to.x - this.from.x;
			dy = to.y - this.from.y;
		} else {
			var to = this.from;
			dx = to.x - this.to.x;
			dy = to.y - this.to.y;
		}
		var straightAngle = Math.atan2(dy, dx); // pointing the way the edge is going towards this node
		var xcont = wid*Math.cos(straightAngle);
		var ycont = wid*Math.sin(straightAngle);
		var normalAngle = Math.atan2(dx, dy); // using dx and dy the "other way around" to find the normal pointing "right"
		var xdisp = wid*Math.cos(normalAngle) / 2;
		var ydisp = wid*Math.sin(normalAngle) / 2;
		var ret;
		if (dir == 1)
			ret = [ this.from.x + lr*xdisp, this.from.y - lr*ydisp, this.to.x + lr*xdisp + xcont, this.to.y - lr*ydisp + ycont ];
		else 
			ret = [ this.to.x + lr*xdisp, this.to.y - lr*ydisp, this.from.x + lr*xdisp + xcont, this.from.y - lr*ydisp + ycont ];
		if (to.kind && to.kind.blockAt)
			return to.kind.blockAt(to, ret);
		else
			return ret;
	}

	toString() {
		return this.kind + "{" + this.from + "=>" + this.to +"}";
	}
}

class Boulevarde {
	constructor() {
		this.width = 15; // 15m wide, enough for 7 tram tracks with a metre over, but more realistically four + pavements & a median
	}
	toString() {
		return "Boulevarde";
	}
}

class Avenue {
	constructor() {
		this.width = 10; // 10m wide
	}
	toString() {
		return "Avenue";
	}
}

class Road {
	constructor() {
		this.width = 5; // 5m wide, big enough for two tram tracks but no platforms
	}
	toString() {
		return "Road";
	}
}

class Intersection {
	toString() {
		return "Intersection";
	}
}

class Circus {
	constructor(radius) {
		this.radius = radius;
	}

	blockAt(to, line) {
		var dx = line[2] - to.x;
		var dy = line[3] - to.y;
		if (dx*dx + dy*dy < this.radius * this.radius) {
			return truncateAt(line, to, this.radius);
		} else {
			return line;
		}
	}

	renderWith(n, r) {
		if (n.caps.length > 0) {
			for (var i=0;i<n.caps.length;i++) {
				var ci = n.caps[i];
				r.arc(n, this.radius, {x:ci[0], y:ci[1]}, {x:ci[2], y: ci[3]});
			}
		} else {
			r.arc(n, this.radius, {x:n.x - this.radius, y: n.y}, {x: n.x + this.radius, y: n.y});
			r.arc(n, this.radius, {x:n.x + this.radius, y: n.y}, {x: n.x - this.radius, y: n.y});
		}
	}

	toString() {
		return "Circus";
	}
}

class TramBuilder {
	constructor(parts, fx, fy) {
		this.parts = parts;
		this.x = fx;
		this.y = fy;
		this.prev = null;
	}

	straight(tx, ty) {
		this.prev = new TrackStraight(this.prev, this.x, this.y, tx, ty);
		this.parts.push(this.prev);
		this.x = tx;
		this.y = ty;
	}

	curve(tx, ty) {
		this.prev = new TrackCurve(this.prev, this.x, this.y, tx, ty);
		this.parts.push(this.prev);
		this.x = tx;
		this.y = ty;
	}
}

class TrackStraight {
	constructor(prev, fx, fy, tx, ty) {
		this.prev = prev;
		this.fx = fx;
		this.fy = fy;
		this.tx = tx;
		this.ty = ty;
		this.ang = Math.atan2(ty - fy, tx - fx);
		var tw = 1;
		var dx = tw * Math.sin(this.ang);
		var dy = tw * Math.cos(this.ang);
		this.pts = [ fx+dx, fy-dy,  tx+dx, ty-dy,  tx-dx, ty+dy,  fx-dx, fy+dy ];
		if (prev && prev.adviseNext)
			prev.adviseNext(this);
	}

	startSlope() {
		return this.ang;
	}

	endSlope() {
		return this.ang;
	}

	render(render) {
		render.gc.fillStyle = 'darkgray';
		render.fillPoly(this.pts);
	}
}

class TrackCurve {
	constructor(prev, fx, fy, tx, ty) {
		this.prev = prev;
		this.tx = tx;
		this.ty = ty;
	}

	adviseNext(next) {
		this.next = next;
	}

	figureArcs() {
		if (!this.prev || !this.next) {
			throw new Error("figureArcs needs prev and next");
		}
		this.arcs = [];
		var prevSlope = this.prev.endSlope();
		var nextSlope = this.next.startSlope();

		var len = 200;
		var prevL = [this.prev.tx, this.prev.ty, this.prev.tx + len * Math.cos(prevSlope), this.prev.ty + len * Math.sin(prevSlope) ];
		var nextL = [this.next.fx, this.next.fy, this.next.fx - len * Math.cos(nextSlope), this.next.fy - len * Math.sin(nextSlope) ];
		var crossAt = linesIntersect(prevL, nextL, true);

		var fpLen = lineLength([ this.prev.tx, this.prev.ty, crossAt.x, crossAt.y ]);
		var tnLen = lineLength([ crossAt.x, crossAt.y, this.next.fx, this.next.fy]);

		var px, py, nx, ny;
		if (fpLen < tnLen) {
			px = this.prev.tx;
			py = this.prev.ty;
			var txy = moveAlong(crossAt, nextSlope, fpLen); 
			nx = txy.x;
			ny = txy.y;
		} else if (tnLen < fpLen) {
			var fxy = moveAlong(crossAt, prevSlope, -tnLen); 
			px = fxy.x;
			py = fxy.y;
			nx = this.next.fx;
			ny = this.next.fy;
		} else {
			// they are, amazingly, the same
		}

		var prevNormal = prevSlope + Math.PI/2;
		var nextNormal = nextSlope + Math.PI/2;
		var prevNL = [ px, py, px + len * Math.cos(prevNormal), py + len * Math.sin(prevNormal) ];
		var nextNL = [ nx, ny, nx - len * Math.cos(nextNormal), ny - len * Math.sin(nextNormal) ];
		
		// the normals must cross at the center of the circle
		var center = linesIntersect(prevNL, nextNL, true);
		var rad = lineLength([ px, py, center.x, center.y ]); // could also use nx, ny

		// now we are able to deduce the subtended angles for each of these ...
		var prevAng = Math.atan2(py - center.y, px - center.x);
		var nextAng = Math.atan2(ny - center.y, nx - center.x);

		var clockwise = Math.sin(nextAng-prevAng) < 0;

		var fromOuter = { x: this.prev.pts[2], y: this.prev.pts[3] };
		var fromInner = { x: this.prev.pts[4], y: this.prev.pts[5] };
		var toInner = { x: this.next.pts[6], y: this.next.pts[7] };
		var toOuter = { x: this.next.pts[0], y: this.next.pts[1] };

		if (!clockwise) {
			var tmp = fromOuter;
			fromOuter = fromInner;
			fromInner = tmp;

			tmp = toInner;
			toInner = toOuter;
			toOuter = tmp;
		}

		var pts = {
			fromOuter,
			fromInner,
			fromInnerArc: { },
			toInner,
			toOuter,
			toOuterArc: { }
		};

		this.arcs.push({ center, from: prevAng, to: nextAng, irad: rad-1, orad: rad+1, clockwise, pts });
		// this.arcs.push({ construction: true, center, prevNL, nextNL, from: prevAng, to: nextAng, clockwise, prevL, nextL, crossAt, px, py, nx, ny });
	}

	render(render) {
		if (!this.arcs)
			this.figureArcs();
		render.gc.fillStyle = 'darkgray';
		for (var i=0;i<this.arcs.length;i++)
			render.fillArc(this.arcs[i]);
	}
}