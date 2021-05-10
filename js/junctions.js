class JunctionFinder {
	// This is used to figure out where all the nodes are in the current city model
	// and then refine the model by adding junctions and replacing the current edges with
	// edges to and from those junctions

	constructor(city) {
		// we assume that any intersections will happen within a grid at a resolution of 5m x 5m
		this.city = city;
		this.xcells = city.wid / 5;
		this.ycells = city.ht / 5;
		this.cells = new Array(this.ycells); // a sparse array, each element of which will be a sparse array of size xcells
	}

	resolve() {
		for (var ei=0;ei<this.city.edges.length;ei++) {
			var edge = this.city.edges[ei];
			var dx = (edge.to.x - edge.from.x)/5;
			var dy = (edge.to.y - edge.from.y)/5;
			if (Math.abs(dx) >= Math.abs(dy)) {
				// scan along x axis and figure corresponding y values
				var from = Math.floor(edge.from.x/5);
				var yfrom = edge.from.y/5;
				if (dx < 0) {
					dx = -dx;
					dy = -dy;
					from = Math.floor(edge.to.x/5);
					yfrom = edge.to.y/5;
				}
				console.log(edge.toString(), dx, "dy/dx", dy/dx);
				for (var x=0;x<=dx;x++) {
					var y = Math.round(x*dy/dx+yfrom);
					if (!this.cells[y])
						this.cells[y] = new Array(this.xcells);
					if (!this.cells[y][x+from])
						this.cells[y][x+from] = [];
					this.cells[y][x+from].push(edge);
				}
			} else {
				// scan up y axis and figure corresponding x values
				var from = Math.floor(edge.from.y/5);
				var xfrom = edge.from.x/5;
				if (dy < 0) {
					dy = -dy;
					dx = -dx;
					from = Math.floor(edge.to.y/5);
					xfrom = edge.to.x/5;
				}
				console.log(edge.toString(), dy, "dx/dy", dx/dy);
				for (var y=0;y<=dy;y++) {
					var x = Math.round(y*dx/dy+xfrom);
					if (!this.cells[y+from])
						this.cells[y+from] = new Array(this.xcells);
					if (!this.cells[y+from][x])
						this.cells[y+from][x] = [];
					this.cells[y+from][x].push(edge);
				}
			}
		}

		for (var ey=0;ey<this.ycells;ey++) {
			if (!this.cells[ey])
				continue;
			for (var ex=0;ex<this.xcells;ex++) {
				if (!this.cells[ey][ex])
					continue;
				if (this.cells[ey][ex].length > 1)
					console.log("have ", this.cells[ey][ex].toString(), "@ ["+(ex*5)+","+(ey*5)+"]");
			}
		}
	}

	show(into) {
		var gc = into.getContext("2d");
		for (var ey=0;ey<this.ycells;ey++) {
			if (!this.cells[ey])
				continue;
			for (var ex=0;ex<this.xcells;ex++) {
				if (!this.cells[ey][ex])
					continue;
				gc.fillRect(ex, this.ycells-ey, 1, 1);
			}
		}
	}
}