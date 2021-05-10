var drawAs = document.getElementById('layout');
var panX, panY, scale;

function begin() {
	// TODO: load resources if any but obvs have a default
	designCity();
	panX = city.wid/2;
	panY = city.ht/2;
	scale = 1;
	renderNow();
}

function renderNow() {
	city.renderInto(drawAs, panX, panY, scale);
}