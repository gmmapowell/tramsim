var zoomIn = document.getElementById('zoom-in');
var zoomOut = document.getElementById('zoom-out');

zoomIn.addEventListener('click', ev => {
	scale = scale * 2;
	renderNow();
});

zoomOut.addEventListener('click', ev => {
	scale = scale / 2;
	renderNow();
});