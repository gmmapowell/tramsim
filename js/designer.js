var city = new Graph(2500, 2000);

function designCity() {
	city.add(new Node(500, 1000), new Node(2000, 1000), new Boulevarde());
	city.add(new Node(1250, 100), new Node(1250, 1900), new Boulevarde());
	city.add(new Node(500, 100), new Node(2000, 1900), new Boulevarde());
	city.add(new Node(500, 1900), new Node(2000, 100), new Boulevarde());
}