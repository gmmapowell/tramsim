class Render {
	constructor(gc, cw, ch, centerX, centerY, scale) {
		this.gc = gc;
		this.cw = cw;
		this.ch = ch;
		this.centerX = centerX;
		this.centerY = centerY;
		this.scale = scale;

		this.gc.clearRect(0, 0, cw, ch);
	}

	mapCoord(cityX, cityY) {
		if (cityX.x) {
			cityY = cityX.y;
			cityX = cityX.x;
		}
		// what we have:
		//   size of the canvas
		//   center of the city model
		//   scale (canvas pixels per city unit)
		// what we want
		//   transform arbitrary city point into canvas point, correcting for vertical inversion

		// canvas(x) = cw/2 + (cityX-centerX) * scale
		// canvas(y) = ch/2 - (cityY-centerY) * scale

		return {
			x : this.cw/2 + (cityX-this.centerX) * scale,
			y : this.ch/2 - (cityY-this.centerY) * scale
		};
	}

	node(node) {
		node.renderWith(this);
	}

	edge(edge) {
		// in order to draw two lines "width" apart, we need to calculate the normal to the line
		// NOTE: I really feel this is the edge's responsibility since it is all in city space
		// ask the edge to tell us the lines (in city space) we should draw
		// both nodes (junctions) and edges can return an arbitrary number of lines; just draw them all

		// console.log("rendering " + edge);
		this.renderLines(edge.lines());
	}

	renderLines(lines) {
		// TODO: a line can also be an arc
		for (var i=0;i<lines.length;i++) {
			var line = lines[i];
			var from = this.mapCoord(line[0], line[1]);
			var to = this.mapCoord(line[2], line[3]);
			this.gc.beginPath();
			this.gc.moveTo(from.x, from.y);
			this.gc.lineTo(to.x, to.y);
			this.gc.stroke();
		}
	}

	arc(center, rad, from, to) {
		var af = Math.atan2(from.y - center.y, from.x - center.x);
		var at = Math.atan2(to.y - center.y, to.x - center.x);
		center = this.mapCoord(center.x, center.y);
		this.gc.beginPath();
		this.gc.arc(center.x, center.y, rad*scale, -af, -at, true);
		this.gc.stroke();
	}

	fillPoly(points) {
		this.gc.beginPath();
		var pt = this.mapCoord(points[points.length-2], points[points.length-1]);
		this.gc.moveTo(pt.x, pt.y);
		for (var i=0;i<points.length;i+=2) {
			var pt = this.mapCoord(points[i], points[i+1]);
			this.gc.lineTo(pt.x, pt.y);
		}
		this.gc.fill();
	}

	fillArc(arc) {
		var center = this.mapCoord(arc.center.x, arc.center.y);
		if (arc.construction) {
			// this is for debugging and does not contain an actual arc
			this.gc.beginPath();

			this.gc.arc(center.x, center.y, 12*scale, 0, Math.PI*2, true);
			this.gc.stroke();

			this.gc.beginPath();
			var p1 = this.mapCoord(arc.prevL[0], arc.prevL[1]);
			var p2 = this.mapCoord(arc.prevL[2], arc.prevL[3]);
			this.gc.moveTo(p1.x, p1.y);
			this.gc.lineTo(p2.x, p2.y);

			var n1 = this.mapCoord(arc.nextL[0], arc.nextL[1]);
			var n2 = this.mapCoord(arc.nextL[2], arc.nextL[3]);
			this.gc.moveTo(n1.x, n1.y);
			this.gc.lineTo(n2.x, n2.y);

			var c1 = this.mapCoord(arc.crossAt.x, arc.crossAt.y);
			this.gc.moveTo(c1.x+10*scale, c1.y);
			this.gc.arc(c1.x, c1.y, 10*scale, 0, 2*Math.PI);

			var p = this.mapCoord(arc.px, arc.py);
			var n = this.mapCoord(arc.nx, arc.ny);
			this.gc.moveTo(p.x, p.y);
			this.gc.lineTo(center.x, center.y);
			this.gc.lineTo(n.x, n.y);

			this.gc.stroke();
			return;
		}

		// actual arc
		this.gc.beginPath();
		var pt = this.mapCoord(arc.pts.fromOuter);
		this.gc.moveTo(pt.x, pt.y);
		pt = this.mapCoord(arc.pts.fromInner);
		this.gc.lineTo(pt.x, pt.y);
		pt = this.mapCoord(arc.pts.fromInnerArc);
		this.gc.lineTo(pt.x, pt.y);
		this.gc.arc(center.x, center.y, arc.orad*scale, -arc.from, -arc.to, !arc.clockwise);
		pt = this.mapCoord(arc.pts.toInner);
		this.gc.lineTo(pt.x, pt.y);
		pt = this.mapCoord(arc.pts.toOuter);
		this.gc.lineTo(pt.x, pt.y);
		pt = this.mapCoord(arc.pts.toOuterArc);
		this.gc.lineTo(pt.x, pt.y);
		this.gc.arc(center.x, center.y, arc.irad*scale, -arc.to, -arc.from, arc.clockwise);
		this.gc.fill();
	}
}