var city = new Graph(2500, 2000);

function designCity() {
	// WE boulevarde
	city.road(new Node(500, 1000), new Node(2000, 1000), new Boulevarde());
	// NS boulevarde
	city.road(new Node(1250, 100), new Node(1250, 1900), new Boulevarde());
	// SW to NE avenue
	city.road(new Node(500, 100), new Node(2000, 1900), new Avenue());
	// NW to SE avenue
	city.road(new Node(500, 1900), new Node(2000, 100), new Avenue());
	// road from NW corner to due S
	city.road(new Node(500, 1900), new Node(1250, 100), new Road());
	// road from due S to E central
	city.road(new Node(1250, 100), new Node(1800, 1000), new Road());
	// large circus in the middle of town
	city.circus(new Node(1250, 1000), 80);
	// lesser circus to the NE
	city.circus(new Node(1625, 1450), 50);

	// Our first WE tram line
	var builder = city.tramFrom(510, 995);
	// builder.straight(1990, 995);
	builder.straight(1170, 995);
	// TODO: we need a point here ...
	builder.curve(1255, 920);
	builder.straight(1255, 105);

	// SW to NE tram line
	var builder = city.tramFrom(500, 100);
	builder.straight(2000, 1900);

	// NW to E tram line
	var builder = city.tramFrom(500, 1900);
	builder.straight(1230, 1030);
	builder.curve(1270, 995);
	builder.straight(2000, 995);
}
