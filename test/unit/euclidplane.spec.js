import { expect } from "chai";
import { EuclidPlane } from "../../html/js/euclid.js";

describe('Drawing in a Plane', () => {
	var plane;
	beforeEach(() => {
		plane = new EuclidPlane();
	});

	it('we can have an empty plane', () => {
		expect(plane.shapes.length).to.equal(0);
	});

	it('we can have a horizontal line', () => {
		plane.pathFrom(0, 0);
		plane.lineTo(10, 0);
		expect(plane.shapes.length).to.equal(1);
		var s1 = plane.shapes[0];
		expect(s1.segments.length).to.equal(2);
		var m0 = s1.segments[0];
		expect(m0.toX).to.equal(0);
		expect(m0.toY).to.equal(0);
		var l1 = s1.segments[1];
		expect(l1.toX).to.equal(10);
		expect(l1.toY).to.equal(0);
	});

	it('we can have a horizontal line then a vertical line in the same shape', () => {
		plane.pathFrom(0, 0);
		plane.lineTo(10, 0);
		plane.lineTo(10, 10);
		expect(plane.shapes.length).to.equal(1);
		var s1 = plane.shapes[0];
		expect(s1.segments.length).to.equal(3);
		var m0 = s1.segments[0];
		expect(m0.toX).to.equal(0);
		expect(m0.toY).to.equal(0);
		var l1 = s1.segments[1];
		expect(l1.toX).to.equal(10);
		expect(l1.toY).to.equal(0);
		var l1 = s1.segments[2];
		expect(l1.toX).to.equal(10);
		expect(l1.toY).to.equal(10);
	});

	it('we can interpolate a curve between the horizontal line and the vertical line', () => {
		plane.pathFrom(0, 0);
		plane.lineTo(10, 0);
		plane.lineTo(10, 10);
		plane.interpolateRadius(3);
		expect(plane.shapes.length).to.equal(1);
		var s1 = plane.shapes[0];
		expect(s1.segments.length).to.equal(4);
		var m0 = s1.segments[0];
		expect(m0.toX).to.equal(0);
		expect(m0.toY).to.equal(0);
		var l1 = s1.segments[1];
		expect(l1.toX).to.equal(7);
		expect(l1.toY).to.equal(0);
		var c1 = s1.segments[2];
		expect(c1.toX).to.equal(10);
		expect(c1.toY).to.equal(3);
		var l2 = s1.segments[3];
		expect(l2.toX).to.equal(10);
		expect(l2.toY).to.equal(10);
	});
});