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
	// road from NE corner to due S
	city.road(new Node(500, 1900), new Node(1250, 100), new Road());
	// road from due S to E central
	city.road(new Node(1250, 100), new Node(1800, 1000), new Road());
	// large circus in the middle of town
	city.circus(new Node(1250, 1000), 30);
}
