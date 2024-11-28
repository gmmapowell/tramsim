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
		var c1 = s1.segments[2];
		expect(c1.rad).to.be.within(2.99, 3.01);
		expect(c1.from).to.equal(-Math.PI/2);
		expect(c1.to).to.equal(0);
		expect(c1.clock).to.be.true;

		expect(l1.toX).to.equal(7);
		expect(l1.toY).to.equal(0);
		expect(c1.toX).to.equal(10);
		expect(c1.toY).to.equal(3);
		var l2 = s1.segments[3];
		expect(l2.toX).to.equal(10);
		expect(l2.toY).to.equal(10);
	});

	it('we can interpolate a rh curve between a vertical line and a horizontal line', () => {
		plane.pathFrom(10, 0);
		plane.lineTo(10, 10);
		plane.lineTo(20, 10);
		plane.interpolateRadius(5);
		expect(plane.shapes.length).to.equal(1);
		var s1 = plane.shapes[0];
		expect(s1.segments.length).to.equal(4);
		var m0 = s1.segments[0];
		expect(m0.toX).to.equal(10);
		expect(m0.toY).to.equal(0);
		var l1 = s1.segments[1];
		var c1 = s1.segments[2];
		expect(c1.rad).to.be.within(5, 5.01);
		expect(c1.from).to.equal(Math.PI);
		expect(c1.to).to.equal(Math.PI/2);
		expect(c1.clock).to.be.false;

		expect(l1.toX).to.equal(10);
		expect(l1.toY).to.equal(5);

		expect(c1.toX).to.equal(15);
		expect(c1.toY).to.equal(10);
		var l2 = s1.segments[3];
		expect(l2.toX).to.equal(20);
		expect(l2.toY).to.equal(10);
	});

	it('we can interpolate a rh curve between a NE-ish line and a SE-ish line', () => {
		plane.pathFrom(15, 5);
		plane.lineTo(25, 10);
		plane.lineTo(33, 7);
		plane.interpolateRadius(2);
		expect(plane.shapes.length).to.equal(1);
		var s1 = plane.shapes[0];
		expect(s1.segments.length).to.equal(4);
		var m0 = s1.segments[0];
		expect(m0.toX).to.equal(15);
		expect(m0.toY).to.equal(5);
		var l1 = s1.segments[1];
		var c1 = s1.segments[2];
		expect(c1.rad).to.be.within(4.5,4.6);
		expect(c1.from).to.be.within(2, 2.1);
		expect(c1.to).to.be.within(1.2,1.3);
		expect(c1.clock).to.be.false;

		expect(l1.toX).to.be.within(23.2, 23.3);
		expect(l1.toY).to.be.within(9.1,9.2);

		expect(c1.toX).to.be.within(26, 27);
		expect(c1.toY).to.be.within(9,10);
		var l2 = s1.segments[3];
		expect(l2.toX).to.equal(33);
		expect(l2.toY).to.equal(7);
	});
});