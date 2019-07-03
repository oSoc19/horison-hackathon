class FeatureCollection {
	constructor() {
		this.type = "FeatureCollection",
		this.features = [];
    }
    addFeature(polygonData){
        var feature = new Feature(polygonData);
        this.features.push(feature);
    }

}