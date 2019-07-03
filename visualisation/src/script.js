// TODO : move to some 'constants.js' file
const colorSchemes = {
    mono: [
        [0, 'lime'],
        [600, 'green'],
        [1200, 'blue'],
        [1800, 'purple']
    ],
    rainbow: [
        [0, 'red'],
        [400, 'orange'],
        [800, 'yellow'],
        [1200, 'green'],
        [1600, 'blue'],
        [2000, 'indigo'],
        [2400, 'violet'],
    ],
    altColor: [
        [150, '#f54e5e'],
        [900, '#f9886c'],
        [1500, '#f1f075'],
        [2100, '#56b881'],
        [2700, '#3887be'],
        [3450, '#4a4a8b']
    ],
    pendleton: [
        [150, '#eae49a'],
        [300, '#e3ce4f'],
        [600, '#eeab50'],
        [900, '#ec8353'],
        [1200, '#c88e9c'],
        [1500, '#b0517d'],
        [1800, '#375b97']
    ]
};
/* */

function getUserPosition() {
    let userPos = [4.352440, 50.846480];
    return userPos;
}

// TODO : improve marker positioning
function buildMarker() {
    var el = document.createElement('img');
    el.setAttribute('src', 'https://i.imgur.com/MK4NUzI.png');
    return el;
}

mapboxgl.accessToken = 'pk.eyJ1IjoiaHVudGVyb2kiLCJhIjoiY2p4bGtuMGZnMDZuNTNvcGk1NXI5aWdobSJ9.Fezd8AOzLyPZkWkRkQoYQg';
const options = {
    token: 'pk.eyJ1IjoiaHVudGVyb2kiLCJhIjoiY2p4bGtuMGZnMDZuNTNvcGk1NXI5aWdobSJ9.Fezd8AOzLyPZkWkRkQoYQg',
    threshold: 420,
    mode: 'walking',
    direction: 'divergent',
    resolution: 5
};

const userPosition = getUserPosition();
// build and display the map centered on the user location
let map = new mapboxgl.Map({
    pitchWithRotate: true,
    pitch: 60,
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v11',
    center: userPosition,
    zoom: 13.5 
});

// build and display the user marker on the map
const markerElement = buildMarker();
const userMarker = new mapboxgl.Marker(markerElement).setLngLat(userPosition).addTo(map);

map.on('load', () => {
    map
        // userDataset
        .addSource('userDataset', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': []
            }
        })

        // layer for all isochrones
        .addLayer({
            'id': 'userlayer-quantized',
            'type': 'line',
            'source': 'userDataset',
            'layout':{
                'visibility': 'visible',
            },        
            'paint':{
                'line-color': {
                    'property': 'time',
                    'type': 'interval',
                    'stops': colorSchemes.altColor.map(function(pair){var edited = [pair[0]-300, pair[1]]; return edited})
                },
                'line-opacity': 0.25,
                'line-width': {
                    base: 1.5,
                    'stops': [[10,1],[22, 4]]
                },
            }
        })

        // layer for maximum duration isochrone
        .addLayer({
            'id': 'userlayer-quantized-major',
            'type': 'line',
            'source': 'userDataset',
            'filter':['>=', 'quantized', options.threshold],
            'layout':{
                'visibility': 'visible',
            },
            'paint':{
                'line-color': {
                    'property': 'time',
                    'type': 'interval',
                    'stops': colorSchemes.altColor
                },
                'line-width': {
                    base: 1,
                    'stops': [[10, 1.5],[22, 15]]
                }
            },
        })

        // layer for distance label on maximum duration isochrone layer
        .addLayer({
            'id': 'userlayer-quantized-label',
            'type': 'symbol',
            'source': 'userDataset',
            'filter':['>=', 'quantized', options.threshold],
            'layout':{
                'visibility': 'visible',
                'text-field':'{minutes} MIN',
                'text-font': ['DIN Offc Pro Bold'],
                'symbol-placement': 'line',
                'text-allow-overlap': true,
                'text-padding':1,
                'text-max-angle':90,
                'text-size': {
                    base: 1.2,
                    'stops': [[8,12],[22, 30]]
                },
                'text-letter-spacing':0.1
            },
            'paint':{
                'text-halo-color': 'hsl(55, 1%, 20%)',
                'text-color': {
                    'property': 'time',
                    'type': 'interval',
                    'stops': colorSchemes.altColor
                },
                'text-halo-width': 12,
            }
        });

    // fetch isochrones coordinates with mapbox-isochrone package,
    // calculate some properties for the quantized layers
    // and reload the "userDataset" source with the data
    isochrone(userPosition, options, (err, output) => {
        if (err) throw err;
        console.log(output);
        
        const isochrones = output;
        isochrones.features = isochrones.features.map(ft => {
            var modified = ft;
            var seconds = ft.properties.time;
            modified.properties.minutes = seconds/60;
            modified.properties.quantized= seconds % 600 === 0 ? 3600 : (seconds % 300 === 0 ? 1800 : (seconds % 300 === 0 ? 900 : 1));
            modified.properties.area = ruler.area(modified.geometry.coordinates)
            return modified
        }).reverse();
        
        map.getSource('userDataset').setData(isochrones);
    });
});