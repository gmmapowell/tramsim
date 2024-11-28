class CanvasRender {
	constructor(canvas, rat, lx, ly) {
		this.canvas = canvas;
		this.cx = canvas.getContext("2d");
		// this.cx.setLineWidth(3.0);
		this.rat = rat;
		this.lx = lx;
		this.top = canvas.height/rat + ly;

		this.cx.lineWidth = 3;
		this.colors = [ 'red', 'yellow', 'green', 'blue', 'black' ];
		this.colIdx = 0;
	}

	constructionLine(line) {
		var lw = this.cx.lineWidth;
		this.cx.beginPath();
		this.cx.lineWidth = 1;
		var from = this.translate(line.fx, line.fy), to = this.translate(line.tx, line.ty);
		this.cx.moveTo(from.x, from.y);
		this.cx.lineTo(to.x, to.y);
		this.cx.stroke();
		this.cx.beginPath();
		this.cx.lineWidth = lw;
	}

	constructionCircle(cx, cy, rad, cinfo) {
		var lw = this.cx.lineWidth;
		this.cx.lineWidth = 1;
		var center = this.translate(cx, cy);

		this.cx.beginPath();
		this.cx.arc(center.x, center.y, 0.25*this.rat, -Math.PI, Math.PI);
		this.cx.fill();

		this.cx.beginPath();
		this.cx.arc(center.x, center.y, rad*this.rat, -Math.PI, Math.PI);
		this.cx.stroke();

		this.cx.beginPath();
		this.cx.arc(center.x, center.y, cinfo.ext*this.rat, -Math.PI, Math.PI);
		this.cx.stroke();

		this.cx.beginPath();
		this.cx.moveTo(center.x, center.y);
		var ba = cinfo.bisector;
		var bx = Math.cos(ba) * cinfo.ext;
		var by = Math.sin(ba) * cinfo.ext;
		var to = this.translate(cx - bx, cy - by);
		this.cx.lineTo(to.x, to.y);
		this.cx.stroke();

		this.cx.beginPath();
		this.cx.moveTo(center.x, center.y);
		var ba = cinfo.from;
		var bx = Math.cos(ba) * cinfo.ext;
		var by = Math.sin(ba) * cinfo.ext;
		var to = this.translate(cx + bx, cy + by);
		this.cx.lineTo(to.x, to.y);
		this.cx.stroke();

		this.cx.beginPath();
		this.cx.moveTo(center.x, center.y);
		var ba = cinfo.to;
		var bx = Math.cos(ba) * cinfo.ext;
		var by = Math.sin(ba) * cinfo.ext;
		var to = this.translate(cx + bx, cy + by);
		this.cx.lineTo(to.x, to.y);
		this.cx.stroke();

		this.cx.beginPath();
		this.cx.lineWidth = lw;
	}

	moveto(x, y) {
		var pt = this.translate(x,y);
		this.cx.beginPath();
		this.cx.moveTo(pt.x, pt.y);
		console.log("moving to ", pt);
	}

	lineto(x, y) {
		var pt = this.translate(x,y);
		var col = this.colors[this.colIdx++];
		console.log("line to ", pt, col);
		this.cx.strokeStyle = col;
		this.cx.lineTo(pt.x, pt.y);
		this.cx.stroke();
		this.cx.beginPath();
	}

	curve(cx, cy, from, to, rad, clock, fx, fy) {
		var pt = this.translate(cx,cy);
		var col = this.colors[this.colIdx++];
		console.log("curve centered at ", pt, "with rad", rad, col);
		this.cx.strokeStyle = col;
		this.cx.arc(pt.x, pt.y, rad * this.rat, -from, -to, clock);
		this.cx.stroke();
		this.cx.beginPath();
		var to = this.translate(fx, fy);
		this.cx.moveTo(to.x, to.y);
	}

	done() {
		console.log("stroking...");
		// this.cx.stroke();
	}

	translate(x,y) {
		return { x: (x-this.lx) * this.rat, y: (this.top-y) * this.rat };
	}
}

export { CanvasRender };