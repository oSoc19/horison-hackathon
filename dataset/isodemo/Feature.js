class Feature {
	constructor(coordinates) {
		this.type = "Feature",
		this.geometry = new Geometry(coordinates);
	}
}