import { EuclidPlane } from "./euclid.js";
import { CanvasRender } from "./canvasrender.js";

function loadSample(sample, plane) {
	switch (sample) {
		case 1: {
			plane.pathFrom(0, 0);
			plane.lineTo(10, 0);
			plane.lineTo(10, 10);
			plane.interpolateRadius(3);
			return { lx: 0, rx: 10, ly: 0, ty: 10 };
		}
		case 2: {
			plane.pathFrom(10, 0);
			plane.lineTo(10, 10);
			plane.lineTo(20, 10);
			plane.interpolateRadius(5);
			return { lx: 0, rx: 50, ly: 0, ty: 20 };
		}
		case 3: {
			plane.pathFrom(15, 5);
			plane.lineTo(25, 10);
			plane.lineTo(33, 7);
			plane.interpolateRadius(2);
			return { lx: 15, rx: 35, ly: 5, ty: 10 };
		}
		case 4: {
			plane.pathFrom(12, 12);
			plane.lineTo(15, 15);
			plane.lineTo(33, 15);
			plane.interpolateRadius(2);
			return { lx: 10, rx: 35, ly: 10, ty: 20 };
		}
		case 5: {
			plane.pathFrom(15, 5);
			plane.lineTo(25, 10);
			plane.lineTo(33, 7);
			plane.interpolateRadius(2);
			return { lx: 10, rx: 35, ly: 0, ty: 20 };
		}
		case 6: { // very acute angle
			plane.pathFrom(0, 0);
			plane.lineTo(10, 0);
			plane.lineTo(0, 3);
			plane.interpolateRadius(1);
			return { lx: 0, rx: 10, ly: 0, ty: 5 };
		}
		case 7: { // obtuse angle
			plane.pathFrom(0, 0);
			plane.lineTo(5, 0);
			plane.lineTo(10, 3);
			plane.interpolateRadius(3);
			return { lx: 0, rx: 10, ly: 0, ty: 5 };
		}
		default: {
			console.log("there is no sample", sample);
			return null;
		}
	}
}

function startMe() {
	var params = new URLSearchParams(window.location.search);
	var sample = params.get("sample");
	if (!sample) {
		console.log("not a sample, do the ordinary thing");
		return;
	}

	var plane = new EuclidPlane();
	var mysample = loadSample(parseInt(sample), plane);
	console.log(plane);

	var canvas = document.getElementById("layout");
	var lw = mysample.rx - mysample.lx;
	var lh = mysample.ty - mysample.ly;
	var xr = canvas.width/lw;
	var yr = canvas.height/lh;
	var rat = Math.min(xr, yr);
	console.log(lw, lh, xr, yr, rat);

	var r = new CanvasRender(canvas, rat, mysample.lx, mysample.ly);
	plane.render(r);
}

window.addEventListener("load", startMe);