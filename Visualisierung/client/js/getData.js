var stationsURL = 'data/stations.geojson';
var bikesURL = 'data/bikes.geojson';

var g = d3.select('#map').select('svg').select('g');
g.attr('class', 'leaflet-zoom-hide');

var gBikes = g.append('g');
var gStations = g.append('g');

var bikes = null;
var stations = null;

d3.json(bikesURL, function(jsonBikes){
    jsonBikes.features.forEach(function(d){
        d.LatLng = new L.LatLng(d.geometry.coordinates[0], d.geometry.coordinates[1]);
    })

    bikes = jsonBikes.features;

    console.log(bikes);
})

d3.json(stationsURL, function(jsonStations){
    jsonStations.features.forEach(function(d){
        d.LatLng = new L.LatLng(d.geometry.coordinates[0], d.geometry.coordinates[1]);
    })

    stations = jsonStations.features;

    console.log(stations);
})