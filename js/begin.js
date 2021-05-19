var drawAs = document.getElementById('layout');
var animateIn = document.getElementById('animation');
var panX, panY, scale;
var junctions;

function begin() {
	// TODO: load resources if any but obvs have a default
	designCity();
	junctions = new JunctionFinder(city);
	junctions.resolve();
	junctions.layOut();
	panX = city.wid/2;
	panY = city.ht/2;
	scale = 0.25;
	// scale = 4;
	renderNow();

	animateMe();
}

function renderNow() {
	city.renderInto(drawAs, panX, panY, scale);
}