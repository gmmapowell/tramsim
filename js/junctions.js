class JunctionFinder {
	// This is used to figure out where all the nodes are in the current city model
	// and then refine the model by adding junctions and replacing the current edges with
	// edges to and from those junctions

	constructor(city) {
		this.city = city;
	}

	resolve() {
		// take each pair of edges and see if they cross and where
		for (var ei=0;ei<this.city.edges.length;ei++) {
			var edge1 = this.city.edges[ei];
			var slope1 = (edge1.to.y-edge1.from.y) / (edge1.to.x-edge1.from.x);
			for (var ej=ei+1;ej<this.city.edges.length;ej++) {
				var edge2 = this.city.edges[ej];

				// don't consider anything that has no overlap
				if (edge2.from.x < edge1.from.x && edge2.to.x < edge1.from.x && edge2.to.x < edge1.from.x && edge2.to.x < edge1.to.x)
					continue;
				if (edge2.from.y < edge1.from.y && edge2.to.y < edge1.from.y && edge2.to.y < edge1.from.y && edge2.to.y < edge1.to.y)
					continue;
				if (edge2.from.x > edge1.from.x && edge2.to.x > edge1.from.x && edge2.to.x > edge1.from.x && edge2.to.x > edge1.to.x)
					continue;
				if (edge2.from.y > edge1.from.y && edge2.to.y > edge1.from.y && edge2.to.y > edge1.from.y && edge2.to.y > edge1.to.y)
					continue;

				var meetx, meety;
				var slope2 = (edge2.to.y-edge2.from.y) / (edge2.to.x-edge2.from.x);
				// console.log(slope1, slope2);
				if (slope1 == slope2)
					continue; // they can't intersect
				if (slope1 == Infinity) {
					// it's vertical, so find out the y value where edge2 has the same x value at edge1's (constant) x value
					
					// difference at start is
					var xdiff = edge1.from.x - edge2.from.x;
					var ydiff = xdiff * slope2;
					meetx = edge1.from.x;
					meety = ydiff + edge2.from.y;
				} else if (slope2 == Infinity) { // second is vertical
					var xdiff = edge2.from.x - edge1.from.x;
					var ydiff = xdiff * slope1;
					meetx = edge1.from.x;
					meety = ydiff + edge1.from.y;
				} else {
					// all the remaining cases need to consider both slopes and whether they cross before they run out of room
					// eqn of a line is y = mx + c.  Where the two lines cross, x and y must be the same.
					// Thus, m1x + c1 = m2x + c2; thus, x = (c2-c1) / (m1-m2) and y  = m1x + c1
					// First calc c from "from" as c = y - mx
					var c1 = edge1.from.y - (slope1 * edge1.from.x);
					var c2 = edge2.from.y - (slope2 * edge2.from.x);
					meetx = (c2 - c1) / (slope1 - slope2);
					meety = slope1*meetx + c1;
				}
				if (!inRange(meetx, edge1.from.x, edge1.to.x) || !inRange(meetx, edge2.from.x, edge2.to.x))
					continue;
				if (!inRange(meety, edge1.from.y, edge1.to.y) || !inRange(meety, edge2.from.y, edge2.to.y))
					continue;
				// console.log("meets at", meetx, meety);
				this.city.intersection(new Node(meetx, meety), 25);
			}
		}
	}

}

function inRange(val, from, to) {
	if (from > to) {
		var tmp = from;
		from = to;
		to = tmp;
	}
	return val >= from && val <= to;
}