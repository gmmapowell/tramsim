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
		if (node.kind) {
			this.renderLines(node.kind.lines());
		}
	}

	edge(edge) {
		// in order to draw two lines "width" apart, we need to calculate the normal to the line
		// NOTE: I really feel this is the edge's responsibility since it is all in city space
		// ask the edge to tell us the lines (in city space) we should draw
		// both nodes (junctions) and edges can return an arbitrary number of lines; just draw them all

		console.log("rendering " + edge);
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

	// circle(x, y, r) {
	// 	this.gc.beginPath();
	// 	var center = this.mapCoord(x, y);
	// 	this.gc.arc(center.x, center.y, r*scale, 0, 2*Math.PI);
	// 	this.gc.fillStyle = 'white';
	// 	this.gc.fill();
	// 	this.gc.stroke();
	// }
}