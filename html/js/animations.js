function animateMe() {
	setInterval(nextFrame, 40);
}

// 	city.straight(500, 100, 2000, 1900);

var param = 50, movex = 1;
function nextFrame() {
	var gc = animateIn.getContext("2d");
	var render = new Render(gc, animateIn.width, animateIn.height, panX, panY, scale);
	param = (param+movex);
	if (param >= 1400) {
		param = 1400;
		movex = -1;
	} else if (param <= 50) {
		param = 50;
		movex = 1;
	}
	var tw = 1;
	var tl = 8;
	var tramx = 500 + param;
	var tramy = 100 + (1800/1500) * param;
	gc.clearRect(0, 0, animateIn.clientWidth, animateIn.clientHeight);
	gc.fillStyle = 'yellow';
	var tp = render.mapCoord(tramx, tramy);

	var ang = Math.atan2(1900 - 100, 2000 - 500);
	var tox = tramx + Math.cos(ang)*tl;
	var toy = tramy + Math.sin(ang)*tl;
	var dx = tw * Math.sin(ang);
	var dy = tw * Math.cos(ang);
	render.fillPoly([ tramx+dx, tramy-dy,  tox+dx, toy-dy,  tox-dx, toy+dy,  tramx-dx, tramy+dy ])
	// gc.fillRect(tp.x, tp.y - 2 * scale, 8 * scale, 2 * scale);
}