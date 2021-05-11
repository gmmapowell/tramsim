class JunctionFinder {
	// This is used to figure out where all the nodes are in the current city model
	// and then refine the model by adding junctions and replacing the current edges with
	// edges to and from those junctions

	constructor(city) {
		this.city = city;
	}

	// find all the places in the city where the roads intersect and break them there
	// I think this should also find all the places where explicit nodes break roads but it does not currently
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
					meetx = edge2.from.x;
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
				meetx = Math.round(meetx);
				meety = Math.round(meety);
				if (!inRange(meetx, edge1.from.x, edge1.to.x) || !inRange(meetx, edge2.from.x, edge2.to.x))
					continue;
				if (!inRange(meety, edge1.from.y, edge1.to.y) || !inRange(meety, edge2.from.y, edge2.to.y))
					continue;
				// console.log(edge1.toString(), edge2.toString(), "meet at", meetx, meety);
				var midpoint = this.city.intersection(new Node(meetx, meety));
				if ((edge1.from.x != midpoint.x || edge1.from.y != midpoint.y) && (edge1.to.x != midpoint.x || edge1.to.y != midpoint.y)) {
					console.log("need to split " + edge1 + " at " + midpoint);
					this.city.road(midpoint, edge1.to, edge1.kind);
					edge1.to = midpoint; // adjust existing one in place
				}
				if ((edge2.from.x != midpoint.x || edge2.from.y != midpoint.y) && (edge2.to.x != midpoint.x || edge2.to.y != midpoint.y)) {
					console.log("need to split " + edge2 + " at " + midpoint);
					this.city.road(midpoint, edge2.to, edge2.kind);
					edge2.to = midpoint; // adjust existing one in place
				}
			}
		}
	}

	// once we have identified all the intersections, lay them out ...
	// The strategy here is:
	//  * We know where all the intersections are
	//  * We can ask the city about the edges that cross there
	//  * For each of these we can determine the angle from 0 to 2π
	//  * Thus we can place them in a circle, all of which have one end at the given node
	//  * We can ask the edge kind to give us the two parallel lines
	//     - called "left" and "right" from the perspective of arriving lines
	//  * The second one together with the first of the next edge need to have a clean connection
	//  * We tell each edge where the line goes
	//  * The first line of the first edge and the second line of the last edge make the final pair
	layOut() {
		for (var i=0;i<this.city.nodes.length;i++) {
			this.layOutNode(this.city.nodes[i]);
		}
	}

	layOutNode(n) {
		var edges = this.city.edgesAt(n);
		console.log(n + " has " + edges.length);
		if (edges.length == 1) {
			var e = edges[0];
			e.leftEndsAt(n, dest(e.leftLine(n)));
			e.rightEndsAt(n, dest(e.rightLine(n)));
			// TODO: cap it
			return;
		}
		var as = [];
		for (var i=0;i<edges.length;i++) {
			var e = edges[i];
			var ang;
			if (e.to == n)
				ang = Math.atan2(e.from.y-e.to.y, e.from.x-e.to.x);
			else
				ang = Math.atan2(e.to.y-e.from.y, e.to.x-e.from.x);
			console.log("have " + e + " at " + ang);
			as.push({ ang, e });
		}

		as.sort((x,y) => { return x.ang < y.ang ? -1 : 1; });
		console.log("sorted as", as);

		for (var i=0;i<as.length;i++) {
			var ase = as[i];
			var nxe;
			if (i+1 == as.length)
				nxe = as[0];
			else
				nxe = as[i+1];
			var fst = ase.e.rightLine(n);
			var snd = nxe.e.leftLine(n);
			var posn = linesIntersect(fst, snd);
			console.log(fst + " and " + snd + " meet at " + JSON.stringify(posn));
			if (!posn) {
				// they don't meet; reflect their ends back to them
				ase.e.rightEndsAt(n, dest(fst));
				nxe.e.leftEndsAt(n, dest(snd));
			} else {
				ase.e.rightEndsAt(n, posn);
				nxe.e.leftEndsAt(n, posn);
			}
		}
	}
}

function dest(line) {
	return { x: line[2], y: line[3] };
}