// The initial plan is to model the city by using a graph of nodes and edges
// All streets run in segments (edges) between intersections (nodes).  In this sense, no edges should cross.
// We have three parallel models: 
//  * the node/edge graph (the ultimate source of truth)
//  * a fine grid representation that allows us to recognize in memory that two edges cross and we need a new intersection
//  * the visual representation on the canvas
// We can recalculate the latter two at any time (and at any scale) from the node/edge graph

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
	}

	add(from, to, kind) {
		// from and to are both nodes
		// ensure we have them
		// add an edge between them
		// The "kind" tells us the width/importance/curvature of the road
		from = this.ensureNode(from);
		to = this.ensureNode(to);
		this.ensureEdge(from, to, kind);
	}

	simplify() {
		// find all the places where edges cross
		// adjust them to introduce more nodes and edges
	}

	renderInto(canvas, centerX, centerY, scale) {
		// render the city into the canvas making the point (centerX, centerY) in CITY coordinates be in the center of the canvas
		// the scale factor is in canvas pixels per city coordinate dimensional units
		// e.g. if the city is 2000m x 1800m and the canvas is 600 x 400, then you could say centerX = 1000, centerY = 900, scale = 1
		// and the whole canvas would be filled with city X values from 700 to 1300 and Y from 700 to 1100.

		var render = new Render(canvas.getContext("2d"), canvas.width, canvas.height, centerX, centerY, scale);
		for (var i=0;i<this.edges.length;i++) {
			render.edge(this.edges[i]);
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
}

class Node {
	// TODO: I think a node will need to collect a list of things that intersect here
	// Then it can figure out how to render itself properly
	// Also, some nodes may be specifically intended to be squares or circuses
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Edge {
	constructor(from, to, kind) {
		this.from = from;
		this.to = to;
		this.kind = kind;
	}
}

class Boulevarde {
	constructor() {
		this.width = 15; // 15m wide, enough for 7 tram tracks with a metre over, but more realistically four + pavements & a median
	}
}