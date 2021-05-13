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
		// this.gc.stroke();
	}
}