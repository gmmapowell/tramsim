function animateMe() {
	setInterval(nextFrame, 40);
}

var tramx = 0, tramy = 994;
function nextFrame() {
	var gc = animateIn.getContext("2d");
	var render = new Render(gc, animateIn.width, animateIn.height, panX, panY, scale);
	tramx = (tramx+1) % 1400;
	gc.clearRect(0, 0, animateIn.clientWidth, animateIn.clientHeight);
	var tp = render.mapCoord(tramx+520, tramy);
	gc.fillRect(tp.x, tp.y - 2 * scale, 8 * scale, 2 * scale);
}