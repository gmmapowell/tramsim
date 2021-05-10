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

	edge(edge) {
		// in order to draw two lines "width" apart, we need to calculate the normal to the line
		// NOTE: I really feel this is the edge's responsibility since it is all in city space
		// and is therefore needed for the grid
		var wid = edge.kind.width;
		var dx = edge.to.x - edge.from.x;
		var dy = edge.to.y - edge.from.y;
		var normalAngle = Math.atan2(dx, dy); // using dx and dy the "other way around" to find the normal
		var xdisp = wid*Math.cos(normalAngle) / 2;
		var ydisp = wid*Math.sin(normalAngle) / 2;
		var lines = [
			[ edge.from.x - xdisp, edge.from.y + ydisp, edge.to.x - xdisp, edge.to.y + ydisp ],
			[ edge.from.x + xdisp, edge.from.y - ydisp, edge.to.x + xdisp, edge.to.y - ydisp ]
		];

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
}