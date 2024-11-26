var zoomIn = document.getElementById('zoom-in');
var zoomOut = document.getElementById('zoom-out');
var panLeft = document.getElementById('pan-left');
var panRight = document.getElementById('pan-right');
var panUp = document.getElementById('pan-up');
var panDown = document.getElementById('pan-down');

zoomIn.addEventListener('click', ev => {
	scale = scale * 2;
	renderNow();
});

zoomOut.addEventListener('click', ev => {
	scale = scale / 2;
	renderNow();
});

panLeft.addEventListener('click', ev => {
	// we want to move 25% of the apparent width, in city coordinates
	// we know that the CANVAS width can be found from drawAs, so we need to use scale but in an INVERSE sense
	// and then divide by 4
	var moveBy = drawAs.width / scale / 4;
	panX -= moveBy;
	renderNow();
});

panRight.addEventListener('click', ev => {
	var moveBy = drawAs.width / scale / 4;
	panX += moveBy;
	renderNow();
});

panUp.addEventListener('click', ev => {
	var moveBy = drawAs.height / scale / 4;
	panY += moveBy;
	renderNow();
});

panDown.addEventListener('click', ev => {
	var moveBy = drawAs.height / scale / 4;
	panY -= moveBy;
	renderNow();
});
