mapboxgl.accessToken =
'pk.eyJ1IjoidGltdXRhYmxlIiwiYSI6ImNqeG45MXp1YzAwN3kzbXBnZnlhaGNndXQifQ.ZpWwVyzwLHNM6dQxdJAx1g';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: [4.3517, 50.8503], // starting position [lng, lat]
    zoom: 11 // starting zoom
});

