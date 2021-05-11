var city = new Graph(2500, 2000);

function designCity() {
	city.road(new Node(500, 1000), new Node(2000, 1000), new Boulevarde());
	city.road(new Node(1250, 100), new Node(1250, 1900), new Boulevarde());
	city.road(new Node(500, 100), new Node(2000, 1900), new Boulevarde());
	city.road(new Node(500, 1900), new Node(2000, 100), new Boulevarde());
	city.road(new Node(500, 1900), new Node(1250, 100), new Boulevarde());
	city.road(new Node(1250, 100), new Node(1800, 1000), new Boulevarde());
	// city.circus(new Node(1250, 1000), 30);
}