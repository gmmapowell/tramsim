// we need a consistent definition of a line
// it can be an edge or it can be an array of 4 values

function linesIntersect(line1, line2) {
	var fx1, fy1, tx1, ty1;
	var fx2, fy2, tx2, ty2;
	
	if (line1 instanceof Edge) {
		fx1 = line1.from.x;
		fy1 = line1.from.y;
		tx1 = line1.to.x;
		ty1 = line1.to.y;
	} else {
		fx1 = line1[0];
		fy1 = line1[1];
		tx1 = line1[2];
		ty1 = line1[3];
	}
	if (line2 instanceof Edge) {
		fx2 = line2.from.x;
		fy2 = line2.from.y;
		tx2 = line2.to.x;
		ty2 = line2.to.y;
	} else {
		fx2 = line2[0];
		fy2 = line2[1];
		tx2 = line2[2];
		ty2 = line2[3];
	}
	var meetx, meety;
	var slope1 = (ty1-fy1) / (tx1-fx1);
	var slope2 = (ty2-fy2) / (tx2-fx2);
	// console.log(slope1, slope2);
	if (slope1 == slope2)
		return null; // they can't intersect
	if (slope1 == Infinity || slope1 == -Infinity) {
		// it's vertical, so find out the y value where second line has the same x value as the first's (constant) x value
		
		// difference at start is
		var xdiff = fx1 - fx2;
		var ydiff = xdiff * slope2;
		meetx = fx1;
		meety = ydiff + fy2;
	} else if (slope2 == Infinity || slope2 == -Infinity) { // second is vertical
		var xdiff = fx2 - fx1;
		var ydiff = xdiff * slope1;
		meetx = fx2;
		meety = ydiff + fy1;
	} else {
		// all the remaining cases need to consider both slopes and whether they cross before they run out of room
		// eqn of a line is y = mx + c.  Where the two lines cross, x and y must be the same.
		// Thus, m1x + c1 = m2x + c2; thus, x = (c2-c1) / (m1-m2) and y  = m1x + c1
		// First calc c from "from" as c = y - mx
		var c1 = fy1 - (slope1 * fx1);
		var c2 = fy2 - (slope2 * fx2);
		meetx = (c2 - c1) / (slope1 - slope2);
		meety = slope1*meetx + c1;
	}
	// meetx = Math.round(meetx);
	// meety = Math.round(meety);
	if (!inRange(meetx, fx1, tx1) || !inRange(meetx, fx2, tx2))
		return null;
	if (!inRange(meety, fy1, ty1) || !inRange(meety, fy2, ty2))
		return null;

	return { x: meetx, y : meety };
}

function inRange(val, from, to) {
	if (from > to) {
		var tmp = from;
		from = to;
		to = tmp;
	}
	return val >= from && val <= to;
}