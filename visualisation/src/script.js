mapboxgl.accessToken =
'pk.eyJ1IjoidGltdXRhYmxlIiwiYSI6ImNqeG45MXp1YzAwN3kzbXBnZnlhaGNndXQifQ.ZpWwVyzwLHNM6dQxdJAx1g';

const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: [4.352440, 50.846480], // starting position [lng, lat]
    zoom: 15 // starting zoom
});

const size = 75;

const pulsingDot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),
    onAdd: function() {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
    },
    render: function() {
        var duration = 1000;
        var t = (performance.now() % duration) / duration;
        var radius = size / 2 * 0.3;
        var outerRadius = size / 2 * 0.7 * t + radius;
        var context = this.context;

        // draw outer circle
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
        context.fill();

        // draw inner circle
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255, 100, 100, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // update this image's data with data from the canvas
        this.data = context.getImageData(0, 0, this.width, this.height).data;

        // keep the map repainting
        map.triggerRepaint();

        // return `true` to let the map know that the image was updated
        return true;
    }
};

map.on('load', function () {
    map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 1 });

    map.addSource("bikestores", {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [4.347640, 50.857930]
                },
                "properties": {
                    "title": "Magic Vélos"
                }
            }, {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [4.350970, 50.850651]
                },
                "properties": {
                    "title": "Decathlon"
                }
            }, {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [4.346090, 50.852520]
                },
                "properties": {
                    "title": "CyCLO"
                }
            }, {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [4.346240, 50.848280]
                },
                "properties": {
                    "title": "Velodroom"
                }
            }, {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [4.346930, 50.846060]
                },
                "properties": {
                    "title": "VeloFixer"
                }
            }, {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [4.355710, 50.845540]
                },
                "properties": {
                    "title": "Fietspunt"
                }
            }, {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [4.358070, 50.845490]
                },
                "properties": {
                    "title": "Ahooga Central Station"
                }
            }]
        }
    });

    map.addLayer({
        "id": "points",
        "type": "symbol",
        "source": "bikestores",
        "layout": {
            "icon-image": "pulsing-dot"
        }
    });

});



