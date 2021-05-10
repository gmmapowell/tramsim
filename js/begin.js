var drawAs = document.getElementById('layout');
var panX, panY, scale;
var junctions;

function begin() {
	// TODO: load resources if any but obvs have a default
	designCity();
	junctions = new JunctionFinder(city);
	junctions.resolve();
	panX = city.wid/2;
	panY = city.ht/2;
	scale = 1;
	renderNow();
}

function renderNow() {
	junctions.show(document.getElementById("junctionMap"));
	city.renderInto(drawAs, panX, panY, scale);
}